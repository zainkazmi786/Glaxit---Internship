import React, { useState, useEffect } from 'react';

const StudentForm = ({ onSave, studentToEdit, cancelEdit }) => {
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [marks, setMarks] = useState('');

  useEffect(() => {
    if (studentToEdit) {
      setName(studentToEdit.name);
      setClassName(studentToEdit.class || '');
      setMarks(studentToEdit.marks || '');
    } else {
      setName('');
      setClassName('');
      setMarks('');
    }
  }, [studentToEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !className || !marks) return;

    onSave({
      _id: studentToEdit?._id, // Use _id instead of id
      name,
      class: className,
      marks: parseInt(marks, 10)
    });

    setName('');
    setClassName('');
    setMarks('');
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Class (e.g. 10th)"
        value={className}
        onChange={(e) => setClassName(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Marks"
        value={marks}
        onChange={(e) => setMarks(e.target.value)}
        required
      />
      <button type="submit">{studentToEdit ? 'Update' : 'Add'}</button>
      {studentToEdit && <button type="button" onClick={cancelEdit}>Cancel</button>}
    </form>
  );
};

export default StudentForm;