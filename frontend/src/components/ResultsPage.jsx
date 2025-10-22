import { useState, useEffect } from 'react';
import { FiExternalLink, FiBookmark, FiSearch } from 'react-icons/fi';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const ResultsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchData, setSearchData] = useState(null);
  const [savedEvents, setSavedEvents] = useState([]);

  // Dummy results data
  const dummyResults = [
    {
      id: 1,
      name: "Tech Innovation Summit 2024",
      type: "online",
      description: "Join industry leaders discussing the latest technological innovations and future trends in AI, blockchain, and sustainable tech solutions.",
      link: "https://example.com/tech-summit",
      platform: "linkedin"
    },
    {
      id: 2,
      name: "Digital Marketing Conference",
      type: "onsite",
      description: "Learn cutting-edge digital marketing strategies from top professionals. Network with marketing experts and discover new tools.",
      link: "https://example.com/marketing-conf",
      platform: "facebook"
    },
    {
      id: 3,
      name: "Startup Pitch Competition",
      type: "online",
      description: "Watch emerging startups pitch their innovative ideas to investors. Interactive Q&A sessions and networking opportunities included.",
      link: "https://example.com/pitch-comp",
      platform: "twitter"
    },
    {
      id: 4,
      name: "Web Development Bootcamp",
      type: "onsite",
      description: "Intensive hands-on workshop covering modern web development frameworks, best practices, and career advancement strategies.",
      link: "https://example.com/web-bootcamp",
      platform: "linkedin"
    },
    {
      id: 5,
      name: "AI & Machine Learning Symposium",
      type: "online",
      description: "Explore the latest advances in artificial intelligence and machine learning with research presentations and practical workshops.",
      link: "https://example.com/ai-symposium",
      platform: "twitter"
    },
    {
      id: 6,
      name: "Sustainable Business Forum",
      type: "onsite",
      description: "Discuss sustainable business practices, environmental impact, and corporate responsibility with industry experts.",
      link: "https://example.com/sustainable-forum",
      platform: "facebook"
    },
    {
      id: 7,
      name: "Creative Photography Workshop",
      type: "online",
      description: "Learn advanced photography techniques, editing tips, and creative composition from professional photographers. Share your work and get feedback.",
      link: "https://example.com/photo-workshop",
      platform: "instagram"
    }
  ];

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

    // Simulate loading for 4 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
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

  if (isLoading) {
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
        <p>Searching for events...</p>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="results-header">
        <h2>Search Results</h2>
        {searchData && (
          <p className="search-info">
            Results for "{searchData.keywords}" from {new Date(searchData.startDate).toLocaleDateString()} 
            to {new Date(searchData.endDate).toLocaleDateString()}
          </p>
        )}
      </div>

      <div className="results-grid">
        {dummyResults.map(event => (
          <div key={event.id} className="event-card">
            <div className="event-header">
              <div className="platform-icon">
                {getPlatformIcon(event.platform)}
              </div>
              <button
                className={`save-button ${savedEvents.includes(event.id) ? 'saved' : ''}`}
                onClick={() => toggleSaveEvent(event.id)}
                title={savedEvents.includes(event.id) ? 'Remove from saved' : 'Save event'}
              >
                <FiBookmark />
              </button>
            </div>
            
            <div className="event-content">
              <h3 className="event-name">{event.name}</h3>
              <div className="event-type">
                <span className={`type-badge ${event.type}`}>
                  {event.type === 'online' ? 'Online' : 'On-site'}
                </span>
              </div>
              <p className="event-description">{event.description}</p>
            </div>

            <div className="event-footer">
              <a
                href={event.link}
                target="_blank"
                rel="noopener noreferrer"
                className="go-to-link"
              >
                <FiExternalLink />
                Go to Link
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;