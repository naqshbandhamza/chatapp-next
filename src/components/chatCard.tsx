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

    //console.log(latest.message_id);
    //console.log(chat.read_status.last_read_message_id);

    return (
        <>
            {chat !== undefined && (
                <div
                    key={chat.chat_id}
                    // className="p-4 bg-white border-b border-gray-100 m-0"
                    className="
                    flex
                    items-center
                    gap-4
                    px-6
                    py-5
                    bg-white
                    border-b
                    border-gray-100
                    cursor-pointer
                    transition-all
                    duration-200
                    hover:bg-[#F8F9FF]
                    hover:shadow-sm
                "
                    onClick={() => {

                        dispatch(setChatId(chat.chat_id))
                        console.log(participantUsernames)
                        let target_username = participantUsernames[0] === username ? participantUsernames[1] : participantUsernames[0];
                        dispatch(setTargetUser({ username: target_username, id: null, token: null }));

                        let ele = document.getElementById("left-bar");
                        let ele1 = document.getElementById("right-bar");
                        if (ele && ele1) {
                            ele.style.zIndex = '1';
                            ele1.style.zIndex = '2';
                        }
                    }}
                >

                    <div className="relative flex-shrink-0">
                        <img
                            src="/avatar.png"
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-purple-100"
                        />

                        <span
                            className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white"
                            style={{
                                background: "#68d391",
                            }}
                        />
                    </div>

                    <div className="font-semibold text-lg text-gray-800 truncate">
                        {participantUsernames[0] === username ? participantUsernames[1] : participantUsernames[0]}
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