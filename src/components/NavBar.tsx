"use client";
// src/components/NavBar.tsx
import Link from 'next/link';
import styles from './NavBar.module.css';

export default function NavBar() {
    return (<nav className={styles.nav}>
            <div className={styles.utility}>Free Shipping on Orders $50+ | US • EN</div>
            <div className={styles.main}>
                <div className={styles.links}>
                    <Link href="#about" scroll={false}>About</Link>
                    <Link href="#work" scroll={false}>Work</Link>
                    <Link href="#blog" scroll={false}>Blog</Link>
                    <Link href="#contact" scroll={false}>Contact</Link>
                </div>
                <div className={styles.wordmark}>Benn Pattara</div>
                <div className={styles.actions}>
                    <a href="mailto:benn@example.com">Email</a>
                </div>
            </div>
        </nav>);
}
