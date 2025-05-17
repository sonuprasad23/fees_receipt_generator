import React from 'react';

export function Header() {
  return (
    <header className="w-full bg-black py-4 px-6 border-b border-green-500 print:hidden"> {/* Added print:hidden */}
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          {/* MODIFIED: Use img tag for logo */}
          <img src="/logo_bold.jpeg" alt="Hopes Academy Logo" className="w-12 h-12 object-contain mr-3" />
          <h1 className="text-2xl font-bold text-green-500">Hopes Academy</h1>
        </div>
        <div className="hidden md:block text-sm text-green-300">
          <p>Janta Market, Near Hotel Madhulika Inn, Bartand, Dhanbad-826001</p>
          <p>+91 7903066925 | newhopesacademy@gmail.com</p>
        </div>
      </div>
    </header>
  );
}