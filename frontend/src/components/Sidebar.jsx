import { FiHome, FiSearch, FiBookmark } from 'react-icons/fi';

const Sidebar = ({ currentView, onNavigate }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: FiHome },
    { id: 'results', label: 'Results', icon: FiSearch },
    { id: 'saved', label: 'Saved', icon: FiBookmark }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-title">EventScope</h1>
      </div>
      <nav className="sidebar-nav">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`nav-tab ${currentView === tab.id ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;