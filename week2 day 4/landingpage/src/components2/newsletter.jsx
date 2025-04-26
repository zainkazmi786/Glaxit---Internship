import React from 'react';

export const NewsletterSection = () => {
    return (
      <section className="py-10 bg-white border-t border-gray-200 rounded-3xl">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Be Our Subscribers</h3>
              <p className="text-gray-600">Subscribe to our newsletter for the latest updates</p>
            </div>
            <div className="mt-6 md:mt-0 w-full md:w-1/2 max-w-md">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:border-blue-500"
                />
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-r-md font-semibold hover:bg-blue-600 transition-colors duration-300"
                >
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  };