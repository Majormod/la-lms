// routes/paymentRoutes.js (Backend)

const express = require('express');
const router = express.Router();
const auth = require('../authMiddleware');
const { createOrder, verifyPayment } = require('../controllers/paymentController');

// @route   POST api/payment/create-order
// @desc    Create a Razorpay order
// @access  Private
router.post('/create-order', auth, createOrder);

// @route   POST api/payment/verify
// @desc    Verify Razorpay payment and enroll user
// @access  Private
router.post('/verify', auth, verifyPayment);

module.exports = router;