const mongoose=require("mongoose");

const messageSchema = new mongoose.Schema({
  id: { type: String, required: true },
  roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

module.exports=mongoose.model("Message", messageSchema);
