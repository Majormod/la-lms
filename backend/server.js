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


const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(staticPath, 'assets/images/uploads/'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

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

        // Update basic fields
        course.title = req.body.title || course.title;
        course.slug = req.body.slug || course.slug;
        course.description = req.body.description || course.description;
        course.originalPrice = parseFloat(req.body.originalPrice) || course.originalPrice;
        course.price = parseFloat(req.body.price) || course.price;
        course.previewVideoUrl = req.body.previewVideoUrl || course.previewVideoUrl;
        course.status = req.body.status || course.status;

        // Update Additional Information fields - CORRECTED TO MATCH YOUR MODEL
        course.startDate = req.body.startDate || course.startDate;
        
        // Language - handle array
        if (req.body.language) {
            try {
                course.language = JSON.parse(req.body.language);
            } catch (e) {
                course.language = Array.isArray(req.body.language) ? req.body.language : [req.body.language];
            }
        }
        
        // Requirements - your model expects array, frontend sends newline-separated
        if (req.body.requirements) {
            course.requirements = req.body.requirements.split('\n')
                .map(req => req.trim())
                .filter(req => req.length > 0);
        }
        
        // What You'll Learn - your model has this field, not detailedDescription
        if (req.body.whatYoullLearn) {
            course.whatYoullLearn = req.body.whatYoullLearn.split('\n')
                .map(item => item.trim())
                .filter(item => item.length > 0);
        }
        
        // Duration - your model has nested duration object, not separate fields
        course.duration = course.duration || {};
        course.duration.hours = parseInt(req.body.durationHours) || course.duration.hours || 0;
        course.duration.minutes = parseInt(req.body.durationMinutes) || course.duration.minutes || 0;
        
        // Tags - your model has 'tags' field, not 'courseTags'
        if (req.body.tags) {
            course.tags = req.body.tags.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag.length > 0);
        }
        
        // Targeted Audience - your model has this field
        if (req.body.targetedAudience) {
            course.targetedAudience = req.body.targetedAudience.split('\n')
                .map(audience => audience.trim())
                .filter(audience => audience.length > 0);
        }

        // Update certificate fields
        course.certificateTemplate = req.body.certificateTemplate || course.certificateTemplate;
        course.certificateOrientation = req.body.certificateOrientation || course.certificateOrientation;
        course.includesCertificate = (req.body.certificateTemplate && req.body.certificateTemplate !== 'none');

        if (req.file) {
            course.thumbnail = `assets/images/uploads/${req.file.filename}`;
        }

        const updatedCourse = await course.save();
        // DEBUG: Check what was actually saved
console.log('=== SERVER: After saving ===');
console.log('whatYoullLearn:', updatedCourse.whatYoullLearn);
console.log('tags:', updatedCourse.tags);
console.log('duration:', updatedCourse.duration);
console.log('requirements:', updatedCourse.requirements);
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

// Using multer's .fields() method to accept up to two different files
// In server.js
const lessonUploads = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'public/assets/images/uploads/'),
        filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
    }),
    fileFilter: (req, file, cb) => {
        // Validate file types if needed (e.g., PDF, images)
        cb(null, true);
    }
}).single('exerciseFile'); // Only handle exerciseFile

// POST /api/courses/:courseId/episodes/:episodeId/lessons
app.post('/api/courses/:courseId/episodes/:episodeId/lessons', auth, lessonUploads, async (req, res) => {
    try {
        const { courseId, episodeId } = req.params;
        const { title, summary, vimeoUrl, duration, isPreview } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Lesson title is required' });
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

        const newLesson = {
            title,
            summary,
            vimeoUrl,
            duration,
            isPreview: isPreview === 'true'
        };

        if (req.file) {
            newLesson.exerciseFile = `assets/images/uploads/${req.file.filename}`;
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
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
});

// PUT /api/courses/:courseId/episodes/:episodeId/lessons/:lessonId
app.put('/api/courses/:courseId/episodes/:episodeId/lessons/:lessonId', auth, lessonUploads, async (req, res) => {
    try {
        const { courseId, episodeId, lessonId } = req.params;
        const { title, summary, vimeoUrl, duration, isPreview } = req.body;

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

        const lesson = episode.lessons.id(lessonId);
        if (!lesson) {
            return res.status(404).json({ success: false, message: 'Lesson not found' });
        }

        lesson.title = title || lesson.title;
        lesson.summary = summary || lesson.summary;
        lesson.vimeoUrl = vimeoUrl || lesson.vimeoUrl;
        lesson.duration = duration || lesson.duration;
        lesson.isPreview = isPreview === 'true';

        if (req.file) {
            lesson.exerciseFile = `assets/images/uploads/${req.file.filename}`;
        }

        await course.save();

        res.json({
            success: true,
            message: 'Lesson updated successfully!',
            course: course
        });
    } catch (error) {
        console.error('Error updating lesson:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
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

app.use(express.static(staticPath));


// --- CATCH-ALL ROUTE for Clean URLs (This must come AFTER all API routes) ---
app.get('*', (req, res) => {
    // Exclude API calls from this catch-all
    if (req.path.startsWith('/api')) {
        return res.status(404).sendFile(path.join(staticPath, '404.html'));
    }

    const requestedPath = req.path === '/' ? '/index.html' : `${req.path}.html`;
    const filePath = path.join(staticPath, requestedPath);

    res.sendFile(filePath, (err) => {
        if (err) {
            // If the requested .html file is not found, send the 404 page
            res.status(404).sendFile(path.join(staticPath, '404.html'));
        }
    });
});
// In server.js




// Your other existing routes like app.post('/api/register', ...) etc. can remain as they are.
// ...
// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`✅ Backend server is running on http://localhost:${PORT}`);
});