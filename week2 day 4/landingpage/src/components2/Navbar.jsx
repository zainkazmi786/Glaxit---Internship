import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <header className="absolute top-0 left-0 z-20 w-full  text-white">
      <div className="container mx-auto flex justify-between items-center p-4 px-20">
        <div className="text-2xl font-bold">
          ProHealth
        </div>
        <nav className="space-x-6">
          <Link to="/" className="hover:text-gray-300">Home</Link>
          <Link to="/" className="hover:text-gray-300">About</Link>
          <Link to="/" className="hover:text-gray-300">Find Doctor</Link>
          <Link to="/" className="hover:text-gray-300">Blog</Link>
          <Link to="/" className="hover:text-gray-300">Contact</Link>
        </nav>
        <div className="space-x-4">
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11A6 6 0 105 11a6 6 0 0012 0z" />
            </svg>
          </button>
          <button className="text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
