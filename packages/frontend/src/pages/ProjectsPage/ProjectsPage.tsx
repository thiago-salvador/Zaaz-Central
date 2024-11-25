import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiGrid, FiList, FiSearch, FiFilter, FiPlus, FiClock, FiUsers, FiFlag } from 'react-icons/fi';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import PerformanceChart from '../../components/Charts/PerformanceChart';
import './ProjectsPage.css';

interface Project {
  id: string;
  name: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  status: 'on-track' | 'at-risk' | 'behind' | 'completed';
  progress: number;
  dueDate: string;
  team: Array<{
    id: string;
    name: string;
    avatar?: string;
  }>;
  tags: string[];
}

const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design and improved UX',
    priority: 'high',
    status: 'on-track',
    progress: 75,
    dueDate: '2024-03-15',
    team: [
      { id: '1', name: 'John D.' },
      { id: '2', name: 'Sarah M.' },
      { id: '3', name: 'Mike R.' },
    ],
    tags: ['Design', 'Frontend'],
  },
  {
    id: '2',
    name: 'Mobile App Development',
    description: 'Native mobile application for iOS and Android platforms',
    priority: 'medium',
    status: 'at-risk',
    progress: 45,
    dueDate: '2024-04-20',
    team: [
      { id: '4', name: 'Alex K.' },
      { id: '5', name: 'Emily W.' },
    ],
    tags: ['Mobile', 'React Native'],
  },
  {
    id: '3',
    name: 'API Integration',
    description: 'Integration with third-party services and internal systems',
    priority: 'low',
    status: 'completed',
    progress: 100,
    dueDate: '2024-02-28',
    team: [
      { id: '6', name: 'Tom H.' },
      { id: '7', name: 'Lisa P.' },
      { id: '8', name: 'David M.' },
    ],
    tags: ['Backend', 'API'],
  },
];

const performanceData = [
  { name: 'Jan', completed: 4, inProgress: 6 },
  { name: 'Feb', completed: 6, inProgress: 4 },
  { name: 'Mar', completed: 5, inProgress: 7 },
  { name: 'Apr', completed: 8, inProgress: 3 },
  { name: 'May', completed: 7, inProgress: 5 },
  { name: 'Jun', completed: 9, inProgress: 4 },
];

const ProjectsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityIcon = (priority: Project['priority']) => {
    return <FiFlag className={`priority-icon ${priority}`} />;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  return (
    <div className="projects-page">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">
          <div className="projects-container">
            <div className="projects-header">
              <div className="header-left">
                <h1>Projects</h1>
                <div className="header-stats">
                  <div className="stat-item">
                    <FiClock />
                    <span>12 Active Projects</span>
                  </div>
                  <div className="stat-item">
                    <FiUsers />
                    <span>28 Team Members</span>
                  </div>
                </div>
              </div>
              <button className="new-project-btn">
                <FiPlus />
                New Project
              </button>
            </div>

            <div className="projects-overview">
              <div className="overview-chart">
                <h3>Project Performance</h3>
                <PerformanceChart data={performanceData} />
              </div>
            </div>

            <div className="projects-toolbar">
              <div className="toolbar-left">
                <div className="search-box">
                  <FiSearch />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="filter-group">
                  <FiFilter />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="on-track">On Track</option>
                    <option value="at-risk">At Risk</option>
                    <option value="behind">Behind</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="view-toggle">
                <button
                  className={viewMode === 'grid' ? 'active' : ''}
                  onClick={() => setViewMode('grid')}
                >
                  <FiGrid />
                </button>
                <button
                  className={viewMode === 'list' ? 'active' : ''}
                  onClick={() => setViewMode('list')}
                >
                  <FiList />
                </button>
              </div>
            </div>

            <div className={`projects-grid ${viewMode}`}>
              {filteredProjects.map((project) => (
                <Link to={`/projects/${project.id}`} key={project.id} className="project-card">
                  <div className="project-header">
                    <h3>{project.name}</h3>
                    {getPriorityIcon(project.priority)}
                  </div>
                  <p className="project-description">{project.description}</p>
                  <div className="project-meta">
                    <span className={`status-badge ${project.status}`}>
                      {project.status.replace('-', ' ')}
                    </span>
                    <span className="meta-item">
                      <FiClock />
                      {new Date(project.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${project.progress}%`,
                        background: project.status === 'completed'
                          ? 'var(--primary-color)'
                          : project.status === 'at-risk'
                          ? 'var(--warning-color)'
                          : project.status === 'behind'
                          ? 'var(--error-color)'
                          : 'var(--success-color)',
                      }}
                    />
                  </div>
                  <div className="project-footer">
                    <div className="project-team">
                      {project.team.slice(0, 3).map((member) => (
                        <div
                          key={member.id}
                          className="team-avatar"
                          style={{
                            background: `hsl(${Math.random() * 360}, 70%, 50%)`,
                          }}
                        >
                          {getInitials(member.name)}
                        </div>
                      ))}
                      {project.team.length > 3 && (
                        <div className="team-avatar more">
                          +{project.team.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="project-tags">
                      {project.tags.map((tag, index) => (
                        <span key={index} className="tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProjectsPage;
