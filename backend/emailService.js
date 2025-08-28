// emailService.js

const nodemailer = require('nodemailer');
const fs = require('fs');

// Configure the transporter once
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'YOUR_EMAIL@gmail.com',
        pass: 'YOUR_APP_PASSWORD'
    }
});

// Create and export the function to be used elsewhere
async function sendAnnouncementEmail(studentEmails, instructorName, courseTitle, message, attachmentFile) {
    const mailOptions = {
        from: `"${instructorName}" <YOUR_EMAIL@gmail.com>`,
        to: studentEmails.join(', '),
        subject: `New Announcement for ${courseTitle}`,
        html: `
            <p>Hello,</p>
            <p>Your instructor, ${instructorName}, has posted a new announcement for the course: <strong>${courseTitle}</strong>.</p>
            <hr>
            <p>${message.replace(/\n/g, '<br>')}</p>
            <hr>
        `,
    };

    if (attachmentFile) {
        mailOptions.attachments = [{
            filename: attachmentFile.originalname,
            path: attachmentFile.path
        }];
    }

    try {
        await transporter.sendMail(mailOptions);
        console.log('Announcement emails sent successfully.');
    } catch (error) {
        console.error('Error sending announcement emails:', error);
    } finally {
        if (attachmentFile) {
            fs.unlinkSync(attachmentFile.path); // Clean up the file
        }
    }
}

// Export the function to make it available to other files
module.exports = { sendAnnouncementEmail };