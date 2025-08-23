require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

// --- GLOBAL VARIABLES & IMPORTS ---
const staticPath = path.join(__dirname, '../frontend/static');
const User = require('./models/User');
const Course = require('./models/Course');
const auth = require('./authMiddleware');

// Using multer's .fields() method to accept up to two different files
// In server.js

// 1. Replace your existing 'lessonUploads' multer instance with this one
// Ensure path is imported at the top of your file
const fs = require('fs');     // Ensure fs is imported for file deletion

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(__dirname, '../frontend/uploads/courses');
            fs.mkdirSync(uploadPath, { recursive: true }); // Ensure directory exists
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

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));


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

app.post('/api/user/avatar', auth, upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No file uploaded.' });
        const user = await User.findById(req.user.id);
        user.avatar = `assets/images/uploads/${req.file.filename}`;
        await user.save();
        res.json({ success: true, msg: 'Avatar updated successfully', filePath: user.avatar });
    } catch (err) { res.status(500).send('Server Error'); }
});

app.post('/api/user/cover', auth, upload.single('coverPhoto'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ msg: 'No file uploaded.' });
        const user = await User.findById(req.user.id);
        user.coverPhoto = `assets/images/uploads/${req.file.filename}`;
        await user.save();
        res.json({ success: true, msg: 'Cover photo updated successfully', filePath: user.coverPhoto });
    } catch (err) { res.status(500).send('Server Error'); }
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

