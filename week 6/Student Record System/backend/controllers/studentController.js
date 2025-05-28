const Student = require('../models/studentModel');

// GET: Get all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (err) {
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// POST: Add a new student
const addStudent = async (req, res) => {
  try {
    const { name, class: studentClass, marks } = req.body;

    // Validation (can also be done by Mongoose schema)
    if (!name || !studentClass || marks === undefined) {
      return res.status(400).json({ error: 'Name, class, and marks are required' });
    }

    const student = new Student({
      name,
      class: studentClass,
      marks
    });

    const savedStudent = await student.save();
    res.status(201).json(savedStudent);
  } catch (err) {
    res.status(400).json({ error: 'Failed to add student', details: err.message });
  }
};

// PUT: Update an existing student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Student.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updated) {
      return res.status(404).json({ error: 'Student not found' });
    } 
    res.status(200).json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update student', details: err.message });
  }
};

// DELETE: Delete a student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Student.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json(deleted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete student', details: err.message });
  }
};

module.exports = {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent
};
