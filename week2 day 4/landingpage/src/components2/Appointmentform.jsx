import React from 'react';
export const AppointmentFormSection = () => {
    return (
      <section className="p-20 bg-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Book an Appointment</h2>
          
          <div className="max-w-3xl mx-auto bg-transparent p-8 rounded-lg">
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="Your name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Your email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-gray-700 mb-2">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    placeholder="Your phone"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="date" className="block text-gray-700 mb-2">Preferred Date</label>
                  <input
                    type="date"
                    id="date"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="time" className="block text-gray-700 mb-2">Preferred Time</label>
                  <select
                    id="time"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Time</option>
                    <option value="morning">Morning (9AM - 12PM)</option>
                    <option value="afternoon">Afternoon (1PM - 5PM)</option>
                    <option value="evening">Evening (6PM - 8PM)</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="department" className="block text-gray-700 mb-2">Department</label>
                  <select
                    id="department"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Department</option>
                    <option value="primary">Primary Care</option>
                    <option value="specialized">Specialized Care</option>
                    <option value="emergency">Emergency</option>
                    <option value="dental">Dental</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                <textarea
                  id="message"
                  rows="4"
                  placeholder="Please provide any additional information about your appointment request"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none focus:outline-none focus:border-blue-500"
                ></textarea>
              </div>
              
              <button
                type="submit"
                className="w-32 bg-blue-500 text-white py-3 rounded-full font-semibold hover:bg-blue-600 transition-colors duration-300"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </section>
    );

};