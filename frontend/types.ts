export type ClassLabel = 'DNA' | 'RNA' | 'DRBP' | 'Neither';

export interface PredictionResult {
  id: string;
  sequence: string;
  label: ClassLabel;
  scores: {
    dna: number;
    rna: number;
    neither: number;
  };
  timestamp: number;
  processingTimeMs: number;
}

export interface CsvRow {
  sequence: string;
  id?: string;
}

export type AppView = 'HOME' | 'SINGLE' | 'BATCH';

export const VALID_AMINO_ACIDS = new Set([
  'A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 
  'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'Y'
]);
