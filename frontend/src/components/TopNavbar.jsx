import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';

const TopNavbar = () => {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div className="top-navbar">
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkMode ? <FiSun /> : <FiMoon />}
      </button>
    </div>
  );
};

export default TopNavbar;