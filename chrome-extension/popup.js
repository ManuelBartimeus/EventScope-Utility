// Popup script for EventScope LinkedIn Scraper
document.addEventListener('DOMContentLoaded', function() {
  const scrapeBtn = document.getElementById('scrapeBtn');
  const status = document.getElementById('status');
  const progress = document.getElementById('progress');
  const progressText = document.getElementById('progressText');
  const progressFill = document.getElementById('progressFill');
  const resultsInfo = document.getElementById('resultsInfo');
  const resultCount = document.getElementById('resultCount');

  let isScrapingActive = false;

  // Check if we're on a LinkedIn search or feed page
  function checkCurrentPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.url) {
        if (tab.url.includes('linkedin.com/search/results')) {
          updateStatus('ready', 'Ready to scrape LinkedIn search results');
          scrapeBtn.disabled = false;
        } else if (tab.url.includes('linkedin.com/feed') || tab.url.includes('linkedin.com') && tab.url.includes('/feed')) {
          updateStatus('ready', 'Ready to scrape LinkedIn feed posts');
          scrapeBtn.disabled = false;
        } else {
          updateStatus('error', 'Please navigate to a LinkedIn search results or feed page');
          scrapeBtn.disabled = true;
        }
      } else {
        updateStatus('error', 'Please navigate to a LinkedIn page');
        scrapeBtn.disabled = true;
      }
    });
  }

  // Update status display
  function updateStatus(type, message) {
    status.className = `status ${type}`;
    status.textContent = message;
  }

  // Update progress display
  function updateProgress(current, total) {
    const percentage = Math.round((current / total) * 100);
    progressText.textContent = `${percentage}% (${current}/${total} scrolls)`;
    progressFill.style.width = `${percentage}%`;
  }

  // Show progress section
  function showProgress() {
    progress.style.display = 'block';
    updateProgress(0, 10);
  }

  // Hide progress section
  function hideProgress() {
    progress.style.display = 'none';
  }

  // Show results info
  function showResults(count) {
    resultCount.textContent = count;
    resultsInfo.style.display = 'block';
  }

  // Start scraping process
  function startScraping() {
    if (isScrapingActive) return;

    isScrapingActive = true;
    scrapeBtn.disabled = true;
    updateStatus('working', 'Starting scraping process...');
    showProgress();
    hideResults();

    // Send message to background script to start scraping
    chrome.runtime.sendMessage({ type: 'START_SCRAPING' }, (response) => {
      if (response && response.success) {
        updateStatus('working', 'Scraping in progress...');
        
        // Simulate progress updates (in real implementation, you'd get these from content script)
        simulateProgress();
        
      } else {
        const errorMsg = response ? response.message : 'Failed to start scraping';
        updateStatus('error', errorMsg);
        isScrapingActive = false;
        scrapeBtn.disabled = false;
        hideProgress();
      }
    });
  }

  // Simulate progress for better UX (replace with real progress updates)
  function simulateProgress() {
    let currentScroll = 0;
    const totalScrolls = 10;
    
    const progressInterval = setInterval(() => {
      currentScroll++;
      updateProgress(currentScroll, totalScrolls);
      
      if (currentScroll >= totalScrolls) {
        clearInterval(progressInterval);
        updateStatus('working', 'Processing results...');
      }
    }, 2500); // Update every 2.5 seconds (assuming 2s scroll delay + processing time)

    // Listen for completion message
    const messageListener = (message) => {
      if (message.type === 'SCRAPING_COMPLETE') {
        clearInterval(progressInterval);
        chrome.runtime.onMessage.removeListener(messageListener);
        
        updateStatus('success', `Scraping completed! Found ${message.data.totalCount} results`);
        showResults(message.data.totalCount);
        hideProgress();
        
        // Update status to show redirect is happening
        setTimeout(() => {
          updateStatus('success', 'Opening results page...');
        }, 1000);
        
        isScrapingActive = false;
        scrapeBtn.disabled = false;
        scrapeBtn.textContent = 'Scrape Again';
        
        // Auto-close popup after 2 seconds (results page will open automatically)
        setTimeout(() => {
          window.close();
        }, 2000);
      }
    };
    
    chrome.runtime.onMessage.addListener(messageListener);
  }

  function hideResults() {
    resultsInfo.style.display = 'none';
  }

  // Event listeners
  scrapeBtn.addEventListener('click', startScraping);

  // Initialize
  checkCurrentPage();
  
  // Check page every 2 seconds in case user navigates
  setInterval(checkCurrentPage, 2000);
});