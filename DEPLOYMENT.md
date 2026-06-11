# 🚀 Deployment Guide - PDF to PNG Converter

This guide will help you deploy your application to Render.

## Prerequisites
- GitHub account (already set up ✓)
- Render account (free) - https://render.com

---

## Step 1: Deploy Backend (FastAPI) to Render

### 1.1 Create a Render Account
- Go to https://render.com
- Sign up with GitHub (recommended for auto-deploy)

### 1.2 Create a New Web Service for Backend
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository (`pdftopng`)
3. Fill in the configuration:
   - **Name**: `pdftopng-backend`
   - **Environment/Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT backend.main:app`
   - **Instance Type**: Select **"Free"** (no credit card required)
   - **Branch**: `master`
4. Click **"Create Web Service"**

### 1.3 Wait for Deployment
- Render will auto-deploy from GitHub
- Wait for the green "Live" status
- Copy your backend URL (e.g., `https://pdftopng-backend.onrender.com`)

---

## Step 2: Deploy Frontend (React/Vite) to Render

### 2.1 Create a New Static Site
1. Click **"New +"** → **"Static Site"**
2. Connect your GitHub repository (`pdftopng`)
3. Fill in the configuration:
   - **Name**: `pdftopng-frontend`
   - **Build Command**: `cd vite-project && npm install && npm run build`
   - **Publish Directory**: `vite-project/dist`
   - **Branch**: `master`
4. Click **"Create Static Site"**

### 2.2 Add Environment Variables
1. Go to your frontend service settings
2. Add Environment Variable:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://pdftopng-backend.onrender.com` (use your backend URL)
3. Trigger a new deploy (manual redeploy in settings)

### 2.3 Wait for Deployment
- Render will build and deploy automatically
- Get your frontend URL (e.g., `https://pdftopng-frontend.onrender.com`)

---

## Step 3: Update Frontend Code

Update your `App.jsx` to use environment variable:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
```

This is likely already set correctly.

---

## Step 4: Install Gunicorn for Production

The backend needs `gunicorn` for production serving:

```bash
cd backend
pip install gunicorn
pip freeze > requirements.txt
```

Or add this to `backend/requirements.txt`:
```
gunicorn==21.2.0
```

---

## 📋 Important Notes

### Auto-Deploy
- Both services will automatically redeploy when you push to GitHub's `master` branch
- No manual deployment needed after initial setup

### Cold Starts
- Free tier services on Render may take 30-60 seconds to respond after inactivity
- This is normal and will warm up after the first request

### File Storage Warning
- Temporary files (`temp_files/`) are stored on the server disk
- After 15 minutes of inactivity, the service resets and files are deleted
- For production, implement cloud storage (AWS S3, etc.)

### API Limits
- Free tier has reasonable limits but avoid creating large batches
- Rate limiting may apply during peak hours

---

## ✅ Verification

Once deployed, test these URLs:

1. **Backend Health Check**:
   ```
   https://your-backend-url.onrender.com/
   ```
   Should return: `{"message": "PDF to PNG Converter API is running", "status": "healthy"}`

2. **Frontend**:
   ```
   https://your-frontend-url.onrender.com/
   ```
   Should show your landing page with animations

---

## 🔧 Troubleshooting

### Backend not connecting
- Check that `VITE_API_URL` environment variable is set correctly in frontend
- Verify backend URL in browser console errors

### Build failing
- Check build logs in Render dashboard
- Ensure all dependencies in `requirements.txt`
- Check `package.json` in vite-project

### Slow performance
- Free tier may have limited resources
- Consider upgrading to paid tier for better performance

---

## 📱 Custom Domain (Optional)

To use a custom domain:
1. Go to service settings
2. Add **Custom Domain**
3. Update DNS records at your domain registrar

---

## 🎉 You're Live!

Your application is now publicly accessible on the internet!

Share your URLs:
- **Frontend**: `https://your-frontend-url.onrender.com`
- **Backend API**: `https://your-backend-url.onrender.com`
