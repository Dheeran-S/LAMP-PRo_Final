import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random
from typing import Dict
import uvicorn
from gradio_client import Client

app = FastAPI()



# Initialize the Hugging Face Gradio client once
# print("Initializing Hugging Face Gradio client...")
client = Client("Dheeran-S/LAMP-PRo")


# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SequenceRequest(BaseModel):
    sequence: str

@app.post("/analyze")
async def analyze_sequence(request: SequenceRequest):
    try:
        # print("Predict being called")
        # Call your Gradio Space API
        result = client.predict(
            sequence=request.sequence,
            api_name="/predict"
        )

        label = result["predicted_class"]

        dna_score = result["probabilities"]["DBP"]
        rna_score = result["probabilities"]["RBP"]
        neither_score = result["probabilities"]["Neither"]
        
        # print("returning values")
        return {
            "label": label,
            "dna_score": dna_score,
            "rna_score": rna_score,
            "neither_score": neither_score
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)