FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Copy dependency definition
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY . .

# Expose the default Hugging Face Spaces port
EXPOSE 7860

# Set the PORT environment variable
ENV PORT=7860

# Start the application using Gunicorn with 2 workers for Hugging Face's 2 vCPUs
CMD ["gunicorn", "-w", "2", "-k", "uvicorn.workers.UvicornWorker", "--bind", "0.0.0.0:7860", "backend.main:app"]
