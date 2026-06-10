# 🚂 Railway Deployment Guide - FastAPI Backend

Complete step-by-step guide to deploy your PDF to PNG Converter backend on Railway.

## Prerequisites
- GitHub account (already set up ✓)
- Railway account (free) - https://railway.app

---

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Click **"Start Project"**
3. Sign up with GitHub (recommended for auto-deploy)
4. Authorize Railway to access your repositories

---

## Step 2: Create New Project on Railway

### 2.1 Start a New Project
1. Click **"Create New Project"**
2. Select **"Deploy from GitHub repo"**
3. Select your `pdftopng` repository
4. Click **"Deploy Now"**

### 2.2 Railway Auto-Detection
- Railway will automatically detect it's a Python project
- It will use `requirements.txt` to install dependencies
- It will try to detect the start command

---

## Step 3: Configure Railway Settings

### 3.1 Set Environment Variables
1. Go to your Railway project dashboard
2. Click on the **"pdftopng"** service
3. Go to **"Variables"** tab
4. Click **"New Variable"** and add:
   - **Key**: `PORT`
   - **Value**: `8000`

### 3.2 Set Start Command
1. Go to **"Settings"** tab
2. Look for **"Start Command"**
3. Set it to:
   ```
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT main:app
   ```

### 3.3 Configure Root Directory (if needed)
1. If your `main.py` is in a subdirectory (`/backend`), you may need to set:
   - **Root Directory**: `backend`

---

## Step 4: Install Required Dependencies

Make sure your `backend/requirements.txt` includes:

```txt
fastapi==0.104.1
uvicorn==0.24.0
python-multipart==0.0.6
pymupdf==1.23.8
img2pdf==1.4.1
gunicorn==21.2.0
```

If you need to update it:
```bash
cd backend
pip install gunicorn
pip freeze > requirements.txt
git add requirements.txt
git commit -m "Add gunicorn for production"
git push origin master
```

---

## Step 5: Monitor Deployment

1. Go to **"Deployments"** tab in Railway
2. Watch the build logs
3. When status is **"Success"** (green checkmark), your backend is live! ✅

### View Logs
- Click **"View Logs"** to debug any issues
- Railway shows real-time build and runtime logs

---

## Step 6: Get Your Backend URL

1. Go to **"Settings"** tab
2. Look for **"Public URL"** or **"Domain"**
3. Copy your backend URL (e.g., `https://your-app-pdftopng-production.up.railway.app`)
4. This is what you'll use as `VITE_API_URL` in your frontend

---

## Step 7: Test Your Endpoint

Test your API is working:

```bash
# Health check
curl https://your-backend-url/

# Expected response:
# {"message": "PDF to PNG Converter API is running", "status": "healthy"}
```

Or open in browser:
```
https://your-backend-url/docs
```

You'll see the Swagger UI documentation!

---

## Step 8: Auto-Deployment Setup

### Enable Auto-Redeploy from GitHub
1. Go to **"Deployments"** tab
2. Look for **"GitHub Webhooks"** 
3. Railway automatically sets this up when you deploy from GitHub
4. Any push to `master` branch will auto-deploy

---

## 📋 Environment Variables Reference

| Variable | Value | Purpose |
|----------|-------|---------|
| `PORT` | `8000` | Server port (required by Railway) |
| `PYTHONUNBUFFERED` | `1` | Show Python output in logs (optional) |

---

## 🔧 Troubleshooting

### "Build Failed" Error
- Check logs: **"View Logs"** → **"Build"** tab
- Common issues:
  - Missing dependencies in `requirements.txt`
  - Wrong `main.py` location
  - Python version mismatch

### "Port 8000 is already in use"
- Railway handles this automatically
- Should never be an issue

### "Cannot find module 'fitz'"
- Add `pymupdf` to `requirements.txt`
- Run: `pip install -r backend/requirements.txt` locally first to test

### Deployment takes too long
- First deployment can take 3-5 minutes (normal)
- Railway is building dependencies from scratch
- Subsequent deployments are faster

### API returning 502/503 errors
- Check if the service is running: **"Settings"** → **"Service status"**
- Restart the service if needed
- Check logs for errors

---

## 💡 Tips & Best Practices

### 1. Monitor Memory Usage
- Go to **"Metrics"** tab
- Watch memory and CPU usage
- Free tier has 512MB RAM (usually plenty for your app)

### 2. View Real-time Logs
- Click **"View Logs"** to see requests/errors in real-time
- Useful for debugging issues

### 3. Enable Auto-Deploy
- Railway does this by default for GitHub repos
- Never manually deploy - just push to GitHub

### 4. Use Temporary File Storage
- Your app creates `temp_files/` directory
- This is fine for free tier, but files persist only until reload
- For production: migrate to cloud storage (AWS S3, Google Cloud Storage)

### 5. Database Connection
- If you add a database later, Railway can provision PostgreSQL/MongoDB
- Super easy integration!

---

## 🚀 Deployment Checklist

- [ ] GitHub repo has all code pushed
- [ ] `backend/requirements.txt` includes all dependencies
- [ ] `requirements.txt` includes `gunicorn`
- [ ] `main.py` is in `backend/` directory
- [ ] Start command is set in Railway settings
- [ ] Environment variables are configured
- [ ] Build succeeds (green checkmark)
- [ ] Health check endpoint responds
- [ ] Backend URL is noted (for frontend)

---

## ✅ Your Backend is Live!

Once deployed successfully:
- **Backend URL**: `https://your-app-pdftopng-production.up.railway.app`
- **API Docs**: `https://your-app-pdftopng-production.up.railway.app/docs`
- **Health Check**: `https://your-app-pdftopng-production.up.railway.app/`

---

## 📱 Next Steps

1. **Connect Frontend to Backend**
   - Update `VITE_API_URL` in your frontend deployment with this backend URL
   
2. **Test Full Integration**
   - Upload a PDF and verify it converts
   - Check error handling

3. **Monitor Performance**
   - Use Railway **"Metrics"** to track performance
   - Set up alerts if needed

4. **Scale if Needed**
   - If you outgrow free tier, upgrade to paid plan
   - Railway scales automatically!

---

## ❓ Need Help?

- Railway Docs: https://docs.railway.app
- FastAPI Docs: https://fastapi.tiangolo.com
- GitHub Issues: Check your repo issues for common problems

**You're all set! 🎉 Your backend is live on Railway!**
