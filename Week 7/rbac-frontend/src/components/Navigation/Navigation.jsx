import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from "../../context/AuthContext";
import { Button } from '@/components/ui/button';

const Navigation = () => {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();

  // Helper to highlight active link
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 shadow-sm border-b">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex space-x-8">
          <Link
            to="/dashboard"
            className={`text-lg font-semibold transition-colors duration-200 ${
              isActive('/dashboard') 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/posts"
            className={`text-lg font-semibold transition-colors duration-200 ${
              isActive('/posts') 
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
                : 'text-blue-600 hover:text-blue-800'
            }`}
          >
            Posts
          </Link>
          {isAdmin() && (
            <>
              <Link
                to="/roles"
                className={`text-lg font-semibold transition-colors duration-200 ${
                  isActive('/roles') 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                Roles
              </Link>
              <Link
                to="/permissions"
                className={`text-lg font-semibold transition-colors duration-200 ${
                  isActive('/permissions') 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                Permissions
              </Link>
              <Link
                to="/users"
                className={`text-lg font-semibold transition-colors duration-200 ${
                  isActive('/users') 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent' 
                    : 'text-blue-600 hover:text-blue-800'
                }`}
              >
                Users
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <span className="text-gray-600 font-medium">Welcome, {user?.name}</span>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.05] active:scale-[0.95] shadow-md hover:shadow-lg"
          >
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
