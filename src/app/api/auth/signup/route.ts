import { NextResponse } from 'next/server';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // 1. Create User in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2. Add Display Name to the Auth Profile
    await updateProfile(user, { displayName: name });

    // 3. Create User Document in Firestore (The "Schema" part)
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name: name,
      email: email,
      createdAt: serverTimestamp(),
      provider: "password",
    });

    return NextResponse.json({ message: "User created successfully", uid: user.uid }, { status: 201 });

  } catch (error: any) {
    console.error("Signup Error:", error.code, error.message);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}