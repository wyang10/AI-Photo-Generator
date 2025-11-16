"use client";

import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { signUpUser, googleSignIn } from "../apicalls/users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { UserContext } from "../../contexts/UserContext";
import styles from "./SignUp.module.css";

const SignUp = () => {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // Check if passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const newUserData = await signUpUser(
        firstName,
        lastName,
        email,
        password
      );

      console.log("Account created successfully:", newUserData);
      // Show alert message on successful signup
      alert(
        "Account created successfully!"
      );
      router.push("/landingPage"); // Redirect to login page after signup
    } catch (err) {
      setError("Error creating account. Please try again. Error: " + err);
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

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Left Side - Image */}
        <div className={styles.imageSection}>
          <img
            src="/images/id-photo-signup.jpeg"
            alt="Sign-up Illustration"
            className={styles.illustration}
          />
        </div>

        {/* Right Side - Form */}
        <div className={styles.formSection}>
          <h2 className={styles.formTitle}>Sign up</h2>

          <form onSubmit={handleSignUp}>
            <div className={styles.inputGroup}>
              <div>
                <label className={styles.inputLabel}>First Name</label>
                <input
                  type="text"
                  placeholder="First Name"
                  className={styles.inputField}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div>
                <label className={styles.inputLabel}>Last Name</label>
                <input
                  type="text"
                  placeholder="Last Name"
                  className={styles.inputField}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className={styles.inputLabel}>Email</label>
              <input
                type="email"
                placeholder="Email"
                className={styles.inputField}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.passwordContainer}>
              <label className={styles.inputLabel}>Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
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

            <div className={styles.passwordContainer}>
              <label className={styles.inputLabel}>Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className={styles.inputField}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <FontAwesomeIcon
                icon={showConfirmPassword ? faEye : faEyeSlash}
                className={styles.eyeIcon}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            </div>

            {error && <p className={styles.error}>{error}</p>}
            <button type="submit" className={styles.createAccountButton}>
              Create Account
            </button>
          </form>

          <p className={styles.loginLink}>
            Already have an account?{" "}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push("/signIn");
              }}
            >
              Log in
            </a>
          </p>

          <div className={styles.divider}>
            <hr className={styles.dividerLine} />
            <span className={styles.dividerText}>Or Continue With</span>
            <hr className={styles.dividerLine} />
          </div>

          {/* Google Sign-In Button */}
          <div id="googleSignInButton" className={styles.googleButton}></div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
