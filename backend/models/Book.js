const mongoose = require("mongoose");


const BookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    postdate: { type: Date, required: true },
    bookPicture: { type: String, required: true },
    description: { type: String, required: true },
    reviews: [
        {
          user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          comment: String,
        },
      ],
      likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
      dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});
module.exports = mongoose.model("Book", BookSchema);