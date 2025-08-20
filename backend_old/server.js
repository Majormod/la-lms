const express = require('express');
const cors = require('cors');
const path = require('path');
const User = require('./models/User');

const app = express();
const PORT = 5000;

// --- SETUP MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- SERVE STATIC FILES ---
const staticPath = path.join(__dirname, '../frontend/static');
app.use(express.static(staticPath));


// --- API ROUTES ---

// Login route
// In backend/server.js
const bcrypt = require('bcryptjs');       // You may need to add this require at the top
const jwt = require('jsonwebtoken');  // You may need to add this require at the top

// User Login Route
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by email in the database
        const user = await User.findOne({ email: username });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }

        // --- Create a Secure Token (JWT) ---
        const payload = {
            user: {
                id: user.id,
                role: user.role,
                name: `${user.firstName} ${user.lastName}`
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '5h' }, // Token expires in 5 hours
            (err, token) => {
                if (err) throw err;
                // Send the token and user info back to the frontend
                res.status(200).json({ 
                    success: true, 
                    token,
                    user: payload.user 
                });
            }
        );

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
// In backend/server.js

// User Registration Route
app.post('/api/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User with this email already exists' });
        }

        // Create a new user
        user = new User({
            firstName,
            lastName,
            email,
            password,
        });

        // Save the user to the database
        await user.save();

        res.status(201).json({ success: true, message: 'User registered successfully!' });

    } catch (error) {
        console.error('Registration server error:', error);
        res.status(500).json({ success: false, message: 'Server error during registration' });
    }
});
// Dashboard data route
app.get('/api/user/dashboard', (req, res) => {
  // In a real app, you'd verify a security token here.
  const mockStudentData = {
    name: 'Aniruddh Dixit',
    enrolledCourses: [
      { id: 1, title: 'The Leadership Masterclass' },
      { id: 2, title: 'The Executive Presence Masterclass' }
    ]
  };
  res.status(200).json({ success: true, data: mockStudentData });
});

// In backend/server.js

// Profile data route
app.get('/api/user/profile', (req, res) => {
  // In a real application, you would get this data from a database
  const mockProfileData = {
    registrationDate: "August 14, 2025 9:30 pm",
    firstName: "Aniruddh",
    lastName: "Dixit",
    username: "aniruddh",
    email: "student@example.com",
    phone: "+91 98765 43210",
    occupation: "Lifelong Learner",
    bio: "Eager to learn and grow through the courses on the Leadership Accelerator platform."
  };
  res.status(200).json({ success: true, data: mockProfileData });
});

// --- HANDLE EXTENSIONLESS URLS (Catch-all) ---
// This must come AFTER your API routes.
app.get('*', (req, res) => {
  const filePath = path.join(staticPath, req.path + '.html');
  res.sendFile(filePath, (err) => {
    if (err) {
      // If file not found, send a 404 page
      res.status(404).sendFile(path.join(staticPath, '404.html'));
    }
  });
});


// --- START THE SERVER ---
app.listen(PORT, () => {
  console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});