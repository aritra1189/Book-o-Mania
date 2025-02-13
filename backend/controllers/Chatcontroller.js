const Message = require("../models/Message.js");

// ✅ Send a message


exports.sendMessage = async (req, res) => {
  try {
    const { bookId, content } = req.body;
    const userId = req.user?._id; // ✅ Ensure req.user exists

    if (!bookId || !content || !userId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const message = new Message({
      id: Math.random().toString(36).substr(2, 9), // ✅ Generate unique message ID
      roomId: bookId,
      userId,
      content,
      timestamp: new Date(), // ✅ Ensure timestamp is properly set
    });

    await message.save();
    
    // ✅ Populate user details before sending to frontend
    const populatedMessage = await Message.findById(message._id).populate("userId", "name");

    return res.status(201).json({ message: "Message sent", data: populatedMessage });
  } catch (error) {
    console.error("Send Message Error:", error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!bookId) {
      return res.status(400).json({ error: "Room ID is required" });
    }

    // ✅ Ensure userId is populated so frontend gets the name
    const messages = await Message.find({ roomId: bookId })
      .populate("userId", "name") // ✅ Populate user name
      .sort({ timestamp: 1 });

    return res.json(messages);
  } catch (error) {
    console.error("Get Messages Error:", error);
    return res.status(500).json({ error: error.message });
  }
};




