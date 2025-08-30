const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const announcementSchema = new Schema({
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course', // This links to your Course model
        required: true
    },
    instructor: {
        type: Schema.Types.ObjectId,
        ref: 'User', // This links to your User model (assuming instructors are users)
        required: true
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    // We don't need an attachment field here, as Multer handles the file system part.
    // The email service will use the temporary file path.
}, {
    timestamps: true // This automatically adds `createdAt` and `updatedAt` fields
});

const Announcement = mongoose.model('Announcement', announcementSchema);

module.exports = Announcement;