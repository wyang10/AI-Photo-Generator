"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./ForgotPassword.module.css";
import { requestPasswordReset } from "../apicalls/users";

const ForgotPassword = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const result = await requestPasswordReset(email);
      setMessage(result.message);
    } catch (err) {
      setError("Error: " + err.message);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.header}>Forgot Password</h2>
        <p className={styles.description}>
          Enter your email to receive a password reset link
        </p>
        <form onSubmit={handleForgotPassword}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.inputField}
          />
          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.message}>{message}</p>}
          <button type="submit" className={styles.submitButton}>
            Send Reset Link
          </button>
        </form>
        <button
          className={styles.backButton}
          onClick={() => router.push("/signIn")}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;
