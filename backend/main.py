from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import fitz  # PyMuPDF
import img2pdf
import zipfile
import os
import shutil
import uuid

app = FastAPI()

# Allow your React app to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "PDF to PNG Converter API is running", "status": "healthy"}

TEMP_DIR = "temp_files"
os.makedirs(TEMP_DIR, exist_ok=True)

def cleanup(path: str):
    if os.path.exists(path):
        if os.path.isdir(path):
            shutil.rmtree(path)
        else:
            os.remove(path)

@app.post("/pdf-to-jpg")
async def pdf_to_jpg(background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    job_id = str(uuid.uuid4())
    job_dir = os.path.join(TEMP_DIR, job_id)
    os.makedirs(job_dir)
    
    pdf_path = os.path.join(job_dir, file.filename)
    with open(pdf_path, "wb") as f:
        f.write(await file.read())
        
    doc = fitz.open(pdf_path)
    zip_path = os.path.join(TEMP_DIR, f"{job_id}.zip")
    
    with zipfile.ZipFile(zip_path, 'w') as zipf:
        for i in range(len(doc)):
            page = doc.load_page(i)
            pix = page.get_pixmap(matrix=fitz.Matrix(2, 2)) # High Quality
            img_name = f"page_{i+1}.jpg"
            img_path = os.path.join(job_dir, img_name)
            pix.save(img_path)
            zipf.write(img_path, img_name)
            
    doc.close()
    background_tasks.add_task(cleanup, job_dir)
    background_tasks.add_task(cleanup, zip_path)
    
    return FileResponse(zip_path, media_type="application/zip", filename="converted_images.zip")

@app.post("/jpg-to-pdf")
async def jpg_to_pdf(background_tasks: BackgroundTasks, files: list[UploadFile] = File(...)):
    job_id = str(uuid.uuid4())
    pdf_path = os.path.join(TEMP_DIR, f"{job_id}.pdf")
    
    # Sort files by name to maintain order
    image_data = [await f.read() for f in files]
    
    with open(pdf_path, "wb") as f:
        f.write(img2pdf.convert(image_data))
        
    background_tasks.add_task(cleanup, pdf_path)
    return FileResponse(pdf_path, media_type="application/pdf", filename="merged_document.pdf")

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)