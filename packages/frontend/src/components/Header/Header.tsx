import React from 'react';
import { Link } from 'react-router-dom';
import { FiMenu, FiSearch, FiBell, FiMoon, FiSun, FiUser } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';
import './Header.css';

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <button 
            className="menu-button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <FiMenu />
          </button>
          <Link to="/" className="site-logo">
            <div className="logo-icon">
              z
              <div className="logo-glow"></div>
            </div>
            <div className="logo-text">
              <span className="logo-text-main">zaaz</span>
              <span className="logo-text-sub">central</span>
            </div>
          </Link>
        </div>

        <div className="search-container">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search..."
              aria-label="Search"
            />
          </div>
        </div>

        <div className="header-right">
          <div className="header-actions">
            <button className="action-button" aria-label="Notifications">
              <FiBell />
              <div className="notification-badge"></div>
            </button>
            <button 
              className="action-button theme-toggle"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <FiSun /> : <FiMoon />}
            </button>
            <button className="action-button profile-button">
              <FiUser />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
