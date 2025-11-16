// src/app/profile/page.tsx 

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import "./profilePage.css";
import NavigationBar from "../NavigationBar/navigation";
import { getLoggedInUserDetails, updateUser, signoutUser } from "../apicalls/users"; // Adjusted import path

export default function ProfilePage() {
    const router = useRouter();

    // State to manage the current date
    const [currentDate, setCurrentDate] = useState("");

    // State to toggle editing mode
    const [isEditing, setIsEditing] = useState(false);

    // User data fetched from the backend
    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        avatar: "",
        gender: "",
        country: ""
    });

    // State for the updated user data during editing
    const [updatedUser, setUpdatedUser] = useState({
        firstName: "",
        lastName: "",
        gender: "",
        country: ""
    });

    useEffect(() => {
        // Fetch and format the current date
        const today = new Date();
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = today.toLocaleDateString("en-US", options);
        setCurrentDate(formattedDate);

        // Fetch user data from the backend
        const fetchUserData = async () => {
            try {
                const response = await getLoggedInUserDetails();
                if (response.success) {
                    const user = response.data;
                    // Set user data and prepare for editing
                    setUserData(prevData => ({ ...prevData, ...user }));
                    setUpdatedUser({
                        firstName: user.firstName || "",
                        lastName: user.lastName || "",
                        gender: user.gender || "",
                        country: user.country || "",
                    });
                } else {
                    console.error("Failed to fetch user details:", response.message);
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUserData();
    }, []);

    const handleEditClick = () => {
        // Toggle between Edit and Save modes
        if (isEditing) {
            handleSave(); // Save changes
        } else {
            setIsEditing(true); // Enable editing
        }
    };

    const handleCancel = () => {
        // Reset updatedUser to the original user data
        setUpdatedUser({
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            gender: userData.gender || "",
            country: userData.country || "",
        });
        setIsEditing(false); // Exit editing mode
    };

    const handleSave = async () => {
        try {
            // Save updated user data to the backend
            const response = await updateUser(updatedUser);
            if (response.success) {
                console.log("User updated successfully:", response);
                // Reflect changes in the user data
                setUserData(prevData => ({ ...prevData, ...updatedUser }));
                setIsEditing(false); // Exit editing mode
            } else {
                console.error("Failed to update user:", response.message);
                alert("Failed to update profile. Please try again.");
            }
        } catch (error) {
            console.error("Error updating user:", error);
            alert("An error occurred while updating the profile. Please try again.");
        }
    };

    const handleSignout = () => {
        // Sign out the user and redirect to the login page
        signoutUser();
        router.push("/signIn");
    }

    return (
        <div className="profileContainer">
            {/* Navigation Bar with routing */}
            <NavigationBar />

            <main className="mainContent">
                {/* Welcome Header */}
                <header className="pageHeader">
                    <h1 className="welcomeMessage">Welcome, {userData.firstName || "User"}</h1>
                    <p className="date">{currentDate}</p>
                </header>

                {/* Profile Information Section */}
                <div className="middleSection">
                    <div className="colorBar"></div>
                    <div className="contentBody">
                        <div className="profileInfo">
                            {/* User Profile Image */}
                            <img
                                src={"/images/avatar-default.png"} // Placeholder image
                                alt="Profile"
                                className="profileImage"
                            />
                            {/* User Information */}
                            <div className="userInfo">
                                <h2 className="profileName">
                                    {userData.firstName} {userData.lastName}
                                </h2>
                                <Link href="/profile" className="profileEmail">
                                    {userData.email || "user@example.com"}
                                </Link>
                            </div>
                            {/* Edit and Cancel Buttons */}
                            <button className="editButton" onClick={handleEditClick}>
                                {isEditing ? "Save" : "Edit"}
                            </button>
                            {isEditing && (
                                <button className="cancelButton" onClick={handleCancel}>
                                    Cancel
                                </button>
                            )}
                        </div>

                        {/* Editable Fields */}
                        <div className="editFields">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="fieldLabel">First Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your First Name"
                                        className="inputField"
                                        value={updatedUser.firstName}
                                        onChange={(e) =>
                                            setUpdatedUser({ ...updatedUser, firstName: e.target.value })
                                        }
                                        disabled={!isEditing} // Disable input unless editing
                                    />
                                </div>
                                <div>
                                    <label className="fieldLabel">Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your Last Name"
                                        className="inputField"
                                        value={updatedUser.lastName}
                                        onChange={(e) =>
                                            setUpdatedUser({ ...updatedUser, lastName: e.target.value })
                                        }
                                        disabled={!isEditing} // Disable input unless editing
                                    />
                                </div>
                                <div>
                                    <label className="fieldLabel">Gender</label>
                                    <select
                                        data-testid="gender-select"
                                        className="inputField genderSelect"
                                        value={updatedUser.gender}
                                        onChange={(e) =>
                                            setUpdatedUser({ ...updatedUser, gender: e.target.value })
                                        }
                                        disabled={!isEditing} // Disable input unless editing
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="fieldLabel">Country</label>
                                    <input
                                        data-testid="country-input"
                                        type="text"
                                        placeholder="Your Country"
                                        className="inputField"
                                        value={updatedUser.country}
                                        onChange={(e) =>
                                            setUpdatedUser({ ...updatedUser, country: e.target.value })
                                        }
                                        disabled={!isEditing} // Disable input unless editing
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="fieldLabel">Email Address</label>
                                    <input
                                        type="text"
                                        placeholder="Your Email Address"
                                        className="inputField"
                                        value={userData.email}
                                        disabled // Email is always non-editable
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Signout Button */}
                <button className="signout" onClick={handleSignout}>
                    <p>Signout</p>
                </button>
            </main>
        </div>
    );
}