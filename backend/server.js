// Updated v7.9.5
// This new line explicitly tells the server where to find the .env file
require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const isAuthenticated = require('./authMiddleware');
const isInstructor = (req, res, next) => {
    if (req.user && req.user.role === 'instructor') {
        return next();
    }
    return res.status(403).json({ msg: 'Access denied. Instructor role required.' });
};

// --- GLOBAL VARIABLES & IMPORTS ---
const staticPath = path.join(__dirname, '../frontend/static');
const User = require('./models/User');
const Course = require('./models/Course');
const auth = require('./authMiddleware');
const QuizResult = require('./models/QuizResult');
const Review = require('./models/Review');
const { sendAnnouncementEmail } = require('./emailService'); 

// Using multer's .fields() method to accept up to two different files
// In server.js

// 1. Replace your existing 'lessonUploads' multer instance with this one
// Ensure path is imported at the top of your file
const fs = require('fs');     // Ensure fs is imported for file deletion

// 1. Uploader for Course Thumbnails
const thumbnailUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, '../frontend/static/uploads/thumbnails');
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
        }
    }),
});

// 2. Uploader for PDF Attachments (Add this new block)
const pdfUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, '../frontend/static/uploads/pdfs');
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
        }
    }),
});

// 3. Uploader for User Avatars (Add this new block)
const avatarUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, '../frontend/static/uploads/avatars');
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
        }
    }),
});

