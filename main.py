from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()

# Allow CORS for the frontend server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/ingredients")
def read_ingredients():
    try:
        # Adjust the path to your CSV file
        file_path = 'C:\\Users\\Rutuja Jagtap\\Documents\\HEXIS_LAB_INT\\FormulationApp\\Database\\ingredients.csv'
        
        # Check if the file exists
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")
        
        # Read the CSV file
        df = pd.read_csv(file_path)
        
        # Check if the DataFrame is empty
        if df.empty:
            raise ValueError("The CSV file is empty.")
        
        # Log the number of rows read
        print(f"Number of rows read from CSV: {len(df)}")
        
        return df.to_dict(orient='records')
    except FileNotFoundError as fnf_error:
        raise HTTPException(status_code=404, detail=str(fnf_error))
    except ValueError as val_error:
        raise HTTPException(status_code=400, detail=str(val_error))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
