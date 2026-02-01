import { NextResponse } from 'next/server';
import admin from '@/lib/firebaseAdmin';

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.split(';').map(c => c.trim()).find(c => c.startsWith('session='));
    if (!match) return NextResponse.json({ user: null, profile: null }, { status: 200 });

    const sessionCookie = decodeURIComponent(match.split('=')[1]);
    const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);

    const userRecord = await admin.auth().getUser(decodedClaims.uid);
    const firestore = admin.firestore();
    const doc = await firestore.collection('users').doc(decodedClaims.uid).get();
    const profile = doc.exists ? doc.data() : null;

    return NextResponse.json({ user: { uid: userRecord.uid, email: userRecord.email, name: userRecord.displayName }, profile }, { status: 200 });
  } catch (err) {
    console.error('sync-user error:', err);
    return NextResponse.json({ user: null, profile: null }, { status: 200 });
  }
}
