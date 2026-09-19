"use client";
import { useEffect, useRef,useState } from "react";
import { useSelector } from "react-redux";

export const useNotifcationSocket = (
  userId: string,
  onMessage: (msg: any) => void
) => {
  const { token } = useSelector((state: any) => state.user);
  const socketRef = useRef<WebSocket | null>(null);

  const [connectionStatus, setConnectionStatus] =
  useState<"online" | "offline">("offline");

  // Chats that the frontend currently wants subscribed to
  const desiredChatsRef = useRef<Set<number>>(new Set());
  const subscribedChatsRef = useRef<Set<number>>(new Set());

  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const lastPongRef = useRef<number>(Date.now());
  const reconnectAttemptRef = useRef(0);
  const shouldReconnectRef = useRef(true);

  const heartbeatRef = useRef<{
    socket: WebSocket;
    interval: ReturnType<typeof setInterval>;
  } | null>(null);

  useEffect(() => {
    shouldReconnectRef.current = true;
    reconnectAttemptRef.current = 0;

    const startHeartbeat = (socket: WebSocket) => {
      // Kill any heartbeat belonging to a previous socket
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current.interval);
        heartbeatRef.current = null;
      }
    
      lastPongRef.current = Date.now();
    
      const ping = () => {
        // This heartbeat no longer belongs to the active socket
        if (socketRef.current !== socket) {
          console.log("Ignoring heartbeat from stale socket");
          return;
        }
    
        if (socket.readyState !== WebSocket.OPEN) {
          return;
        }
    
        const elapsed = Date.now() - lastPongRef.current;
    
        console.log("heartbeat tick", {
          elapsed,
          readyState: socket.readyState,
        });
    
        if (elapsed > 90000) {
          console.warn("WebSocket heartbeat timeout");
          setConnectionStatus("offline");
          socket.close();
          return;
        }
    
        console.log("sending ping");
    
        socket.send(
          JSON.stringify({
            data: {
              event_type: "ping",
            },
          })
        );
      };
    
      // Send immediately after connection
      ping();
    
      const interval = setInterval(ping, 30000);
    
      heartbeatRef.current = {
        socket,
        interval,
      };
    
      console.log("heartbeat started");
    };
  
    const connect = (): WebSocket | null => {
      if (!shouldReconnectRef.current) {
        return null;
      }
      console.log("in connect")
      // Don't create another socket if one is already alive/connecting
      if (
        socketRef.current &&
        (
          socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING
        )
      ) {
        console.log("already connected")
        return socketRef.current;
      }
  
      const protocol =
        window.location.protocol === "https:" ? "wss" : "ws";
  
      const socket = new WebSocket(
        `${protocol}://${process.env.NEXT_PUBLIC_WS_URL}/ws/api/chat/notifications/`
      );
  
      socketRef.current = socket;
  
      socket.onopen = () => {
        console.log("notification WebSocket connected");
        setConnectionStatus("online");
  
        reconnectAttemptRef.current = 0;
        startHeartbeat(socket);

        // lastPongRef.current = Date.now();
        //  // Start heartbeat for every connected socket
        // if (heartbeatRef.current) {
        //   clearInterval(heartbeatRef.current);
        // }
        // heartbeatRef.current = setInterval(() => {
        //   if (socket.readyState === WebSocket.OPEN) {

        //     const elapsed = Date.now() - lastPongRef.current;
        //     if (elapsed > 90000) {
        //       console.warn("WebSocket heartbeat timeout");
        //       console.log("Closing dead WebSocket...", {
        //         readyState: socket.readyState,
        //         socketRefSame: socketRef.current === socket,
        //       });
              
        //       socket.close();
              
        //       console.log("close() called");
        //       return;
        //     }

        //     socket.send(
        //       JSON.stringify({
        //         data: {
        //           event_type: "ping",
        //         },
        //       })
        //     );
        //   }
        // }, 30000);
  
        const pendingChats = Array.from(
          desiredChatsRef.current
        );
  
        if (pendingChats.length === 0) {
          return;
        }
  
        console.log(
          "subscribing after connection:",
          pendingChats
        );
  
        socket.send(
          JSON.stringify({
            data: {
              event_type: "subscribe_chats",
              chat_ids: pendingChats,
            },
          })
        );
  
        desiredChatsRef.current.clear();
  
        for (const chatId of pendingChats) {
          subscribedChatsRef.current.add(chatId);
        }

      };
  
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data?.data?.event_type === "pong") {
          lastPongRef.current = Date.now();
          return;
        }

        onMessage(data);
      };
  
      socket.onclose = () => {
        console.log("notification WebSocket disconnected");
        setConnectionStatus("offline");
      
        if (socketRef.current !== socket) {
          console.log("Ignoring close from stale socket");
          return;
        }
      
        socketRef.current = null;
      
        // Only clear heartbeat belonging to THIS socket
        if (
          heartbeatRef.current &&
          heartbeatRef.current.socket === socket
        ) {
          clearInterval(heartbeatRef.current.interval);
          heartbeatRef.current = null;
        }
      
        if (!shouldReconnectRef.current) {
          return;
        }
      
        for (const chatId of subscribedChatsRef.current) {
          desiredChatsRef.current.add(chatId);
        }
      
        subscribedChatsRef.current.clear();
      
        if (reconnectTimeoutRef.current) {
          return;
        }
      
        const attempt = reconnectAttemptRef.current++;
      
        const delay = Math.min(
          1000 * Math.pow(2, attempt),
          30000
        );
      
        console.log(`reconnecting in ${delay}ms`);
      
        reconnectTimeoutRef.current = setTimeout(() => {
          reconnectTimeoutRef.current = null;
          connect();
        }, delay);
      };
  
      return socket;
    };
  
    connect();
  
    return () => {
      shouldReconnectRef.current = false;
  
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current.interval);
        heartbeatRef.current = null;
      }
  
      const socket = socketRef.current;
  
      socketRef.current = null;
  
      if (socket) {
        socket.close();
      }
  
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

    // Always remove from desired first.
    for (const chatId of chatIds) {
      desiredChatsRef.current.delete(chatId);
      subscribedChatsRef.current.delete(chatId);
    }

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

  };

  return {
    sendMessage,
    subscribeChats,
    unsubscribeChats,
    connectionStatus,
  };
};
