"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import styles from './Privacy.module.css';

const PrivacyPage = () => {
  const router = useRouter();

  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.logo} onClick={() => router.push('/')}>
          AI ID Photo
        </div>
      </nav>

      <main className={styles.main}>
        <h1>Privacy Policy</h1>
        <div className={styles.content}>
          <section>
            <h2>Information We Collect</h2>
            <p>We collect information that you provide directly to us, including personal information such as your name, email address, and the photos you upload to our service.</p>
          </section>

          <section>
            <h2>How We Use Your Information</h2>
            <p>Your information is used to provide and improve our services, process your photos, and communicate with you about our services.</p>
          </section>

          <section>
            <h2>Data Storage and Security</h2>
            <p>We implement appropriate security measures to protect your personal information. You can delete your photos at any time.</p>
          </section>

          <section>
            <h2>Your Rights</h2>
            <p>You have the right to access, correct, or delete your personal information. Contact us if you wish to exercise these rights.</p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default PrivacyPage; 