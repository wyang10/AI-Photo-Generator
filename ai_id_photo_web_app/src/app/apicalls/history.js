import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_REACT_APP_BASE_API_URL || "http://localhost:4000";

const getAuthToken = () => localStorage.getItem("authToken");

export const fetchHistoryPhotosById = async () => {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error("No authentication token found");
        }
        const response = await axios.get(`${API_BASE_URL}/users/get-photo-history`, {
            headers: {
                Authorization: `Bearer ${token}`, // Attach JWT token in Authorization header
            },
        });
        console.log("Fetched history photos:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching history photos:", error);
        throw error.response ? error.response.data : error;
    }
};

export const fetchPhotoById = async () => {
    try {
        const token = getAuthToken();
        if (!token) {
            throw new Error("No authentication token found");
        }
        const response = await axios.get(`${API_BASE_URL}/users/get-single-photo`, {
            headers: {
                Authorization: `Bearer ${token}`, // Attach JWT token in Authorization header
            },
        });
        console.log("Fetched photo by ID:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error fetching photo by ID:", error);
        throw error.response ? error.response.data : error;
    }
};