import React from 'react';

const About = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="relative">
            <img 
              src="/1.jpg" 
              alt="Roofing services" 
              className="w-full h-full object-cover rounded"
            />
            <div className="absolute bottom-10 left-10 bg-blue-500 text-white rounded-full p-4 w-32 h-32 flex flex-col items-center justify-center">
              <span className="text-3xl font-bold">25</span>
              <span className="text-sm">Years of practicing</span>
            </div>
          </div>
          
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <span className="text-blue-500 font-medium">OUR ABOUT</span>
              <h2 className="text-3xl font-bold mt-2 mb-6">
                Roofsie exception roofing services
              </h2>
              <p className="text-gray-600 mb-6">
                Nulla et mauris aliquam tortor ac vehicula conque arcu. Aenean ut Nulla et tortor at nisl, tempor facilisis. Sed eu leo exporbol fels, vestibulum felis.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="flex items-center p-4 rounded border">
                <div className="mr-4 text-blue-500">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold">Innovative work</h4>
                </div>
              </div>
              
              <div className="flex items-center p-4 rounded border">
                <div className="mr-4 text-blue-500">
                  <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold">Single roofing</h4>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mb-8">
              Exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat quis aute aliquip ex ea nunc reprehenderit.
            </p>
            
            <a 
              href="#" 
              className="inline-block bg-blue-500 text-white px-8 py-3 font-medium hover:bg-blue-600 transition duration-300"
            >
              DISCOVER MORE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;