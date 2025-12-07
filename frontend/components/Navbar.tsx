import React from 'react';
import { Home, FileText, Github, FlaskConical } from 'lucide-react';
import { AppView } from '../types';

interface NavbarProps {
  currentView: AppView;
  onNavigate: (view: AppView) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const navLinkClass = (view: AppView) => 
    `cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      currentView === view 
        ? 'bg-science-100 text-science-700' 
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('HOME')}>
            <div className="flex-shrink-0 flex items-center text-science-600">
              <FlaskConical className="h-8 w-8 mr-2" />
              <span className="font-bold text-xl tracking-tight text-slate-900">LAMP-PRo</span>
            </div>
          </div>
          
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            <button onClick={() => onNavigate('HOME')} className={navLinkClass('HOME')}>
              Home
            </button>
            <button onClick={() => onNavigate('SINGLE')} className={navLinkClass('SINGLE')}>
              Single Sequence
            </button>
            <button onClick={() => onNavigate('BATCH')} className={navLinkClass('BATCH')}>
              Batch Upload
            </button>
            
            <div className="h-6 w-px bg-slate-300 mx-2"></div>

            <a href="https://arxiv.org/abs/2509.24262" className="text-slate-500 hover:text-science-600 flex items-center gap-1 text-sm font-medium px-3 py-2">
              <FileText className="h-4 w-4" />
              <span>Paper</span>
            </a>
            <a href="https://github.com/NimishaGhosh/LAMP-PRo" className="text-slate-500 hover:text-slate-900 px-3 py-2">
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};