import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiLayout, 
  FiClipboard, 
  FiCpu, 
  FiFileText, 
  FiList, 
  FiStar, 
  FiClock,
  FiMenu,
  FiX,
  FiDollarSign
} from 'react-icons/fi';
import { AiOutlineProject, AiOutlineAppstore } from 'react-icons/ai';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <>
      <button className="menu-button" onClick={toggleSidebar}>
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>
      <nav className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="nav-items">
          <div className="nav-group">
            <Link to="/home" className={`nav-item ${location.pathname === '/home' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <FiHome className="icon" />
              <span>Home</span>
            </Link>
            <Link to="/dashboard" className={`nav-item ${location.pathname === '/dashboard' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <FiLayout className="icon" />
              <span>Dashboard</span>
            </Link>
            <Link to="/ai-hub" className={`nav-item ${location.pathname === '/ai-hub' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <FiCpu className="icon" />
              <span>AI Hub</span>
            </Link>
            <Link to="/business-pipeline" className={`nav-item ${location.pathname === '/business-pipeline' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <FiDollarSign className="icon" />
              <span>Business Pipeline</span>
            </Link>
          </div>

          <div className="nav-group">
            <div className="nav-group-title">Projects</div>
            <Link to="/projects" className={`nav-item ${location.pathname === '/projects' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <AiOutlineProject className="icon" />
              <span>All Projects</span>
            </Link>
            <Link to="/projects/kanban" className={`nav-item ${location.pathname === '/projects/kanban' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <AiOutlineAppstore className="icon" />
              <span>Kanban Board</span>
            </Link>
          </div>

          <div className="nav-group">
            <div className="nav-group-title">Workflows</div>
            <Link to="/meeting-summarizer" className={`nav-item ${location.pathname === '/meeting-summarizer' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <FiFileText className="icon" />
              <span>Meeting Summarizer</span>
            </Link>
            <Link to="/business-analyzer" className={`nav-item ${location.pathname === '/business-analyzer' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <FiDollarSign className="icon" />
              <span>Business Analyzer</span>
            </Link>
          </div>

          <div className="nav-group">
            <Link to="/favorites" className={`nav-item ${location.pathname === '/favorites' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <FiStar className="icon" />
              <span>Favorites</span>
              <span className="nav-badge">5</span>
            </Link>
            <Link to="/recent" className={`nav-item ${location.pathname === '/recent' ? 'active' : ''}`} onClick={() => setIsOpen(false)}>
              <FiClock className="icon" />
              <span>Recent</span>
              <span className="nav-badge">12</span>
            </Link>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="workspace-info">
            <div className="workspace-avatar">Z</div>
            <div className="workspace-details">
              <span className="workspace-name">Zaaz Central</span>
              <span className="workspace-plan">Pro Plan</span>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
