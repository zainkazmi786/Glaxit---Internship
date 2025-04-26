import React from 'react';
import doctorImage from '../assets/doctor.jpg'; // <-- You need a placeholder doctor image
import Navbar from './Navbar';

function HeroTwo() {
  return (
    <section className="relative bg-gradient-to-r from-blue-900 to-blue-600 text-white overflow-hidden">
        <Navbar/>
<div className="absolute inset-0">
    <img src={doctorImage} alt="Doctor" className="w-full h-full object-cover" />
    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/60"></div> {/* optional dark overlay */}
  </div>

  {/* Content */}
  <div className="relative container mx-auto flex flex-col md:flex-row items-center min-h-screen z-10 pl-20">
    {/* Left side */}
    <div className="md:w-1/2 space-y-6">
      <h1 className="text-4xl md:text-6xl font-bold leading-tight">
        Compassionate care,<br /> exceptional results.
      </h1>
      <p className="mt-4 text-lg">
        Our team of experienced doctors and healthcare professionals are committed to providing quality care and personalized attention to our patients.
      </p>
      <button className="mt-6 bg-white text-blue-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition">
        See how we work
      </button>
    </div>

    {/* Right side small card */}
    <div className="absolute top-20 right-10 bg-transparent backdrop-blur-md text-blue-700 rounded-full px-6 py-2 shadow-lg flex items-center space-x-2 border-white border">
      <div className="flex -space-x-2">
        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt="" />
        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/44.jpg" alt="" />
        <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/45.jpg" alt="" />
      </div>
      <div className="text-sm text-white font-bold">
        150K+ Patient Recover
      </div>
    </div>
  </div>

  {/* Bottom stats */}
  <div className="absolute bottom-0 right-0 bg-transparent backdrop-blur-md text-slate-200 flex flex-wrap md:flex-nowrap items-center justify-around p-6 rounded-tl-2xl shadow-lg z-20 space-x-6 w-3/5 border-t-2 border-l-2 h-40">
    <div className="text-center">
      <h2 className="text-3xl font-bold">20+</h2>
      <p className="text-sm">Years of experience</p>
    </div>
    <div className="text-center">
      <h2 className="text-3xl font-bold">95%</h2>
      <p className="text-sm">Patient satisfaction</p>
    </div>
    <div className="text-center">
      <h2 className="text-3xl font-bold">5,000+</h2>
      <p className="text-sm">Patients served annually</p>
    </div>
    <div className="text-center">
      <h2 className="text-3xl font-bold">10+</h2>
      <p className="text-sm">Healthcare providers</p>
    </div>
  </div>
</section>

  );
}

export default HeroTwo;
