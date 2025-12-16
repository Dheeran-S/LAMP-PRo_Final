# LAMP-PRo: Protein Binding Prediction

LAMP-PRo (Leveraging ESM2 for Accurate Multi-class Protein Binding Prediction) is a web application that classifies protein sequences into DNA-binding, RNA-binding, or dual-binding (DRBP) categories using state-of-the-art ESM2 embeddings and deep learning.

## 🚀 Features

- **Single Sequence Analysis**: Analyze individual protein sequences
- **Batch Processing**: Upload CSV files for bulk sequence analysis
- **High Accuracy**: Powered by ESM2 (Evolutionary Scale Modeling) transformer
- **Modern UI**: Clean, responsive interface built with React and TailwindCSS
- **REST API**: Built with FastAPI for easy integration

## 🛠️ Tech Stack

### Frontend
- React 18 with TypeScript
- TailwindCSS for styling
- Vite for fast development and building
- Lucide React for icons

### Backend
- FastAPI (Python)
- Uvicorn ASGI server
- Hugging Face Gradio client for model inference

### AI/ML
- ESM2 (Evolutionary Scale Modeling) embeddings
- Deep learning model for sequence classification

## 📦 Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Python 3.8+

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the backend server:
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install Node.js dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
   The application will be available at `http://localhost:5173`

## 🚀 Usage

1. **Single Sequence Analysis**:
   - Enter your protein sequence in the input field
   - Click "Analyze" to get predictions
   - View the classification results and confidence scores

2. **Batch Processing**:
   - Prepare a CSV file with a column named "sequence"
   - Upload the file and wait for processing
   - Download the results with predictions
