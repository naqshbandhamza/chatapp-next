'use client';
import Link from 'next/link'
import Image from 'next/image';
import { Roboto, Inter, Montserrat } from 'next/font/google'
import { User } from '@/types/User';
import { useSelector, useDispatch } from 'react-redux';
import React, { useRef, useState } from 'react';
import { Message } from '@/types/chatTypes';
import { appendChat,clearMessages } from '@/store/slices/chatSlice';
import { setChatId } from '@/store/slices/selectedChat';
import { setTargetUser } from '@/store/slices/targetUserSlice';
import Modal from '@/components/ui/modal';
import { ToastContainer, toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const inter = Montserrat({
    weight: '400',
    subsets: ['latin'],
})

export default function NewChat() {

    const notify = (msg: string) => toast(msg);

    const dispatch = useDispatch();



    const [open, setOpen] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);

    const createNewChat = async () => {
        const target_username = usernameRef?.current?.value;
        const message = textareaRef?.current?.value;
        const messageId = uuidv4(); // 👈 CLIENT UUID

        if (target_username?.trim() === "" || message?.trim() === "") {
            notify("username and message cannot be empty");
            return;
        }

        try {
            const res = await fetch('/api/createnewchat', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    target_username, message, messageId, // 👈 send to backend
                }),
            });

            const response = await res.json();

            if (!response.success) {
                notify(response.message)
                return;
            }

            const { messages, ...rest } = response.data.chat; // assuming 'chat' is the key

            let net_result = {
                ...rest, latest_message: messages[0]
            }
            
            dispatch(setChatId(net_result.chat_id))
            dispatch(appendChat(net_result))
            dispatch(setTargetUser({ token: null, id: null, username: target_username !== undefined ? target_username : null }))

            setOpen(false)

        } catch (err: any) {
        } finally {
        }
    }

    return (
        <>
            <button
                className='absolute top-[26px] right-[120px] text-gray-400 w-10 h-10 rounded-[50%]'
                style={{ zIndex: "9998" }}
                onClick={() => {
                    setOpen(prev => !prev)
                }}>
                <Image src="/icons/new-message.svg" alt="new message" width={20} height={20} className='m-auto' />
            </button>

            <Modal isOpen={open} onClose={() => setOpen(false)}>
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                    Start a Chat 💬
                </h2>

                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Enter username"
                        className="w-full px-4 py-2 rounded-lg bg-blue-50 focus:outline-none transition"
                        ref={usernameRef}
                    />
                    <textarea
                        ref={textareaRef}
                        rows={4}
                        placeholder="Say hi..."
                        className="w-full px-4 py-2 rounded-lg bg-blue-50 focus:outline-none transition resize-none"
                    />

                    <div className="flex justify-between items-center gap-4">
                        <button
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-[18px] transition"
                            onClick={() => {
                                createNewChat()
                            }}
                        >
                            Send
                        </button>
                        <button
                            onClick={() => setOpen(false)}
                            className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-gray-700 dark:text-white font-medium py-2 px-4 rounded-[18px] transition"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}