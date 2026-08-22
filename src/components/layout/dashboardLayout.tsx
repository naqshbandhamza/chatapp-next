// import Link from 'next/link'
// import { Roboto, Inter, Montserrat } from 'next/font/google'
// import ProfileHeader from '@/components/layout/profileHeader';
// import MainChat from '../currentChat';
// import Chats from '../currentChats';

// const inter = Montserrat({
//   weight: '400',
//   subsets: ['latin'],
// })

// export default function DashboardLayout() {

  
//   return (
//     <div className={`min-h-screen ${inter.className}`}>
//       <div className="grid grid-cols-10 h-screen" id="div-bar">
//         <div className="col-span-3 relative bg-white border-r border-gray-100" id="left-bar">
//           <ProfileHeader variation={"source"} />
//           <Chats />
//         </div>
//         <div className="col-span-7 relative bg-white overflow-hidden" id="right-bar">
//           <ProfileHeader variation={"destination"} />
//           <MainChat />
//         </div>
//       </div>
//     </div>
//   )
// }

'use client';

import ProfileHeader from '@/components/layout/profileHeader';
import MainChat from '../currentChat';
import Chats from '../currentChats';
import { useSelector } from 'react-redux';

export default function DashboardLayout() {
    const { id: selectedChatId } = useSelector(
        (state: any) => state.selectedChat
    );

    const hasActiveChat =
        selectedChatId !== null &&
        selectedChatId !== undefined &&
        !Number.isNaN(Number(selectedChatId));

    return (
        <main className="h-[100dvh] w-full overflow-hidden bg-[#F7F5FA]">

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
                        <MainChat />
                    </div>
                </section>

            </div>
        </main>
    );
}
