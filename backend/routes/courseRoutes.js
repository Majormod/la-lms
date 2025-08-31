const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const auth = require('../authMiddleware'); // Go up one level to the 'backend' folder
//const upload = require('../middleware/upload');

// ================================================================
// @route   GET /api/courses
// @desc    Get all published courses (with full filtering and sorting)
// @access  Public
// ================================================================
router.get('/', async (req, res) => {
    try {
        const filters = { status: 'Published' };
        let sortOptions = { createdAt: -1 };

        // ... (Search and Category filters are unchanged) ...
        if (req.query.search) {
            filters.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }
        const categoryFilters = [];
        if (req.query.category) {
            categoryFilters.push({ categories: req.query.category });
        }
        if (req.query.school) {
            categoryFilters.push({ categories: req.query.school });
        }
        if (categoryFilters.length > 0) {
            filters.$and = (filters.$and || []).concat(categoryFilters);
        }


        // --- [MODIFIED] Price Filtering Logic ---
        let priceConditions = [];

        // Condition 1: Price Type Dropdown
        if (req.query.price === 'free') {
            priceConditions.push({ price: 0 });
        } else if (req.query.price === 'paid') {
            priceConditions.push({ price: { $gt: 0 } });
        }

        // Condition 2: Price Range Slider
        const minPrice = parseInt(req.query.minPrice);
        const maxPrice = parseInt(req.query.maxPrice);

        // CHANGED: Simplified this condition to correctly handle the new max range.
        // It now applies the filter as long as valid numbers are provided.
        if (!isNaN(minPrice) && !isNaN(maxPrice)) {
             priceConditions.push({ price: { $gte: minPrice, $lte: maxPrice } });
        }
        
        if (priceConditions.length > 0) {
            filters.$and = (filters.$and || []).concat(priceConditions);
        }


        // ... (The rest of the route logic is unchanged) ...
        switch (req.query.sortBy) {
            case 'price_asc': sortOptions = { price: 1 }; break;
            case 'price_desc': sortOptions = { price: -1 }; break;
            default: sortOptions = { createdAt: -1 }; break;
        }

        let query = Course.find(filters)
            .populate('instructor', 'firstName lastName avatar')
            .sort(sortOptions);

        if (req.query.limit) {
            const limit = parseInt(req.query.limit, 10);
            if (!isNaN(limit) && limit > 0) {
                query = query.limit(limit);
            }
        }

        const courses = await query.exec();
        const totalCourses = await Course.countDocuments(filters);

        res.json({
            success: true,
            courses: courses,
            pagination: { totalCourses: totalCourses }
        });

    } catch (error) {
        console.error('Error fetching courses:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});


// ================================================================
// @route   GET /api/courses/instructor/my-courses
// @desc    Get all courses for the logged-in instructor
// @access  Private
// ================================================================
router.get('/instructor/my-courses', auth, async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id }).sort({ createdAt: -1 });
        res.json({ success: true, courses });
    } catch (error) {
        console.error('Server Error:', error.message);
        res.status(500).send('Server Error');
    }
});

// ================================================================
// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private
// ================================================================
router.put('/:id', auth, upload.single('thumbnail'), async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized' });
        }
        // Update fields
        const { title, slug, description, price, originalPrice } = req.body;
        course.title = title;
        course.slug = slug;
        course.description = description;
        course.price = parseFloat(price);
        course.originalPrice = parseFloat(originalPrice);
        if (req.file) {
            course.thumbnail = `uploads/${req.file.filename}`;
        }
        const updatedCourse = await course.save();
        res.json({ success: true, message: 'Course updated successfully!', course: updatedCourse });
    } catch (error) {
        console.error('Error updating course:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// ================================================================
// @route   PUT /api/courses/:id/status
// @desc    Update a course's status
// @access  Private
// ================================================================
router.put('/:id/status', auth, async (req, res) => {
    const { status } = req.body;
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found.' });
        }
        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: 'User not authorized.' });
        }
        course.status = status;
        await course.save();
        res.json({ success: true, message: `Course status updated to ${status}` });
    } catch (error) {
        console.error('Error updating status:', error.message);
        res.status(500).send('Server Error');
    }
});


// ================================================================
// @route   GET /api/courses/:id
// @desc    Get a single course by its ID
// @access  Public
// --- THIS MUST BE THE LAST 'GET' ROUTE ---
// ================================================================
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'firstName lastName avatar');

    if (!course) {
      return res.status(404).json({ success: false, msg: 'Course not found' });
    }
    res.json({ success: true, course });
  } catch (err) {
    console.error(`Error fetching course by ID: ${err.message}`);
    if (err.kind === 'ObjectId') {
        return res.status(404).json({ success: false, msg: 'Course not found' });
    }
    res.status(500).send('Server Error');
  }
});


module.exports = router;