import { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FiFilter, FiSearch } from 'react-icons/fi';
import FilterModal from './FilterModal';
import "react-datepicker/dist/react-datepicker.css";

const HomePage = ({ onNavigate }) => {
  const [keywords, setKeywords] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = () => {
    if (keywords && startDate && endDate && selectedPlatform) {
      // Store search data in session storage
      const searchData = {
        keywords,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        platform: selectedPlatform
      };
      sessionStorage.setItem('eventscope-search', JSON.stringify(searchData));
      onNavigate('results');
    } else {
      alert('Please fill in all fields and select a platform');
    }
  };

  const isSearchDisabled = !keywords || !startDate || !endDate || !selectedPlatform;

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
            </div>
          )}
        </div>

        <div className="date-group">
          <div className="form-group">
            <label htmlFor="start-date">Start Date</label>
            <DatePicker
              id="start-date"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Select start date"
              className="date-picker"
            />
          </div>

          <div className="form-group">
            <label htmlFor="end-date">End Date</label>
            <DatePicker
              id="end-date"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate}
              placeholderText="Select end date"
              className="date-picker"
            />
          </div>
        </div>

        <button
          className={`search-button ${isSearchDisabled ? 'disabled' : ''}`}
          onClick={handleSearch}
          disabled={isSearchDisabled}
        >
          <FiSearch />
          Search Events
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