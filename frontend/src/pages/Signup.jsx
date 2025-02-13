import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/Darkmodecontext'; // ✅ Import Dark Mode Context
import API_BASE_URL from '../config';
const Signup = () => {
    const { isDarkMode } = useDarkMode(); // ✅ Get dark mode state
    const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        username: '',
        country: '',
        city: '',
        dateofBirth: '',
        profilePicture: null,
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, profilePicture: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/api/auth/register`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("Response:", response.data);
            alert(response.data.message);
            navigate('/');
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.message || "Server Error");
        }
    };

    return (
        <div className={`flex items-center justify-center min-h-screen transition-all duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <form onSubmit={handleSubmit} className={`shadow-lg rounded-lg p-8 w-full max-w-md transition-all duration-300 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
                <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

                <input className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-400' : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'}`} type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                
                <input className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-400' : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'}`} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-400' : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'}`} type="text" name="country" placeholder="country" value={formData.country} onChange={handleChange} required />
                <input className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-400' : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'}`} type="text" name="city" placeholder="city" value={formData.city} onChange={handleChange} required />
                
                <input className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-400' : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'}`} type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required />
                
                <input className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-400' : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'}`} type="date" name="dateofBirth" value={formData.dateofBirth} onChange={handleChange} required />
                
                <input className="w-full p-3 border rounded-lg mb-4 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" type="file" name="profilePicture" accept="image/*" onChange={handleFileChange} required />
                
                <input className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-400' : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'}`} type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
                
                <button className={`w-full p-3 rounded-lg transition duration-300 ${isDarkMode ? 'bg-blue-400 hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`} type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;

