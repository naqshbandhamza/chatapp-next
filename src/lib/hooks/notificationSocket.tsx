// 'use client';
// import { useEffect, useRef, useState } from "react";
// import { useSelector } from 'react-redux';

// export const useNotifcationSocket = (userId: string, onMessage: (msg: any) => void) => {

//   const { token } = useSelector((state: any) => state.user);


//   const socketRef = useRef<WebSocket | null>(null);

//   useEffect(() => {
//       const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

//       const socket = new WebSocket(
//          `${protocol}://${process.env.NEXT_PUBLIC_WS_URL}/ws/api/chat/notifications/?token=${token}`
//       );

//       socketRef.current = socket;

//       socket.onmessage = (event) => {
//         const data = JSON.parse(event.data);
//         onMessage(data);
//       };

//       socket.onclose = () => {
//         console.log(" notification WebSocket disconnected");
//       };

//       return () => {
//         socket.close();
//       };

//   }, [userId]);

//   const sendMessage = (data: {
//     event_type:string,
//     content:any
//   }) => {
//     socketRef.current?.send(
//       JSON.stringify({
//         data,
//       })
//     );
//   };

//   return { sendMessage };
// };


'use client';

import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

export const useNotifcationSocket = (
  userId: string,
  onMessage: (msg: any) => void
) => {

  const { token } = useSelector((state: any) => state.user);

  const socketRef = useRef<WebSocket | null>(null);
  const subscribedChatsRef = useRef<Set<number>>(new Set());

  useEffect(() => {

    const protocol =
      window.location.protocol === 'https:'
        ? 'wss'
        : 'ws';

    const socket = new WebSocket(
      `${protocol}://${process.env.NEXT_PUBLIC_WS_URL}/ws/api/chat/notifications/?token=${token}`
    );

    socketRef.current = socket;

    socket.onopen = () => {

      console.log("notification WebSocket connected");

      // Send every subscription that was requested
      // while the socket was connecting.
      for (const chatId of subscribedChatsRef.current) {

        console.log("subscribing after connection:", chatId);

        socket.send(
          JSON.stringify({
            data: {
              event_type: "subscribe_chat",
              chat_id: chatId,
            },
          })
        );
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

      subscribedChatsRef.current.clear();
      console.log(subscribedChatsRef.current)
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
  // SUBSCRIBE TO CHAT GROUP
  // ============================================================

  const subscribeChat = (chatId: number) => {

    // Remember it immediately, even if socket isn't connected yet
    if (subscribedChatsRef.current.has(chatId)) {
      return;
    }

    subscribedChatsRef.current.add(chatId);

    const socket = socketRef.current;

    // Socket isn't ready yet.
    // onopen() will send this subscription.
    if (!socket || socket.readyState !== WebSocket.OPEN) {
      console.log("queued subscription:", chatId);
      return;
    }

    console.log("subscribing:", chatId);

    socket.send(
      JSON.stringify({
        data: {
          event_type: "subscribe_chat",
          chat_id: chatId,
        },
      })
    );
  };

  // ============================================================
  // UNSUBSCRIBE FROM CHAT GROUP
  // ============================================================

  const unsubscribeChat = (chatId: number) => {

    // Remove it from our desired subscriptions immediately
    subscribedChatsRef.current.delete(chatId);

    const socket = socketRef.current;

    if (!socket || socket.readyState !== WebSocket.OPEN) {
      return;
    }

    socket.send(
      JSON.stringify({
        data: {
          event_type: "unsubscribe_chat",
          chat_id: chatId,
        },
      })
    );
  };

  return {
    sendMessage,
    subscribeChat,
    unsubscribeChat,
  };
};
