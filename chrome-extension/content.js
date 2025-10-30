// Content script for LinkedIn search results scraping
console.log('EventScope LinkedIn scraper content script loaded');

class LinkedInScraper {
  constructor() {
    this.scrollCount = 0;
    this.maxScrolls = 10;
    this.scrollDelay = 2000; // 2 seconds between scrolls
    this.extractedData = [];
    this.isScrapingActive = false;
  }

  // Check if we're on a LinkedIn search results page or feed page
  isLinkedInSearchPage() {
    return window.location.href.includes('linkedin.com/search/results');
  }

  // Check if we're on a LinkedIn feed page
  isLinkedInFeedPage() {
    return window.location.href.includes('linkedin.com/feed') || 
           window.location.pathname === '/feed/' ||
           window.location.href.includes('linkedin.com') && document.querySelector('div.feed-shared-update-v2');
  }

  // Wait for elements to load after scrolling
  async waitForContent(selector, timeout = 5000) {
    return new Promise((resolve) => {
      const startTime = Date.now();
      const checkForElement = () => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0 || Date.now() - startTime > timeout) {
          resolve(elements);
        } else {
          setTimeout(checkForElement, 100);
        }
      };
      checkForElement();
    });
  }

  // Extract data from LinkedIn search results
  extractSearchResults() {
    const results = [];
    
    console.log('=== Starting LinkedIn Search Results Extraction ===');
    console.log('Current URL:', window.location.href);
    console.log('Page title:', document.title);
    
    // LinkedIn search result selectors (these may need updates as LinkedIn changes their DOM)
    const resultSelectors = [
      '.reusable-search__result-container',
      '.search-results-container .search-result',
      '.entity-result',
      '.search-result__wrapper',
      '.search-result',
      '.entity-result__item',
      '[data-view-name="search-entity-result"]'
    ];

    let resultElements = [];
    
    // Try different selectors to find search results
    for (const selector of resultSelectors) {
      console.log('Trying search selector:', selector);
      resultElements = document.querySelectorAll(selector);
      console.log('Found:', resultElements.length, 'elements');
      if (resultElements.length > 0) {
        console.log(`✅ Found ${resultElements.length} search results using selector: ${selector}`);
        break;
      }
    }

    if (resultElements.length === 0) {
      console.log('❌ No search results found with any selector');
    }

    resultElements.forEach((element, index) => {
      try {
        console.log(`Processing search result ${index + 1}/${resultElements.length}`);
        const result = this.extractSingleResult(element, index);
        if (result) {
          results.push(result);
          console.log(`✅ Extracted search result ${index + 1}:`, result);
        } else {
          console.log(`❌ Failed to extract search result ${index + 1}`);
        }
      } catch (error) {
        console.error(`❌ Error extracting search result ${index}:`, error);
      }
    });

    console.log(`=== Search Extraction Complete: ${results.length} search results total ===`);
    return results;
  }

  // Extract LinkedIn feed posts according to specified DOM structure
  extractFeedPosts() {
    const results = [];
    
    console.log('=== Starting LinkedIn Feed Post Extraction ===');
    console.log('Current URL:', window.location.href);
    console.log('Page title:', document.title);
    
    // Use the specified CSS selector for LinkedIn feed posts
    const feedPostSelector = 'li.artdeco-card.mb2 div.occludable-update div[data-view-name="feed-full-update"] div.feed-shared-update-v2[role="article"][data-urn^="urn:li:activity:"]';
    
    // Also try alternative selectors in case the DOM structure varies
    const alternativeSelectors = [
      'div.feed-shared-update-v2[role="article"][data-urn^="urn:li:activity:"]',
      '.feed-shared-update-v2[data-urn^="urn:li:activity:"]',
      '[data-urn^="urn:li:activity:"]',
      '.feed-shared-update-v2',
      '.occludable-update',
      'li.artdeco-card'
    ];

    let postElements = [];
    
    // Try main selector first
    console.log('Trying main selector:', feedPostSelector);
    postElements = document.querySelectorAll(feedPostSelector);
    console.log('Main selector found:', postElements.length, 'elements');
    
    // If no posts found, try alternative selectors
    if (postElements.length === 0) {
      console.log('Main selector failed, trying alternatives...');
      for (const selector of alternativeSelectors) {
        console.log('Trying selector:', selector);
        postElements = document.querySelectorAll(selector);
        console.log('Found:', postElements.length, 'elements');
        if (postElements.length > 0) {
          console.log(`✅ Found ${postElements.length} feed posts using selector: ${selector}`);
          break;
        }
      }
    } else {
      console.log(`✅ Found ${postElements.length} feed posts using main selector`);
    }

    // Debug: Log some sample elements
    if (postElements.length > 0) {
      console.log('Sample element HTML:', postElements[0].outerHTML.substring(0, 500));
    }

    postElements.forEach((element, index) => {
      try {
        console.log(`Processing element ${index + 1}/${postElements.length}`);
        const post = this.extractSingleFeedPost(element, index);
        if (post) {
          results.push(post);
          console.log(`✅ Extracted post ${index + 1}:`, post);
        } else {
          console.log(`❌ Failed to extract post ${index + 1}`);
        }
      } catch (error) {
        console.error(`❌ Error extracting feed post ${index}:`, error);
      }
    });

    console.log(`=== Extraction Complete: ${results.length} feed posts total ===`);
    return results;
  }

  // Extract data from a single search result
  extractSingleResult(element, index) {
    const result = {
      id: `linkedin_${Date.now()}_${index}`,
      platform: 'LinkedIn',
      extractedAt: new Date().toISOString()
    };

    try {
      // Extract name/title
      const nameSelectors = [
        '.entity-result__title-text a span[aria-hidden="true"]',
        '.search-result__result-link',
        '.actor-name',
        '.search-result__info .search-result__result-link',
        'h3 a span[aria-hidden="true"]'
      ];
      
      for (const selector of nameSelectors) {
        const nameElement = element.querySelector(selector);
        if (nameElement && nameElement.textContent.trim()) {
          result.name = nameElement.textContent.trim();
          break;
        }
      }

      // Extract profile URL
      const linkSelectors = [
        '.entity-result__title-text a',
        '.search-result__result-link',
        'h3 a'
      ];
      
      for (const selector of linkSelectors) {
        const linkElement = element.querySelector(selector);
        if (linkElement && linkElement.href) {
          result.profileUrl = linkElement.href;
          break;
        }
      }

      // Extract subtitle/description
      const subtitleSelectors = [
        '.entity-result__primary-subtitle',
        '.entity-result__summary',
        '.search-result__summary',
        '.subline-level-1'
      ];
      
      for (const selector of subtitleSelectors) {
        const subtitleElement = element.querySelector(selector);
        if (subtitleElement && subtitleElement.textContent.trim()) {
          result.subtitle = subtitleElement.textContent.trim();
          break;
        }
      }

      // Extract location
      const locationSelectors = [
        '.entity-result__secondary-subtitle',
        '.search-result__summary .subline-level-2',
        '.subline-level-2'
      ];
      
      for (const selector of locationSelectors) {
        const locationElement = element.querySelector(selector);
        if (locationElement && locationElement.textContent.trim()) {
          result.location = locationElement.textContent.trim();
          break;
        }
      }

      // Extract image/avatar
      const imageSelectors = [
        '.entity-result__item img',
        '.search-result__image img',
        '.presence-entity__image img'
      ];
      
      for (const selector of imageSelectors) {
        const imageElement = element.querySelector(selector);
        if (imageElement && imageElement.src) {
          result.imageUrl = imageElement.src;
          break;
        }
      }

      // Only return result if we have at least a name
      return result.name ? result : null;

    } catch (error) {
      console.error('Error extracting single result:', error);
      return null;
    }
  }

  // Extract data from a single LinkedIn feed post
  extractSingleFeedPost(element, index) {
    const post = {
      id: `feed_post_${Date.now()}_${index}`,
      type: 'feed_post',
      platform: 'LinkedIn',
      extractedAt: new Date().toISOString()
    };

    try {
      // Extract URN (post ID) from data-urn attribute
      const urn = element.getAttribute('data-urn');
      if (urn) {
        post.urn = urn;
      }

      // Extract author/poster name
      const authorSelectors = [
        '.feed-shared-actor__name',
        '.feed-shared-actor__name .visually-hidden',
        '.feed-shared-actor .feed-shared-actor__name span[aria-hidden="true"]',
        '.feed-shared-actor .feed-shared-actor__name a span',
        '.feed-shared-actor__title .visually-hidden',
        '.update-components-actor__name .visually-hidden'
      ];

      for (const selector of authorSelectors) {
        const authorElement = element.querySelector(selector);
        if (authorElement && authorElement.textContent.trim()) {
          post.author = authorElement.textContent.trim();
          break;
        }
      }

      // Extract post description (first 20 words)
      const descriptionSelectors = [
        '.feed-shared-text__text-view span[dir="ltr"]',
        '.feed-shared-text span[dir="ltr"]',
        '.feed-shared-update-v2__description',
        '.feed-shared-text',
        '.update-components-text span[dir="ltr"]'
      ];

      for (const selector of descriptionSelectors) {
        const descElement = element.querySelector(selector);
        if (descElement && descElement.textContent.trim()) {
          const fullText = descElement.textContent.trim();
          const words = fullText.split(/\s+/);
          post.description = words.slice(0, 20).join(' ');
          if (words.length > 20) {
            post.description += '...';
          }
          break;
        }
      }

      // Extract social counts (likes, comments, reposts)
      const socialCountsSelectors = {
        likes: [
          '.social-details-social-counts__reactions-count',
          '.social-counts-reactions__count',
          '[data-test-id="social-actions-bar"] button[aria-label*="reaction"] span',
          '.react-count__count'
        ],
        comments: [
          '.social-details-social-counts__comments',
          '.social-counts-comments__count', 
          '[data-test-id="social-actions-bar"] button[aria-label*="comment"] span',
          '.comment-count__count'
        ],
        reposts: [
          '.social-details-social-counts__shares',
          '.social-counts-shares__count',
          '[data-test-id="social-actions-bar"] button[aria-label*="repost"] span',
          '.share-count__count'
        ]
      };

      // Initialize counts
      post.likes = 0;
      post.comments = 0;
      post.reposts = 0;

      // Extract likes count
      for (const selector of socialCountsSelectors.likes) {
        const element = post.element?.querySelector ? post.element.querySelector(selector) : element.querySelector(selector);
        if (element) {
          const text = element.textContent.trim();
          const count = this.parseCount(text);
          if (count > 0) {
            post.likes = count;
            break;
          }
        }
      }

      // Extract comments count  
      for (const selector of socialCountsSelectors.comments) {
        const element = post.element?.querySelector ? post.element.querySelector(selector) : element.querySelector(selector);
        if (element) {
          const text = element.textContent.trim();
          const count = this.parseCount(text);
          if (count > 0) {
            post.comments = count;
            break;
          }
        }
      }

      // Extract reposts count
      for (const selector of socialCountsSelectors.reposts) {
        const element = post.element?.querySelector ? post.element.querySelector(selector) : element.querySelector(selector);
        if (element) {
          const text = element.textContent.trim();
          const count = this.parseCount(text);
          if (count > 0) {
            post.reposts = count;
            break;
          }
        }
      }

      // Only return post if we have at least author or description
      return (post.author || post.description) ? post : null;

    } catch (error) {
      console.error('Error extracting feed post:', error);
      return null;
    }
  }

  // Helper function to parse count text (e.g., "42", "1.2K", "3.5M")
  parseCount(text) {
    if (!text) return 0;
    
    const cleanText = text.replace(/[^\d.KMkm]/g, '');
    const number = parseFloat(cleanText);
    
    if (isNaN(number)) return 0;
    
    if (cleanText.toLowerCase().includes('k')) {
      return Math.round(number * 1000);
    } else if (cleanText.toLowerCase().includes('m')) {
      return Math.round(number * 1000000);
    }
    
    return Math.round(number);
  }

  // Fallback extraction method - tries to extract any visible content for debugging
  extractFallbackContent() {
    console.log('=== Starting Fallback Content Extraction ===');
    const results = [];
    
    // Try to find any elements with text content that might be LinkedIn posts or profiles
    const fallbackSelectors = [
      '[data-urn*="activity"]',
      '[data-urn*="profile"]', 
      '.feed-shared-update-v2',
      '.entity-result',
      '.artdeco-card',
      'article',
      '[role="article"]',
      '.update-components-text',
      '.feed-shared-text'
    ];

    for (const selector of fallbackSelectors) {
      const elements = document.querySelectorAll(selector);
      console.log(`Fallback selector "${selector}" found:`, elements.length, 'elements');
      
      if (elements.length > 0) {
        elements.forEach((element, index) => {
          if (index < 5) { // Limit to first 5 elements per selector
            try {
              const text = element.textContent?.trim();
              if (text && text.length > 20) {
                results.push({
                  id: `fallback_${Date.now()}_${index}`,
                  type: 'fallback',
                  name: 'Fallback Content',
                  author: 'Debug Extract',
                  description: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
                  extractedAt: new Date().toISOString(),
                  selector: selector,
                  element_tag: element.tagName,
                  element_classes: element.className
                });
              }
            } catch (error) {
              console.error('Error in fallback extraction:', error);
            }
          }
        });
        
        if (results.length > 0) {
          console.log(`✅ Fallback extraction successful with selector: ${selector}`);
          break; // Stop after finding content with first working selector
        }
      }
    }

    console.log(`=== Fallback Complete: ${results.length} items extracted ===`);
    return results;
  }

  // Perform auto-scrolling
  async autoScroll() {
    console.log(`Starting scroll ${this.scrollCount + 1}/${this.maxScrolls}`);
    
    // Get current page height
    const beforeHeight = document.body.scrollHeight;
    
    // Scroll to bottom
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: 'smooth'
    });
    
    // Wait for new content to load
    await new Promise(resolve => setTimeout(resolve, this.scrollDelay));
    
    // Check if new content loaded
    const afterHeight = document.body.scrollHeight;
    const newContentLoaded = afterHeight > beforeHeight;
    
    console.log(`Scroll ${this.scrollCount + 1} complete. New content loaded: ${newContentLoaded}`);
    
    this.scrollCount++;
    
    // Continue scrolling if we haven't reached max scrolls and new content is loading
    if (this.scrollCount < this.maxScrolls && newContentLoaded) {
      return this.autoScroll();
    } else {
      console.log('Scrolling complete');
      return true;
    }
  }

  // Main scraping function
  async startScraping() {
    if (this.isScrapingActive) {
      console.log('Scraping already in progress');
      return;
    }

    const isSearchPage = this.isLinkedInSearchPage();
    const isFeedPage = this.isLinkedInFeedPage();

    if (!isSearchPage && !isFeedPage) {
      console.log('Not on a LinkedIn search results or feed page');
      return;
    }

    const pageType = isSearchPage ? 'search results' : 'feed';
    console.log(`Starting LinkedIn ${pageType} scraping process...`);
    this.isScrapingActive = true;
    this.scrollCount = 0;

    try {
      if (isSearchPage) {
        // Wait for search results to load
        await this.waitForContent('.search-results-container, .reusable-search__result-container');
        
        // Extract initial results
        let initialResults = this.extractSearchResults();
        console.log(`Initial extraction: ${initialResults.length} search results`);

        // Perform auto-scrolling
        await this.autoScroll();
        
        // Extract all results after scrolling
        const finalResults = this.extractSearchResults();
        console.log(`Final extraction: ${finalResults.length} search results`);

        // If no results found, try a generic fallback extraction
        let fallbackResults = [];
        if (finalResults.length === 0) {
          console.log('No search results found with standard selectors, trying fallback...');
          fallbackResults = this.extractFallbackContent();
        }

        const resultsToSend = finalResults.length > 0 ? finalResults : fallbackResults;

        // Send results to background script
        chrome.runtime.sendMessage({
          type: 'SCRAPING_COMPLETE',
          data: {
            results: resultsToSend,
            totalCount: resultsToSend.length,
            scrollsPerformed: this.scrollCount,
            pageUrl: window.location.href,
            scrapedAt: new Date().toISOString(),
            contentType: finalResults.length > 0 ? 'search_results' : 'fallback_content'
          }
        }, (response) => {
          if (response) {
            console.log('Search data sent successfully:', response);
          }
        });

      } else if (isFeedPage) {
        // Wait for feed posts to load
        await this.waitForContent('.feed-shared-update-v2, div[data-view-name="feed-full-update"]');
        
        // Extract initial feed posts
        let initialPosts = this.extractFeedPosts();
        console.log(`Initial extraction: ${initialPosts.length} feed posts`);

        // Perform auto-scrolling
        await this.autoScroll();
        
        // Extract all posts after scrolling
        const finalPosts = this.extractFeedPosts();
        console.log(`Final extraction: ${finalPosts.length} feed posts`);

        // If no posts found, try a generic fallback extraction
        let fallbackResults = [];
        if (finalPosts.length === 0) {
          console.log('No posts found with standard selectors, trying fallback...');
          fallbackResults = this.extractFallbackContent();
        }

        const resultsToSend = finalPosts.length > 0 ? finalPosts : fallbackResults;

        // Send posts to background script
        chrome.runtime.sendMessage({
          type: 'SCRAPING_COMPLETE',
          data: {
            results: resultsToSend,
            totalCount: resultsToSend.length,
            scrollsPerformed: this.scrollCount,
            pageUrl: window.location.href,
            scrapedAt: new Date().toISOString(),
            contentType: finalPosts.length > 0 ? 'feed_posts' : 'fallback_content'
          }
        }, (response) => {
          if (response) {
            console.log('Feed data sent successfully:', response);
          }
        });
      }

      this.isScrapingActive = false;
      console.log('Scraping process completed');

    } catch (error) {
      console.error('Error during scraping process:', error);
      this.isScrapingActive = false;
    }
  }
}

// Initialize scraper
const scraper = new LinkedInScraper();

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Content script received message:', message);
  
  if (message.type === 'INITIATE_SCRAPING') {
    scraper.startScraping();
    sendResponse({ success: true });
  }
});

// Auto-detect and show scraping option when on LinkedIn pages
const isSearchPage = scraper.isLinkedInSearchPage();
const isFeedPage = scraper.isLinkedInFeedPage();

if (isSearchPage || isFeedPage) {
  const pageType = isSearchPage ? 'search results' : 'feed posts';
  console.log(`LinkedIn ${pageType} page detected. Ready to scrape.`);
  
  // Add a visual indicator that the extension is ready
  const indicator = document.createElement('div');
  indicator.id = 'eventscope-indicator';
  indicator.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #0077b5;
      color: white;
      padding: 10px 15px;
      border-radius: 5px;
      z-index: 10000;
      font-family: Arial, sans-serif;
      font-size: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      cursor: pointer;
    ">
      🔍 EventScope Ready - ${pageType} detected
    </div>
  `;
  
  document.body.appendChild(indicator);
  
  // Remove indicator after 5 seconds
  setTimeout(() => {
    const element = document.getElementById('eventscope-indicator');
    if (element) element.remove();
  }, 5000);
}