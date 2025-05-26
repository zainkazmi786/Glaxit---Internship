import React from 'react';

const StudentItem = ({ student, onDelete, onEdit }) => {
  return (
    <li style={{ marginBottom: '8px' }}>
      <strong>{student.name}</strong> (ID: {student._id || student.id})<br />
      Class: {student.class}, Marks: {student.marks}
      <div style={{ marginTop: '5px' }}>
        <button onClick={() => onEdit(student)} style={{ marginRight: '5px' }}>Edit</button>
        <button onClick={() => onDelete(student._id || student.id)}>Delete</button>
      </div>
    </li>
  );
};

export default StudentItem;