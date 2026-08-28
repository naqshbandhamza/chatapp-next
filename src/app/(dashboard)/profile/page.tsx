export const dynamic = 'force-dynamic';

import { decrypt } from '@/lib/session';
import { Montserrat } from 'next/font/google';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { User } from '@/types/User';
import { Providers } from '@/app/providers';

import { getUser } from '@/lib/queries/Users/getUser';
import { getCurrentUserChats } from '@/lib/queries/Users/getCurrentUserChats';

import DashboardLayout from '@/components/layout/dashboardLayout';

const montserrat = Montserrat({
    weight: ['400', '600', '700'],
    subsets: ['latin'],
});

export default async function DashboardPage() {

    console.log('dashboard page rendered');

    /*
    |--------------------------------------------------------------------------
    | AUTHENTICATION
    |--------------------------------------------------------------------------
    */

    const cookieStore = await cookies();

    const session = cookieStore.get('session')?.value;

    const decryptedSession =
        session !== undefined
            ? await decrypt(session)
            : undefined;

    const userData =
        decryptedSession !== undefined
            ? JSON.parse(decryptedSession)
            : undefined;

    const token = userData?.token;

    /*
    |--------------------------------------------------------------------------
    | REDIRECT IF NOT AUTHENTICATED
    |--------------------------------------------------------------------------
    */

    if (!token) {
        redirect('/sign-in');
    }

    /*
    |--------------------------------------------------------------------------
    | USER DATA
    |--------------------------------------------------------------------------
    */

    const id = userData?.user_id;

    const userDetails = await getUser(
        id,
        token
    );

    const currentChats =
        await getCurrentUserChats(token);

    const username =
        userDetails.success
            ? userDetails?.data?.username
            : '';

    /*
    |--------------------------------------------------------------------------
    | INITIAL USER STATE
    |--------------------------------------------------------------------------
    */

    const user: User = {
        token,
        username,
        id,
    };

    /*
    |--------------------------------------------------------------------------
    | DASHBOARD
    |--------------------------------------------------------------------------
    */

    return (
        <Providers
            user={user}
            currentChats={currentChats.data}
        >
            <DashboardLayout />
        </Providers>
    );
}