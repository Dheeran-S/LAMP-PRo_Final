import React from 'react';
import { AppView } from '../types';
import { Dna, Upload, ArrowRight, Activity } from 'lucide-react';

interface HomeProps {
  onNavigate: (view: AppView) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full py-12">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-science-50 rounded-full mb-6">
             <span className="px-3 py-1 text-xs font-bold text-science-700 uppercase tracking-wide">v1.0.0 Release</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Precision Protein Binding Classification
          </h1>
          <p className="text-xl text-slate-600 mb-8 leading-relaxed">
            Analyze and classify protein sequences into <span className="font-semibold text-science-600">DNA</span>, <span className="font-semibold text-science-600">RNA</span>, or <span className="font-semibold text-science-600">Dual-Binding (DRBP)</span> categories using state-of-the-art ESM2 embeddings and deep learning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button 
              onClick={() => onNavigate('SINGLE')}
              className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-medium text-white bg-science-600 rounded-lg shadow-md hover:bg-science-700 transition-all duration-200 overflow-hidden"
            >
              <Dna className="mr-2 h-5 w-5" />
              Analyze Single Sequence
              <ArrowRight className="ml-2 h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </button>

            <button 
              onClick={() => onNavigate('BATCH')}
              className="inline-flex items-center justify-center px-8 py-4 text-base font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-all duration-200"
            >
              <Upload className="mr-2 h-5 w-5 text-slate-500" />
              Upload CSV (Batch)
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <FeatureCard 
            icon={<Activity className="h-6 w-6 text-science-500" />}
            title="ESM2 Powered"
            description="Leverages the evolutionary scale modeling (ESM) transformer for high-fidelity residue embeddings."
          />
          <FeatureCard 
            icon={<Dna className="h-6 w-6 text-science-500" />}
            title="Multi-Class Prediction"
            description="Accurate discrimination between DNA-binding, RNA-binding, and dual-binding proteins."
          />
          <FeatureCard 
            icon={<Upload className="h-6 w-6 text-science-500" />}
            title="High-Throughput"
            description="Process thousands of sequences efficiently via our optimized batch processing pipeline."
          />
        </div>
      </div>

      <footer className="w-full bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex justify-center items-center text-sm text-slate-500">
          <p>Powered by <span className="font-semibold text-slate-700">ESM2</span> + <span className="font-semibold text-slate-700">LAMP-PRo</span></p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({ icon, title, description }) => (
  <div className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
    <div className="h-12 w-12 bg-science-50 rounded-lg flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
    <p className="text-slate-600 leading-relaxed">{description}</p>
  </div>
);