import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from 'react-icons/fa';

const FilterModal = ({ isOpen, onClose, selectedPlatform, onPlatformChange }) => {
  const [tempSelected, setTempSelected] = useState(selectedPlatform);

  const platforms = [
    { id: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, color: '#0077B5' },
    { id: 'twitter', label: 'Twitter/X', icon: FaTwitter, color: '#1DA1F2' },
    { id: 'facebook', label: 'Facebook', icon: FaFacebook, color: '#1877F2' },
    { id: 'instagram', label: 'Instagram', icon: FaInstagram, color: '#E4405F' }
  ];

  useEffect(() => {
    setTempSelected(selectedPlatform);
  }, [selectedPlatform]);

  const handleSave = () => {
    onPlatformChange(tempSelected);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select Social Media Platform</h3>
          <button className="close-button" onClick={onClose}>
            <FiX />
          </button>
        </div>
        <div className="modal-body">
          {platforms.map(platform => {
            const Icon = platform.icon;
            return (
              <label key={platform.id} className="platform-option">
                <input
                  type="radio"
                  name="platform"
                  value={platform.id}
                  checked={tempSelected === platform.id}
                  onChange={(e) => setTempSelected(e.target.value)}
                />
                <div className="platform-content">
                  <Icon 
                    className="platform-icon" 
                    style={{ color: platform.color }}
                  />
                  <span>{platform.label}</span>
                </div>
              </label>
            );
          })}
        </div>
        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>Cancel</button>
          <button className="save-button" onClick={handleSave}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;