import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Play, Download, AlertCircle, RefreshCw, Copy, Check, Activity } from 'lucide-react';
import { analyzeSequence, validateSequence, cleanSequence } from '../utils/mockModel';
import { PredictionResult } from '../types';

export const SingleSequence: React.FC = () => {
  const [sequence, setSequence] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    const cleaned = cleanSequence(sequence);
    if (!cleaned) {
      setError('Please enter a protein sequence.');
      return;
    }
    if (!validateSequence(cleaned)) {
      setError('Invalid characters detected. Use only standard amino acids (A-Z).');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    setResult(null);

    try {
      const res = await analyzeSequence(cleaned);
      setResult(res);
    } catch (e) {
      setError('An unexpected error occurred during analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  const downloadJSON = () => {
    if (!result) return;
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `analysis_${result.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const copyToClipboard = () => {
    if(!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const chartData = result ? [
    { name: 'DNA', score: result.scores.dna * 100 },
    { name: 'RNA', score: result.scores.rna * 100 },
    { name: 'Neither', score: result.scores.neither * 100 },
  ] : [];

  const getBarColor = (entry: any) => {
      if (entry.name === 'DNA') return '#0ea5e9'; // science-500
      if (entry.name === 'RNA') return '#8b5cf6'; // violet-500
      return '#94a3b8'; // slate-400
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Single Sequence Analysis</h2>
        <p className="text-slate-600 mt-1">Enter a raw amino acid sequence to predict its binding affinity.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Enter Protein Sequence (FASTA or raw)
            </label>
            <div className="relative">
              <textarea
                rows={8}
                className="block w-full rounded-lg border-slate-300 bg-slate-50 shadow-sm focus:border-science-500 focus:ring-science-500 font-mono text-sm p-4 resize-none"
                placeholder="MKTIIALSYIFCLVFADYKDDDD..."
                value={sequence}
                onChange={(e) => {
                    setSequence(e.target.value);
                    setError(null);
                }}
              />
              <div className="absolute bottom-3 right-3 text-xs text-slate-400">
                Length: {cleanSequence(sequence).length}
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm rounded-md flex items-start">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mt-6">
              <button
                onClick={handleAnalyze}
                disabled={isLoading || sequence.length === 0}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-science-600 hover:bg-science-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-science-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Analyzing Sequence...
                  </>
                ) : (
                  <>
                    <Play className="-ml-1 mr-2 h-4 w-4 fill-current" />
                    Run Analysis
                  </>
                )}
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-500 text-center">
              Valid characters: A-Z. Non-standard characters will be filtered automatically.
            </p>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          {result ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fade-in">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                 <h3 className="text-lg font-medium text-slate-900">Analysis Results</h3>
                 <span className="text-xs font-mono text-slate-400">ID: {result.id}</span>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="text-sm text-slate-500 uppercase tracking-wider font-semibold">Predicted Class</span>
                    <div className="mt-1 flex items-center">
                        <span className={`text-4xl font-bold 
                            ${result.label === 'DNA' ? 'text-science-600' : 
                              result.label === 'RNA' ? 'text-violet-600' : 
                              result.label === 'DRBP' ? 'text-fuchsia-600' : 'text-slate-600'}`}>
                            {result.label}
                        </span>
                        {result.label === 'DRBP' && <span className="ml-3 px-2 py-1 bg-fuchsia-100 text-fuchsia-700 text-xs rounded-full font-bold">Dual Binding</span>}
                    </div>
                  </div>
                  <div className="text-right">
                     <span className="text-sm text-slate-500 block">Time</span>
                     <span className="text-lg font-mono text-slate-700">{result.processingTimeMs}ms</span>
                  </div>
                </div>

                <div className="h-64 w-full mb-6">
                    <p className="text-sm font-medium text-slate-700 mb-4">Confidence Scores</p>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" domain={[0, 100]} hide />
                      <YAxis dataKey="name" type="category" tick={{fontSize: 12, fill: '#64748b'}} width={50} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}} 
                        contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                      />
                      <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={32}>
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={getBarColor(entry)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex gap-3 pt-4 border-t border-slate-100">
                  <button 
                    onClick={downloadJSON}
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50"
                  >
                    <Download className="mr-2 h-4 w-4 text-slate-500" />
                    Download JSON
                  </button>
                  <button 
                    onClick={copyToClipboard}
                    className="inline-flex items-center justify-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 w-12"
                    title="Copy JSON"
                  >
                    {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4 text-slate-500" />}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[400px] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center p-8">
               {isLoading ? (
                   <div className="space-y-4">
                       <div className="w-16 h-16 border-4 border-science-200 border-t-science-600 rounded-full animate-spin mx-auto"></div>
                       <p className="text-slate-500 font-medium">Running ESM2 Embedding & Classification...</p>
                   </div>
               ) : (
                   <div className="space-y-2 max-w-xs">
                       <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400 mb-2">
                         <Activity className="h-6 w-6" />
                       </div>
                       <h4 className="text-slate-900 font-medium">No Results Yet</h4>
                       <p className="text-slate-500 text-sm">Run an analysis to see the predicted binding class and confidence scores here.</p>
                   </div>
               )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};