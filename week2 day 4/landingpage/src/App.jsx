import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Your current website
import HomePage from './pages/HomePage';

// Your second new website
import SecondWebsite from './pages/SecondWebsite';

function App() {
  return (
    <div className="font-sans">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/second" element={<SecondWebsite />} />
      </Routes>
    </div>
  );
}

export default App;
