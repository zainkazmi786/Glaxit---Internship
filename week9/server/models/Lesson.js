
// models/Lesson.js
const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required']
  },
  content: {
    type: String,
    required: [true, 'Lesson content is required'],
    maxlength: [5000, 'Content cannot be more than 5000 characters']
  },
  duration: {
    type: Number,
    required: [true, 'Lesson duration is required'],
    min: [1, 'Duration must be at least 1 minute']
  },
  quiz: {
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number
    }],
    totalMarks: Number
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Lesson', lessonSchema);