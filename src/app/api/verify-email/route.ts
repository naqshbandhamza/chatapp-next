import { NextRequest, NextResponse } from 'next/server';

const DJANGO_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${DJANGO_URL}/api/chat/verify-email/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json(
      data,
      { status: response.status }
    );

  } catch {
    return NextResponse.json(
      {
        error: 'Unable to connect to the server.',
      },
      { status: 500 }
    );
  }
}