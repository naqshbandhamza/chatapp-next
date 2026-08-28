'use client';

import React from 'react';
import { useState, useRef } from 'react';

import DashboardTopBar from './dashboardTopBar';

import HomeModule from '@/components/modules/home/homeModule';
import ChatLayout from '@/components/layout/chatLayout';
import MetaPage from '../modules/meta/metaPage';

import { useNotifcationSocket } from '@/lib/hooks/notificationSocket';
import { useDispatch, useSelector } from 'react-redux';

import { appendChat } from '@/store/slices/chatSlice';
import { updateChats, updateMessages } from '@/store/slices/chatSlice';
import { updateChatsReadStatus } from '@/store/slices/chatSlice';



type DashboardSection =
    | 'home'
    | 'messages'
    | 'meta';


export default function DashboardLayout() {

    const [activeSection, setActiveSection] =
        useState<DashboardSection>('home');
    const { id } = useSelector((state: any) => state.user);
    const { id: selectedchatid } = useSelector((state: any) => state.selectedChat);
    const { chats } = useSelector(
        (state: any) => state.chats
    );

    const dispatch = useDispatch();

    const selectedChatIdRef = useRef<number | null>(null);


    const getChatid = () => {
        return selectedchatid;
    }

    const { sendMessage, subscribeChat, unsubscribeChat } = useNotifcationSocket(id, (res) => {

        if (res.data.event_type === "new_chat") {

            const { messages, ...rest } = res.data.content.chat;
            let net_result = {
                ...rest, latest_message: messages[0]
            }
            dispatch(appendChat(net_result))

            dispatch(updateChats(messages[0]))

        } else if (res.data.event_type === "new_message") {
            console.log("new msg", res)

            let chatidd = res.data.content.chat;
            if (typeof chatidd !== 'number')
                chatidd = parseInt(chatidd)

            dispatch(updateChats(res.data.content))

            
            if (selectedChatIdRef.current === chatidd) {

                dispatch(updateMessages([res.data.content]))
                sendMessage({
                    event_type: "read_receipt",
                    content: {
                        chatId: chatidd, senderId: id, lastMessageId: res.data.content.message_id
                    }
                }
                );
                dispatch(updateChatsReadStatus({ user_id: id, chat_id: chatidd }))
            }

        }

    });

    React.useEffect(() => {
        selectedChatIdRef.current = selectedchatid;
    }, [selectedchatid]);


    React.useEffect(() => {
        
        for (const chat of chats) {

            const chatId = Number(chat.chat_id);

            if (
                Number.isNaN(chatId) ||
                chatId <= 0
            ) {
                continue;
            }
            console.log("sending to subscribe chat" ,chats)
            subscribeChat(chatId);
        }

    }, [chats,subscribeChat]);

    return (
        <main
            className="
                flex
                h-[100dvh]
                w-full
                flex-col
                overflow-hidden
                bg-[#F7F5FA]
            "
        >

            {/* ================================================= */}
            {/* ALWAYS VISIBLE TOP BAR                            */}
            {/* ================================================= */}

            <DashboardTopBar
                activeSection={activeSection}
                setActiveSection={setActiveSection}
            />


            {/* ================================================= */}
            {/* DASHBOARD CONTENT                                 */}
            {/* ================================================= */}

            <section className="min-h-0 flex-1 overflow-hidden">

                {activeSection === 'home' && (
                    <HomeModule />
                )}

                {activeSection === 'messages' && (
                    <ChatLayout sendMessage={sendMessage}
                    />
                )}

                {activeSection === 'meta' && (
                    <MetaPage />
                )}

            </section>

        </main>
    );
}