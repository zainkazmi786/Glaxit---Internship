// src/components/Layout.js
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children, onToggleSidebar, isSidebarOpen }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 md:space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={onToggleSidebar}
                className="md:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm"
              >
                <svg 
                  className={`w-5 h-5 text-white transition-transform duration-300 ${isSidebarOpen ? 'rotate-90' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl backdrop-blur-sm flex items-center justify-center shadow-lg">
                <span className="p-1">
                  <img src="/icon.png" alt="" className="w-full h-full object-contain" />
                </span>
              </div>
              <h1 className="text-lg md:text-2xl font-bold text-white tracking-tight">
                <span className="hidden sm:inline">ChatterBox</span>
                <span className="sm:hidden">Chat</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-3 md:gap-6">
              {/* User Info */}
              <div className="flex items-center gap-2 md:gap-3 px-2 md:px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                <div className="relative">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-6 h-6 md:w-8 md:h-8 rounded-full ring-1 md:ring-2 ring-white/50 shadow-md transition-transform hover:scale-110"
                  />
                  <div className="absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full border-1 md:border-2 border-white shadow-sm"></div>
                </div>
                <span className="text-white font-medium text-sm md:text-base hidden sm:inline truncate max-w-24 md:max-w-none">
                  {user?.name}
                </span>
              </div>
              
              {/* Logout Button */}
              <button
                onClick={logout}
                className="group px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden md:inline">Logout</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;