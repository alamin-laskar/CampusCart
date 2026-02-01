import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const res = NextResponse.json({ status: 'ok' }, { status: 200 });
  res.cookies.set('session', '', { httpOnly: true, maxAge: 0, path: '/' });
  return res;
}
