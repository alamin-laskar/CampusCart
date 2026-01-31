import styles from './styles/Footer.module.css';
import Link from 'next/link';
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.column}>
          <h4>Marketplace</h4>
          <Link href="">BiCycles</Link>
          <Link href="">Electronics</Link>
          <Link href="">Stationeries</Link>
          <Link href="">Books</Link>
          <Link href="">Study Materials</Link>
        </div>
        <div className={styles.column}>
          <h4>Support</h4>
          <Link href="">Help Center</Link>
          <Link href="">Guide</Link>
          <Link href="">Contact US</Link>
        </div>
        <div className={styles.column}>
          <h4>Legal</h4>
          <Link href="">Privacy</Link>
          <Link href="">Terms & Services</Link>
        </div>
      </div>
      <div className={styles.bottom}>
        © {new Date().getFullYear()} CampusCart. All rights reserved.
      </div>
    </footer>
  );
}