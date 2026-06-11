from fastapi import FastAPI, UploadFile, File, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, StreamingResponse
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

def get_file_and_cleanup(file_path: str, dir_path: str = None):
    try:
        with open(file_path, mode="rb") as f:
            yield from f
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)
        if dir_path and os.path.exists(dir_path):
            shutil.rmtree(dir_path)

@app.post("/pdf-to-jpg")
async def pdf_to_jpg(file: UploadFile = File(...)):
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
    
    headers = {
        "Content-Disposition": "attachment; filename=converted_images.zip",
        "Content-Length": str(os.path.getsize(zip_path))
    }
    return StreamingResponse(
        get_file_and_cleanup(zip_path, job_dir),
        media_type="application/zip",
        headers=headers
    )

@app.post("/jpg-to-pdf")
async def jpg_to_pdf(files: list[UploadFile] = File(...)):
    job_id = str(uuid.uuid4())
    pdf_path = os.path.join(TEMP_DIR, f"{job_id}.pdf")
    
    # Sort files by name to maintain order
    image_data = [await f.read() for f in files]
    
    with open(pdf_path, "wb") as f:
        f.write(img2pdf.convert(image_data))
        
    headers = {
        "Content-Disposition": "attachment; filename=merged_document.pdf",
        "Content-Length": str(os.path.getsize(pdf_path))
    }
    return StreamingResponse(
        get_file_and_cleanup(pdf_path),
        media_type="application/pdf",
        headers=headers
    )

if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)