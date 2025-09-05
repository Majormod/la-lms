const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const auth = require('../authMiddleware');
const Course = require('../models/Course');
const User = require('../models/User');

// Make sure your Razorpay keys are in a .env file
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create a Razorpay order
router.post('/create-order', auth, async (req, res) => {
    const { items } = req.body;
    if (!items || items.length === 0) {
        return res.status(400).json({ success: false, message: 'No items in cart' });
    }
    try {
        const courseIds = items.map(item => item.id);
        const coursesFromDB = await Course.find({ '_id': { $in: courseIds } });
        let totalAmount = 0;
        coursesFromDB.forEach(course => {
            const cartItem = items.find(item => item.id === course._id.toString());
            if(cartItem) {
                totalAmount += course.price * cartItem.quantity;
            }
        });

        if (totalAmount <= 0) {
            return res.status(400).json({ success: false, message: 'Total amount is invalid.' });
        }
        const options = {
            amount: totalAmount * 100, // Amount in paise
            currency: "INR",
            receipt: `receipt_order_${new Date().getTime()}`,
        };
        const order = await razorpay.orders.create(options);
        if (!order) return res.status(500).send('Error creating order');
        res.json({ success: true, order });
    } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(500).send('Server Error');
    }
});

// Verify payment and enroll user
// In paymentRoutes.js, replace the '/verify' route
router.post('/verify', auth, async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, courseIds } = req.body;
    const shasum = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    shasum.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = shasum.digest('hex');

    if (digest !== razorpay_signature) {
        return res.status(400).json({ success: false, message: 'Transaction not legit!' });
    }
    try {
        const user = await User.findById(req.user.id);
        
        // Create new enrollment objects
        const newEnrollments = courseIds
            .filter(courseId => !user.enrolledCourses.some(e => e.course.toString() === courseId)) // Filter out courses user is already enrolled in
            .map(courseId => ({ course: courseId, status: 'active', progress: 0 }));

        if (newEnrollments.length > 0) {
            user.enrolledCourses.push(...newEnrollments);
            await user.save();
        }

        res.json({ success: true, message: 'Payment verified successfully. You are now enrolled!' });
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).send('Server Error');
    }
});

module.exports = router;