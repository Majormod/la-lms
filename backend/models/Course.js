const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Defines the schema for a single Lesson
const LessonSchema = new Schema({
    title: { 
        type: String, 
        required: true 
    },
    summary: String,
    vimeoUrl: {
        type: String,
        trim: true
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

// Add these two new schemas right here
const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    summary: { type: String }
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
    quizzes: [QuizSchema],         // <-- ADD THIS LINE
    assignments: [AssignmentSchema] // <-- ADD THIS LINE
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