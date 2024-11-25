import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IntroPage from './pages/IntroPage/IntroPage';
import Home from './components/Home/Home';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import ProjectsPage from './pages/ProjectsPage/ProjectsPage';
import KanbanBoard from './pages/ProjectsPage/KanbanBoard';
import MeetingSummarizerPage from './pages/MeetingSummarizerPage/MeetingSummarizerPage';
import AIHubPage from './pages/AIHubPage/AIHubPage';
import BusinessPipelinePage from './pages/BusinessPipelinePage/BusinessPipelinePage';
import BusinessAnalyzerPage from './pages/BusinessAnalyzerPage/BusinessAnalyzerPage';
import Layout from './components/Layout/Layout';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<IntroPage />} />
        <Route element={<Layout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/kanban" element={<KanbanBoard />} />
          <Route path="/meeting-summarizer" element={<MeetingSummarizerPage />} />
          <Route path="/ai-hub/*" element={<AIHubPage />} />
          <Route path="/business-pipeline" element={<BusinessPipelinePage />} />
          <Route path="/business-analyzer" element={<BusinessAnalyzerPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
