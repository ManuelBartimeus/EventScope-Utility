# EventScope LinkedIn Chrome Extension

A Chrome MV3 extension that automatically scrolls LinkedIn search result pages, extracts profile data, and sends it to your EventScope application.

## Features

- ✅ **Auto-scroll**: Automatically scrolls LinkedIn search results ~10 times
- ✅ **Data extraction**: Extracts profile names, descriptions, URLs, locations, and images
- ✅ **Real-time communication**: Sends extracted data to EventScope app in real-time
- ✅ **Visual feedback**: Shows progress and status in popup interface
- ✅ **Seamless integration**: Results appear automatically on EventScope /results page

## Installation

### 1. Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `chrome-extension` folder from your EventScope project
5. The extension should now appear in your extensions list

### 2. Pin the Extension

1. Click the puzzle piece icon in Chrome toolbar
2. Find "EventScope LinkedIn Scraper" and click the pin icon
3. The extension icon will now be visible in your toolbar

## Usage

### 1. Start Your EventScope Backend

Make sure your Django backend is running:

```bash
cd backend
python manage.py runserver
```

The extension expects the backend to be available at `http://localhost:8000`

### 2. Start Your EventScope Frontend

Make sure your React frontend is running:

```bash
cd frontend
npm run dev
```

The frontend should be available at `http://localhost:5173`

### 3. Use the Extension

1. **Navigate to LinkedIn**: Go to LinkedIn and perform a search (people, companies, etc.)
   - Example: `https://www.linkedin.com/search/results/people/?keywords=software%20engineer`

2. **Open Extension Popup**: Click the EventScope extension icon in your toolbar

3. **Start Scraping**: 
   - The popup will show "Ready to scrape LinkedIn results"
   - Click "Start Scraping" button
   - The extension will automatically scroll the page ~10 times
   - Progress will be shown in the popup

4. **View Results**: 
   - Open your EventScope app at `http://localhost:5173/results`
   - Extension data will automatically appear with a blue border and "Chrome Extension" badge
   - Results refresh every 5 seconds automatically

## How It Works

### Extension Architecture

1. **Content Script** (`content.js`):
   - Detects LinkedIn search result pages
   - Performs auto-scrolling with 2-second delays
   - Extracts profile data from DOM elements
   - Sends data to background script

2. **Background Script** (`background.js`):
   - Receives data from content script
   - Sends POST request to EventScope API
   - Handles communication between extension and app

3. **Popup Interface** (`popup.html/js`):
   - User-friendly interface to start scraping
   - Shows real-time progress and status
   - Provides feedback on scraping results

### Data Flow

```
LinkedIn Page → Content Script → Background Script → Django API → React Frontend
```

1. User performs LinkedIn search
2. Extension content script detects the page
3. User clicks "Start Scraping" in popup
4. Content script auto-scrolls and extracts data
5. Background script sends data to Django backend (`/api/events/results/`)
6. React frontend polls backend and displays results (`/api/events/results/get/`)

## API Endpoints

The extension integrates with these EventScope API endpoints:

- `POST /api/events/results/` - Receive scraped data from extension
- `GET /api/events/results/get/` - Retrieve extension data for frontend

## Extracted Data Fields

For each LinkedIn profile found, the extension extracts:

- **Name**: Profile name/title
- **Subtitle**: Job title or company
- **Location**: Geographic location
- **Profile URL**: LinkedIn profile link
- **Image URL**: Profile picture
- **Description**: Additional profile information
- **Timestamp**: When the data was extracted

## Troubleshooting

### Extension Not Working

1. **Check Extension Installation**:
   - Go to `chrome://extensions/`
   - Ensure "EventScope LinkedIn Scraper" is enabled
   - Check for any error messages

2. **Check Console Logs**:
   - Open Developer Tools (F12) on LinkedIn page
   - Look for extension-related logs in Console tab

3. **Verify Backend Connection**:
   - Ensure Django backend is running on port 8000
   - Check Django server logs for incoming requests

### No Results Appearing

1. **Check API Connection**:
   - Open browser network tab during scraping
   - Verify POST request to `/api/events/results/` succeeds

2. **Check Frontend Polling**:
   - Open EventScope frontend
   - Check network tab for GET requests to `/api/events/results/get/`
   - Verify 200 responses with data

3. **Clear Browser Data**:
   - Clear browser cache and cookies
   - Restart Django server
   - Reload extension

### LinkedIn Page Changes

If LinkedIn updates their page structure, the extension selectors may need updates:

1. Open `content.js`
2. Update the CSS selectors in `extractSingleResult()` method
3. Test on current LinkedIn search results pages
4. Reload the extension

## Development

### Modifying the Extension

1. Make changes to extension files
2. Go to `chrome://extensions/`
3. Click the refresh icon on the EventScope extension
4. Test changes on LinkedIn

### Adding New Data Fields

1. Update `extractSingleResult()` in `content.js`
2. Add new CSS selectors for additional LinkedIn elements
3. Update Django API to handle new fields
4. Update React frontend to display new data

### Debugging

- **Content Script**: Check browser console on LinkedIn pages
- **Background Script**: Go to `chrome://extensions/` → "Inspect views: background page"
- **Popup**: Right-click extension popup → "Inspect"

## Security Notes

- Extension only runs on LinkedIn domains
- Requires explicit host permissions for LinkedIn
- Uses Chrome's secure messaging system
- No sensitive data stored in extension

## Browser Compatibility

- **Chrome**: Fully supported (MV3)
- **Edge**: Should work (MV3 compatible)
- **Firefox**: Not compatible (uses MV2)

## License

This extension is part of the EventScope project and follows the same licensing terms.