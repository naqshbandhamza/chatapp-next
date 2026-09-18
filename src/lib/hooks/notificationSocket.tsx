"use client";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export const useNotifcationSocket = (
  userId: string,
  onMessage: (msg: any) => void
) => {

  const { token } = useSelector((state: any) => state.user);
  const socketRef = useRef<WebSocket | null>(null);

  // Chats that the frontend currently wants subscribed to
  const desiredChatsRef = useRef<Set<number>>(new Set());
  const subscribedChatsRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss" : "ws";
    const socket = new WebSocket(
      `${protocol}://${process.env.NEXT_PUBLIC_WS_URL}/ws/api/chat/notifications/`
    );

    socketRef.current = socket;

    socket.onopen = () => {
      console.log("notification WebSocket connected");

      const pendingChats = Array.from(desiredChatsRef.current);
      if (pendingChats.length > 0) {
        console.log("subscribing after connection:", pendingChats);
        socket.send(
          JSON.stringify({
            data: {
              event_type: "subscribe_chats",
              chat_ids: pendingChats,
            },
          })
        );

        // They have now been sent; no longer pending.
        desiredChatsRef.current.clear();
        // Mark them as subscribed on this socket.
        for (const chatId of pendingChats) {
          subscribedChatsRef.current.add(chatId);
        }
      }
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };

    socket.onclose = () => {
      console.log("notification WebSocket disconnected");
    };

    return () => {
      socket.close();

      socketRef.current = null;

      desiredChatsRef.current.clear();
      subscribedChatsRef.current.clear();
    };
  }, [userId, token]);

  // ============================================================
  // SEND THROUGH THE EXISTING SINGLE SOCKET
  // ============================================================

  const sendMessage = (data: {
    event_type: string;
    content?: any;
    chat_id?: number;
  }) => {
    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not connected");
      return;
    }

    socket.send(
      JSON.stringify({
        data,
      })
    );
  };

  // ============================================================
  // SEND BATCH SUBSCRIBE
  // ============================================================

  const subscribeChats = (chatIds: number[]) => {
    const socket = socketRef.current;
  
    const newChatIds: number[] = [];
  
    for (const chatId of chatIds) {
      if (
        !subscribedChatsRef.current.has(chatId) &&
        !desiredChatsRef.current.has(chatId)
      ) {
        desiredChatsRef.current.add(chatId);
        newChatIds.push(chatId);
      }
    }
  
    if (newChatIds.length === 0) {
      return;
    }
  
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("queued subscription:", desiredChatsRef.current);
      return;
    }
  
    console.log("subscribing to new chats:", newChatIds);
    socket.send(
      JSON.stringify({
        data: {
          event_type: "subscribe_chats",
          chat_ids: newChatIds,
        },
      })
    );
  
    // No longer pending.
    for (const chatId of newChatIds) {
      desiredChatsRef.current.delete(chatId);
      subscribedChatsRef.current.add(chatId);
    }
  };

  // ============================================================
  // SEND BATCH UNSUBSCRIBE
  // ============================================================
  const unsubscribeChats = (chatIds: number[]) => {
    const socket = socketRef.current;
  
    if (
      !socket ||
      socket.readyState !== WebSocket.OPEN ||
      chatIds.length === 0
    ) {
      return;
    }
  
    console.log("unsubscribing from chats:", chatIds);
  
    socket.send(
      JSON.stringify({
        data: {
          event_type: "unsubscribe_chats",
          chat_ids: chatIds,
        },
      })
    );
  
    // Remove from pending subscriptions too.
    for (const chatId of chatIds) {
      desiredChatsRef.current.delete(chatId);
    }

    for (const chatId of chatIds) {
      subscribedChatsRef.current.delete(chatId);
    }
  };

  // ============================================================
  // SUBSCRIBE TO CHAT GROUP
  // ============================================================

  // const subscribeChat = (chatId: number) => {

  //   // Remember it immediately, even if socket isn't connected yet
  //   if (subscribedChatsRef.current.has(chatId)) {
  //     return;
  //   }

  //   subscribedChatsRef.current.add(chatId);

  //   const socket = socketRef.current;

  //   // Socket isn't ready yet.
  //   // onopen() will send this subscription.
  //   if (!socket || socket.readyState !== WebSocket.OPEN) {
  //     console.log("queued subscription:", chatId);
  //     return;
  //   }

  //   console.log("subscribing:", chatId);

  //   socket.send(
  //     JSON.stringify({
  //       data: {
  //         event_type: "subscribe_chat",
  //         chat_id: chatId,
  //       },
  //     })
  //   );
  // };

  // ============================================================
  // UNSUBSCRIBE FROM CHAT GROUP
  // ============================================================

  // const unsubscribeChat = (chatId: number) => {

  //   // Remove it from our desired subscriptions immediately
  //   subscribedChatsRef.current.delete(chatId);

  //   const socket = socketRef.current;

  //   if (!socket || socket.readyState !== WebSocket.OPEN) {
  //     return;
  //   }

  //   socket.send(
  //     JSON.stringify({
  //       data: {
  //         event_type: "unsubscribe_chat",
  //         chat_id: chatId,
  //       },
  //     })
  //   );
  // };

  return {
    sendMessage,
    subscribeChats,
    unsubscribeChats,
  };
};
