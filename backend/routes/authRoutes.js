const express = require('express');
const upload = require('../middleware/multer');
const { registerUser } = require('../controllers/authcontroller');
const {loginUser}=require('../controllers/authcontroller')
const router = express.Router();
router.post('/register', upload.single('profilePicture'), registerUser);
router.route("/login").post(loginUser)
module.exports = router;