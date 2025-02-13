const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyJwt = async (req, res, next) => {
  try {
    console.log("Cookies received:", req.cookies);
    const token = req.cookies.accessToken; 
    console.log("Token received:", token); // Debugging

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

   const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = await User.findById(decodedToken._id).select("-password -refreshtoken");

    if (!req.user) {
      return res.status(401).json({ message: "Invalid token: User does not exist" });
    }
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = verifyJwt;





