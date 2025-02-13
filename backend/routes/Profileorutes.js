const express = require("express");
const { getProfile, updateProfile } = require("../controllers/Profilecontroller");
const authMiddleware = require("../middleware/AuthMiddleware");

const router = express.Router();

// Get User Profile
router.get("/profile", authMiddleware, getProfile);

// Update Profile
router.put('/update',authMiddleware,updateProfile)

module.exports = router;