// 4. Uploader for User Cover Photos (Add this new block)
const coverPhotoUpload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, '../frontend/static/uploads/covers');
            fs.mkdirSync(uploadPath, { recursive: true });
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`);
        }
    }),
});

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend/static')));

// =================================================================
// --- API ROUTES ---
// =================================================================
//app.use('/api/courses', require('./routes/courseRoutes'));
// AUTHENTICATION API ROUTES
app.post('/api/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        user = new User({ firstName, lastName, email, password });
        await user.save();
        res.status(201).json({ success: true, message: 'User registered successfully!' });
    } catch (error) {
        console.error('Registration server error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/register-instructor', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }
        user = new User({ firstName, lastName, email, password, role: 'instructor' });
        await user.save();
        res.status(201).json({ success: true, message: 'Instructor registered successfully!' });
    } catch (error) {
        console.error('Instructor registration error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ email: username });
        if (!user) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Invalid Credentials' });
        }
        const payload = { user: { id: user.id, role: user.role, name: `${user.firstName} ${user.lastName}` } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '5h' }, (err, token) => {
            if (err) throw err;
            res.status(200).json({ success: true, token, user: payload.user });
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// USER & DASHBOARD API ROUTES
app.get('/api/user/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const formattedDate = user.registrationDate ? user.registrationDate.toDateString() : 'Not available';
        res.json({
            success: true,
            data: {
                registrationDate: formattedDate,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.email,
                email: user.email,
                phone: user.phone || 'Not provided',
                occupation: user.occupation || 'Not provided',
                bio: user.bio || 'Not provided',
                avatar: user.avatar,
                coverPhoto: user.coverPhoto
            }
        });
    } catch (err) { res.status(500).send('Server Error'); }
});

app.put('/api/user/profile', auth, async (req, res) => {
    try {
        const { firstName, lastName, phone, occupation, bio } = req.body;
        const user = await User.findByIdAndUpdate(req.user.id, { firstName, lastName, phone, occupation, bio }, { new: true });
        res.json({ success: true, msg: 'Profile updated successfully' });
    } catch (err) { res.status(500).send('Server Error'); }
});

app.put('/api/user/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: 'Incorrect current password.' });
        }
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();
        res.status(200).json({ success: true, message: 'Password updated successfully!' });
    } catch (error) {
        console.error('Password update server error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

app.put('/api/user/social', auth, async (req, res) => {
    try {
        const { facebook, twitter, linkedin, website, github } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.user.id, {
            social: { facebook, twitter, linkedin, website, github }
        }, { new: true });
        res.status(200).json({ success: true, message: 'Social links updated successfully!' });
    } catch (error) {
        console.error('Error updating social links:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


app.post('/api/user/avatar', auth, avatarUpload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No file uploaded.' });
        const user = await User.findById(req.user.id);
        // FIX: The path should point to the actual upload location
        user.avatar = `uploads/courses/${req.file.filename}`; 
        await user.save();
        res.json({ success: true, msg: 'Avatar updated successfully', filePath: user.avatar });
    } catch (err) { res.status(500).send('Server Error'); }
});

// UPDATE USER COVER PHOTO
app.post('/api/user/cover', auth, coverPhotoUpload.single('coverPhoto'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No file uploaded.' });
        }
        
        const user = await User.findById(req.user.id);
        
        // Use the correct path that matches the coverPhotoUpload destination
        user.coverPhoto = `uploads/covers/${req.file.filename}`; 
        
        await user.save();
        
        res.json({ success: true, msg: 'Cover photo updated successfully', filePath: user.coverPhoto });

    } catch (err) { 
        console.error("Cover Photo Upload Error:", err);
        res.status(500).send('Server Error'); 
    }
});

// INSTRUCTOR API ROUTES
app.get('/api/instructor/dashboard', auth, async (req, res) => {
    try {
        if (req.user.role !== 'instructor') {
            return res.status(403).json({ success: false, message: 'Access denied. You must be an instructor.' });
        }
        const instructorDashboardData = {
            enrolledCourses: 30, activeCourses: 10, completedCourses: 7, totalCourses: 20, totalStudents: 160, totalEarnings: 25000,
            courses: [{ title: 'Accounting', enrolled: 50, rating: 5 }, { title: 'Marketing', enrolled: 40, rating: 4 }, { title: 'Web Design', enrolled: 75, rating: 5 }, { title: 'Graphic', enrolled: 20, rating: 2 },]
        };
        res.status(200).json({ success: true, data: instructorDashboardData });
    } catch (error) {
        console.error('Error fetching instructor dashboard data:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

app.get('/api/instructor/my-courses', auth, async (req, res) => {
    try {
        if (req.user.role !== 'instructor') {
            return res.status(403).json({ success: false, message: 'Access denied. You must be an instructor.' });
        }
        const instructorCourses = [{ id: 'course-1', title: 'Full-Stack Web Development Bootcamp', image: 'assets/images/course/course-online-01.jpg', lessons: 45, students: 230, status: 'Published', rating: 4.8 }, { id: 'course-2', title: 'Advanced React and Redux', image: 'assets/images/course/course-online-02.jpg', lessons: 20, students: 85, status: 'Draft', rating: 4.5 }, { id: 'course-3', title: 'Data Science with Python', image: 'assets/images/course/course-online-03.jpg', lessons: 60, students: 410, status: 'Published', rating: 4.9 },];
        res.status(200).json({ success: true, courses: instructorCourses });
    } catch (error) {
        console.error('Error fetching instructor courses:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// server.js

app.get('/api/instructor/my-courses-status', auth, async (req, res) => {
    try {
        // This check is good, it makes sure only instructors can access this
        if (req.user.role !== 'instructor') {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }

        // --- THIS IS THE FIX ---
        // We query the Course model to find all courses where the
        // instructor field matches the ID of the logged-in user.
        const instructorCourses = await Course.find({ instructor: req.user.id });

        res.status(200).json({ success: true, courses: instructorCourses });

    } catch (error) {
        console.error('Error fetching instructor courses:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// In server.js

app.get('/api/instructor/announcements', auth, async (req, res) => {
    try {
        // For now, we'll return mock data. Later, you can fetch this from your database.
        const announcements = [
            {
                date: new Date('2025-08-16T10:00:00Z'),
                title: 'New Content Added to Module 3!',
                course: 'Full-Stack Web Development'
            },
            {
                date: new Date('2025-08-12T15:30:00Z'),
                title: 'Live Q&A Session This Friday',
                course: 'Advanced React and Redux'
            },
            {
                date: new Date('2025-08-10T09:00:00Z'),
                title: 'Welcome to the Course!',
                course: 'Data Science with Python'
            }
        ];

        res.status(200).json({ success: true, announcements: announcements });

    } catch (error) {
        console.error('Error fetching instructor announcements:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

app.put('/api/instructor/assignments/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'instructor') {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }
        const assignmentId = req.params.id;
        const updatedData = req.body;
        console.log(`Instructor ${req.user.name} is updating assignment with ID: ${assignmentId}`, updatedData);
        res.status(200).json({ success: true, message: 'Assignment updated successfully!' });
    } catch (error) {
        console.error('Error updating assignment:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

app.delete('/api/instructor/assignments/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'instructor') {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }
        const assignmentId = req.params.id;
        console.log(`Instructor ${req.user.name} is deleting assignment with ID: ${assignmentId}`);
        res.status(200).json({ success: true, message: 'Assignment deleted successfully!' });
    } catch (error) {
        console.error('Error deleting assignment:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// server.js (replace your existing route with this one)

// In server.js, replace your entire app.post('/api/instructor/courses', ...) route

// In server.js

// In server.js
app.post('/api/instructor/courses', auth, thumbnailUpload.single('thumbnail'), async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'instructor') {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }

        // 1. Receive the new fields from the form data
const { title, slug, description, price, originalPrice, difficultyLevel, maxStudents, isPublic, isQAEnabled, previewVideoUrl, isMasterclass } = req.body;
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Course thumbnail is required.' });
        }
        const thumbnailPath = `assets/images/uploads/${req.file.filename}`;

        const newCourse = new Course({
            title,
            slug,
            description,
            instructor: req.user.id,
            price: parseFloat(price),
            originalPrice: parseFloat(originalPrice),
            thumbnail: thumbnailPath,
            previewVideoUrl: previewVideoUrl,
            status: 'Draft',
            // 2. Add the new fields to the object being saved
            difficultyLevel: difficultyLevel,
            maxStudents: parseInt(maxStudents, 10),
            isPublic: isPublic === 'true', // Convert string from form to boolean
            isQAEnabled: isQAEnabled === 'true', // Convert string from form to boolean
            isMasterclass: isMasterclass === 'true' // ADD THIS LINE
        });

        await newCourse.save();
        res.status(201).json({ success: true, message: 'Course created successfully!', course: newCourse });

    } catch (error) {
        console.error('Error creating course:', error.message);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// In server.js
// =================================================================
// --- API ROUTES ---
// =================================================================

// ADD THIS NEW ROUTE FOR THE EXPLORE COURSES PAGE
// In server.js, replace your existing GET /api/courses route with this one

app.get('/api/courses', async (req, res) => {
    try {
        const filters = { status: 'Published' };
        let sortOptions = { createdAt: -1 }; // Default sort is 'latest'

        // --- Search Filter ---
        if (req.query.search) {
            filters.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // --- Category Filter ---
        if (req.query.category) {
            filters.category = req.query.category;
        }

        // --- Price Type Filter (from dropdown) ---
        if (req.query.price === 'free') {
            filters.price = 0;
        } else if (req.query.price === 'paid') {
            filters.price = { $gt: 0 };
        }

        // --- Price Range Slider Filter ---
        const minPrice = parseInt(req.query.minPrice);
        const maxPrice = parseInt(req.query.maxPrice);
        // This will override the simple price filter if a range is provided
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
            filters.price = { $gte: minPrice, $lte: maxPrice };
        }

        // --- Sorting Filter ---
        switch (req.query.sortBy) {
            case 'price_asc':
                sortOptions = { price: 1 };
                break;
            case 'price_desc':
                sortOptions = { price: -1 };
                break;
        }

        // --- Final Database Query ---
        const courses = await Course.find(filters)
            .populate('instructor', 'firstName lastName avatar')
            .sort(sortOptions);
        
        const totalCourses = await Course.countDocuments(filters);

        res.json({
            success: true,
            courses: courses,
            pagination: { totalCourses: totalCourses }
        });

    } catch (error) {
        console.error('Error fetching all courses:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});
// PUBLIC: For the course-details.html page (Preview)
app.get('/api/courses/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'firstName lastName avatar occupation bio social');
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        res.json({ success: true, course: course });
    } catch (error) {
        console.error('Error fetching public course by ID:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
// PRIVATE: For the edit-course.html page
app.get('/api/courses/edit/:id', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized' });
        }
        // --- ADD THESE TWO LINES ---
        console.log("--- DATA FROM GET ROUTE (page load) ---");
        console.log(JSON.stringify(course.toObject().episodes, null, 2));
        res.json({ success: true, course: course.toObject() });
    } catch (error) {
        // --- MODIFIED LOGGING FOR DEBUGGING ---
        console.error('---! ERROR: FAILED TO FETCH COURSE FOR EDIT PAGE !---');
        console.error(`The failing Course ID was: ${req.params.id}`);
        console.error('The full error object is:', error); // This will print the detailed error
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
// In server.js - Add this new route

// UPDATE a course by its ID
app.put('/api/courses/:courseId', auth, thumbnailUpload.single('thumbnail'), async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized' });
        }

        // --- Update All Fields ---
        
        // This handles the isMasterclass toggle
        if (req.body.isMasterclass !== undefined) {
            course.isMasterclass = req.body.isMasterclass === 'true';
        }

        // Update all other text fields from the form
        course.title = req.body.title || course.title;
        course.slug = req.body.slug || course.slug;
        // ... (all your other fields are fine)
        course.description = req.body.description || course.description;
        course.originalPrice = parseFloat(req.body.originalPrice);
        course.price = parseFloat(req.body.price);
        course.previewVideoUrl = req.body.previewVideoUrl;
        course.status = req.body.status || course.status;
        course.startDate = req.body.startDate;
        if (req.body.language) { try { course.language = JSON.parse(req.body.language); } catch (e) { course.language = []; } }
        if (req.body.requirements) { course.requirements = req.body.requirements.split('\n').map(item => item.trim()).filter(Boolean); }
        if (req.body.whatYoullLearn) { course.whatYoullLearn = req.body.whatYoullLearn.split('\n').map(item => item.trim()).filter(Boolean); }
        if (req.body.targetedAudience) { course.targetedAudience = req.body.targetedAudience.split('\n').map(item => item.trim()).filter(Boolean); }
        if (req.body.tags) { course.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(Boolean); }
        course.duration = course.duration || {};
        course.duration.hours = parseInt(req.body.durationHours, 10) || 0;
        course.duration.minutes = parseInt(req.body.durationMinutes, 10) || 0;
        course.certificateTemplate = req.body.certificateTemplate || course.certificateTemplate;
        course.certificateOrientation = req.body.certificateOrientation || course.certificateOrientation;
        course.includesCertificate = (req.body.certificateTemplate && req.body.certificateTemplate !== 'none');

        // Handle new thumbnail upload
        if (req.file) {
            // Use the correct path for the dedicated thumbnails folder
            course.thumbnail = `uploads/thumbnails/${req.file.filename}`;
        }

        const updatedCourse = await course.save();
        res.json({ success: true, message: 'Course updated successfully!', course: updatedCourse });

    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// In server.js

// ADD A NEW TOPIC TO A COURSE
app.post('/api/courses/:courseId/episodes', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized' });
        }
        const { title, summary } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, message: 'Topic title is required' });
        }
        course.episodes.push({ title, summary, lessons: [] });
        await course.save();
        res.status(201).json({ 
            success: true, 
            message: 'Topic added successfully!',
            course
        });
    } catch (error) {
        console.error('Error adding topic:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// DELETE A TOPIC (EPISODE) FROM A COURSE
app.delete('/api/courses/:courseId/episodes/:episodeId', auth, async (req, res) => {
    try {
        const { courseId, episodeId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized' });
        }
        const episode = course.episodes.id(episodeId);
        if (!episode) {
            return res.status(404).json({ success: false, message: 'Topic not found' });
        }
        course.episodes.pull({ _id: episodeId });
        await course.save();
        res.status(200).json({
            success: true,
            message: 'Topic deleted successfully!',
            course
        });
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// UPDATE A SPECIFIC TOPIC (EPISODE)
app.put('/api/courses/:courseId/episodes/:episodeId', auth, async (req, res) => {
    try {
        const { courseId, episodeId } = req.params;
        const { title, summary } = req.body;
        if (!title) {
            return res.status(400).json({ success: false, message: 'Topic title is required' });
        }
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized' });
        }
        const episode = course.episodes.id(episodeId);
        if (!episode) {
            return res.status(404).json({ success: false, message: 'Topic not found' });
        }
        episode.title = title;
        episode.summary = summary || '';
        await course.save();
        res.status(200).json({
            success: true,
            message: 'Topic updated successfully!',
            course
        });
    } catch (error) {
        console.error('Error updating topic:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// ADD A NEW LESSON TO A SPECIFIC TOPIC (EPISODE)
// In server.js




// 2. Replace your existing 'PUT /api/courses/.../lessons/:lessonId' route with this one
// PUT /api/courses/:courseId/episodes/:episodeId/lessons/:lessonId
app.put('/api/courses/:courseId/episodes/:episodeId/lessons/:lessonId', auth, pdfUpload.array('exerciseFiles'), async (req, res) => {
    try {
        const { courseId, episodeId, lessonId } = req.params;
        const { title, summary, vimeoUrl, duration, isPreview } = req.body;

        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Course not found or user not authorized' });
        }
        const episode = course.episodes.id(episodeId);
        if (!episode) return res.status(404).json({ success: false, message: 'Topic not found' });
        const lesson = episode.lessons.id(lessonId);
        if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

        lesson.title = title || lesson.title;
        lesson.summary = summary;
        lesson.vimeoUrl = vimeoUrl;
        lesson.duration = duration || lesson.duration;
        lesson.isPreview = isPreview === 'true';

        if (req.files && req.files.length > 0) {
            const newFiles = req.files.map(file => ({
                filename: file.originalname,
                // CHANGE 2: Use the correct path
                path: `uploads/pdfs/${file.filename}`
            }));
            lesson.exerciseFiles.push(...newFiles);
        }

        await course.save();
        res.json({ success: true, message: 'Lesson updated successfully!', course });
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


// POST /api/courses/:courseId/episodes/:episodeId/lessons
// POST /api/courses/:courseId/episodes/:episodeId/lessons
app.post('/api/courses/:courseId/episodes/:episodeId/lessons', auth, pdfUpload.array('exerciseFiles'), async (req, res) => {
    try {
        const { courseId, episodeId } = req.params;
        const { title, summary, vimeoUrl, duration, isPreview } = req.body;

        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Course not found or user not authorized' });
        }
        const episode = course.episodes.id(episodeId);
        if (!episode) return res.status(404).json({ success: false, message: 'Topic not found' });

        const newLesson = {
            title,
            summary,
            vimeoUrl,
            duration,
            isPreview: isPreview === 'true',
            exerciseFiles: []
        };

        if (req.files && req.files.length > 0) {
            newLesson.exerciseFiles = req.files.map(file => ({
                filename: file.originalname,
                // CHANGE 1: Use the correct path
                path: `uploads/pdfs/${file.filename}`
            }));
        }

        episode.lessons.push(newLesson);
        await course.save();

        res.status(201).json({ success: true, message: 'Lesson added successfully!', course });
    } catch (error) {
        console.error('Error adding lesson:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


// DELETE route remains unchanged as it doesn't handle files
app.delete('/api/courses/:courseId/episodes/:episodeId/lessons/:lessonId', auth, async (req, res) => {
    try {
        const { courseId, episodeId, lessonId } = req.params;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized' });
        }
        const episode = course.episodes.id(episodeId);
        if (!episode) {
            return res.status(404).json({ success: false, message: 'Episode not found' });
        }
        const lesson = episode.lessons.id(lessonId);
        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }
        episode.lessons.pull({ _id: lessonId });
        await course.save();
        res.status(200).json({
            success: true,
            message: 'Lesson deleted successfully!',
            course
        });
    } catch (error) {
        console.error('Error deleting lesson:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});


// DELETE /api/courses/:courseId/episodes/:episodeId/lessons/:lessonId/files
app.delete('/api/courses/:courseId/episodes/:episodeId/lessons/:lessonId/files', auth, async (req, res) => {
    try {
        const { courseId, episodeId, lessonId } = req.params;
        const { filePath } = req.body;

        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.id) return res.status(404).json({ success: false, message: 'Not authorized' });
        
        const episode = course.episodes.id(episodeId);
        if (!episode) return res.status(404).json({ success: false, message: 'Topic not found' });

        const lesson = episode.lessons.id(lessonId);
        if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

        const fileToRemove = lesson.exerciseFiles.find(file => file.path === filePath);
        if (!fileToRemove) return res.status(404).json({ success: false, message: 'File not found in lesson.' });

        lesson.exerciseFiles.pull(fileToRemove._id);
        await course.save();

        // CHANGE 3: Use the correct physical path for deletion
        const physicalPath = path.join(__dirname, '../frontend/static', filePath);
        
        fs.unlink(physicalPath, (err) => {
            if (err) console.error("Error deleting physical file:", err);
            else console.log("Successfully deleted physical file:", physicalPath);
        });

        res.json({ success: true, message: 'File deleted successfully!', course });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/courses/:courseId/episodes/:episodeId/quizzes
app.post('/api/courses/:courseId/episodes/:episodeId/quizzes', auth, async (req, res) => {
    try {
        const { courseId, episodeId } = req.params;
        const { title, summary } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Quiz title is required' });
        }

        const newQuiz = { title, summary };

        // This is the new, atomic update logic
        const updateResult = await Course.updateOne(
            { "_id": courseId, "episodes._id": episodeId },
            { "$push": { "episodes.$.quizzes": newQuiz } }
        );

        if (updateResult.matchedCount === 0) {
             return res.status(404).json({ success: false, message: 'Course or Topic not found.' });
        }
        if (updateResult.modifiedCount === 0) {
             return res.status(500).json({ success: false, message: 'Failed to add the quiz.' });
        }

        // After successfully pushing the quiz, refetch the entire course to send it back
        const updatedCourse = await Course.findById(courseId);

        res.status(201).json({ 
            success: true, 
            message: 'Quiz added successfully!',
            course: updatedCourse.toObject() 
        });

    } catch (error) {
        console.error('Error adding quiz:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/courses/:courseId/episodes/:episodeId/quizzes/:quizId
app.delete('/api/courses/:courseId/episodes/:episodeId/quizzes/:quizId', auth, async (req, res) => {
    try {
        const { courseId, episodeId, quizId } = req.params;

        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Not authorized' });
        }

        const episode = course.episodes.id(episodeId);
        if (!episode) return res.status(404).json({ success: false, message: 'Topic not found' });

        // Find and remove the quiz from the array
        episode.quizzes.pull({ _id: quizId });
        
        await course.save();

        res.json({ 
            success: true, 
            message: 'Quiz deleted successfully!',
            course: course.toObject() 
        });

    } catch (error) {
        console.error('Error deleting quiz:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/courses/:courseId/episodes/:episodeId/quizzes/:quizId/questions
app.post('/api/courses/:courseId/episodes/:episodeId/quizzes/:quizId/questions', auth, async (req, res) => {
    try {
        const { courseId, episodeId, quizId } = req.params;
        const questionData = req.body;

        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Not authorized' });
        }

        const episode = course.episodes.id(episodeId);
        if (!episode) return res.status(404).json({ success: false, message: 'Topic not found' });
        
        const quiz = episode.quizzes.id(quizId);
        if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

        // Add the new question to the quiz's questions array
        quiz.questions.push(questionData);
        await course.save();

        // --- ADD THESE TWO LINES ---
        console.log("--- DATA AFTER ADDING A QUESTION ---");
        console.log(JSON.stringify(course.toObject().episodes, null, 2));
        
        res.status(201).json({ 
            success: true, 
            message: 'Question added successfully!',
            course: course.toObject() 
        });

    } catch (error) {
        console.error('Error adding question to quiz:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
// PUT /api/courses/:courseId/episodes/:episodeId/quizzes/:quizId
// PUT /api/courses/:courseId/episodes/:episodeId/quizzes/:quizId
app.put('/api/courses/:courseId/episodes/:episodeId/quizzes/:quizId', auth, async (req, res) => {
    try {
        const { courseId, episodeId, quizId } = req.params;
        // Destructure title, summary, AND the new settings object from the body
        const { title, summary, settings } = req.body;

        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Not authorized' });
        }

        const episode = course.episodes.id(episodeId);
        if (!episode) return res.status(404).json({ success: false, message: 'Topic not found' });
        
        const quiz = episode.quizzes.id(quizId);
        if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

        // Update the basic quiz fields
        quiz.title = title || quiz.title;
        quiz.summary = summary;

        // --- UPDATE ALL THE NEW SETTINGS ---
        // If settings are provided in the request, update them
        if (settings) {
            quiz.timeLimit = settings.timeLimit || quiz.timeLimit;
            quiz.hideTimeLimit = settings.hideTimeLimit;
            quiz.feedbackMode = settings.feedbackMode || quiz.feedbackMode;
            quiz.passingGrade = settings.passingGrade || quiz.passingGrade;
            quiz.maxQuestionsAllowed = settings.maxQuestionsAllowed || quiz.maxQuestionsAllowed;
            quiz.autoStart = settings.autoStart;
            quiz.questionLayout = settings.questionLayout || quiz.questionLayout;
            quiz.questionOrder = settings.questionOrder || quiz.questionOrder;
            quiz.hideQuestionNumber = settings.hideQuestionNumber;
            quiz.shortAnswerCharLimit = settings.shortAnswerCharLimit || quiz.shortAnswerCharLimit;
            quiz.essayCharLimit = settings.essayCharLimit || quiz.essayCharLimit;
        }

        await course.save();
        
        res.json({    
            success: true,    
            message: 'Quiz updated successfully!',    
            course: course.toObject()
        });

    } catch (error) {
        console.error('Error updating quiz:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// DELETE /api/courses/:courseId/episodes/:episodeId/quizzes/:quizId/questions/:questionId
app.delete('/api/courses/:courseId/episodes/:episodeId/quizzes/:quizId/questions/:questionId', auth, async (req, res) => {
    try {
        const { courseId, episodeId, quizId, questionId } = req.params;

        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Not authorized' });
        }

        const episode = course.episodes.id(episodeId);
        if (!episode) return res.status(404).json({ success: false, message: 'Topic not found' });
        
        const quiz = episode.quizzes.id(quizId);
        if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

        // Find and remove the question from the quiz's questions array
        quiz.questions.pull({ _id: questionId });
        
        await course.save();

        res.json({ 
            success: true, 
            message: 'Question deleted successfully!',
            course: course.toObject() 
        });

    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// PUT /api/courses/:courseId/episodes/:episodeId/quizzes/:quizId/questions/:questionId
app.put('/api/courses/:courseId/episodes/:episodeId/quizzes/:quizId/questions/:questionId', auth, async (req, res) => {
    try {
        const { courseId, episodeId, quizId, questionId } = req.params;
        const updatedQuestionData = req.body;

        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Not authorized' });
        }

        const episode = course.episodes.id(episodeId);
        const quiz = episode.quizzes.id(quizId);
        const question = quiz.questions.id(questionId);
        if (!question) return res.status(404).json({ success: false, message: 'Question not found' });

        // Update the question fields
        question.set(updatedQuestionData);
        
        await course.save();

        res.json({ 
            success: true, 
            message: 'Question updated successfully!',
            course: course.toObject() 
        });

    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// POST /api/quizzes/:quizId/submit
// Handles quiz submission, grading, and saving the result.
app.post('/api/courses/:courseId/quizzes/:quizId/submit', auth, async (req, res) => {
    try {
        const { courseId, quizId } = req.params;
        const userId = req.user.id; // From the 'auth' middleware
        const submittedAnswers = req.body.answers; // Expecting { questionId: [optionId], ... }

        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found.' });

        // Find the quiz (the "answer key")
        let quiz;
        course.episodes.forEach(ep => {
            const found = ep.quizzes.id(quizId);
            if (found) quiz = found;
        });
        if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found.' });

        let score = 0;
        let possibleScore = 0;
        const resultAnswers = [];

        for (const question of quiz.questions) {
            possibleScore += question.points;
            const submitted = submittedAnswers[question._id]; // User's answer for this question
            const correctOptionIds = question.options.filter(o => o.isCorrect).map(o => o._id.toString());
            
            let isCorrect = false;
            if (submitted) {
                // For choice-based questions
                if (Array.isArray(submitted)) {
                    isCorrect = submitted.length === correctOptionIds.length && submitted.every(id => correctOptionIds.includes(id));
                }
            }

            if (isCorrect) {
                score += question.points;
            }
            
            resultAnswers.push({
                questionId: question._id,
                questionText: question.questionText,
                submittedOptionIds: submitted || [],
                correctOptionIds: correctOptionIds,
                isCorrect: isCorrect,
                points: question.points,
            });
        }

        const percentage = (score / possibleScore) * 100;
        const passed = percentage >= quiz.passingGrade;

        // Save the result to the database
        const newResult = new QuizResult({
            user: userId,
            course: courseId,
            quiz: quizId,
            score,
            possibleScore,
            percentage: Math.round(percentage),
            passed,
            answers: resultAnswers
        });
        await newResult.save();

        // Send the detailed results back to the client
        res.status(201).json({ success: true, result: newResult });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        res.status(500).json({ success: false, message: 'Server error during quiz submission.' });
    }
});

// GET /api/quiz-results/:resultId - Fetches a single quiz result
// In server.js, replace the existing route with this one
app.get('/api/quiz-results/:resultId', auth, async (req, res) => {
    try {
        const result = await QuizResult.findById(req.params.resultId)
            .populate({
                path: 'course',
                // THIS IS THE CORRECTED LINE:
                select: 'title episodes instructor' 
            });

        if (!result) {
            return res.status(404).json({ success: false, message: 'Result not found.' });
        }

        // Security check: ensure the user is either the student who took the quiz or the instructor
        const isStudentOwner = result.user.equals(req.user.id);
        const isInstructorOwner = result.course.instructor.equals(req.user.id);

        if (!isStudentOwner && !isInstructorOwner) {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }

        // Find the quiz title for the header
        let quizTitle = 'Quiz Result';
        for (const episode of result.course.episodes) {
            const quiz = episode.quizzes.id(result.quiz);
            if (quiz) {
                quizTitle = quiz.title;
                break;
            }
        }

        res.json({ success: true, result, quizTitle });
    } catch (error) {
        console.error('Error fetching quiz result:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

app.get('/api/instructor/quiz-attempts', auth, async (req, res) => {
    try {
        if (req.user.role !== 'instructor') {
            return res.status(403).json({ success: false, message: 'Forbidden' });
        }

        const instructorCourses = await Course.find({ instructor: req.user.id }).select('_id title episodes');
        const courseIds = instructorCourses.map(c => c._id);

        let attempts = await QuizResult.find({ course: { $in: courseIds } })
            .populate('user', 'firstName lastName')
            .sort({ submittedAt: -1 });

        attempts = attempts.filter(attempt => attempt.user);

        const formattedAttempts = attempts.map(attempt => {
            try {
                const course = instructorCourses.find(c => c._id.equals(attempt.course));
                let quizTitle = 'Unknown Quiz';
                if (course) {
                    for (const episode of course.episodes) {
                        if (episode.quizzes) {
                           const quiz = episode.quizzes.id(attempt.quiz);
                           if (quiz) {
                               quizTitle = quiz.title;
                               break;
                           }
                        }
                    }
                }
                
                const correctAnswersCount = attempt.answers.filter(a => a.isCorrect).length;
                
                return {
                    id: attempt._id,
                    courseId: attempt.course.toString(),
                    // --- THIS IS THE CORRECTED LINE ---
                    date: new Date(attempt.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    quizTitle: quizTitle,
                    studentName: `${attempt.user.firstName} ${attempt.user.lastName}`,
                    totalQuestions: attempt.answers.length,
                    totalMarks: attempt.possibleScore,
                    correctAnswers: correctAnswersCount,
                    result: attempt.passed ? 'Pass' : 'Fail',
                };
            } catch (e) {
                console.error(`Could not process quiz attempt with ID: ${attempt._id}. Error:`, e);
                return null;
            }
        }).filter(Boolean);

        res.json({ 
            success: true, 
            attempts: formattedAttempts,
            courses: instructorCourses
        });

    } catch (error) {
        console.error('Error fetching instructor quiz attempts:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

app.get('/api/student/my-quiz-attempts', auth, async (req, res) => {
    try {
        // Find all attempts by the logged-in student
        const attempts = await QuizResult.find({ user: req.user.id })
            .populate('course', 'title episodes') // Get course title
            .sort({ submittedAt: -1 });

        // Format the data for the dashboard
        const formattedAttempts = attempts.map(attempt => {
            let quizTitle = 'Unknown Quiz';
            if (attempt.course) {
                 for (const episode of attempt.course.episodes) {
                    const quiz = episode.quizzes.id(attempt.quiz);
                    if (quiz) {
                        quizTitle = quiz.title;
                        break;
                    }
                }
            }
            const correctAnswersCount = attempt.answers.filter(a => a.isCorrect).length;

            return {
                 id: attempt._id, // <-- ADD THIS LINE
                date: new Date(attempt.submittedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                quizTitle: `${attempt.course.title} - ${quizTitle}`,
                totalQuestions: attempt.answers.length,
                totalMarks: attempt.possibleScore,
                correctAnswers: correctAnswersCount,
                result: attempt.passed ? 'Pass' : 'Fail',
            };
        });
        
        res.json({ success: true, attempts: formattedAttempts });

    } catch (error) {
        console.error('Error fetching student quiz attempts:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});


// STUDENT DASHBOARD API ROUTE
app.get('/api/student/dashboard', auth, async (req, res) => {
    try {
        // Optional: Ensure the user is a student
        if (req.user.role !== 'student') {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }

        // In a real application, you would query your database here.
        // For now, we will return mock data.
        const studentDashboardData = {
            enrolledCourses: 1,
            activeCourses: 1,
            completedCourses: 1,
        };

        res.status(200).json({ success: true, data: studentDashboardData });

    } catch (error) {
        console.error('Error fetching student dashboard data:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// In server.js

// STUDENT ENROLLED COURSES API ROUTE
app.get('/api/student/my-courses', auth, async (req, res) => {
    try {
        // For now, we'll return a list of mock courses.
        // Later, you will replace this with a real database query.
        const enrolledCourses = [
            {
                _id: 'course-1',
                title: 'React Front To Back',
                thumbnail: 'assets/images/course/course-online-01.jpg',
                lessonCount: 20,
                studentCount: 40,
                status: 'completed', // 'active' or 'completed'
                progress: 100
            },
            {
                _id: 'course-2',
                title: 'PHP Beginner + Advanced',
                thumbnail: 'assets/images/course/course-online-02.jpg',
                lessonCount: 10,
                studentCount: 30,
                status: 'active',
                progress: 40
            },
            {
                _id: 'course-3',
                title: 'Angular Zero to Mastery',
                thumbnail: 'assets/images/course/course-online-03.jpg',
                lessonCount: 14,
                studentCount: 26,
                status: 'active',
                progress: 65
            }
        ];

        res.status(200).json({ success: true, courses: enrolledCourses });

    } catch (error) {
        console.error('Error fetching student enrolled courses:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});


// ADD OR REMOVE A COURSE FROM THE WISHLIST
app.post('/api/user/wishlist/toggle', auth, async (req, res) => {
    try {
        const { courseId } = req.body;
        const user = await User.findById(req.user.id);

        const index = user.wishlist.indexOf(courseId);

        if (index === -1) {
            user.wishlist.push(courseId); // Add to wishlist
        } else {
            user.wishlist.splice(index, 1); // Remove from wishlist
        }

        // THIS IS THE FIX: Tell the database the array has changed
        user.markModified('wishlist');

        await user.save();
        res.json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        console.error("Wishlist toggle error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET THE STUDENT'S WISHLISTED COURSES
app.get('/api/student/wishlist', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({
            path: 'wishlist',
            populate: { path: 'instructor', select: 'firstName lastName' }
        });
        res.json({ success: true, courses: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// CREATE OR UPDATE A REVIEW FOR A COURSE
app.post('/api/courses/:courseId/reviews', auth, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const courseId = req.params.courseId;
        const studentId = req.user.id;

        // For simplicity, we'll use findOneAndUpdate with 'upsert'
        // This will create a review if one doesn't exist, or update it if it does.
        const review = await Review.findOneAndUpdate(
            { course: courseId, student: studentId },
            { rating, comment },
            { new: true, upsert: true, runValidators: true }
        );

        res.json({ success: true, message: "Review submitted successfully!", review });
    } catch (error) {
        console.error("Review submission error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// In server.js

// GET ALL REVIEWS FOR A SPECIFIC COURSE (with Pagination)
app.get('/api/courses/:courseId/reviews', async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const totalReviews = await Review.countDocuments({ course: courseId });
        const totalPages = Math.ceil(totalReviews / limit);

        const reviews = await Review.find({ course: courseId })
            .populate('student', 'firstName lastName avatar')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);

        res.json({ 
            success: true, 
            reviews,
            pagination: { currentPage: page, totalPages, totalReviews }
        });
    } catch (error) {
        console.error("Get course reviews error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// GET ALL REVIEWS BY THE CURRENT STUDENT (with Pagination)
app.get('/api/student/reviews', auth, async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        // CHANGE THE DEFAULT LIMIT HERE
        const limit = parseInt(req.query.limit) || 20; // Changed from 5 to 20
        const skip = (page - 1) * limit;

        // ... rest of the function remains the same ...
        
        const totalReviews = await Review.countDocuments({ student: req.user.id });
        const totalPages = Math.ceil(totalReviews / limit);

        const reviews = await Review.find({ student: req.user.id })
            .populate('course', 'title')
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip);
        
        res.json({ 
            success: true, 
            reviews,
            pagination: { currentPage: page, totalPages, totalReviews }
        });
    } catch (error) {
        console.error("Get student reviews error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


// CHECK ENROLLMENT STATUS FOR A STUDENT IN A COURSE
app.get('/api/courses/:courseId/enrollment-status', auth, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const studentId = req.user.id;

        // Check if a course exists with the studentId in its students_enrolled array
        const course = await Course.findOne({ _id: courseId, students_enrolled: studentId });

        res.json({ success: true, isEnrolled: !!course });
    } catch (error) {
        console.error("Enrollment status check error:", error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// Add these imports at the top of your server.js

const nodemailer = require('nodemailer');



// Configure Multer for file uploads
const announcementUpload = multer({ dest: 'uploads/' });

// --- ADD THIS NEW ANNOUNCEMENT ROUTE ---
// It uses 'upload.single('attachment')' to handle the file
app.post('/api/announcements', isAuthenticated, isInstructor, announcementUpload.single('attachment'), async (req, res) => {
    try {
        const { courseId, message } = req.body;
        const instructorId = req.user.id; // From isAuthenticated middleware

        // 1. Find the course and all enrolled students
        const course = await Course.findById(courseId).populate('students');
        if (!course || course.instructor.toString() !== instructorId) {
            return res.status(403).json({ success: false, message: 'You are not the instructor of this course.' });
        }
        
        // 2. Save the announcement to the database
        const announcement = new Announcement({
            course: courseId,
            instructor: instructorId,
            message: message,
            // You could save attachment path here if needed:
            // attachmentPath: req.file ? req.file.path : null 
        });
        await announcement.save();

        // 3. Send emails to all students
        if (course.students && course.students.length > 0) {
            const studentEmails = course.students.map(student => student.email);
            const instructor = await User.findById(instructorId);
            const instructorName = `${instructor.firstName} ${instructor.lastName}`;
                    sendAnnouncementEmail(studentEmails, instructorName, course.title, message, req.file);

            // Send email in the background
            sendAnnouncementEmail(studentEmails, instructorName, course.title, message, req.file);
        }

        res.json({ success: true, message: 'Announcement sent successfully.' });

    } catch (error) {
        console.error('Error sending announcement:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// --- ADD THIS NEW ROUTE TO GET ANNOUNCEMENTS FOR THE TABLE ---
app.get('/api/instructors/:instructorId/announcements', isAuthenticated, async (req, res) => {
    try {
        const announcements = await Announcement.find({ instructor: req.params.instructorId })
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate('course', 'title'); // Get course title
        res.json({ success: true, announcements });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// server.js

// --- DELETE AN ANNOUNCEMENT ---
app.delete('/api/announcements/:id', isAuthenticated, isInstructor, async (req, res) => {
    try {
        const announcement = await Announcement.findById(req.params.id);

        if (!announcement) {
            return res.status(404).json({ success: false, message: 'Announcement not found.' });
        }

        // Ensure the person deleting is the instructor who created it
        if (announcement.instructor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized to delete this announcement.' });
        }

        await announcement.deleteOne(); // Use this Mongoose method
        res.json({ success: true, message: 'Announcement deleted successfully.' });

    } catch (error) {
        console.error('Error deleting announcement:', error);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

// Add this route to your server.js file

app.get('/api/instructors/:instructorId/courses', isAuthenticated, async (req, res) => {
    try {
        // Find courses where the instructor field matches the ID from the URL
        const courses = await Course.find({ instructor: req.params.instructorId });
        res.json({ success: true, courses });
    } catch (error) {
        console.error('Error fetching instructor courses:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// In server.js

// PRIVATE: For previewing a course from the edit page
app.get('/api/courses/preview/:id', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate('instructor', 'firstName lastName avatar occupation bio social'); // Populate instructor details

        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Security Check: Only the course owner can preview
        if (course.instructor._id.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized to preview this course' });
        }
        
        // If checks pass, send the course data regardless of its status
        res.json({ success: true, course: course });

    } catch (error) {
        console.error('Error fetching course for preview:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});


app.use(express.static(staticPath));

// ADD THIS LINE:
app.use('/uploads', express.static(path.join(__dirname, '../frontend/uploads')));


// =================================================================
// --- CATCH-ALL ROUTE FOR SERVING HTML FILES ---
// This must be after all API routes and before app.listen()
// =================================================================
app.get('*', (req, res) => {
    // First, make sure it's not an API call that slipped through
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API endpoint not found' });
    }

    // Construct the path to the potential HTML file in your static folder
    // This handles the root path ('/') by serving 'index.html'
    // and other paths (e.g., '/about') by appending '.html'
    const filePath = path.join(__dirname, '../frontend/static', req.path === '/' ? 'index.html' : `${req.path}.html`);

    // Try to send the file
    res.sendFile(filePath, (err) => {
        if (err) {
            // If the file doesn't exist (e.g., /non-existent-page), send your 404 page
            res.status(404).sendFile(path.join(__dirname, '../frontend/static', '404.html'));
        }
    });
});

// REPLACE your old mongoose.connect and app.listen blocks with this final version

// --- DATABASE CONNECTION & SERVER START ---
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully.');
    // Only start the server AFTER the database is connected
    app.listen(PORT, () => {
        console.log(`✅ Backend server is running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Could not connect to MongoDB.');
    console.error(err);
    process.exit(1); // Exit if the database connection fails
  });

// Current version git commit -m "SERVER.js Update v6.1.1"