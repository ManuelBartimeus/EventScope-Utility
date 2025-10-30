// Background script for EventScope LinkedIn Scraper
console.log('EventScope extension background script loaded');

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);
  
  if (message.type === 'SCRAPING_COMPLETE') {
    console.log('Scraping completed, processing data:', message.data);
    
    // Send scraped data to EventScope app
    sendDataToEventScope(message.data)
      .then(response => {
        console.log('Data sent to EventScope successfully:', response);
        
        // Always open EventScope results page after data transfer (even with 0 results for debugging)
        console.log('Opening results page...');
        chrome.tabs.create({
          url: 'http://localhost:5173/results',
          active: true
        });
        
        sendResponse({ success: true, response, redirected: true });
      })
      .catch(error => {
        console.error('Failed to send data to EventScope:', error);
        
        // Still redirect to results page even if API fails, for debugging
        console.log('API failed, but still opening results page for debugging...');
        chrome.tabs.create({
          url: 'http://localhost:5173/results',
          active: true
        });
        
        sendResponse({ success: false, error: error.message, redirected: true });
      });
    
    // Keep the message channel open for async response
    return true;
  }
  
  if (message.type === 'START_SCRAPING') {
    // Inject content script to start scraping
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab && tab.url && tab.url.includes('linkedin.com/search/results')) {
        chrome.tabs.sendMessage(tab.id, { type: 'INITIATE_SCRAPING' });
        sendResponse({ success: true, message: 'Scraping initiated' });
      } else {
        sendResponse({ success: false, message: 'Please navigate to a LinkedIn search results page first' });
      }
    });
    return true;
  }
});

// Function to send scraped data to EventScope app
async function sendDataToEventScope(data) {
  try {
    // Determine the EventScope app URL (adjust port if needed)
    const eventScopeUrl = 'http://localhost:8000/api/events/results/';
    
    console.log('Sending data to EventScope:', data);
    
    const response = await fetch(eventScopeUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'linkedin_extension',
        timestamp: new Date().toISOString(),
        data: data
      })
    });
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('EventScope API response:', result);
    return result;
  } catch (error) {
    console.error('Error sending data to EventScope:', error);
    throw error;
  }
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log('EventScope extension installed/updated:', details);
});