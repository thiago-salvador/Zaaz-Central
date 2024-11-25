import React from 'react';
import { Dashboard } from '../Dashboard/Dashboard';
import { Collective } from '../Collective/Collective';
import News from '../News/News';
import './Home.css';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      <div className="content-area">
        <div className="content-grid">
          <Dashboard />
          <News />
          <Collective />
        </div>
      </div>
    </div>
  );
};

export default Home;
