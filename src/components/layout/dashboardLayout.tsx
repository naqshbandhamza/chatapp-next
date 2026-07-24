import Link from 'next/link'
import { Roboto, Inter, Montserrat } from 'next/font/google'
import ProfileHeader from '@/components/layout/profileHeader';
import MainChat from '../currentChat';
import Chats from '../currentChats';

const inter = Montserrat({
  weight: '400',
  subsets: ['latin'],
})

export default function DashboardLayout() {

  
  return (
    <div className={`min-h-screen ${inter.className}`}>
      <div className="grid grid-cols-10 h-screen" id="div-bar">
        <div className="col-span-3 relative bg-white border-r border-gray-100" id="left-bar">
          <ProfileHeader variation={"source"} />
          <Chats />
        </div>
        <div className="col-span-7 relative bg-white overflow-hidden" id="right-bar">
          <ProfileHeader variation={"destination"} />
          <MainChat />
        </div>
      </div>
    </div>
  )
}

