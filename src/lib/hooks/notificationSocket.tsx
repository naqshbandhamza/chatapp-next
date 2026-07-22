'use client';
import { useEffect, useRef, useState } from "react";

export const useNotifcationSocket = (userId: string, onMessage: (msg: any) => void) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

      const socket = new WebSocket(
         `${protocol}://localhost:8000/ws/api/chat/notifications/`
        // `${protocol}://localhost:8000/ws/api/chat/notifications/${userId}/`
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
    
  }, [userId]);

  const sendMessage = (data: {
    event_type:string,
    content:any
  }) => {
    socketRef.current?.send(
      JSON.stringify({
        data,
      })
    );
  };

  return { sendMessage };
};
