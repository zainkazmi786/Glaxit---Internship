// src/components/Layout.js
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 shadow-lg backdrop-blur-sm border-b border-blue-500/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-xl backdrop-blur-sm flex items-center justify-center shadow-lg">
                <span className="p-1"><img src="/icon.png" alt="" /></span>
              </div>
              <h1 className="hidden md:block text-2xl font-bold text-white tracking-tight">
                ChatterBox
              </h1>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 shadow-lg">
                <div className="relative">
                  <img
                    src={user?.avatar}
                    alt={user?.name}
                    className="w-8 h-8 rounded-full ring-2 ring-white/50 shadow-md transition-transform hover:scale-110"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>
                <span className="text-white font-medium hidden md:block">{user?.name}</span>
              </div>
              <button
                onClick={logout}
                className="group px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl backdrop-blur-sm"
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="">
        {children}
      </main>
    </div>
  );
};

export default Layout;
