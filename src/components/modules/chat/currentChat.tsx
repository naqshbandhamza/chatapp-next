'use client';
import Image from 'next/image';
import { Montserrat } from 'next/font/google'
import { useDispatch, useSelector } from 'react-redux';
import React, { useRef } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { updateChatsReadStatus,updateMessages } from '@/store/slices/chatSlice';
//import { useNotifcationSocket } from '@/lib/hooks/notificationSocket';
//import { appendChat } from '@/store/slices/chatSlice';
//import { updateChats } from '@/store/slices/chatSlice';
import { v4 as uuidv4 } from "uuid";


const inter = Montserrat({
    weight: '400',
    subsets: ['latin'],
})

function ChatInput({ id, chatid, username, sendMessage, 
    //MessageSentSuccessfully 
}: { id: number, chatid: number, username: string, sendMessage: any
    //, MessageSentSuccessfully: any 
}) {

    const notify = (msg: string) => toast(msg);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const textareaContainerRef = useRef<HTMLDivElement>(null);

    const handleInput = () => {
        const textarea = textareaRef.current;
        const divtext = textareaContainerRef.current;
        if (textarea && divtext) {
            textarea.style.height = 'auto'; // Reset height
            divtext.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`; // Max height = 300px
            divtext.style.height = `${Math.min(textarea.scrollHeight + 20, 340)}px`; // Max height = 340px
        }
    };

    const handleMessageSend = async () => {
        const content = textareaRef?.current?.value;

        if (!content) {
            return; // Don't send empty messages
        }

        if (content !== undefined) {

            const message_id = uuidv4(); // 👈 generate once

            sendMessage({
                event_type: "new_message",
                content: {
                    content,
                    username,
                    id,
                    chatid,
                    message_id // 👈 pass UUID
                    //,participants
                }
            }
            );


            //sendMessage(content, username, id.toString(), chatid.toString())
            if (textareaRef?.current?.value) {
                textareaRef.current.value = "";
            }
        }

    }

    return (
        <>
            <div
                ref={textareaContainerRef}
                className="
            shrink-0
            w-full
            border-t border-gray-100
            bg-white/95
            px-3 py-3
            backdrop-blur-md
            sm:px-5
            sm:py-4
        "
            >

                {chatid !== null && !Number.isNaN(chatid) && (
                    <div className="mx-auto flex w-full max-w-4xl items-end gap-2">

                        <textarea
                            ref={textareaRef}
                            onInput={handleInput}
                            onKeyDown={(e) => {
                                if (
                                    e.key === 'Enter' &&
                                    !e.shiftKey
                                ) {
                                    e.preventDefault();
                                    handleMessageSend();
                                }
                            }}
                            placeholder="Type a message..."
                            rows={1}
                            className="
                        min-h-[48px]
                        max-h-[140px]
                        flex-1
                        resize-none
                        overflow-y-auto
                        rounded-2xl
                        border border-gray-200
                        bg-gray-50
                        px-4 py-3
                        text-sm
                        outline-none
                        transition
                        focus:border-purple-300
                        focus:bg-white
                        focus:ring-2
                        focus:ring-purple-100
                    "
                        />

                        <button
                            onClick={handleMessageSend}
                            aria-label="Send message"
                            className="
                        flex
                        h-11 w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        text-white
                        shadow-sm
                        transition
                        hover:opacity-90
                        active:scale-95
                    "
                            style={{
                                background:
                                    'linear-gradient(135deg, #7B6EF6, #6C5CE7)',
                            }}
                        >
                            <Image
                                src="/icons/send.svg"
                                alt=""
                                width={19}
                                height={19}
                            />
                        </button>

                    </div>
                )}

                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="light"
                />
            </div>
        </>
    );
}

interface DashboardLayoutProps {
    sendMessage: (id: any) => void;
}

export default function MainChat({ sendMessage }: DashboardLayoutProps) {

    console.log("Main Chat Rendered")

    // chatid -> is chat's id
    // id     -> is users's id

    const { id: chatid } = useSelector((state: any) => state.selectedChat);
    const chatIdRef = React.useRef<string | null>(null);
    const { username, id } = useSelector((state: any) => state.user);
    const { messages } = useSelector((state: any) => state.chats);

    const dispatch = useDispatch();
    //const [messages, setMessages] = React.useState<Message[]>([]);
    //const [participants,setParticipants] = React.useState<string[]>([]);


    // const { sendMessage } = useNotifcationSocket(id, (res) => {

    //     if (res.data.event_type === "new_chat") {

    //         const { messages, ...rest } = res.data.content.chat;
    //         let net_result = {
    //             ...rest, latest_message: messages[0]
    //         }
    //         dispatch(appendChat(net_result))

    //         dispatch(updateChats(messages[0]))

    //     } else if (res.data.event_type === "new_message") {
    //         console.log("new msg", res)

    //         let chatidd = res.data.content.chat;
    //         if (typeof chatidd !== 'number')
    //             chatidd = parseInt(chatidd)

    //         dispatch(updateChats(res.data.content))
    //         if (chatIdRef.current === chatidd) {
    //             setMessages((prev) => [...prev, res.data.content])
    //             sendMessage({
    //                 event_type: "read_receipt",
    //                 content: {
    //                     chatId: chatidd, senderId: id, lastMessageId: res.data.content.message_id
    //                 }
    //             }
    //             );
    //             dispatch(updateChatsReadStatus({ user_id: id, chat_id: chatidd }))
    //         }

    //     }

    // });


    const getChatDetails = async (chatId: number) => {
        try {

            const res = await fetch('/api/chatdetails', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatId }),
            });

            const response = await res.json();
            console.log("res res ttt", response)
            //setParticipants([response.data.created_by,response.data.participants[0].user])
            //setMessages(response.data.messages)
            dispatch(updateMessages(response.data.messages));
            console.log("from getchatdetails :", chatId)
            dispatch(updateChatsReadStatus({ user_id: id, chat_id: chatId }))


        } catch (err: any) {
            alert('could not fetch chat details due to some problem')
        } finally {
        }
    }

    React.useEffect(() => {

        if (chatid !== null) {
            getChatDetails(chatid)
            let tttt = chatid
            if (typeof tttt !== 'number')
                tttt = parseInt(tttt)
            chatIdRef.current = tttt;
        }
    }, [chatid])

    return (
        <>

            <div className="flex h-full min-h-0 flex-col bg-[#F7F3FA]">

                {/* MESSAGES */}
                <div
                    className="
                        min-h-0
                        flex-1
                        overflow-y-auto
                        px-3 py-4
                        sm:px-5
                        sm:py-6
                    "
                >
                    <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">

                        {messages.map((msg: any,idx:number) => {
                            const isOwn =
                                msg.sender_username === username;

                            return (
                                <div
                                    key={idx}
                                    className={`
                                        flex
                                        ${isOwn
                                            ? 'justify-end'
                                            : 'justify-start'
                                        }
                                    `}
                                >
                                    <div
                                        className={`
                                            max-w-[82%]
                                            sm:max-w-[70%]
                                            rounded-2xl
                                            px-4 py-3
                                            text-sm
                                            leading-relaxed
                                            shadow-sm
                                            ${isOwn
                                                ? `
                                                        rounded-br-md
                                                        bg-[#8176EF]
                                                        text-white
                                                      `
                                                : `
                                                        rounded-bl-md
                                                        bg-white
                                                        text-gray-800
                                                      `
                                            }
                                        `}
                                    >
                                        <div
                                            className={`
                                                mb-1
                                                text-[11px]
                                                font-semibold
                                                ${isOwn
                                                    ? 'text-white/70'
                                                    : 'text-gray-400'
                                                }
                                            `}
                                        >
                                            {msg.sender_username}
                                        </div>

                                        <div className="break-words">
                                            {msg.content}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                    </div>
                </div>

                {/* INPUT */}
                {chatIdRef.current !== null && (
                    <ChatInput
                        id={id}
                        chatid={Number(chatid)}
                        username={username}
                        sendMessage={sendMessage}
                        //MessageSentSuccessfully={MessageSentSuccessfully}
                    />)}

            </div>
        </>
    )
}