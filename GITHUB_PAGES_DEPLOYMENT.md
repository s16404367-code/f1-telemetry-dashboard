# F1 Telemetry Dashboard - GitHub Pages Deployment Guide

## Complete Step-by-Step Instructions for Non-Technical Users

This guide will walk you through deploying the F1 Telemetry Dashboard to GitHub Pages in simple steps.

---

## STEP 1: Create a GitHub Account

1. Go to https://github.com/signup
2. Enter your email, create a password, and choose a username
3. Verify your email
4. You now have a GitHub account

---

## STEP 2: Create a New Repository

1. Go to https://github.com/new
2. Fill in the form:
   - **Repository name:** `f1-telemetry-dashboard`
   - **Description:** `Professional Formula 1 Telemetry Dashboard`
   - **Public** (select this option)
   - Leave other options as default
3. Click "Create repository"
4. You'll see a page with instructions - **copy the URL** (looks like `https://github.com/YOUR-USERNAME/f1-telemetry-dashboard.git`)

---

## STEP 3: Upload Project Files

### Option A: Using Git (Recommended for developers)

```bash
cd /home/ubuntu/f1-dashboard

# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: F1 Telemetry Dashboard"

# Add remote repository (replace with your URL from Step 2)
git remote add origin https://github.com/YOUR-USERNAME/f1-telemetry-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Option B: Using GitHub Web Interface (Easier)

1. Go to your repository page
2. Click "Add file" → "Upload files"
3. Drag and drop the entire `f1-dashboard` folder contents
4. Scroll down and click "Commit changes"

---

## STEP 4: Enable GitHub Pages

1. Go to your repository: `https://github.com/YOUR-USERNAME/f1-telemetry-dashboard`
2. Click **Settings** (top right)
3. In the left sidebar, click **Pages**
4. Under "Source", select:
   - **Branch:** `main`
   - **Folder:** `/ (root)`
5. Click **Save**

**Important:** GitHub will now build your site. Wait 1-2 minutes.

---

## STEP 5: Access Your Live Dashboard

After 1-2 minutes, your dashboard will be live at:

```
https://YOUR-USERNAME.github.io/f1-telemetry-dashboard/
```

Replace `YOUR-USERNAME` with your actual GitHub username.

---

## STEP 6: Verify It's Working

1. Open the URL from Step 5
2. You should see:
   - F1 Telemetry Dashboard header
   - "Select a session to begin" message
   - Mode selector (Live / Historical)
3. Click "Load 2026 Season" button
4. Select a meeting and session
5. You should see the track map and timing tower

---

## Troubleshooting

### "404 Page Not Found"

**Problem:** The page doesn't load
**Solution:**
1. Wait another 2-3 minutes (GitHub Pages can take time to deploy)
2. Clear your browser cache (Ctrl+Shift+Delete)
3. Try a different browser
4. Check that your repository is set to **Public** (Settings → General)

### "Select a session to begin" but nothing happens

**Problem:** Can't load meetings
**Solution:**
1. Check your internet connection
2. The OpenF1 API might be temporarily down - try again in a few minutes
3. Open browser DevTools (F12) and check the Console tab for errors

### "Build failed" or "Deployment error"

**Problem:** GitHub Pages shows an error
**Solution:**
1. Go to Settings → Pages
2. Check that "Source" is set to `main` branch and `/ (root)` folder
3. Wait 5 minutes and refresh
4. If still failing, try uploading files again

---

## Updating Your Dashboard

When you make changes locally:

### Using Git:
```bash
cd /home/ubuntu/f1-dashboard
git add .
git commit -m "Update: your changes here"
git push origin main
```

### Using GitHub Web Interface:
1. Go to your repository
2. Click "Add file" → "Upload files"
3. Select the files you changed
4. Click "Commit changes"

GitHub Pages will automatically rebuild (wait 1-2 minutes).

---

## Custom Domain (Optional)

If you want a custom domain like `f1-dashboard.com`:

1. Buy a domain from a registrar (GoDaddy, Namecheap, etc.)
2. In your repository Settings → Pages
3. Under "Custom domain", enter your domain
4. Follow the DNS configuration instructions provided

---

## Features Explained

### Live Mode
- Shows real-time F1 data from OpenF1 API
- Updates every second
- Shows current driver positions, gaps, tyres, pit stops
- Click any driver to see detailed telemetry

### Historical Mode
- Replay past F1 sessions
- Scrub through the timeline
- Play/pause and speed controls (0.25x to 4x)
- See where every driver was at any moment

### Track Map
- Visual representation of the circuit
- Colored dots show driver positions
- Team colors match official F1 teams
- Click drivers to focus on them

### Timing Tower
- FIA-style standings display
- Shows gaps to leader
- Displays tyre information
- Sorted by current position

### Driver Panel
- Detailed telemetry for selected driver
- Current, best, and last lap times
- Real-time speed, throttle, brake, gear, RPM
- Tyre compound and age
- Pit stop information

---

## Data Source

All data comes from the **free OpenF1 API**:
- https://openf1.org/
- No API key required
- No subscription needed
- Real historical data from 2025-2026 seasons

---

## Common Questions

**Q: Will this work forever?**
A: Yes, as long as GitHub Pages is available (free service) and OpenF1 API is online.

**Q: Can I modify the code?**
A: Yes! The code is in the `src/` folder. Edit and push changes to update your dashboard.

**Q: Can I add more features?**
A: Yes! The architecture is modular and extensible. See the code comments for guidance.

**Q: Is my data private?**
A: Yes. Your repository can be private, and all data comes from public APIs.

**Q: Can I use a different hosting service?**
A: Yes! The `dist/` folder can be deployed to:
- Vercel
- Netlify
- AWS S3
- Azure Static Web Apps
- Any static hosting service

---

## Support

If you encounter issues:

1. **Check the browser console:** Press F12, go to Console tab, look for red errors
2. **Verify internet connection:** Try accessing https://api.openf1.org/v1/meetings
3. **Check GitHub Pages status:** Go to your repository Settings → Pages
4. **Wait for deployment:** GitHub Pages can take 1-5 minutes to deploy changes

---

## Next Steps

1. ✅ Deploy to GitHub Pages (this guide)
2. Share your dashboard with friends
3. Customize colors and styling in `src/index.css`
4. Add more features from the OpenF1 API
5. Set up a custom domain

---

**Your F1 Telemetry Dashboard is now live! 🏁**

Enjoy real-time Formula 1 telemetry at your fingertips!
