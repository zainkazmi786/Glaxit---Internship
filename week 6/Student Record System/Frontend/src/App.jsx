import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentForm from './StudentForm';
import StudentList from './StudentList';

const App = () => {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  const API_URL = 'http://localhost:3000/api/students';

  const fetchStudents = async () => {
    try {
      const res = await axios.get(API_URL);
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
    }
  };

  const handleAddOrUpdate = async (student) => {
    try {
      console.log("Sending student data:", student);

      // Check if we're updating (student has _id) or adding new
      if (student._id) {
        // Update existing student
        const res = await axios.put(`${API_URL}/${student._id}`, student);
        setStudents(prev => prev.map(s => (s._id === student._id ? res.data : s)));
      } else {
        // Add new student
        const res = await axios.post(API_URL, student); 
        setStudents(prev => [...prev, res.data]);
      }

      setEditingStudent(null);
    } catch (err) {
      console.error('Failed to save student:', err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setStudents(prev => prev.filter(s => s._id !== id));
    } catch (err) {
      console.error('Failed to delete student:', err.response?.data || err.message);
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
  };

  const cancelEdit = () => {
    setEditingStudent(null);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="app-container" style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Student Manager</h1>
      <StudentForm
        onSave={handleAddOrUpdate}
        studentToEdit={editingStudent}
        cancelEdit={cancelEdit}
      />
      <StudentList
        students={students}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default App;