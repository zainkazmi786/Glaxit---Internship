
// controllers/courseController.js
const Course = require('../models/Course');
const User = require('../models/User');

const getAllCourses = async (req, res) => {
  try {
    const { category, instructor, approved } = req.query;
    let query = {};
    
    // Non-authenticated users can only see approved courses
    if (!req.user || req.user.role !== 'admin') {
      query.approved = true;
    }
    
    if (category) query.category = category;
    if (instructor) query.instructor = instructor;
    if (approved !== undefined && req.user?.role === 'admin') {
      query.approved = approved === 'true';
    }
    
    const courses = await Course.find(query)
      .populate('instructor', 'name email')
      .populate('lessons')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: courses.length,
      courses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name email')
      .populate('lessons');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check if user can access this course
    if (!course.approved && (!req.user || (req.user.role !== 'admin' && req.user.id !== course.instructor._id.toString()))) {
      return res.status(403).json({
        success: false,
        message: 'Course not approved or access denied'
      });
    }
    
    res.json({
      success: true,
      course
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const createCourse = async (req, res) => {
  try {
    const { title, description, price, category, thumbnailUrl } = req.body;
    
    const course = await Course.create({
      title,
      description,
      price,
      category,
      thumbnailUrl,
      instructor: req.user.id
    });
    
    const populatedCourse = await Course.findById(course._id).populate('instructor', 'name email');
    
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: populatedCourse
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check permissions
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only update your own courses'
      });
    }
    
    const { title, description, price, category, thumbnailUrl } = req.body;
    
    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { title, description, price, category, thumbnailUrl },
      { new: true, runValidators: true }
    ).populate('instructor', 'name email').populate('lessons');
    
    res.json({
      success: true,
      message: 'Course updated successfully',
      course: updatedCourse
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    // Check permissions
    if (req.user.role !== 'admin' && course.instructor.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You can only delete your own courses'
      });
    }
    
    await Course.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const approveCourse = async (req, res) => {
  try {
    const { approved } = req.body;
    
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { approved },
      { new: true, runValidators: true }
    ).populate('instructor', 'name email');
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    res.json({
      success: true,
      message: `Course ${approved ? 'approved' : 'disapproved'} successfully`,
      course
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    if (!course.approved) {
      return res.status(400).json({
        success: false,
        message: 'Course is not approved yet'
      });
    }
    
    // Check if already enrolled
    if (course.enrolledStudents.includes(req.user.id)) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }
    
    // Add student to course
    course.enrolledStudents.push(req.user.id);
    await course.save();
    
    // Add course to user's purchased courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { purchasedCourses: course._id }
    });
    
    res.json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  approveCourse,
  enrollInCourse
};