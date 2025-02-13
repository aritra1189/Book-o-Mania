const cloudinary = require("../utils/cloudinary");
const Book = require("../models/Book");

exports.registerBook = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Book picture is required" });
    }

    console.log("Checking for duplicate book...");

    // Check if a book with the same name or picture already exists
    const existingBook = await Book.findOne({ 
      name: req.body.name, 
      bookPicture: { $exists: true } // Ensures bookPicture exists
    });

    if (existingBook) {
      return res.status(400).json({ message: "Book with the same name and picture already exists!" });
    }

    console.log("Uploading file to Cloudinary...");

    // Upload directly from memory buffer
    const uploadResponse = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "book_pictures", resource_type: "image" },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(req.file.buffer);
    });

    console.log("Upload Successful! Cloudinary URL:", uploadResponse.secure_url);

    // Save book details in MongoDB
    const newBook = new Book({
      name: req.body.name,
      author: req.body.author,
      genre: req.body.genre,
      postdate: req.body.postdate,
      bookPicture: uploadResponse.secure_url,
      description: req.body.description,
    });

    await newBook.save();
    res.status(201).json({ message: "Book registered successfully!", book: newBook });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.searchBooks = async (req, res) => {
  try {
    const { query, id } = req.query;

    // ✅ If ID is provided, fetch book details
    if (id) {
      console.log("Fetching book by ID:", id);  // Debugging
      const book = await Book.findById(id)
        .populate("reviews.user", "name")
        .populate("likes dislikes", "name");

      if (!book) {
        console.log("Book not found!");  // Debugging
        return res.status(404).json({ message: "Book not found" });
      }

      // ✅ Add like & dislike count to the response
      return res.json({
        _id: book._id,
        name: book.name,
        genre: book.genre,
        author: book.author,
        postdate: book.postdate,
        description:book.description,
        bookPicture: book.bookPicture,
        reviews: book.reviews,
        likesCount: book.likes.length,
        dislikesCount: book.dislikes.length,
        likedBy: book.likes.map(user => user.name),  // List of users who liked
        dislikedBy: book.dislikes.map(user => user.name)  // List of users who disliked
      });
    }

    // ✅ If search query is provided, find matching books
    if (query) {
      console.log("Searching for books with name:", query);  // Debugging
      const books = await Book.find({ name: { $regex: query, $options: "i" } }).limit(5)
        .populate("reviews.user", "name")
        .populate("likes dislikes", "name");

      console.log("Search Results:", books);  // Debugging

      // ✅ Add like & dislike count to each book
      const updatedBooks = books.map(book => ({
        _id: book._id,
        name: book.name,
        genre: book.genre,
        author: book.author,
        description: book.description,
        postdate: book.postdate,
        bookPicture: book.bookPicture,
        likesCount: book.likes.length,
        dislikesCount: book.dislikes.length,
        likedBy: book.likes.map(user => user.name), 
        dislikedBy: book.dislikes.map(user => user.name)
      }));

      return res.json(updatedBooks);
    }

    // ✅ If no query or ID, return empty array
    return res.json([]);

  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.addReview = async (req, res) => {
  try {
    const { bookId, comment } = req.body;

    if (!bookId || !comment) {
      return res.status(400).json({ message: "Book ID and comment are required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: User not found in token" });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // ✅ Ensure the comment is added
    book.reviews.push({ user: req.user._id, comment });
    await book.save();

    // ✅ Fetch updated book with populated user details
    const updatedBook = await Book.findById(bookId)
      .populate("reviews.user", "name")  // Get user details
      .select("reviews");  // Return only reviews for efficiency

    res.json({ 
      message: "Review added successfully", 
      reviews: updatedBook.reviews  // ✅ Return updated reviews array
    });

  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.likeBook = async (req, res) => {
  try {
    const { bookId } = req.body;
    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Unauthorized: No user found in token" });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const userId = req.user._id.toString();

    // ✅ Check if already liked
    if (book.likes.includes(userId)) {
      book.likes = book.likes.filter((id) => id.toString() !== userId);
    } else {
      book.likes.push(userId);
      book.dislikes = book.dislikes.filter((id) => id.toString() !== userId);
    }

    await book.save();
    res.json({ message: "Like toggled successfully", book });
  } catch (error) {
    console.error("Error liking book:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

exports.dislikeBook = async (req, res) => {
  try {
    const { bookId } = req.body; // ✅ Get bookId from request body

    if (!bookId) {
      return res.status(400).json({ message: "Book ID is required" });
    }

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (!book.dislikes.includes(req.user._id)) {
      book.dislikes.push(req.user._id);
      book.likes = book.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      // If already disliked, remove the dislike (toggle)
      book.dislikes = book.dislikes.filter((id) => id.toString() !== req.user._id.toString());
    }

    await book.save();
    res.json({ message: "Book disliked successfully", book });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






