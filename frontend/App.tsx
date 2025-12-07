import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { SingleSequence } from './pages/SingleSequence';
import { BatchUpload } from './pages/BatchUpload';
import { AppView } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('HOME');

  const renderView = () => {
    switch (currentView) {
      case 'HOME':
        return <Home onNavigate={setCurrentView} />;
      case 'SINGLE':
        return <SingleSequence />;
      case 'BATCH':
        return <BatchUpload />;
      default:
        return <Home onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <Navbar currentView={currentView} onNavigate={setCurrentView} />
      <main className="animate-fade-in">
        {renderView()}
      </main>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;