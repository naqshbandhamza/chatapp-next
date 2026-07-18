'use client';
import { Montserrat } from 'next/font/google'
import { useDispatch } from 'react-redux';
import { setChatId } from '@/store/slices/selectedChat';
import { setTargetUser } from '@/store/slices/targetUserSlice';
import { updateChatsReadStatus, updateChats } from '@/store/slices/chatSlice';
import React from 'react';

const inter = Montserrat({
    weight: '400',
    subsets: ['latin'],
})

export default function ChatCard({ chat, username, id, latest, participantUsernames }: { chat: any, username: any, id: any, latest: any, participantUsernames: any }) {

    const dispatch = useDispatch();

    

    return (
        <>
            {chat !== undefined && (
                <div
                    key={chat.chat_id}
                    className="p-4 bg-white border-b border-gray-100 m-0"
                    onClick={() => {
                        
                        dispatch(setChatId(chat.chat_id))
                        let target_username = participantUsernames.includes(username) ? chat.creator_username : participantUsernames[0]
                        dispatch(setTargetUser({ username: target_username, id: null, token: null }));

                        let ele = document.getElementById("left-bar");
                        let ele1 = document.getElementById("right-bar");
                        if (ele && ele1) {
                            ele.style.zIndex = '1';
                            ele1.style.zIndex = '2';
                        }
                    }}
                >
                    <div className="font-semibold text-lg text-gray-800 truncate">
                        {participantUsernames[0]===username ? participantUsernames[1] : participantUsernames[0]}
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 truncate">
                        {latest?.content || "No messages yet"}
                        {latest.message_id !== chat.read_status.last_read_message_id && (
                            <span style={{ display: "inline-block", width: "auto", padding: "5px", backgroundColor: "#95FF95", color: "#00cc66", borderRadius: "4px", fontWeight: "bold" }}>unread</span>
                        )}
                    </div>

                </div>
            )}
        </>
    )
}