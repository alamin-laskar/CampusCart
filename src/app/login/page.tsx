'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup } from 'firebase/auth';
import styles from './login.module.css';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', { // Replace with your actual API path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) router.push('/dashboard');
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/dashboard');
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1>Login</h1>
          <p>Welcome back</p>
        </div>

        <button onClick={handleGoogleAuth} className={styles.submitBtn} style={{ marginBottom: '1rem', backgroundColor: '#4285F4' }}>
          Log in with Google
        </button>

        <div style={{ textAlign: 'center', margin: '10px 0', color: '#666' }}>OR</div>

        <form className={styles.form} onSubmit={handleManualLogin}>
          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input 
              type="email" id="email" placeholder="Example@gmail.com" required 
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div> 

          <div className={styles.inputGroup}>
            <div className={styles.labelRow}>
              <label htmlFor="password">Password</label>
              <Link href="/forgot-password" className={styles.forgotLink}>
                Forgot?
              </Link>
            </div>
            <input 
              type="password" id="password" placeholder="••••••••" required 
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Log In
          </button>
        </form>

        <p className={styles.footerText}>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}