export const dynamic = 'force-dynamic';
import { decrypt } from '@/lib/session' // Your custom encryption function
import Image from "next/image";
import { Montserrat } from 'next/font/google';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '@/types/User';
import { Providers } from '@/app/providers';
import { getUser } from '@/lib/queries/Users/getUser';
import { getCurrentUserChats } from '@/lib/queries/Users/getCurrentUserChats';
import DashboardLayout from '@/components/layout/dashboardLayout';

const inter = Montserrat({
  weight: '400',
  subsets: ['latin'],
});


export default async function DashboardPage() {

  console.log('profile page rendered')

  // get session data and decrypt it
  const cookieStore = await cookies();
  const session: string | undefined = cookieStore.get('session')?.value;
  const decrypted_session = session !== undefined ? await decrypt(session) : undefined;
  const user_data = decrypted_session !== undefined ? JSON.parse(decrypted_session) : undefined;
  const token = user_data?.token;

  // redirect if no auth token
  if (!token) {
    redirect('/sign-in');
  }

  const id = user_data?.user_id;
  const userDetails = await getUser(id, token);
  const currentChats = await getCurrentUserChats(token);
  
  const username = userDetails.success ? userDetails?.data?.username : "";

  //persist session state on refresh for client side
  const user: User = { "token": null, "username": username, "id": id };

  return (
    <Providers user={user} currentChats={currentChats.data}>
      <DashboardLayout />
    </Providers>
  );
}