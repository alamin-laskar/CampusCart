'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import styles from './signup.module.css';

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // Handle Manual Signup
  const handleManualSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/signup', { // Replace with your actual API path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) router.push('/login');
    } catch (err) {
      console.error("Manual signup error", err);
    }
  };

  // Handle Google Signup/Login
  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Sync Google User to MongoDB
      await fetch('/api/auth/sync-user', { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          image: user.photoURL,
        }),
      });
      router.push('/dashboard');
    } catch (err) {
      console.error("Google auth error", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Create Account</h1>
          <p>Join your campus community today.</p>
        </div>

        {/* Google Sign-In Button */}
        <button onClick={handleGoogleAuth} className={styles.submitBtn} style={{ marginBottom: '1rem', backgroundColor: '#4285F4' }}>
          Sign up with Google
        </button>

        <div style={{ textAlign: 'center', margin: '10px 0', color: '#666' }}>OR</div>

        <form className={styles.form} onSubmit={handleManualSignup}>
          <div className={styles.inputGroup}>
            <label htmlFor="name">Full Name</label>
            <input 
              type="text" id="name" placeholder="Enter your name" required 
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" id="email" placeholder="name@gmail.com" required 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Password</label>
            <input 
              type="password" id="password" placeholder="••••••••" required 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms">
              I agree to the <Link href="/terms">Terms of Service</Link>
            </label>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Sign Up
          </button>
        </form>

        <p className={styles.footerText}>
          Already have an account? <Link href="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}