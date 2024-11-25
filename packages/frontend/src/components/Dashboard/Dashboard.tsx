import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  FiActivity, FiAlertCircle, FiCheckCircle, FiClock, FiRefreshCw, 
  FiTrendingUp, FiFilter, FiPlus, FiUsers, FiTarget, FiZap 
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import './Dashboard.css';

interface Task {
  id: string;
  title: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: string;
  status: 'completed' | 'in-progress' | 'pending';
  assignee?: string;
}

interface Insight {
  id: string;
  type: 'performance' | 'trend' | 'alert';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  value: string;
  trend: number;
}

interface ChartData {
  name: string;
  value: number;
  target: number;
}

interface StatCard {
  title: string;
  value: string | number;
  trend: number;
  icon: IconType;
}

type TaskFilterType = Task['status'] | 'all';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete Project Proposal',
    priority: 'high',
    dueDate: '2024-01-25',
    status: 'in-progress',
    assignee: 'Alex Chen'
  },
  {
    id: '2',
    title: 'Review Code Changes',
    priority: 'medium',
    dueDate: '2024-01-24',
    status: 'pending',
    assignee: 'Sarah Kim'
  },
  {
    id: '3',
    title: 'Update Documentation',
    priority: 'low',
    dueDate: '2024-01-23',
    status: 'completed',
    assignee: 'Mike Johnson'
  },
  {
    id: '4',
    title: 'Deploy New Features',
    priority: 'high',
    dueDate: '2024-01-26',
    status: 'pending',
    assignee: 'Lisa Wong'
  }
];

const mockStatCards: StatCard[] = [
  {
    title: 'Active Users',
    value: '2,847',
    trend: 12,
    icon: FiUsers
  },
  {
    title: 'Task Completion',
    value: '87%',
    trend: 5,
    icon: FiCheckCircle
  },
  {
    title: 'System Load',
    value: '65%',
    trend: -8,
    icon: FiZap
  },
  {
    title: 'Sprint Progress',
    value: '73%',
    trend: 15,
    icon: FiTarget
  }
];

const mockInsights: Insight[] = [
  {
    id: '1',
    type: 'performance',
    title: 'System Performance',
    description: 'Response time improved by 25% this week',
    impact: 'high',
    value: '120ms',
    trend: 25
  },
  {
    id: '2',
    type: 'trend',
    title: 'User Engagement',
    description: 'Active users increased by 15%',
    impact: 'medium',
    value: '2.5k',
    trend: 15
  },
  {
    id: '3',
    type: 'alert',
    title: 'Memory Usage Alert',
    description: 'Memory usage approaching threshold',
    impact: 'high',
    value: '85%',
    trend: -10
  }
];

const mockChartData: ChartData[] = [
  { name: 'Jan', value: 65, target: 70 },
  { name: 'Feb', value: 75, target: 70 },
  { name: 'Mar', value: 85, target: 75 },
  { name: 'Apr', value: 82, target: 80 },
  { name: 'May', value: 90, target: 85 },
  { name: 'Jun', value: 95, target: 85 }
];

const getStatusIcon = (status: Task['status']): IconType => {
  switch (status) {
    case 'completed':
      return FiCheckCircle;
    case 'in-progress':
      return FiActivity;
    default:
      return FiClock;
  }
};

const getInsightIcon = (type: Insight['type']): IconType => {
  switch (type) {
    case 'performance':
      return FiActivity;
    case 'trend':
      return FiTrendingUp;
    case 'alert':
      return FiAlertCircle;
    default:
      return FiActivity;
  }
};

export const Dashboard: React.FC = () => {
  const [tasks] = useState<Task[]>(mockTasks);
  const [insights] = useState<Insight[]>(mockInsights);
  const [chartData] = useState<ChartData[]>(mockChartData);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [taskFilter, setTaskFilter] = useState<TaskFilterType>('all');

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  }, []);

  useEffect(() => {
    handleRefresh();
  }, [handleRefresh]);

  const filteredTasks = tasks.filter(task => 
    taskFilter === 'all' ? true : task.status === taskFilter
  );

  return (
    <div className="dashboard">
      <div className="section-header">
        <h2 className="section-title">Dashboard</h2>
        <button
          className={`refresh-button ${isRefreshing ? 'refreshing' : ''}`}
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <FiRefreshCw />
          <span>Refresh</span>
        </button>
      </div>

      <div className="stat-cards">
        {mockStatCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon">
              <stat.icon />
            </div>
            <div className="stat-content">
              <h3>{stat.title}</h3>
              <div className="stat-value">
                {stat.value}
                <span className={`trend ${stat.trend > 0 ? 'positive' : 'negative'}`}>
                  {stat.trend > 0 ? '+' : ''}{stat.trend}%
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card performance-chart">
          <div className="card-header">
            <h3>Performance Metrics</h3>
            <div className="chart-legend">
              <span className="legend-item">
                <span className="legend-color value"></span>
                Actual
              </span>
              <span className="legend-item">
                <span className="legend-color target"></span>
                Target
              </span>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis
                  dataKey="name"
                  stroke="var(--text-secondary)"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  stroke="var(--text-secondary)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--card-background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '4px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="var(--primary-color)"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="var(--text-secondary)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card tasks-section">
          <div className="card-header">
            <h3>Active Tasks</h3>
            <div className="task-controls">
              <div className="filter-dropdown">
                <FiFilter />
                <select 
                  value={taskFilter} 
                  onChange={(e) => setTaskFilter(e.target.value as TaskFilterType)}
                >
                  <option value="all">All Tasks</option>
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
              <button className="add-task-button">
                <FiPlus />
                <span>Add Task</span>
              </button>
            </div>
          </div>
          <div className="tasks-list">
            {filteredTasks.map((task) => (
              <div key={task.id} className={`task-item ${task.status}`}>
                {React.createElement(getStatusIcon(task.status), {
                  className: 'task-icon'
                })}
                <div className="task-content">
                  <div className="task-title">{task.title}</div>
                  <div className="task-meta">
                    <span className={`task-priority ${task.priority}`}>
                      {task.priority}
                    </span>
                    <span className="task-assignee">{task.assignee}</span>
                    <span className="task-due">Due: {task.dueDate}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="dashboard-card insights-section">
          <div className="card-header">
            <h3>System Insights</h3>
          </div>
          <div className="insights-list">
            {insights.map((insight) => (
              <div key={insight.id} className={`insight-item ${insight.impact}`}>
                {React.createElement(getInsightIcon(insight.type), {
                  className: 'insight-icon'
                })}
                <div className="insight-content">
                  <div className="insight-header">
                    <h4>{insight.title}</h4>
                    <span className={`trend ${insight.trend > 0 ? 'positive' : 'negative'}`}>
                      {insight.trend > 0 ? '+' : ''}{insight.trend}%
                    </span>
                  </div>
                  <p>{insight.description}</p>
                  <div className="insight-value">{insight.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
