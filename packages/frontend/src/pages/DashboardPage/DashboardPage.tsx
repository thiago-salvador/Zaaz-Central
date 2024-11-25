import React from 'react';
import Header from '../../components/Header/Header';
import Sidebar from '../../components/Sidebar/Sidebar';
import { Dashboard } from '../../components/Dashboard/Dashboard';
import './DashboardPage.css';

const DashboardPage: React.FC = () => {
  return (
    <div className="dashboard-page">
      <Header />
      <div className="content-wrapper">
        <Sidebar />
        <main className="main-content">
          <div className="dashboard-container">
            <Dashboard />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;