app.get('/api/instructor/quiz-attempts', auth, async (req, res) => {
    try {
        if (req.user.role !== 'instructor') {
            return res.status(403).json({ success: false, message: 'Access denied. You must be an instructor.' });
        }
        const quizAttempts = [{ date: 'December 26, 2024', quizTitle: 'Write a short essay on yourself using the 5', studentName: 'John Due', totalQuestions: 4, totalMarks: 8, correctAnswers: 4, result: 'Pass', }, { date: 'December 26, 2024', quizTitle: 'Write a short essay on yourself using the 5', studentName: 'Jane Smith', totalQuestions: 4, totalMarks: 8, correctAnswers: 2, result: 'Fail', }, { date: 'December 26, 2024', quizTitle: 'Write a short essay on yourself using the 5', studentName: 'Mike Ross', totalQuestions: 4, totalMarks: 8, correctAnswers: 4, result: 'Pass', },];
        res.status(200).json({ success: true, attempts: quizAttempts });
    } catch (error) {
        console.error('Error fetching student quiz attempts:', error);
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
app.post('/api/instructor/courses', auth, upload.single('thumbnail'), async (req, res) => {
    try {
        if (!req.user || req.user.role !== 'instructor') {
            return res.status(403).json({ success: false, message: 'Access denied.' });
        }

        // 1. Receive the new fields from the form data
const { title, slug, description, price, originalPrice, difficultyLevel, maxStudents, isPublic, isQAEnabled, previewVideoUrl } = req.body;
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
            isQAEnabled: isQAEnabled === 'true' // Convert string from form to boolean
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
        res.json({ success: true, course: course });
    } catch (error) {
        console.error('Error fetching course for edit:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
// In server.js - Add this new route

// UPDATE a course by its ID
app.put('/api/courses/:courseId', auth, upload.single('thumbnail'), async (req, res) => {
    try {
        const { courseId } = req.params;
        const course = await Course.findById(courseId);
        
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized' });
        }

        // --- Update All Fields from Form Data ---

        // Basic fields
        course.title = req.body.title || course.title;
        course.slug = req.body.slug || course.slug;
        course.description = req.body.description || course.description;
        course.originalPrice = parseFloat(req.body.originalPrice);
        course.price = parseFloat(req.body.price);
        course.previewVideoUrl = req.body.previewVideoUrl;
        course.status = req.body.status || course.status;

        // Additional Information fields
        course.startDate = req.body.startDate;
        
        if (req.body.language) {
            try { course.language = JSON.parse(req.body.language); } 
            catch (e) { course.language = []; }
        }
        
        if (req.body.requirements) {
            course.requirements = req.body.requirements.split('\n').map(item => item.trim()).filter(Boolean);
        }
        if (req.body.whatYoullLearn) {
            course.whatYoullLearn = req.body.whatYoullLearn.split('\n').map(item => item.trim()).filter(Boolean);
        }
        if (req.body.targetedAudience) {
            course.targetedAudience = req.body.targetedAudience.split('\n').map(item => item.trim()).filter(Boolean);
        }
        if (req.body.tags) {
            course.tags = req.body.tags.split(',').map(tag => tag.trim()).filter(Boolean);
        }

        // Handle nested duration object
        course.duration = course.duration || {};
        course.duration.hours = parseInt(req.body.durationHours, 10) || 0;
        course.duration.minutes = parseInt(req.body.durationMinutes, 10) || 0;

        // Certificate fields
        course.certificateTemplate = req.body.certificateTemplate || course.certificateTemplate;
        course.certificateOrientation = req.body.certificateOrientation || course.certificateOrientation;
        course.includesCertificate = (req.body.certificateTemplate && req.body.certificateTemplate !== 'none');

        // Handle new thumbnail upload
        if (req.file) {
            course.thumbnail = `assets/images/uploads/${req.file.filename}`;
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
app.put('/api/courses/:courseId/episodes/:episodeId/lessons/:lessonId', auth, upload.array('exerciseFiles'), async (req, res) => {
    console.log('--- UPDATE LESSON ROUTE TRIGGERED ---');
    console.log('--- req.body (text fields) ---', req.body);
    console.log('--- req.files (uploaded files) ---', req.files); // <-- THIS IS THE MOST IMPORTANT LOG

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

        // Update text fields
        lesson.title = title || lesson.title;
        lesson.summary = summary; // Allow empty summary
        lesson.vimeoUrl = vimeoUrl; // Allow clearing the URL
        lesson.duration = duration || lesson.duration;
        lesson.isPreview = isPreview === 'true';

        // Handle new file uploads by adding them to the existing array
        if (req.files && req.files.length > 0) {
            const newFiles = req.files.map(file => ({
                filename: file.originalname,
                path: `uploads/courses/${file.filename}`
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
app.post('/api/courses/:courseId/episodes/:episodeId/lessons', auth, upload.array('exerciseFiles'), async (req, res) => {
    try {
        const { courseId, episodeId } = req.params;
        const { title, summary, vimeoUrl, duration, isPreview } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Lesson title is required' });
        }

        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Course not found or user not authorized' });
        }

        const episode = course.episodes.id(episodeId);
        if (!episode) {
            return res.status(404).json({ success: false, message: 'Topic not found' });
        }

        const newLesson = {
            title,
            summary,
            vimeoUrl,
            duration,
            isPreview: isPreview === 'true',
            exerciseFiles: [] // Initialize as an empty array
        };

        // If files were uploaded, map them to the correct format
        if (req.files && req.files.length > 0) {
            newLesson.exerciseFiles = req.files.map(file => ({
                filename: file.originalname,
                path: `uploads/courses/${file.filename}` // Store the relative path
            }));
        }

        episode.lessons.push(newLesson);
        await course.save();

        res.status(201).json({ 
            success: true, 
            message: 'Lesson added successfully!',
            course: course 
        });
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
        const { filePath } = req.body; // File path sent from the frontend

        if (!filePath) {
            return res.status(400).json({ success: false, message: 'File path is required.' });
        }

        const course = await Course.findById(courseId);
        if (!course || course.instructor.toString() !== req.user.id) {
            return res.status(404).json({ success: false, message: 'Not authorized' });
        }
        
        const episode = course.episodes.id(episodeId);
        if (!episode) return res.status(404).json({ success: false, message: 'Topic not found' });

        const lesson = episode.lessons.id(lessonId);
        if (!lesson) return res.status(404).json({ success: false, message: 'Lesson not found' });

        // Find the file to be removed
        const fileToRemove = lesson.exerciseFiles.find(file => file.path === filePath);
        if (!fileToRemove) {
             return res.status(404).json({ success: false, message: 'File not found in this lesson.' });
        }

        // Remove the file object from the array in the database using its _id
        lesson.exerciseFiles.pull(fileToRemove._id);
        await course.save();

        // Delete the physical file from the server's disk
        const physicalPath = path.join(__dirname, '../frontend', filePath);
        fs.unlink(physicalPath, (err) => {
            if (err) {
                console.error("Error deleting physical file:", err);
                // Don't block success response if DB entry was removed but file was already gone
            } else {
                console.log("Successfully deleted physical file:", physicalPath);
            }
        });

        res.json({ success: true, message: 'File deleted successfully!', course });
    } catch (error) {
        console.error('Error deleting file:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});
app.use(express.static(staticPath));


// in server.js

// ... your existing API routes like app.use('/api/courses', ...) go here ...


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


// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});

// Current version