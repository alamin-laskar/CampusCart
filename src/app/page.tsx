import styles from './page.module.css';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function HomePage() {
  return (
    <main className={styles.container}>
     <Navbar/>
     <Footer/>
    </main>
  );
}