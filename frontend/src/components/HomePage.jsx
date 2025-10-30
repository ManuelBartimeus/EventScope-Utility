import { useState } from 'react';
import { FiFilter, FiSearch } from 'react-icons/fi';
import FilterModal from './FilterModal';

const HomePage = () => {
  const [keywords, setKeywords] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = () => {
    if (keywords && selectedPlatform) {
      // Check if LinkedIn is selected and redirect to LinkedIn search
      if (selectedPlatform === 'linkedin') {
        // Create LinkedIn search URL with keywords
        const linkedinSearchUrl = `https://www.linkedin.com/search/results/all/?keywords=${encodeURIComponent(keywords)}`;
        
        // Open LinkedIn search in a new tab/window
        window.open(linkedinSearchUrl, '_blank', 'noopener,noreferrer');
        
        // Store search data for potential future use
        const searchData = {
          keywords,
          platform: selectedPlatform,
          linkedinUrl: linkedinSearchUrl
        };
        sessionStorage.setItem('eventscope-search', JSON.stringify(searchData));
        
        return; // Exit early for LinkedIn
      }
      
      // For other platforms, store search data and navigate to results
      const searchData = {
        keywords,
        platform: selectedPlatform
      };
      sessionStorage.setItem('eventscope-search', JSON.stringify(searchData));
      // Navigate to results page by updating URL
      window.history.pushState({}, '', '/results');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } else {
      alert('Please enter keywords and select a platform');
    }
  };

  const isSearchDisabled = !keywords || !selectedPlatform;

  return (
    <div className="home-page">
      <div className="search-form">
        <div className="form-group">
          <label htmlFor="keywords">Keywords</label>
          <div className="input-with-filter">
            <input
              id="keywords"
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="Enter keywords..."
              className="keywords-input"
            />
            <button
              className="filter-button"
              onClick={() => setIsModalOpen(true)}
              title="Filter platforms"
            >
              <FiFilter />
            </button>
          </div>
          {selectedPlatform && (
            <div className="selected-platform">
              Selected: {selectedPlatform.charAt(0).toUpperCase() + selectedPlatform.slice(1)}
              {selectedPlatform === 'linkedin' && (
                <div className="linkedin-redirect-note">
                  🔗 Will open LinkedIn search in new tab
                </div>
              )}
            </div>
          )}
        </div>

        <button
          className={`search-button ${isSearchDisabled ? 'disabled' : ''}`}
          onClick={handleSearch}
          disabled={isSearchDisabled}
          title={selectedPlatform === 'linkedin' ? 'Open LinkedIn search in new tab' : 'Search for events'}
        >
          <FiSearch />
          {selectedPlatform === 'linkedin' ? 'Search on LinkedIn' : 'Search Events'}
        </button>
      </div>

      <FilterModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedPlatform={selectedPlatform}
        onPlatformChange={setSelectedPlatform}
      />
    </div>
  );
};

export default HomePage;