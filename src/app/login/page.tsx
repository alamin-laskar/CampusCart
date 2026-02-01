'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, setPersistence, browserLocalPersistence, signInWithEmailAndPassword } from 'firebase/auth';
import styles from './login.module.css';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Enable persistence so user stays logged in
    setPersistence(auth, browserLocalPersistence).catch(console.error);
  }, []);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Perform client-side sign-in so Firebase client state is populated
      const userCred = await signInWithEmailAndPassword(auth, formData.email, formData.password);

      // Get ID token and create a server session cookie
      const idToken = await userCred.user.getIdToken();
      await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      router.push('/dashboard');
    } catch (err) {
      console.error("Login failed", err);
      alert('Invalid credentials');
    } finally {
      setLoading(false);
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

        <button type="button" onClick={handleGoogleAuth} className={styles.googleBtn}>
          <svg className={styles.googleIcon} viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
          </svg>
          Continue with Google
        </button>

        <div className={styles.divider}>OR</div>

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

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <p className={styles.footerText}>
          Don&apos;t have an account? <Link href="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}