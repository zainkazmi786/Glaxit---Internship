import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header>
      {/* Top info bar */}
          <header className="p-4 flex justify-between bg-white shadow">
            <Link to="/">Home</Link>
            <Link to="/second">Second Website</Link>
          </header>
      <div className="bg-blue-500 text-white p-2">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
        
       
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
              Wood Have New Works
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              +9985657783445
            </span>
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              demo@example.com
            </span>
          </div>
          <div className="flex space-x-2">
            <a href="#" aria-label="Facebook">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
              </svg>
            </a>
            <a href="#" aria-label="Twitter">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a href="#" aria-label="Google">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 0C4.477 0 0 4.477 0 10c0 5.523 4.477 10 10 10 5.523 0 10-4.477 10-10C20 4.477 15.523 0 10 0zm-1.786 15.267c-2.994 0-5.433-2.439-5.433-5.433S5.22 4.4 8.214 4.4c1.308 0 2.407.491 3.258 1.292l-1.323 1.323c-.361-.344-.996-.743-1.935-.743-1.656 0-3.009 1.437-3.009 3.15 0 1.713 1.353 3.15 3.009 3.15 1.918 0 2.64-1.384 2.754-2.095h-2.754V8.76h4.584c.043.247.082.485.082.803 0 2.822-1.892 5.703-5.432 5.703z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      {/* Main navbar */}
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <a href="#" className="text-2xl font-bold text-blue-500">
                <span className="flex items-center">
                  <svg className="w-8 h-8 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  Roofen
                </span>
              </a>
            </div>
            
            {/* Desktop navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-blue-500 font-medium">Home</a>
              <a href="#" className="text-gray-600 hover:text-blue-500">About</a>
              <a href="#" className="text-gray-600 hover:text-blue-500">Service</a>
              <a href="#" className="text-gray-600 hover:text-blue-500">Pages</a>
              <a href="#" className="text-gray-600 hover:text-blue-500">Blog</a>
              <a href="#" className="text-gray-600 hover:text-blue-500">Contact</a>
              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                GET A QUOTE
              </button>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-blue-500 focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4">
              <a href="#" className="block py-2 text-blue-500 font-medium">Home</a>
              <a href="#" className="block py-2 text-gray-600 hover:text-blue-500">About</a>
              <a href="#" className="block py-2 text-gray-600 hover:text-blue-500">Service</a>
              <a href="#" className="block py-2 text-gray-600 hover:text-blue-500">Pages</a>
              <a href="#" className="block py-2 text-gray-600 hover:text-blue-500">Blog</a>
              <a href="#" className="block py-2 text-gray-600 hover:text-blue-500">Contact</a>
              <button className="mt-4 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
                GET A QUOTE
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;