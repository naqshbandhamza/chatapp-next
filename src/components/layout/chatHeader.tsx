'use client';

import { Montserrat } from 'next/font/google';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';

//import { clearUser } from '@/store/slices/userSlice';
//import { clearTargetUser } from '@/store/slices/targetUserSlice';
import { resetChatId } from '@/store/slices/selectedChat';
import { clearChats,clearMessages } from '@/store/slices/chatSlice';
import NewChat from '@/components/modules/chat/newChat';

const montserrat = Montserrat({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
});

export default function ProfileHeader({
    variation,
}: {
    variation: 'source' | 'destination';
}) {
    const router = useRouter();
    const dispatch = useDispatch();

    const { username } = useSelector((state: any) =>
        variation === 'source'
            ? state.user
            : state.targetUser
    );

    // const handleLogout = async () => {
    //     try {
    //         const res = await fetch('/api/logout', {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });

    //         const data = await res.json();

    //         if (data.success) {
    //             dispatch(clearUser());
    //             dispatch(clearTargetUser());
    //             dispatch(resetChatId());
    //             dispatch(clearMessages())
    //             dispatch(clearChats());

    //             router.push('/sign-in');
    //         }
    //     } catch (error) {
    //         console.error('Logout failed:', error);
    //     }
    // };

    const handleBack = () => {
        dispatch(resetChatId());
        dispatch(clearMessages())
    };

    return (
        <header
            className={`
                relative z-10
                flex h-[72px] shrink-0
                items-center
                border-b border-gray-100
                bg-white/95 backdrop-blur-md
                px-4 sm:px-5
                ${montserrat.className}
            `}
        >

            {/* MOBILE BACK */}
            {variation === 'destination' && (
                <button
                    onClick={handleBack}
                    aria-label="Back to chats"
                    className="
                        mr-3 flex h-10 w-10
                        shrink-0 items-center justify-center
                        rounded-full
                        border border-gray-100
                        bg-white
                        text-lg
                        shadow-sm
                        transition
                        hover:bg-gray-50
                        active:scale-95
                        lg:hidden
                    "
                >
                    ←
                </button>
            )}

            {/* USER */}
            {username && (
                <div className="flex min-w-0 flex-1 items-center gap-3">

                    <div className="relative shrink-0">
                        <img
                            src="/avatar.png"
                            alt=""
                            className="
                                h-11 w-11
                                rounded-full
                                object-cover
                                ring-2 ring-purple-100
                            "
                        />

                        <span
                            className="
                                absolute bottom-0 right-0
                                h-3.5 w-3.5
                                rounded-full
                                border-2 border-white
                            "
                            style={{
                                background: '#68d391',
                            }}
                        />
                    </div>

                    <div className="min-w-0">
                        <p
                            className="
                                truncate
                                text-[15px]
                                font-bold
                            "
                            style={{
                                color: 'var(--ink)',
                            }}
                        >
                            {username}
                        </p>

                        <span
                            className="text-xs"
                            style={{
                                color: 'var(--muted)',
                            }}
                        >
                            Online
                        </span>
                    </div>

                </div>
            )}

            {/* SOURCE ACTIONS */}
            {variation === 'source' && (
                <div className="ml-auto flex items-center gap-2">
                    <NewChat />

                    {/* <button
                        onClick={handleLogout}
                        className="
                            rounded-full
                            px-4 py-2
                            text-xs sm:text-sm
                            font-semibold
                            text-white
                            transition
                            hover:opacity-90
                            active:scale-95
                        "
                        style={{
                            background:
                                'linear-gradient(135deg, #7B6EF6, #6C5CE7)',
                        }}
                    >
                        <span className="hidden sm:inline">
                            Logout
                        </span>

                        <span className="sm:hidden">
                            ↪
                        </span>
                    </button> */}
                </div>
            )}

        </header>
    );
}