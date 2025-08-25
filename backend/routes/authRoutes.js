const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        if (await User.findOne({ email })) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        const user = new User({ firstName, lastName, email, password, role: role || 'student' });
        await user.save();
        res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration server error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ email: username });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }
        const payload = {
    user: { id: user.id }
};

jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: '5h' },
    (err, token) => {
        if (err) throw err;

        // This sends the COMPLETE user object to the browser
        res.status(200).json({
            success: true,
            token,
            user: {
                id: user.id,
                role: user.role,
                firstName: user.firstName,
                lastName: user.lastName,
                avatar: user.avatar
            }
        });
    }
);
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;