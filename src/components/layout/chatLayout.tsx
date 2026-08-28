'use client';

import ProfileHeader from '@/components/layout/chatHeader';
import MainChat from '@/components/modules/chat/currentChat';
import Chats from '@/components/modules/chat/currentChats';
import { useSelector } from 'react-redux';

interface DashboardLayoutProps {
    sendMessage: (data: any) => void;
}

export default function DashboardLayout({
    sendMessage,
}: DashboardLayoutProps) {
    const { id: selectedChatId } = useSelector(
        (state: any) => state.selectedChat
    );

    const hasActiveChat =
        selectedChatId !== null &&
        selectedChatId !== undefined &&
        !Number.isNaN(Number(selectedChatId));

    return (
        <main className="h-[90dvh] w-full overflow-hidden bg-[#F7F5FA]">

            <div className="relative flex h-full w-full">

                {/* LEFT — CHAT LIST */}
                <aside
                    className={`
                        absolute inset-0 z-20 flex w-full flex-col bg-white
                        transition-transform duration-300
                        lg:relative lg:z-auto lg:w-[340px]
                        lg:translate-x-0
                        ${hasActiveChat
                            ? '-translate-x-full lg:translate-x-0'
                            : 'translate-x-0'
                        }
                    `}
                >
                    <ProfileHeader variation="source" />

                    <div className="min-h-0 flex-1 overflow-y-auto">
                        <Chats />
                    </div>
                </aside>

                {/* RIGHT — ACTIVE CHAT */}
                <section
                    className={`
                        absolute inset-0 z-10 flex flex-col bg-[#F7F5FA]
                        transition-transform duration-300
                        lg:relative lg:z-auto lg:flex-1
                        lg:translate-x-0
                        ${hasActiveChat
                            ? 'translate-x-0'
                            : 'translate-x-full lg:translate-x-0'
                        }
                    `}
                >
                    <ProfileHeader variation="destination" />

                    <div className="min-h-0 flex-1">
                        <MainChat sendMessage={sendMessage} />
                    </div>
                </section>

            </div>
        </main>
    );
}
