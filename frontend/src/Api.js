import axios from "axios";
import Cookies from "js-cookie";
import API_BASE_URL from "./config"; // Backend URL

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // ✅ Ensures cookies are sent with requests
});

export const loginUser = async (credentials) => {
  const res = await axiosInstance.post("/api/auth/login", credentials);
  console.log("Login response:", res); // ✅ Debug response
  return res.data;
};

export const registerUser = async (userData) => {
  const res = await axiosInstance.post("/api/auth/register", userData);
  return res.data;
};

export const getProfile = async () => {
  try {
    const res = await axiosInstance.get("/api/profile/profile"); // ✅ Automatically sends cookies
    console.log("Profile data:", res.data);
    return res.data.user;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const res = await axiosInstance.put("/api/profile/update",profileData); // ✅ Automatically sends cookies
    console.log("Profile data:", res.data);
    return res.data.user;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
export const sendMessage = (data) => API.post("/api/chat/send", data);
export const getMessages = (bookId) => API.get(`api/chat/messages/${bookId}`);
