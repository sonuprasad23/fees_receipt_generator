import React, { useState } from 'react';
import { WelcomePage } from './components/WelcomePage';
import { FeeStructureForm } from './components/FeeStructureForm';
import { Header } from './components/Header';
import { Footer } from './components/Footer';

export function App() {
  const [userName, setUserName] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-black text-white selection:bg-green-500 selection:text-black">
      {/* Header and Footer components already have 'print:hidden' */}
      <Header />
      {/* The main content area will be controlled by FeeStructureForm for printing */}
      <main className="flex-1 w-full py-6 print:py-0 print:bg-white"> {/* Ensures main background is white for print if something unexpected prints */}
        {!userName ? (
          <WelcomePage onSelectName={setUserName} />
        ) : (
          <FeeStructureForm userName={userName} />
        )}
      </main>
      <Footer />
    </div>
  );
}