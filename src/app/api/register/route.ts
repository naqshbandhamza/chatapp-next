import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstname,lastname, username, email, password  } = body;

    const signUpRes: any = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/register/`, // e.g. Django endpoint
      { firstname,lastname,username, email, password  },
      { withCredentials: true }
    );

    // Forward cookie from Django backend if any
    const response = NextResponse.json({ success: true });

    return response;
  } catch (error: any) {
    console.error('Login error:', error.response);
    return NextResponse.json({ success: false, message: error?.response?.data?.error? error.response.data.error:'Sign Up failed' }, { status: 401 });
  }
}
