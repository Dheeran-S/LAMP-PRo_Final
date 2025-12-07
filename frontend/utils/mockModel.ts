import { PredictionResult, ClassLabel, VALID_AMINO_ACIDS } from '../types';
const API_URL = 'http://localhost:8000/analyze';
const generateId = () => Math.random().toString(36).substr(2, 9);



export const analyzeSequence = async (sequence: string): Promise<PredictionResult> => {
  const start = Date.now();
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sequence }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    return {
      id: generateId(),
      sequence,
      label: data.label as ClassLabel,
      scores: {
        dna: data.dna_score,
        rna: data.rna_score,
        neither: data.neither_score,
      },
      timestamp: Date.now(),
      processingTimeMs: Date.now() - start,
    };
  } catch (error) {
    console.error('Error calling analysis API:', error);
    throw error;
  }
};

export const validateSequence = (seq: string): boolean => {
  if (!seq) return false;
  const upper = seq.toUpperCase();
  for (let i = 0; i < upper.length; i++) {
    if (!VALID_AMINO_ACIDS.has(upper[i])) {
      return false;
    }
  }
  return true;
};

export const cleanSequence = (seq: string): string => {
    return seq.toUpperCase().replace(/[^A-Z]/g, '');
}
