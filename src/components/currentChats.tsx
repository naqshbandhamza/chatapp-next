'use client';
import { Montserrat } from 'next/font/google'
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { Chat } from "@/types/chatTypes";
import React from 'react';
import ChatCard from './chatCard';


const inter = Montserrat({
    weight: '400',
    subsets: ['latin'],
})

export default function Chats() {

    const dispatch = useDispatch();

    console.log("Chats list Rendered")
    const { username, id } = useSelector((state: any) => state.user);
    const chats: Chat[] = useSelector((state: any) => state.chats.chats);

    console.log(username, "user chats list: ",chats);

    return (
        <div className="w-full max-w-xl mx-auto space-y-4 bg-white">
            {chats !== undefined && (
                chats.map((chat, indx) => {
                    const latest = chat.latest_message;
                    const participantUsernames = chat.participants
                        .map((p) => p.username);

                    return (
                        <ChatCard chat={chat} key={indx} id={id} username={username} latest={latest} participantUsernames={participantUsernames} />
                    );
                })
            )}
        </div>
    )
}