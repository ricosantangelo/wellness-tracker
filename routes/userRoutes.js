const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');



// Route to render landing page
router.get('/', userController.renderLandingPage);


// Registration route
router.post('/register', userController.register);

// Login route
router.post('/login', userController.login);

// View profile route (might require authentication middleware to ensure logged-in status)
router.get('/profile', userController.profile);

// Edit profile route
router.put('/profile/edit', userController.editProfile);

// Logout route
router.post('/logout', userController.logout);

// Forgot password route
router.post('/forgot-password', userController.forgotPassword);

// Reset password route
router.post('/reset-password', userController.resetPassword);

// Delete account route
router.delete('/delete', userController.deleteAccount);

module.exports = router;