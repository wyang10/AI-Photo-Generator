"use client";

import "./historyPage.css";
import React, { useState, useEffect } from "react";
import Link from 'next/link';
import { getLoggedInUserDetails } from "../apicalls/users";
import { fetchHistoryPhotosById } from "../apicalls/history"; 
import NavigationBar from "../NavigationBar/navigation";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const UserProfileHistoryPage = () => { 
    const [userData, setUserData] = useState("");
    const [photos, setPhotos] = useState([]);
    const [avatarUrl, setAvatarUrl] = useState("");
    const [currentDate, setCurrentDate] = useState("");

    // Fetch user data and photos on mount
    useEffect(() => {
        async function loadUserData() {
            try {
                const userResponse = await getLoggedInUserDetails();
                setUserData(userResponse.data);
                const historyResponse = await fetchHistoryPhotosById();
                console.log("Fetched photos:", historyResponse.data);
                const photos = await fetchHistoryPhotosById();
                console.log("PHOTOS:", photos);
                setPhotos(historyResponse.data);
                return userResponse.data;
            } catch (error) {
                console.error("Error loading user data or history:", error);
            }
        }
        loadUserData();

        // Set the current date
        const today = new Date();
        const options = { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' };
        setCurrentDate(today.toLocaleDateString("en-US", options));
    }, []);

    // Load avatar URL on mount
    useEffect(() => {
        const fetchAvatar = async () => {
            try {
                const avatarResponse = await getLoggedInUserDetails();
                console.log("Avatar response:", avatarResponse);
                if (avatarResponse && avatarResponse.data && avatarResponse.data.avatar) {
                    setAvatarUrl(avatarResponse.data.avatar); // Set avatar URL
                }
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchAvatar();
    }, []);

    const downloadImage = async (index) => {
        const photo = photos[index];
        if (!photo || !photo.url) {
            alert("Photo URL is missing");
            return;
        }
    
        try {
            // const proxyUrl = `http://localhost:4000/photo/proxy?url=${encodeURIComponent(photo.url)}`;
            const proxyUrl = process.env.NEXT_PUBLIC_REACT_APP_BASE_API_URL + "/photo/proxy?url=" + encodeURIComponent(photo.url);
            const response = await fetch(proxyUrl);
    
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
    
            const link = document.createElement("a");
            link.href = url;
            link.download = `image-${photo._id || index + 1}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error downloading image:", error);
        }
    };

    // Download all images
    const downloadAllImages = async () => {
        if (!photos || photos.length === 0) {
            alert("No photos available to download");
            return;
        }
    
        const zip = new JSZip(); // Create a new ZIP file
        const folder = zip.folder("photos");
    
        try {
            for (let i = 0; i < photos.length; i++) {
                const photo = photos[i];
                if (!photo || !photo.url) {
                    console.warn(`Photo at index ${i} is missing or invalid`);
                    continue; // Skip to next iteration
                }
    
                try {
                    // Fetch image and convert to blob
                    // const proxyUrl = `http://localhost:4000/photo/proxy?url=${encodeURIComponent(photo.url)}`;
                    const proxyUrl = process.env.NEXT_PUBLIC_REACT_APP_BASE_API_URL + "/photo/proxy?url=" + encodeURIComponent(photo.url);
                    const response = await fetch(proxyUrl);
    
                    if (!response.ok) {
                        throw new Error(`Failed to fetch image at index ${i}`);
                    }
    
                    const blob = await response.blob();
                    const arrayBuffer = await blob.arrayBuffer();
                    const filename = `image-${photo._id || i + 1}.jpg`;
    
                    folder.file(filename, arrayBuffer); // Add image to ZIP folder
                    console.log(`Added ${filename} to ZIP`);
                } catch (error) {
                    console.error(`Error fetching image at index ${i}:`, error);
                }
            }
    
            // Generate the ZIP file and download it
            const content = await zip.generateAsync({ type: "blob" });
            saveAs(content, "photos.zip");
            alert("All images downloaded successfully!");
        } catch (error) {
            console.error("Error generating ZIP file:", error);
            alert("An error occurred while downloading images.");
        }
    };

    // Only for testing purposes
    // useEffect(() => {
    //     async function testDownload() {
    //         await downloadImage(2);
    //     }
    //     testDownload();
    // }, []);
    
    
    return (
            <div className="profileContainer">
                {/* Left Sidebar */}
                <NavigationBar />
            
                {/* Main Content */}
                <main className="mainContent">
                    {/* Top Section */}
                    <div className="topSection">
                        <h1 className="welcomeMessage">Welcome, {userData?.firstName}</h1>
                        <p className="date">{currentDate}</p>
                    </div>
                    
                    {/* Middle Section */}
                    <div className="middleSection">
                        <div className="colorBar"></div>
                        <div className="contentBody">
                            <div className="profileInfo">
                                {/* <div className="avatar"> */}
                                    <img
                                        src={ avatarUrl || "/images/exampleImage/avatar.png" }
                                        alt="avatar"
                                        className="profileImage"
                                    />
                                    
                                    {/* <div className="overlay">
                                        <i
                                            className="fas fa-upload faUpload" // Upload icon
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                document.getElementById("avatarUpload").click(); // Trigger file input
                                            }}
                                        />
                                    
                                        <input
                                            type="file"
                                            id="avatarUpload"
                                            accept="image/*"
                                            style={{ display: "none" }}
                                            onChange={handleFileChange}
                                        />
                                    </div> */}


                                {/* </div> */}

                                <div className="userInfo">
                                    <h2 className="profileName">
                                        {userData?.firstName} {userData?.lastName}
                                    </h2>
                                    <Link href="/profile" className="profileEmail">
                                        {userData?.email}
                                    </Link>
                                </div>
                                <button className="downloadButton" onClick={downloadAllImages}>
                                    Download All
                                </button>

                            </div>
                        </div>
                        {/* Bottom Section */}
                        <div className="bottomSection">
                            <h3 className="historyTitle">ID Photo History</h3>
                            <div className="photoGrid">
                                {photos && photos.length > 0 ? (
                                    photos.map((photo, index) => (
                                        <div key={index} className="photoItem">
                                            <img
                                                src={photo.url}
                                                alt={`Photo ${index + 1}`}
                                                className="photoImage"
                                                onError={(e) => {
                                                    // Hidding not existing figures
                                                    // e.target.closest('.photoItem').style.display = 'none';
                                                    e.target.src = "https://i0.wp.com/chemmatcars.uchicago.edu/wp-content/uploads/2021/03/default-placeholder-image-1024x1024-1.png?ssl=1";
                                                }}
                                            />

                                            <div className="overlay">
                                                <i
                                                    className="fas fa-download faDownload"
                                                    onClick={(e) => {
                                                        e.stopPropagation(); 
                                                        downloadImage(index);
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p>No photos</p>
                                )}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
    );
};


export default UserProfileHistoryPage