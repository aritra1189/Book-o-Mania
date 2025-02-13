const User = require("../models/User");
const cloudinary = require("../utils/cloudinary");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");



// Generate Access & Refresh Tokens
const generatetokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");

    const accesstoken = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
    const refreshtoken = jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

    user.refreshtoken = refreshtoken;
    await user.save({ validateBeforeSave: false });

    return { accesstoken, refreshtoken };
  } catch (error) {
    console.error("Error in generatetokens:", error.message);
    throw new Error("Failed to generate tokens");
  }
};

// Register User
// Ensure Cloudinary is configured



exports.registerUser = async (req, res) => {
    try {
        const { name, email, username, dateofBirth, password,country,city } = req.body;

        // 🔹 Validate required fields
        if (!name || !email || !username || !dateofBirth || !password || !country ||!city) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 🔹 Check if email or username already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: "Email or Username already in use" });
        }

        // 🔹 Handle profile picture upload (Memory Storage)
        if (!req.file) {
            return res.status(400).json({ message: "Profile picture is required" });
        }

        let uploadResponse;
        try {
            uploadResponse = await cloudinary.uploader.upload_stream(
                { folder: "profile_pictures" },
                async (error, result) => {
                    if (error) {
                        console.error("Cloudinary Upload Error:", error);
                        return res.status(500).json({ message: "Failed to upload profile picture" });
                    }

                    // 🔹 Create new user
                    const newUser = new User({
                        name,
                        email,
                        username,
                        country,
                        city,
                        password, // Password will be hashed in UserSchema
                        dateofBirth,
                        profilePicture: result.secure_url
                    });

                    await newUser.save();

                    // 🔹 Generate Tokens
                    const accessToken = newUser.generateAccessToken();
                    const refreshToken = newUser.generateRefreshToken();

                    // 🔹 Save refresh token in DB
                    newUser.refreshtoken = refreshToken;
                    await newUser.save();

                    res.status(201).json({
                        message: "User registered successfully",
                        user: {
                            _id: newUser._id,
                            
                            name: newUser.name,
                            country: newUser.country,
                            city: newUser.city,
                            email: newUser.email,
                            username: newUser.username,
                            profilePicture: newUser.profilePicture,
                        },
                        accessToken,
                        refreshToken
                    });
                }
            );

            uploadResponse.end(req.file.buffer); // Upload from memory buffer
        } catch (error) {
            console.error("Cloudinary Upload Error:", error);
            return res.status(500).json({ message: "Failed to upload profile picture" });
        }
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.loginUser = async (req, res) => {
    try {
      const { email, username, password } = req.body;
  
      if (!email && !username) return res.status(400).json({ message: "Email or username is required" });
      if (!password) return res.status(400).json({ message: "Password is required" });
  
      const user = await User.findOne({ $or: [{ username }, { email }] });
      if (!user) return res.status(404).json({ message: "User not found" });
  
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) return res.status(401).json({ message: "Invalid credentials" });
  
      // 🛠 FIX: Add `await` for `generatetokens`
      const { accesstoken, refreshtoken } = await generatetokens(user._id);
  
      res
        .cookie("accessToken", accesstoken, {
          httpOnly: true,
          secure:true,
          sameSite: "None",
          maxAge: 15 * 60 * 10000,
        })
        .cookie("refreshToken", refreshtoken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "None",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        })
        .status(200)
        .json({
          message: "Login successful",
          accesstoken, // ✅ Tokens now correctly returned
          refreshtoken,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            country: user.country,
            city: user.city,
            name: user.name,
            dateofBirth: user.dateofBirth,
            profilePicture:user.profilePicture
          },
        });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

// 67a828db8969ac8469b4badc
