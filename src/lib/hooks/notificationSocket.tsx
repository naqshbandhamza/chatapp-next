'use client';
import { useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux';

export const useNotifcationSocket = (userId: string, onMessage: (msg: any) => void) => {

  const { token } = useSelector((state: any) => state.user);
  

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

      const socket = new WebSocket(
         `${protocol}://${process.env.NEXT_PUBLIC_WS_URL}/ws/api/chat/notifications/?token=${token}`
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
