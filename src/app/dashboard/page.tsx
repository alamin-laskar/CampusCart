'use client'
import { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, "users", currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setProfile(docSnap.data());
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  // Redirect only after we've resolved the auth state
  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [loading, user, router]);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  if (loading) return <div style={{ padding: '20px' }}>Loading Campus-Cart...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Dashboard</h1>
      <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px' }}>
        <h2>Welcome, {profile?.name || user?.displayName}!</h2>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Account ID:</strong> {user?.uid}</p>
        <p><strong>Role:</strong> {profile?.role || 'user'}</p>
        
        {user?.photoURL && (
          <img 
            src={user.photoURL} 
            alt="Profile" 
            style={{ borderRadius: '50%', width: '80px', marginTop: '10px' }} 
          />
        )}

        <button 
          onClick={handleLogout}
          style={{ 
            marginTop: '20px', 
            padding: '10px 20px', 
            backgroundColor: '#ff4444', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer' 
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}