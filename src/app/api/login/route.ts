import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { serialize } from 'cookie'
import { encrypt } from '@/lib/session' // Your custom encryption function

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const { username, password } = body;

    const loginRes: any = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/login/`, // e.g. Django endpoint
      { username, password },
      // { withCredentials: true }
    );

    const sdata = { "username": loginRes.data.username, "user_id": loginRes.data.user_id, "token": loginRes.data.token }

    const isProd = true;

    const cookieOptions = {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    };

    let enc = await encrypt(JSON.stringify(sdata));

    const djangoCookie = loginRes.headers["set-cookie"];

    // Forward cookie from Django backend if any
    const response = NextResponse.json({ success: true });
    response.cookies.set("session", enc, cookieOptions);
    //response.cookies.set("ws_auth_token", loginRes.data.token, cookieOptions);

    if (djangoCookie) {
      response.headers.set(
        "Set-Cookie",
        djangoCookie.join(", ")
      );
    }

    return response;
  } catch (error: any) {
    console.log(error)
    return NextResponse.json({ success: false, message: error?.response?.data?.password ? error.response.data.password : 'invalid credentials' }, { status: 401 });

  }
}
