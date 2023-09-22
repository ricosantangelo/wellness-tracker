const db = require('../models'); 
const bcrypt = require('bcryptjs');


const userController = {};

userController.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        
        const existingUser = await db.User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }
        
        

        const user = await db.User.create({ name, email, password});
        delete user.dataValues.password;
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Server error during registration.' });
    }
};
userController.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await db.User.findOne({ where: { email } });

        // Log for debugging purposes
        console.log("Attempting login for email:", email);

        // Check if user exists with the given email
        if (!user) {
            console.log("User with this email not found:", email);
            return res.status(400).json({ error: 'No user found with the provided email.' });
        }

        // Check if provided password matches the one in the database
        const isValidPassword = bcrypt.compareSync(password, user.password);
        if (!isValidPassword) {
            console.log("Password does not match for user:", email);
            return res.status(400).json({ error: 'Incorrect password.' });
        }
        req.session.userId = user.id; // Set the session userId to the logged-in user's id
        console.log("Session initialized", req.session);

        // Successfully authenticated the user
        console.log("Login successful for user:", email);
        delete user.dataValues.password;
        res.status(200).json({ message: 'Logged in successfully', user })
        
    } catch (error) {
        console.error("Error during login:", error); // Log the full error for debugging purposes
        res.status(500).json({ error: 'Server error during login.' });
    }
};

userController.profile = async (req, res) => {
    console.log("Entered profile function");
    
    // Check if the user object is present in the request
    if (!req.user) {
        return res.status(404).json({ error: 'User not found.' });
    }
    
    try {
        // As you've already fetched the user in the middleware, 
        // there's no need to fetch it again. Directly return the user.
        delete req.user.dataValues.password;
        res.status(200).json({ user: req.user });
    } catch (error) {
        console.error("Error in profile:", error);
        res.status(500).json({ error: 'Server error fetching profile.' });
    }
};
userController.editProfile = async (req, res) => {
    try {
        const userId = req.userId;

        // Debug log to print the userId
        console.log("Editing profile for userId:", userId);

        // Check if userId is undefined or null
        if (!userId) {
            return res.status(400).json({ error: 'User not identified. Please login again.' });
        }

        const { name, email } = req.body;

        const user = await db.User.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        user.name = name;
        user.email = email;
        await user.save();

        // Avoid returning hashed password
        delete user.dataValues.password;

        res.status(200).json({ message: 'Profile updated successfully', user });

    } catch (error) {
        console.error('Error while editing profile:', error);
        res.status(500).json({ error: 'Server error during profile update.' });
    }
};

userController.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).json({ error: 'Error logging out.' });
        }
        res.status(200).json({ message: 'Logged out successfully.' });
    });
};
userController.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ error: 'User with this email not found.' });
        }

        const resetCode = Math.floor(100000 + Math.random() * 900000); // Generate a 6 digit code

        // Explicitly update the resetCode field in the database
        await user.update({ resetCode });

        // Fetch the user again from the database and log the resetCode to verify
        const updatedUser = await db.User.findOne({ where: { email } });
        console.log("Updated user resetCode:", updatedUser.resetCode);

        // Normally, you'd send this code to user's email.
        res.status(200).json({ message: `Your reset code is ${resetCode}. Please use it to reset your password.` });

    } catch (error) {
        console.error("Error during password reset:", error);  // Log the error for debugging
        res.status(500).json({ error: 'Server error during password reset.' });
    }
};

userController.resetPassword = async (req, res) => {
    const { email, resetCode, newPassword } = req.body;

    try {
        const user = await db.User.findOne({ where: { email } });

        if (!user) {
            console.log(`User with email: ${email} not found.`);
            return res.status(404).json({ error: 'User not found.' });
        }

        console.log("User from DB:", user.dataValues);
        console.log("Provided resetCode:", resetCode);
        console.log("Reset code from user object:", user.resetCode);

        // Convert both reset codes to strings for comparison
        if (String(user.resetCode) !== String(resetCode)) {
            console.log(`Provided reset code: ${resetCode} does not match stored code: ${user.resetCode}`);
            return res.status(400).json({ error: 'Invalid reset code.' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);  // Hashing the new password
        user.password = hashedPassword;
        user.resetCode = null;  // Resetting the reset code

        await user.save();

        res.status(200).json({ message: 'Password reset successfully.' });

    } catch (error) {
        console.error('Error during password reset:', error);
        res.status(500).json({ error: 'Server error during password reset.' });
    }
};


userController.deleteAccount = async (req, res) => {
    console.log("UserId from request:", req.userId);
    try {
        const userId = req.userId;

        // Destroy the user account
        const destroyedRowCount = await db.User.destroy({ where: { id: userId } });

        // If no rows were destroyed, return user not found error.
        if (destroyedRowCount === 0) {
            return res.status(404).json({ error: 'User not found.' });
        }
        
        // If using sessions, destroy the session after deleting the account.
        if (req.session) req.session.destroy();
        
        res.status(200).json({ message: 'Account deleted successfully.' });

    } catch (error) {
        console.error('Detailed error during account deletion:', error);
        res.status(500).json({ error: 'Server error during account deletion.' });
    }
};
module.exports = userController;

