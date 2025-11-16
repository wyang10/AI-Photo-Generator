"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './About.module.css';

const AboutPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          AI ID Photo
        </div>
      </nav>

      <main className={styles.main}>
        <h1>About Us</h1>
        <div className={styles.content}>
          <section>
            <h2>Our Mission</h2>
            <p>At AI ID Photo, we&apos;re revolutionizing the way people obtain ID photos. Our mission is to make professional-quality ID photographs accessible to everyone, anywhere, at any time.</p>
          </section>

          <section>
            <h2>What We Do</h2>
            <p>Using cutting-edge AI technology, we help users create perfect ID photos that meet official requirements for passports, visas, and other documents. Our system ensures proper lighting, background, and positioning while maintaining natural looks.</p>
          </section>

          <section>
            <h2>Why Choose Us</h2>
            <ul>
              <li>Instant results with AI-powered technology</li>
              <li>Guaranteed compliance with official requirements</li>
              <li>Affordable and convenient solution</li>
              <li>Available 24/7</li>
            </ul>
          </section>
        </div>
      </main>
    </div>
  );
};

export default AboutPage;
