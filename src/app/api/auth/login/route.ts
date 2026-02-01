import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function POST(req: Request) {
  try {
    const { idToken } = await req.json();
    if (!idToken) return NextResponse.json({ error: 'Missing idToken' }, { status: 400 });
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });

    const res = NextResponse.json({ status: 'success' }, { status: 200 });
    res.cookies.set('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: expiresIn / 1000,
      path: '/',
    });

    return res;
  } catch (err) {
    console.error('Failed to create session:', err);
    return NextResponse.json({ error: 'Failed to create session' }, { status: 401 });
  }
}