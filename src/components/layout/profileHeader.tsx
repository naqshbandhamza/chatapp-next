'use client';
import Link from 'next/link'
import { Roboto, Inter, Montserrat } from 'next/font/google'
import { User } from '@/types/User';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { clearUser } from '@/store/slices/userSlice';
import { clearTargetUser } from '@/store/slices/targetUserSlice';
import { resetChatId } from '@/store/slices/selectedChat';
import { clearChats } from '@/store/slices/chatSlice';

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
        <div className={`relative w-full h-[10%] bg-white text-gray-800 text-[14px] overflow-hidden border-b border-b-solid border-gray-100 ${inter.className}`}>
            {variation === "destination" && (
                <button className='back-to-chats' onClick={() => {
                    let ele = document.getElementById("left-bar");
                    let ele1 = document.getElementById("right-bar");
                    
                    if(ele && ele1){
                        ele.style.zIndex='2';
                        ele1.style.zIndex='1';
                    }

                }}>back</button>
            )}
            {username !== null && (
                <div className='flex mt-[18px] ml-[16px] relative' id={variation}>
                    <img src={'/avatar.webp'} className='w-12 h-12 rounded-[50%] object-cover' />
                    <p className='text-gray-800 text-[18px] inline-block font-bold mt-[4px] ml-[5px]'> {username}</p>
                    <div className='text-gray-800 text-[12px] inline-block absolute bottom-[0px] left-[71px]'> <div className='w-[10px] h-[10px] rounded-[50%] bg-[#68d391] absolute bottom-[3px] left-[-16px]'></div> online</div>
                </div>)}
            {variation === "source" && (
                <button className='absolute right-[10px] top-[26px] logout-btn' onClick={() => {
                    handleLogout()
                }}>logout</button>
            )}
        </div>
    )
}