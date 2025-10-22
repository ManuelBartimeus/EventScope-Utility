import { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Sidebar from './components/Sidebar';
import TopNavbar from './components/TopNavbar';
import HomePage from './components/HomePage';
import ResultsPage from './components/ResultsPage';
import SavedPage from './components/SavedPage';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={setCurrentView} />;
      case 'results':
        return <ResultsPage />;
      case 'saved':
        return <SavedPage />;
      default:
        return <HomePage onNavigate={setCurrentView} />;
    }
  };

  return (
    <ThemeProvider>
      <div className="app">
        <Sidebar currentView={currentView} onViewChange={setCurrentView} />
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
