const User = require("../models/User");
const ApiError = require("../utils/apierror");
// Get User Profile


// Get User Profile


exports.getProfile = async (req, res, next) => {
  try {
    console.log("User in request:", req.user); // Debug log

    if (!req.user) return next(new ApiError(401, "Unauthorized: No user found"));

    // ✅ Fetch full user profile from the database
    const user = await User.findById(req.user._id).select("-password"); // Exclude password

    if (!user) return next(new ApiError(404, "User not found"));

    return res.status(200).json({
      success: true,
      message: "Profile fetched successfully",
      user, // ✅ Returns full user data including profilePicture
    });

  } catch (error) {
    console.error("Profile Fetch Error:", error);
    next(new ApiError(500, "Server error", error));
  }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, dateofBirth,username,country,city } = req.body;
        const userId = req.user.id; // Extracted from JWT via authMiddleware

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { name, dateofBirth,username,country,city },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error });
    }
};


