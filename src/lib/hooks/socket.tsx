'use client';
import { useEffect, useRef, useState } from "react";

export const useChatSocket = (chatId: string, onMessage: (msg: any) => void) => {
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!Number.isNaN(chatId)) {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

      const socket = new WebSocket(
        `${protocol}://${process.env.NEXT_PUBLIC_WS_URL}/ws/api/chat/${chatId}/`
      );

      socketRef.current = socket;

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
      };

      socket.onclose = () => {
        console.log("chat WebSocket disconnected");
      };

      return () => {
        socket.close();
      };
    }
  }, [chatId]);

  const sendMessage = (message: string, sender: string, senderId: string, chatId: string,messageId:string) => {
    socketRef.current?.send(
      JSON.stringify({
        message,
        sender,
        senderId,
        chatId,
        messageId
      })
    );
  };

  return { sendMessage };
};
