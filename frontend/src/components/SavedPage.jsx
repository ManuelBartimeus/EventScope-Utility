import { useState, useEffect } from 'react';
import { FiExternalLink, FiBookmark } from 'react-icons/fi';
import { FaLinkedin, FaTwitter, FaFacebook, FaBookmark, FaInstagram } from 'react-icons/fa';

const SavedPage = () => {
  const [savedEvents, setSavedEvents] = useState([]);

  // Same dummy results as in ResultsPage (in a real app, this would come from an API)
  const allEvents = [
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

  const removeSavedEvent = (eventId) => {
    const newSavedEvents = savedEvents.filter(id => id !== eventId);
    setSavedEvents(newSavedEvents);
    sessionStorage.setItem('eventscope-saved', JSON.stringify(newSavedEvents));
  };

  // Filter to show only saved events
  const savedEventsList = allEvents.filter(event => savedEvents.includes(event.id));

  return (
    <div className="saved-page">
      <div className="saved-header">
        <h2>Saved Events</h2>
        <p className="saved-count">
          {savedEventsList.length} {savedEventsList.length === 1 ? 'event' : 'events'} saved
        </p>
      </div>

      {savedEventsList.length === 0 ? (
        <div className="empty-state">
          <FiBookmark className="empty-icon" />
          <h3>No saved events yet</h3>
          <p>Save events from your search results to view them here later.</p>
        </div>
      ) : (
        <div className="results-grid">
          {savedEventsList.map(event => (
            <div key={event.id} className="event-card saved-card">
              <div className="event-header">
                <div className="platform-icon">
                  {getPlatformIcon(event.platform)}
                </div>
                <button
                  className="save-button saved"
                  onClick={() => removeSavedEvent(event.id)}
                  title="Remove from saved"
                >
                  <FaBookmark />
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
      )}
    </div>
  );
};

export default SavedPage;