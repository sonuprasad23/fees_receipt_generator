import React from 'react';

interface WelcomePageProps {
  onSelectName: (name: string) => void;
}

export function WelcomePage({ onSelectName }: WelcomePageProps) {
  return (
    <div className="container mx-auto px-4 py-12 flex flex-col items-center">
      {/* MODIFIED: Use img tag for logo */}
      <img src="/logo.png" alt="Hopes Academy Logo" className="w-32 h-32 object-contain mb-8" />
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
        Welcome to <span className="text-green-500">Hopes Academy</span>
      </h2>
      <div className="text-xl mb-8 text-center">Who is generating the receipt?</div>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-md">
        <button
          onClick={() => onSelectName('Izaj Ahmad')}
          className="relative group bg-green-500 text-black font-bold py-4 px-8 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(52,211,153,0.7)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm group-hover:blur-none"></div>
          <span className="relative z-10">Izaj Ahmad</span>
        </button>
        <button
          onClick={() => onSelectName('Sonu Mahato')}
          className="relative group bg-green-500 text-black font-bold py-4 px-8 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(52,211,153,0.7)] active:scale-95 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm group-hover:blur-none"></div>
          <span className="relative z-10">Sonu Mahato</span>
        </button>
      </div>
      {/* <div className="mt-8 text-center"> // Optional: Kept Guest User if you want
        <button
          onClick={() => onSelectName('Guest User')}
          className="text-green-500 underline hover:text-green-400"
        >
          Continue as Guest
        </button>
      </div> */}
    </div>
  );
}