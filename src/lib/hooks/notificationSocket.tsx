'use client';
import { useEffect, useRef, useState } from "react";

export const useNotifcationSocket = (username: string, onMessage: (msg: any) => void) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

      const socket = new WebSocket(
        `${protocol}://127.0.0.1:8000/ws/api/chat/notifications/${username}/`
      );

      socketRef.current = socket;

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
      };

      socket.onclose = () => {
        console.log(" notification WebSocket disconnected");
      };

      return () => {
        socket.close();
      };
    
  }, [username]);

  const sendMessage = (message: string) => {
    socketRef.current?.send(
      JSON.stringify({
        message,
      })
    );
  };

  return { sendMessage };
};
