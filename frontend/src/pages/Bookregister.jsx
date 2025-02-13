import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDarkMode } from '../context/Darkmodecontext';
import API_BASE_URL from '../config';
const RegisterBook = () => {
    const { isDarkMode } = useDarkMode();
     const navigate = useNavigate(); 
    const [formData, setFormData] = useState({
        name: '',
        author: '',
        genre: '',
        postdate: '',
        bookPicture: null,
        description: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, bookPicture: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        for (let key in formData) {
            formDataToSend.append(key, formData[key]);
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/api/book/register`, formDataToSend, {
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
            <h2 className="text-2xl font-bold text-center mb-6">Register Your Book</h2>

            <input className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-400' : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'}`} type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
            
            <input className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-400' : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'}`} type="text" name="author" placeholder="Author" value={formData.author} onChange={handleChange} required />
            
            <input className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-400' : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'}`} type="text" name="genre" placeholder="Genre" value={formData.genre} onChange={handleChange} required />
            
            <input className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-400' : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'}`} type="date" name="postdate" value={formData.postdate} onChange={handleChange} required />
            
            <input className="w-full p-3 border rounded-lg mb-4 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" type="file" name="bookPicture" accept="image/*" onChange={handleFileChange} required />
            
            <input className={`w-full p-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 transition-all duration-300 ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white focus:ring-blue-400' : 'border-gray-300 bg-white text-gray-900 focus:ring-blue-500'}`} type="text" name="description" placeholder="descrip[tion" value={formData.description} onChange={handleChange} required />
            
            <button className={`w-full p-3 rounded-lg transition duration-300 ${isDarkMode ? 'bg-blue-400 hover:bg-blue-500' : 'bg-blue-500 text-white hover:bg-blue-600'}`} type="submit">Publish</button>
        </form>
        </div>
    );
};

export default RegisterBook;

