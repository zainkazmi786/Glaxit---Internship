
// src/pages/AdminDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AdminPanel from './Admin'; // Import your existing admin dashboard component

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };
  
  return (
    <div>
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-semibold">Admin Dashboard</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      
      <AdminPanel />
    </div>
  );
};

export default AdminDashboard;