"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './Terms.module.css';

const TermsPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          AI ID Photo
        </div>
      </nav>

      <main className={styles.main}>
        <h1>Terms of Service</h1>
        <div className={styles.content}>
          <section>
            <h2>Acceptance of Terms</h2>
            <p>By accessing and using AI ID Photo, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
          </section>

          <section>
            <h2>Use of Service</h2>
            <p>You agree to use our service only for lawful purposes and in accordance with these Terms. You are responsible for ensuring that the photos you submit comply with official ID photo requirements.</p>
          </section>

          <section>
            <h2>Intellectual Property</h2>
            <p>You retain all rights to the photos you upload. By using our service, you grant us a limited license to process and modify your photos as necessary to provide our services.</p>
          </section>

          <section>
            <h2>Limitation of Liability</h2>
            <p>We strive to provide accurate and compliant ID photos but cannot guarantee acceptance by all authorities. Use of our service is at your own risk.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default TermsPage; 