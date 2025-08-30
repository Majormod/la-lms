// Course.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defines the schema for a single Lesson
const LessonSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    summary: String,
videoSource: {
        type: String,
        enum: ['YouTube', 'Vimeo', 'External URL', null],
        default: null
    },
    videoUrl: {
        type: String,
        trim: true,
        default: ''
    },
    duration: {
        type: String, // e.g., "10 min"
        default: "0 min"
    },
    isPreview: {
        type: Boolean, // Can non-enrolled students watch this lesson?
        default: false
    },
    exerciseFiles: [{
    filename: String,
    path: String
}]
});
const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    isCorrect: { type: Boolean, default: false }
});
const QuestionSchema = new mongoose.Schema({
    questionText: { type: String, required: true },
    questionType: { 
        type: String, 
        required: true,
        enum: ['single-choice', 'multiple-choice', 'open-ended']
    },
    points: { type: Number, default: 10 },
    options: [OptionSchema]
});
// Add these two new schemas right here
const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String },
    questions: [QuestionSchema],
    
    // --- NEW SETTINGS FIELDS ---
    timeLimit: {
        value: { type: Number, default: 0 },
        unit: { type: String, enum: ['Weeks', 'Days', 'Hours'], default: 'Hours' }
    },
    hideTimeLimit: { type: Boolean, default: false },
    feedbackMode: {
        type: String,
        enum: ['default', 'reveal', 'retry'],
        default: 'default'
    },
    passingGrade: { type: Number, default: 50 },
    maxQuestionsAllowed: { type: Number, default: 10 },
    autoStart: { type: Boolean, default: false },
    questionLayout: { type: String, default: 'single_question' },
    questionOrder: { type: String, default: 'Random' },
    hideQuestionNumber: { type: Boolean, default: false },
    shortAnswerCharLimit: { type: Number, default: 200 },
    essayCharLimit: { type: Number, default: 500 }
});

const AssignmentSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String }
});
// Defines the schema for an Episode (Topic), which contains an array of Lessons
const EpisodeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String },
    lessons: [LessonSchema],
    quizzes: [QuizSchema],
    assignments: [AssignmentSchema]
});

// Your main Course Schema, with the 'episodes' field
const CourseSchema = new Schema({
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, default: 0 },
    originalPrice: { type: Number },
    isFree: { type: Boolean, default: false },
    thumbnail: String,
    status: { type: String, enum: ['Draft', 'Pending', 'Published'], default: 'Draft' },
    difficultyLevel: { type: String, enum: ['All Levels', 'Beginner', 'Intermediate', 'Expert'], default: 'All Levels' },
    categories: [String],
    tags: [String],
    language: [{ type: String }], // Changed to array for multiple languages
    requirements: [String],
    whatYoullLearn: [String],
    targetedAudience: [String],
    maxStudents: { type: Number, default: 0 },
    isPublic: { type: Boolean, default: false },
    isQAEnabled: { type: Boolean, default: true },
    
    // --- ADD THIS FIELD FOR THE MASTERCLASS FEATURE ---
    isMasterclass: { 
        type: Boolean, 
        default: false 
    },

    previewVideoUrl: String,
    createdAt: { type: Date, default: Date.now },
    startDate: { type: Date }, // New field for start date
    duration: { // New field for course duration
        hours: { type: Number, min: 0 },
        minutes: { type: Number, min: 0, max: 59 }
    },
    episodes: [EpisodeSchema],
    
    // === ADD CERTIFICATE FIELDS HERE ===
    certificateTemplate: {
        type: String,
        enum: [
            'none', 'option1', 'option2', 'option3', 'option4', 'option5', 'option6',
            'optionport1', 'optionport2', 'optionport3', 'optionport4', 'optionport5', 'optionport6'
        ],
        default: 'none'
    },
    certificateOrientation: {
        type: String,
        enum: ['landscape', 'portrait'],
        default: 'landscape'
    },
    includesCertificate: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', CourseSchema);