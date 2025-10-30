import { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import HomePage from './components/HomePage';
import ResultsPage from './components/ResultsPage';
import SavedPage from './components/SavedPage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');

  // Handle URL changes and browser navigation
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      if (path === '/results') {
        setCurrentView('results');
      } else if (path === '/saved') {
        setCurrentView('saved');
      } else {
        setCurrentView('home');
      }
    };

    // Listen for popstate events (back/forward buttons)
    window.addEventListener('popstate', handleLocationChange);
    
    // Check initial URL
    handleLocationChange();

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  // Navigation function that updates URL and state
  const navigate = (view) => {
    setCurrentView(view);
    const path = view === 'home' ? '/' : `/${view}`;
    window.history.pushState({}, '', path);
  };

  // Render current component based on view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'results':
        return <ResultsPage />;
      case 'saved':
        return <SavedPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <ThemeProvider>
      <div className="app">
        <Sidebar currentView={currentView} onNavigate={navigate} />
        <div className="main-content">
          <TopNavbar />
          <div className="content-area">
            {renderCurrentView()}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
