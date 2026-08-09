'use client';
import { useEffect, useRef, useState } from "react";
import { useSelector } from 'react-redux';

export const useReadStatusSocket = (chatId: string, onMessage: (msg: any) => void) => {
  const socketRef = useRef<WebSocket | null>(null);
  const { token } = useSelector((state: any) => state.user);


  useEffect(() => {
    if (!Number.isNaN(chatId)) {
      const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';

      const socket = new WebSocket(
        `${protocol}://${process.env.NEXT_PUBLIC_WS_URL}/ws/api/chat/readstatus/${chatId}/?token=${token}`
      );

      socketRef.current = socket;

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data);
      };

      socket.onclose = () => {
        console.log("read WebSocket disconnected");
      };

      return () => {
        socket.close();
      };
    }
  }, [chatId]);

  const sendChatReadStatus = (chatId: string,senderId:string,lastMessageId:string) => {
    socketRef.current?.send(
      JSON.stringify({
        chatId,
        senderId,
        lastMessageId
      })
    );
  };

  return { sendChatReadStatus };
};
