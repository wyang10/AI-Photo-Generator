"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  signInUser,
  googleSignIn,
  verifyTwoFactorCode,
} from "../apicalls/users";
import { UserContext } from "../../contexts/UserContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import styles from "./SignIn.module.css";

const SignIn = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signInError, setSignInError] = useState("");
  const [twoFactorError, setTwoFactorError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isTwoFactorPopupVisible, setIsTwoFactorPopupVisible] = useState(false); // Track if in 2FA step
  const { setUser } = useContext(UserContext);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);

  useEffect(() => {
    // Check if an email is saved in localStorage and pre-fill the input if so
    const savedEmail = localStorage.getItem("savedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setSignInError("");

    try {
      // Move to 2FA step, show the 2FA popup
      setIsTwoFactorPopupVisible(true);

      // Validate email and password
      await signInUser(email, password);
    } catch (err) {
      setSignInError(err.response?.data?.error || "Invalid email or password.");
    }
  };

  const handleVerifyTwoFactor = async (e) => {
    e.preventDefault();
    setTwoFactorError("");

    try {
      // Verify the 2FA code
      const userData = await verifyTwoFactorCode(email, twoFactorCode);

      // Log the token received
      console.log("Token received after 2FA:", userData.token);

      // Finalize login
      setUser(userData);
      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
      } else {
        localStorage.removeItem("savedEmail");
      }
      console.log("Signed in successfully:", userData);
      localStorage.setItem("authToken", userData.token);

      // Success alert and redirect
      alert("Correct code. Redirecting to landing page...");
      router.push("/landingPage");
    } catch (err) {
      setTwoFactorError(
        err.response?.data?.error || "Invalid or expired authentication code."
      );
    }
  };

  const handleGoogleResponse = async (response) => {
    const idToken = response.credential;
    try {
      // Send token to backend
      const userData = await googleSignIn(idToken);
      // Clear previous user data
      setUser(null);
      // Set the user data in context
      setUser(userData);
      // Store the token in local storage
      console.log("Google sign-in successful", userData.token);
      router.push("/landingPage"); // Redirect after sign-in
    } catch (error) {
      console.error("Google sign-in error:", error);
    }
  };

  // Initialize Google Sign-In button
  useEffect(() => {
    console.log("Google Client ID:", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
    // Function to add the Google Sign-In script dynamically
    const loadGoogleScript = () => {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.google) {
          window.google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleGoogleResponse,
          });
          window.google.accounts.id.renderButton(
            document.getElementById("googleSignInButton"),
            { theme: "outline", size: "large" }
          );
        }
      };
    };

    // Load the script when the component mounts
    loadGoogleScript();

    return () => {
      const googleScript = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (googleScript) googleScript.remove(); // Clean up the script on unmount
    };
  }, []);

  const handleResendCode = async () => {
    if (!canResend) return;
    
    try {
      await signInUser(email, password);
      setCanResend(false);
      let timeLeft = 30; // 30 seconds cooldown
      setResendTimer(timeLeft);
      
      const timer = setInterval(() => {
        timeLeft -= 1;
        setResendTimer(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(timer);
          setCanResend(true);
        }
      }, 1000);
    } catch (err) {
      setSignInError(err.response?.data?.error || "Failed to resend code.");
    }
  };

  const handleClosePopup = () => {
    setIsTwoFactorPopupVisible(false);
    setTwoFactorCode("");
    setTwoFactorError("");
  };

  useEffect(() => {
    if (isTwoFactorPopupVisible) {
      let timeLeft = 30;
      setResendTimer(timeLeft);
      
      const timer = setInterval(() => {
        timeLeft -= 1;
        setResendTimer(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(timer);
          setCanResend(true);
        }
      }, 1000);

      return () => clearInterval(timer); // Cleanup on unmount
    }
  }, [isTwoFactorPopupVisible]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Login Form */}
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Login</h2>
          <p className={styles.formSubtitle}>
            Login to access your ID Photo Generator account
          </p>

          <form onSubmit={handleSignIn}>
            <label className={styles.inputLabel}>Email</label>
            <input
              type="email"
              placeholder="Email"
              className={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className={styles.inputLabel}>Password</label>
            <div className={styles.passwordContainer}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                className={styles.inputField}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEye : faEyeSlash}
                className={styles.eyeIcon}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>

            <div className={styles.actions}>
              <label className={styles.rememberLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  style={{ marginRight: "8px" }}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />{" "}
                Remember me
              </label>
              <p className={styles.forgotPasswordLink}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/forgotPassword");
                  }}
                >
                  Forgot Password?
                </a>
              </p>
            </div>

            {signInError && <p className={styles.error}>{signInError}</p>}
            <button
              data-testid="login-button"
              type="submit"
              className={styles.loginButton}
            >
              Login
            </button>
          </form>

          {/* Two-Factor Authentication Popup */}
          {isTwoFactorPopupVisible && (
            <div className={styles.popupOverlay}>
              <div className={styles.popup}>
                <div className={styles.popupContent}>
                  <button onClick={handleClosePopup} className={styles.closeButton}>×</button>
                  <h2 className={styles.authHeader}>Two-Factor Authentication</h2>
                  <form onSubmit={handleVerifyTwoFactor}>
                    <label className={styles.authCodeLabel}>
                      Authentication Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter the code sent to your email"
                      className={styles.inputField}
                      value={twoFactorCode}
                      onChange={(e) => setTwoFactorCode(e.target.value)}
                      required
                    />

                    {twoFactorError && (
                      <p className={styles.error}>{twoFactorError}</p>
                    )}
                    <button type="submit" className={styles.verifyButton}>
                      Verify Code
                    </button>
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className={`${styles.resendButton} ${!canResend ? styles.resendDisabled : ''}`}
                      disabled={!canResend}
                    >
                      {canResend ? 'Resend Code' : `Resend in ${resendTimer}s`}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          <p className={styles.signupLink}>
            Don’t have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push("/signUp");
              }}
            >
              Sign up
            </a>
          </p>

          <div className={styles.divider}>
            <hr className={styles.dividerLine} />
            <span className={styles.dividerText}>Or Login With</span>
            <hr className={styles.dividerLine} />
          </div>

          {/* Google Sign-In Button */}
          <div id="googleSignInButton" className={styles.googleButton}></div>
        </div>

        {/* Right Side - Image */}
        <div className={styles.imageSection}>
          <img
            src="/images/id-photo-login.jpeg"
            alt="Illustration"
            className={styles.illustration}
          />
        </div>
      </div>
    </div>
  );
};

export default SignIn;
