# EventScope Chrome Extension - Quick Setup

## 🚀 Quick Start (5 minutes)

### 1. Install the Extension
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select: `C:\Users\manue\Documents\Builds\React\EventScope\chrome-extension\`
5. Pin the extension to your toolbar

### 2. Start Your Servers

**Backend (Terminal 1):**
```bash
cd C:\Users\manue\Documents\Builds\React\EventScope\backend
python manage.py runserver
```

**Frontend (Terminal 2):**
```bash
cd C:\Users\manue\Documents\Builds\React\EventScope\frontend
npm run dev
```

### 3. Use the Extension

1. **Go to LinkedIn**: Choose either option:
   - **Search Results**: `https://www.linkedin.com/search/results/people/?keywords=software%20engineer`
   - **Feed Page**: `https://www.linkedin.com/feed/` (your LinkedIn home feed)

2. **Click Extension Icon**: Look for "🔍 EventScope" in your Chrome toolbar

3. **Click "Start Scraping"**: Extension will auto-scroll ~10 times and extract:
   - **Search Results**: Profile names, titles, locations, URLs
   - **Feed Posts**: Post content, authors, likes, comments, reposts

4. **Automatic Results**: After scraping completes
   - Results page opens automatically in new tab
   - Extension data appears with blue borders and special badges
   - Feed posts show engagement metrics (likes, comments)
   - No loading time - results show immediately

## 🎯 What It Does

✅ **Auto-scrolls** LinkedIn pages 10 times (2-second delays)  
✅ **Extracts search results**: profile names, titles, locations, URLs, images  
✅ **Extracts feed posts**: post content, authors, likes, comments, reposts  
✅ **Sends data** to your Django backend in real-time  
✅ **Auto-redirects** to results page when scraping completes  
✅ **Displays results** immediately with engagement metrics  

## 🔧 Troubleshooting

**Extension not working?**
- Check `chrome://extensions/` - ensure it's enabled
- Refresh the extension after any code changes

**No results showing?**
- Ensure both servers are running (ports 8000 & 5173)
- Check browser console for errors
- Try refreshing the /results page

**LinkedIn changes?**
- Update CSS selectors in `content.js` if LinkedIn updates their DOM structure

## 📋 File Structure Created

```
chrome-extension/
├── manifest.json        # Extension configuration
├── background.js        # Service worker (API communication)
├── content.js          # LinkedIn page interaction & scrolling
├── popup.html          # Extension popup UI
├── popup.js            # Popup functionality
├── icons/              # Extension icons (create your own)
└── README.md           # Detailed documentation
```

## 🌐 API Endpoints Added

- `POST /api/events/results/` - Receives extension data
- `GET /api/events/results/get/` - Frontend retrieves extension data

Your EventScope app now has a powerful LinkedIn scraping extension! 🎉