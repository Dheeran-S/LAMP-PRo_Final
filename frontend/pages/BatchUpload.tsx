import React, { useState, useRef, useCallback } from 'react';
import { Upload, FileText, AlertCircle, CheckCircle, Download, X } from 'lucide-react';
import { analyzeSequence, cleanSequence } from '../utils/mockModel';
import { PredictionResult } from '../types';

export const BatchUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<PredictionResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = (uploadedFile: File) => {
    if (uploadedFile.type !== "text/csv" && !uploadedFile.name.endsWith('.csv')) {
        alert("Please upload a CSV file.");
        return;
    }
    setFile(uploadedFile);
    
    const reader = new FileReader();
    reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/);
        // Simple CSV parse: assume header "sequence" exists, otherwise look for first col
        const sequences: string[] = [];
        let startRow = 0;
        
        // Check header
        const header = lines[0].toLowerCase();
        if (header.includes('sequence')) {
            startRow = 1;
        }

        for (let i = startRow; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue;
            // Take first column if comma separated
            const cols = line.split(',');
            const seq = cleanSequence(cols[0]); // Assume seq is first column
            if (seq.length > 0) {
                sequences.push(seq);
            }
        }
        setParsedRows(sequences);
        setResults([]);
        setProgress(0);
    };
    reader.readAsText(uploadedFile);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) processFile(droppedFile);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const startBatchAnalysis = async () => {
    if (parsedRows.length === 0) return;
    setIsProcessing(true);
    setResults([]);
    
    const tempResults: PredictionResult[] = [];
    const total = parsedRows.length;

    // Simulate batch processing with concurrency limit = 1 for the mock visual effect
    for (let i = 0; i < total; i++) {
        // Simulate varying fast processing for batch
        await new Promise(r => setTimeout(r, 100)); 
        // We use the real analyze function but override the mock delay inside it for batch speed? 
        // No, let's just call analyzeSequence but maybe it's okay if it takes a while, 
        // shows the progress bar nicely.
        
        // To make the UI responsive and show progress, we won't wait full 2s per item in mock.
        // We will generate mock result instantly here for batch demo purposes.
        
        const r1 = Math.random();
        const r2 = Math.random();
        const r3 = Math.random();
        const sum = r1 + r2 + r3;
        const dna = r1/sum; 
        const rna = r2/sum;
        const neither = r3/sum;
        
        let label: any = 'Neither';
        if (dna > 0.35 && rna > 0.35) label = 'DRBP';
        else if (dna > rna && dna > neither) label = 'DNA';
        else if (rna > dna && rna > neither) label = 'RNA';
        
        const res: PredictionResult = {
            id: Math.random().toString(36).substr(2,9),
            sequence: parsedRows[i],
            label,
            scores: { dna, rna, neither },
            timestamp: Date.now(),
            processingTimeMs: Math.floor(Math.random() * 200) + 50
        };
        
        tempResults.push(res);
        setResults([...tempResults]);
        setProgress(Math.round(((i + 1) / total) * 100));
    }

    setIsProcessing(false);
  };

  const downloadResults = () => {
      const header = "ID,Sequence,Predicted_Class,Score_DNA,Score_RNA,Score_Neither\n";
      const rows = results.map(r => 
        `${r.id},${r.sequence},${r.label},${r.scores.dna.toFixed(4)},${r.scores.rna.toFixed(4)},${r.scores.neither.toFixed(4)}`
      ).join('\n');
      
      const blob = new Blob([header + rows], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `batch_results_${Date.now()}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
  };

  const reset = () => {
      setFile(null);
      setParsedRows([]);
      setResults([]);
      setProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Batch CSV Processing</h2>
            <p className="text-slate-600 mt-1">Upload a CSV file containing a list of protein sequences.</p>
        </div>
        {file && !isProcessing && results.length === 0 && (
             <button onClick={reset} className="text-sm text-red-600 hover:text-red-700 font-medium">Clear File</button>
        )}
      </div>

      {!file ? (
        <div 
          className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center text-center transition-colors cursor-pointer ${
            isDragging ? 'border-science-500 bg-science-50' : 'border-slate-300 hover:border-science-400 hover:bg-slate-50'
          }`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".csv" 
            onChange={handleFileSelect} 
          />
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
             <Upload className={`h-8 w-8 ${isDragging ? 'text-science-600' : 'text-slate-400'}`} />
          </div>
          <h3 className="text-lg font-medium text-slate-900">Click to upload or drag and drop</h3>
          <p className="text-slate-500 mt-2 max-w-sm">
            CSV file must contain a 'sequence' column or have raw sequences in the first column.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* File Info Card */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 flex items-center justify-between shadow-sm">
              <div className="flex items-center">
                  <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <FileText className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                      <p className="font-medium text-slate-900">{file.name}</p>
                      <p className="text-xs text-slate-500">{parsedRows.length} valid sequences detected</p>
                  </div>
              </div>
              
              {!isProcessing && results.length === 0 && (
                  <button 
                    onClick={startBatchAnalysis}
                    className="px-4 py-2 bg-science-600 text-white text-sm font-medium rounded-md hover:bg-science-700 transition-colors"
                  >
                      Start Batch Analysis
                  </button>
              )}
          </div>

          {/* Progress Bar */}
          {(isProcessing || results.length > 0) && (
              <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
                  <div className="flex justify-between text-sm font-medium text-slate-700 mb-2">
                      <span>Progress</span>
                      <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 mb-6 overflow-hidden">
                      <div 
                        className="bg-science-600 h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${progress}%` }}
                      ></div>
                  </div>
                  
                  {results.length > 0 && (
                      <div className="mt-6">
                           <div className="flex justify-between items-center mb-4">
                               <h4 className="text-base font-medium text-slate-900">Preview Results</h4>
                               {progress === 100 && (
                                   <button 
                                    onClick={downloadResults}
                                    className="flex items-center px-3 py-1.5 text-sm border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
                                   >
                                       <Download className="h-4 w-4 mr-2" />
                                       Download CSV
                                   </button>
                               )}
                           </div>
                           <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                               <table className="min-w-full divide-y divide-slate-300">
                                   <thead className="bg-slate-50">
                                       <tr>
                                           <th className="px-3 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Sequence (Preview)</th>
                                           <th className="px-3 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Predicted Class</th>
                                           <th className="px-3 py-3.5 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Confidence (D/R/N)</th>
                                       </tr>
                                   </thead>
                                   <tbody className="divide-y divide-slate-200 bg-white">
                                       {results.slice(0, 5).map((res) => (
                                           <tr key={res.id}>
                                               <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500 font-mono">
                                                   {res.sequence.length > 20 ? res.sequence.substring(0, 20) + '...' : res.sequence}
                                               </td>
                                               <td className="whitespace-nowrap px-3 py-4 text-sm font-medium text-slate-900">
                                                   <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                      ${res.label === 'DNA' ? 'bg-blue-100 text-blue-800' :
                                                        res.label === 'RNA' ? 'bg-purple-100 text-purple-800' :
                                                        res.label === 'DRBP' ? 'bg-fuchsia-100 text-fuchsia-800' :
                                                        'bg-slate-100 text-slate-800'
                                                      }`}>
                                                       {res.label}
                                                   </span>
                                               </td>
                                               <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">
                                                   {(res.scores.dna).toFixed(2)} / {(res.scores.rna).toFixed(2)} / {(res.scores.neither).toFixed(2)}
                                               </td>
                                           </tr>
                                       ))}
                                   </tbody>
                               </table>
                               {results.length > 5 && (
                                   <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 text-xs text-slate-500 text-center">
                                       ... and {results.length - 5} more rows
                                   </div>
                               )}
                           </div>
                      </div>
                  )}
              </div>
          )}
        </div>
      )}
    </div>
  );
};