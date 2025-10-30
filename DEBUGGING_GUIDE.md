# EventScope Extension Debugging Guide

## 🚨 Issue: Extension Extracting 0 Results

If your extension shows "Received 0 results" but still redirects to the results page, follow this debugging process:

### 1. Check Extension Installation
1. Go to `chrome://extensions/`
2. Ensure "EventScope LinkedIn Scraper" is **enabled**
3. Click the **refresh icon** to reload the extension after any changes

### 2. Open Browser Developer Tools
1. Go to your LinkedIn page (feed or search results)
2. Press **F12** to open Developer Tools
3. Go to the **Console** tab
4. Click the extension and start scraping
5. Watch for detailed logs starting with "=== Starting LinkedIn..."

### 3. What to Look For in Console

**Good Signs:**
```
=== Starting LinkedIn Feed Post Extraction ===
✅ Found 5 feed posts using selector: div.feed-shared-update-v2
✅ Extracted post 1: {author: "John Doe", description: "Great insights..."}
```

**Problem Signs:**
```
Main selector found: 0 elements
❌ No search results found with any selector
```

### 4. Debug LinkedIn Page Structure

If extraction fails, inspect the page DOM:

1. **Right-click on a LinkedIn post** → "Inspect Element"
2. Look for these key attributes in the HTML:
   - `data-urn="urn:li:activity:..."`
   - `class="feed-shared-update-v2"`
   - `role="article"`

3. **Copy the actual class names** you see and update the extension

### 5. Test Different LinkedIn Pages

Try the extension on:
- ✅ LinkedIn Feed: `https://www.linkedin.com/feed/`
- ✅ People Search: `https://www.linkedin.com/search/results/people/?keywords=engineer`
- ✅ Company Search: `https://www.linkedin.com/search/results/companies/?keywords=tech`

### 6. Update Selectors if LinkedIn Changed

If LinkedIn updated their DOM structure, update `content.js`:

1. Open `chrome-extension/content.js`
2. Update the selectors in `alternativeSelectors` array:

```javascript
const alternativeSelectors = [
  'div.feed-shared-update-v2[role="article"][data-urn^="urn:li:activity:"]',
  '.feed-shared-update-v2[data-urn^="urn:li:activity:"]',
  // Add new selectors based on current LinkedIn DOM
  '.your-new-selector-here'
];
```

### 7. Check Backend Connection

Ensure your Django server is running:

```bash
cd backend
python manage.py runserver
```

Look for API requests in the Console:
```
Sending data to EventScope: {results: Array(0), totalCount: 0, ...}
EventScope API response: {success: true, message: "Received 0 results", ...}
```

### 8. Test Fallback Extraction

The extension now includes fallback extraction. Look for:
```
No posts found with standard selectors, trying fallback...
=== Starting Fallback Content Extraction ===
✅ Fallback extraction successful with selector: [data-urn*="activity"]
```

### 9. Manual Selector Testing

Test selectors manually in the Console:

```javascript
// Test if posts exist with different selectors
console.log('Main selector:', document.querySelectorAll('div.feed-shared-update-v2[role="article"]').length);
console.log('Any URN:', document.querySelectorAll('[data-urn^="urn:li:activity:"]').length);
console.log('Any articles:', document.querySelectorAll('[role="article"]').length);
```

### 10. Expected Results Page Behavior

After scraping (even with 0 results):
- ✅ New tab opens automatically
- ✅ Results page loads at `http://localhost:5173/results`
- ✅ Shows "Chrome Extension Data" section
- ⚠️ If 0 results: shows debug notice or fallback content

### Common LinkedIn DOM Patterns

Recent LinkedIn structures to look for:

**Feed Posts:**
```html
<div class="feed-shared-update-v2" role="article" data-urn="urn:li:activity:123">
  <div class="feed-shared-actor__meta">
    <span class="feed-shared-actor__name">John Doe</span>
  </div>
  <div class="feed-shared-text">
    <span>Post content here...</span>
  </div>
</div>
```

**Search Results:**
```html
<li class="reusable-search__result-container">
  <div class="entity-result">
    <div class="entity-result__title-text">
      <a><span>Person Name</span></a>
    </div>
  </div>
</li>
```

### Troubleshooting Steps Summary

1. ✅ Extension enabled and refreshed
2. ✅ Console shows detailed extraction logs  
3. ✅ LinkedIn page has expected DOM structure
4. ✅ Backend server running on port 8000
5. ✅ Results page opens automatically
6. ✅ Check for fallback content extraction

If all steps pass but still 0 results, LinkedIn likely updated their DOM structure and selectors need updating.

---

## 🔧 Quick Fixes

**Extension not loading?**
```bash
# Reload extension
Go to chrome://extensions/ → Click refresh icon
```

**Backend not responding?**
```bash
# Restart Django server  
cd backend
python manage.py runserver
```

**Frontend not loading?**
```bash
# Restart React server
cd frontend  
npm run dev
```

**Still having issues?**
Check the browser console during scraping for detailed error messages and DOM structure information.