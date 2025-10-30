import { useState, useEffect } from 'react';
import { FiExternalLink, FiBookmark, FiSearch, FiRefreshCw } from 'react-icons/fi';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const ResultsPage = () => {
  const [searchData, setSearchData] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);
  const [extensionResults, setExtensionResults] = useState([]);
  const [showExtensionData, setShowExtensionData] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isLoadingExtensionData, setIsLoadingExtensionData] = useState(false);



  // Fetch extension results from backend
  const fetchExtensionResults = async () => {
    try {
      setIsLoadingExtensionData(true);
      const response = await fetch('http://localhost:8000/api/events/results/get/');
      if (response.ok) {
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          setExtensionResults(data.results);
          setShowExtensionData(true);
          setLastUpdated(new Date(data.timestamp));
          console.log('Extension results loaded:', data.results.length, 'items');
        } else {
          // If no extension results, clear data
          setExtensionResults([]);
          setShowExtensionData(false);
          console.log('No extension results found');
        }
      }
    } catch (error) {
      console.log('No extension data available:', error);
    } finally {
      setIsLoadingExtensionData(false);
    }
  };

  // Poll for new extension data
  useEffect(() => {
    // Initial check for extension data
    fetchExtensionResults();
    
    // Poll every 3 seconds for new data (more frequent for better responsiveness)
    const pollInterval = setInterval(fetchExtensionResults, 3000);
    
    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    // Get search data from session storage
    const storedData = sessionStorage.getItem('eventscope-search');
    if (storedData) {
      setSearchData(JSON.parse(storedData));
    }

    // Get saved events from session storage
    const storedSaved = sessionStorage.getItem('eventscope-saved');
    if (storedSaved) {
      setSavedEvents(JSON.parse(storedSaved));
    }
  }, []);

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'linkedin':
        return <FaLinkedin style={{ color: '#0077B5' }} />;
      case 'twitter':
        return <FaTwitter style={{ color: '#1DA1F2' }} />;
      case 'facebook':
        return <FaFacebook style={{ color: '#1877F2' }} />;
      case 'instagram':
        return <FaInstagram style={{ color: '#E4405F' }} />;
      default:
        return null;
    }
  };

  const toggleSaveEvent = (eventId) => {
    const newSavedEvents = savedEvents.includes(eventId)
      ? savedEvents.filter(id => id !== eventId)
      : [...savedEvents, eventId];
    
    setSavedEvents(newSavedEvents);
    sessionStorage.setItem('eventscope-saved', JSON.stringify(newSavedEvents));
  };

  const refreshExtensionData = () => {
    fetchExtensionResults();
  };

  // Render extension results (both search results and feed posts)
  const renderExtensionResults = () => {
    if (!extensionResults || extensionResults.length === 0) return null;

    return extensionResults.map((result, index) => {
      // Check if this is a feed post or search result
      const isFeedPost = result.type === 'feed_post';
      
      return (
        <div key={result.id || index} className={`event-card extension-result ${isFeedPost ? 'feed-post' : ''}`}>
          <div className="event-header">
            <div className="platform-icon">
              <FaLinkedin style={{ color: '#0077B5' }} />
            </div>
            <div className="extension-badge">
              <span>{isFeedPost ? 'Feed Post' : 'Profile'}</span>
            </div>
            <button
              className={`save-button ${savedEvents.includes(result.id) ? 'saved' : ''}`}
              onClick={() => toggleSaveEvent(result.id)}
              title={savedEvents.includes(result.id) ? 'Remove from saved' : `Save ${isFeedPost ? 'post' : 'profile'}`}
            >
              <FiBookmark />
            </button>
          </div>
          
          <div className="event-content">
            {isFeedPost ? (
              // Feed Post Layout
              <>
                <h3 className="event-name">Feed Post</h3>
                {result.author && (
                  <p className="post-author">by {result.author}</p>
                )}
                <div className="event-type">
                  <span className="type-badge feed-post">
                    LinkedIn Post
                  </span>
                </div>
                {result.description && (
                  <p className="event-description">{result.description}</p>
                )}
                <div className="post-engagement">
                  <span className="engagement-item">
                    👍 {result.likes || 0} likes
                  </span>
                  <span className="engagement-item">
                    💬 {result.comments || 0} comments
                  </span>
                  {result.reposts > 0 && (
                    <span className="engagement-item">
                      🔄 {result.reposts} reposts
                    </span>
                  )}
                </div>
              </>
            ) : (
              // Profile Layout (existing)
              <>
                <h3 className="event-name">{result.name || 'LinkedIn Profile'}</h3>
                <div className="event-type">
                  <span className="type-badge profile">
                    LinkedIn Profile
                  </span>
                </div>
                <p className="event-description">
                  {result.description || result.subtitle || 'LinkedIn profile extracted from search results'}
                </p>
                {result.location && (
                  <p className="event-location">📍 {result.location}</p>
                )}
              </>
            )}
            
            {result.extractedAt && (
              <p className="event-timestamp">
                Extracted: {new Date(result.extractedAt).toLocaleString()}
              </p>
            )}
          </div>

          <div className="event-footer">
            {!isFeedPost && result.link && result.link !== '#' ? (
              <a
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="go-to-link"
              >
                <FiExternalLink />
                View Profile
              </a>
            ) : isFeedPost && result.urn ? (
              <span className="post-id">
                Post ID: {result.urn.split(':').pop()}
              </span>
            ) : (
              <span className="go-to-link disabled">
                <FiExternalLink />
                {isFeedPost ? 'LinkedIn Post' : 'Profile Link Not Available'}
              </span>
            )}
          </div>
        </div>
      );
    });
  };

  // Show loading only for extension data fetching
  if (isLoadingExtensionData) {
    return (
      <div className="loading-container">
        <div className="loading-animation">
          <div className="search-icon-container">
            <FiSearch className="search-icon" />
          </div>
          <div className="loading-spinner">
            <div className="spinner"></div>
          </div>
        </div>
        <p>Loading LinkedIn results...</p>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-header">
        <h2>Search Results</h2>
        {searchData && (
          <p className="search-info">
            Results for "{searchData.keywords}" 
            {searchData.startDate && searchData.endDate && 
              ` from ${new Date(searchData.startDate).toLocaleDateString()} to ${new Date(searchData.endDate).toLocaleDateString()}`
            }
          </p>
        )}
        
        {showExtensionData && (
          <div className="extension-info">
            <div className="extension-status">
              <span className="extension-indicator">🔍 Chrome Extension Data</span>
              {lastUpdated && (
                <span className="last-updated">
                  Last updated: {lastUpdated.toLocaleTimeString()}
                </span>
              )}
              <button 
                className="refresh-button" 
                onClick={refreshExtensionData}
                title="Refresh extension data"
              >
                <FiRefreshCw />
              </button>
            </div>
            {extensionResults.length > 0 && extensionResults[0].type === 'fallback' && (
              <div className="debug-notice">
                ⚠️ Debug Mode: Showing fallback content. Check browser console for extraction details.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="results-grid">
        {/* Show extension results if available */}
        {showExtensionData && renderExtensionResults()}
      </div>
      
      {!showExtensionData && (
        <div className="no-extension-results">
          <div className="empty-state">
            <FiSearch className="empty-icon" />
            <h3>No Results Yet</h3>
            <p>Use the Chrome extension to scrape LinkedIn data and see results here.</p>
            <div className="extension-instructions">
              <ol>
                <li>Go to LinkedIn (search results or feed)</li>
                <li>Click the EventScope extension icon</li>
                <li>Click "Start Scraping"</li>
                <li>Results will appear here automatically</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsPage;