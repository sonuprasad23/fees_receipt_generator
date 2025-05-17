import React from 'react';

export function Footer() {
  return (
    <footer className="w-full bg-black py-8 px-4 border-t-2 border-green-600 print:hidden"> {/* Added print:hidden */}
      <div className="container mx-auto">
        {/* Contact info for mobile in main footer */}
        <div className="md:hidden text-center mb-6 text-sm text-green-400/80 space-y-1">
          <p>Janta Market, Near Hotel Madhulika Inn, Bartand, Dhanbad-826001</p>
          <p>+91 7903066925 | newhopesacademy@gmail.com</p>
        </div>
        
        {/* Tagline with 3D effect */}
        <div className="relative w-full max-w-xl mx-auto py-4 px-3 sm:px-6 border-2 border-green-500 rounded-lg shadow-xl shadow-green-500/20 
                        bg-gradient-to-br from-gray-800 via-black to-gray-800
                        transform perspective-1000 hover:-translate-y-1 transition-transform duration-300 group">
          
          {/* Subtle inner glow/border */}
          <div className="absolute inset-0.5 rounded-md border border-green-500/30 group-hover:border-green-400/70 transition-all duration-300"></div>
          
          {/* Pseudo 3D depth effect */}
          <div className="absolute -bottom-1 -right-1 w-full h-full bg-green-700/30 rounded-lg -z-10 blur-sm group-hover:blur-[2px] transition-all duration-300"></div>

          <div className="relative z-10 text-center">
            <p className="text-base sm:text-lg md:text-xl font-bold text-green-400 group-hover:text-green-300 transition-colors duration-300 tracking-wide">
              "Building Dreams, Empowering Minds: Hopes Academy"
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}