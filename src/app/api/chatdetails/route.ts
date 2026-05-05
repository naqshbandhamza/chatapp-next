import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { decrypt } from '@/lib/session' // Your custom encryption function
import axios from 'axios';

export async function POST(req: NextRequest) {

    const cookieStore = await cookies();
    const session: string | undefined = cookieStore.get('session')?.value;
    const decrypted_session = session !== undefined ? await decrypt(session) : undefined;
    const user_data = decrypted_session !== undefined ? JSON.parse(decrypted_session) : undefined;
    const token = user_data?.token;

    

    try {
        const body = await req.json();
        const { chatId } = body;

        const chatDetailsResponse: any = await axios.get(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/chat/${chatId}/`, // e.g. Django endpoint
            {
                withCredentials: true,
                headers: {
                    Authorization: `Token ${token}`,
                },
            }
        );

        

        const data = chatDetailsResponse.data

        // Forward cookie from Django backend if any
        const response = NextResponse.json({ success: true, data });

        return response;
    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json({ success: false, message: 'Login failed' }, { status: 401 });
    }
}
