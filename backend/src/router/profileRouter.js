const express = require('express');
const router = express.Router();
const profileController = require('../controller/profileController');
const authMiddleware = require('../../middleware/authUser');
const upload = require('../../middleware/multer');

// Middleware to protect routes and ensure user is authenticated
router.use(authMiddleware);

// Update profile route
router.patch('/update', profileController.updateProfile);

// Update profile image route (using multer for file upload)
router.patch('/update-image', 
  upload.single('profileImage'), 
  profileController.updateProfileImage
);

// Get profile details route
router.get('/', profileController.getProfile);

module.exports = router;