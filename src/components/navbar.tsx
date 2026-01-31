'use client'
import Link from 'next/link';
import styles from './styles/Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.nav}>
      <Link href="/" className={styles.logo}>Campus Cart</Link>
      
      <div className={styles.links}>
        <Link href="/login" className={styles.linkBtn}>Log In</Link>
        <Link href="/signup" className={styles.linkBtn}>Sign Up</Link>
        <Link href="/contact" className={styles.linkBtn}>Contact Us</Link>
      </div>
    </nav>
  );
}