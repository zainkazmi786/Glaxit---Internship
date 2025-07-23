// controllers/lessonController.js
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

const getLessonsByCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user can access this course
    const canAccess = req.user.role === 'admin' || 
                     course.instructor.toString() === req.user.id ||
                     (req.user.role === 'student' && course.enrolledStudents.includes(req.user.id));
    
    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You must be enrolled in this course'
      });
    }
    
    const lessons = await Lesson.find({ course: req.params.courseId }).sort({ createdAt: 1 });
    
    res.json({
      success: true,
      count: lessons.length,
      lessons
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    // Check if user can access this lesson
    const canAccess = req.user.role === 'admin' || 
                     lesson.course.instructor.toString() === req.user.id ||
                     (req.user.role === 'student' && lesson.course.enrolledStudents.includes(req.user.id));
    
    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You must be enrolled in this course'
      });
    }
    
    res.json({
      success: true,
      lesson
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createLesson = async (req, res) => {
  try {
    const { title, videoUrl, content, duration, quiz, courseId } = req.body;
    
    const course = await Course.findById(courseId);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if instructor owns this course
    if (course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only add lessons to your own courses'
      });
    }
    
    const lesson = await Lesson.create({
      title,
      videoUrl,
      content,
      duration,
      quiz,
      course: courseId
    });
    
    // Add lesson to course
    course.lessons.push(lesson._id);
    await course.save();
    
    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      lesson
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    // Check if instructor owns this course
    if (lesson.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update lessons in your own courses'
      });
    }
    
    const { title, videoUrl, content, duration, quiz } = req.body;
    
    const updatedLesson = await Lesson.findByIdAndUpdate(
      req.params.id,
      { title, videoUrl, content, duration, quiz },
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Lesson updated successfully',
      lesson: updatedLesson
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id).populate('course');
    
    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }
    
    // Check if instructor owns this course
    if (lesson.course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete lessons from your own courses'
      });
    }
    
    // Remove lesson from course
    await Course.findByIdAndUpdate(lesson.course._id, {
      $pull: { lessons: lesson._id }
    });
    
    // Delete the lesson
    await Lesson.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Lesson deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getLessonsByCourse,
  getLesson,
  createLesson,
  updateLesson,
  deleteLesson
};