import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_REACT_APP_BASE_API_URL || "http://localhost:4000";

// Helper function to get the token from localStorage
const getAuthToken = () => {
  const token = localStorage.getItem("authToken");
  //console.log("Auth Token:", token); // Debug the token
  return token;
};

// Function to handle user sign-in
export const signInUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/signin`, {
      email,
      password,
    });

    // Backend only returns a success message or 2FA requirement, no token now
    return response.data;
  } catch (error) {
    console.error("Error during sign-in:", error);
    throw error.response ? error.response.data : error;
  }
};

// Function to handle user sign-up
export const signUpUser = async (firstName, lastName, email, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/signup`, {
      firstName,
      lastName,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    console.error("Error during sign-up:", error);
    throw error.response ? error.response.data : error;
  }
};

// Function to get details of the logged-in user
export const getLoggedInUserDetails = async () => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.get(
      `${API_BASE_URL}/users/get-logged-in-user`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Attach JWT token in Authorization header
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error in getLoggedInUserDetails:", error.response || error);
    throw new Error(
      error.response?.data?.error || "Failed to fetch user data."
    );
  }
};

// Send the Google ID token to the backend
export const googleSignIn = async (idToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/google-signin`, {
      idToken,
    });
    // the backend returns the token in response.data.token
    const token = response.data.token;

    // Store token in both cookie and localStorage
    document.cookie = `authToken=${token}; path=/; max-age=2592000`; // 30 days
    localStorage.setItem("authToken", token);

    return response.data;
  } catch (error) {
    console.error("Error during Google Sign-In:", error);
    throw error.response ? error.response.data : error;
  }
};

// Function to update user details
export const updateUser = async (userData) => {
  try {
    const token = getAuthToken();

    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await axios.put(`${API_BASE_URL}/users/update`, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data; // Return the updated user data
  } catch (error) {
    console.error("Error updating user:", error);
    throw error.response ? error.response.data : error;
  }
};

export const signoutUser = async () => {
  localStorage.removeItem("authToken");
  document.cookie = "authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  console.log("Sign out successfully");
};

export const requestPasswordReset = async (email) => {
  try {
    await axios.post(`${API_BASE_URL}/users/forgot-password`, {
      email,
    });
    return { success: true, message: "Password reset email sent!" };
  } catch (err) {
    throw new Error(err.response?.data?.error || "Failed to send reset email");
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/reset-password`, {
      token,
      newPassword,
    });
    return (
      response.data.message ||
      "Password reset successfully! Redirecting to login..."
    );
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to reset password");
  }
};

export const verifyTwoFactorCode = async (email, code) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/verify-2fa-code`, {
      email,
      code,
    });

    // the backend returns the token in response.data.token
    const token = response.data.token;

    // Store token in both cookie and localStorage
    document.cookie = `authToken=${token}; path=/; max-age=2592000`; // 30 days
    localStorage.setItem("authToken", token);

    return response.data;
  } catch (error) {
    throw new Error(
      error.response?.data?.error || "Failed to verify 2FA code."
    );
  }
};
