const express=require( "express");
const { sendMessage, getMessages }=require("../controllers/Chatcontroller.js");
const  protect =require("../middleware/AuthMiddleware.js");

const router = express.Router();

router.post("/send", protect, sendMessage); // ✅ Send a message
router.get("/messages/:bookId", protect, getMessages); // ✅ Get messages in a room

module.exports = router;
