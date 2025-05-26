import React from 'react';
import StudentItem from './StudentItem';

const StudentList = ({ students, onDelete, onEdit }) => {
  if (!students.length) return <p>No students available.</p>;

  return (
    <ul>
      {students.map(student => (
        <StudentItem
          key={student._id}
          student={student}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
};

export default StudentList;
