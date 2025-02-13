const express = require('express');
const upload = require('../middleware/multer');
const { registerBook, searchBooks, getAllBooks, addReview, likeBook, dislikeBook} = require('../controllers/Bookcontroller');
const verifyJwt = require('../middleware/AuthMiddleware');
const router = express.Router();
router.post('/register', upload.single('bookPicture'), registerBook);
router.get("/search", searchBooks);
router.get('/all',getAllBooks)
router.post('/search/review',verifyJwt,addReview);
router.post('/search/like',verifyJwt,likeBook);
router.post('/search/dislike',verifyJwt,dislikeBook);
module.exports = router;
// 67a88a67ea03d6339aab8a9c
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2N2E4ZDU2MWE5ZDdmYTVlM2YzYjdjMTAiLCJpYXQiOjE3MzkxMTgwMDMsImV4cCI6MTczOTEyMTYwM30.q0bKHiXcz0jPfHEnjXbx8z-x10ohcCV9a6GUkAS35pc