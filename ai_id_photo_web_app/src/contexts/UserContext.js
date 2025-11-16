"use client";

import React, { createContext, useState, useEffect } from "react";
import { getLoggedInUserDetails } from "../app/apicalls/users";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Function to fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getLoggedInUserDetails();
        console.log("Setting user in context:", userData);
        setUser(userData.data); // Set user in context
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
