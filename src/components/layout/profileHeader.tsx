'use client';
//import Link from 'next/link'
import { Roboto, Inter, Montserrat } from 'next/font/google'
//import { User } from '@/types/User';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearUser } from '@/store/slices/userSlice';
import { clearTargetUser } from '@/store/slices/targetUserSlice';
import { resetChatId } from '@/store/slices/selectedChat';
import { clearChats } from '@/store/slices/chatSlice';
import NewChat from '../newChat';

const inter = Montserrat({
    weight: '400',
    subsets: ['latin'],
})


export default function ProfileHeader({ variation }: { variation: string }) {

    const router = useRouter();
    const dispatch = useDispatch();

    if (variation === "source")
        console.log("profile header logged in user rendered")
    else if (variation === "destination")
        console.log("profile header destination user rendered")

    const { username } = useSelector((state: any) => {
        return variation === "source" ? state.user : state.targetUser
    });

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/logout', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });


            const ress = await res.json();


            if (ress.success) {
                dispatch(clearUser())
                dispatch(clearTargetUser())
                dispatch(resetChatId())
                dispatch(clearChats())
                router.push('/sign-in')
            }

        } catch (err: any) {
        } finally {
        }
    }



    return (
        // <div className={`relative w-full h-[10%] bg-white text-gray-800 text-[14px] overflow-hidden border-b border-b-solid border-gray-100 ${inter.className}`}>
        //     {variation === "destination" && (
        //         <button className='back-to-chats' onClick={() => {
        //             let ele = document.getElementById("left-bar");
        //             let ele1 = document.getElementById("right-bar");

        //             if(ele && ele1){
        //                 ele.style.zIndex='2';
        //                 ele1.style.zIndex='1';
        //             }

        //         }}>back</button>
        //     )}
        //     {username !== null && (
        //         <div className='flex mt-[18px] ml-[16px] relative' id={variation}>
        //             <img src={'/avatar.webp'} className='w-12 h-12 rounded-[50%] object-cover' />
        //             <p className='text-gray-800 text-[18px] inline-block font-bold mt-[4px] ml-[5px]'> {username}</p>
        //             <div className='text-gray-800 text-[12px] inline-block absolute bottom-[0px] left-[71px]'> <div className='w-[10px] h-[10px] rounded-[50%] bg-[#68d391] absolute bottom-[3px] left-[-16px]'></div> online</div>
        //         </div>)}
        //     {variation === "source" && (
        //         <button className='absolute right-[10px] top-[26px] logout-btn' onClick={() => {
        //             handleLogout()
        //         }}>logout</button>
        //     )}
        // </div>
        <div
            className={`relative w-full h-[10%] bg-white/90 backdrop-blur-sm text-gray-800 overflow-hidden border-b border-gray-100 ${inter.className}`}
        >
            {variation === "destination" && (
                <button
                    className="
                        flex items-center gap-2
                        px-4 py-2
                        rounded-full
                        text-sm font-medium
                        border border-gray-100
                        bg-white
                        shadow-sm
                        transition-all
                        hover:bg-gray-50
                        back-to-chats
                    "
                    style={{ color: "var(--purple)" }}
                    onClick={() => {
                        const ele = document.getElementById("left-bar");
                        const ele1 = document.getElementById("right-bar");

                        if (ele && ele1) {
                            ele.style.zIndex = "2";
                            ele1.style.zIndex = "1";
                        }
                    }}
                >
                    ← Back
                </button>
            )}

            {username !== null && (
                <div
                    className={`flex items-center h-full gap-3 ${variation === "destination"
                            ? "gap-3 ml-[60px] sm:ml-6"
                            : "ml-6"
                        }`}
                    id={variation}
                >
                    {/* Avatar */}
                    <div className={`relative ${variation === "destination" ? "ml-14 sm:ml-0" : ""
                        }`}>
                        <img
                            src="/avatar.png"
                            className="
                            w-12 h-12
                            rounded-full
                            object-cover
                            ring-2 ring-purple-100
                        "
                        />

                        {/* Online indicator */}
                        <span
                            className="
                                absolute bottom-0 right-0
                                w-3.5 h-3.5
                                rounded-full
                                border-2 border-white
                            "
                            style={{
                                background: "#68d391",
                            }}
                        />
                    </div>

                    {/* User Info */}
                    <div className="flex flex-col">
                        <p
                            className="text-[16px] leading-tight"
                            style={{
                                fontFamily: "var(--font-display)",
                                fontWeight: 700,
                                color: "var(--ink)",
                            }}
                        >
                            {username}
                        </p>

                        <span
                            className="text-xs mt-1"
                            style={{
                                color: "var(--muted)",
                            }}
                        >
                            Online
                        </span>
                    </div>
                </div>
            )}

            {variation === "source" && (
                <>
                <NewChat/>
                <button
                    className="
                        absolute right-6 top-1/2 -translate-y-1/2
                        px-5 py-2
                        rounded-full
                        text-sm font-semibold
                        text-white
                        transition-opacity
                        hover:opacity-90
                    "
                    style={{
                        background:
                            "linear-gradient(135deg, #7B6EF6, #6C5CE7)",
                    }}
                    onClick={() => {
                        handleLogout();
                    }}
                >
                    Logout
                </button>
                </>
            )}
        </div>
    )
}