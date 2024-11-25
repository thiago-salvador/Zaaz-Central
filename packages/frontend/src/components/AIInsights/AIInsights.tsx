import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
  Tooltip,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  FiArrowUp,
  FiArrowDown,
  FiSearch,
  FiDownload,
  FiShare2,
  FiRefreshCw,
  FiFilter,
  FiCheck,
} from 'react-icons/fi';
import {
  TrendingUp as TrendingUpIcon,
  AccessTime as AccessTimeIcon,
  MonetizationOn as MonetizationOnIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Mock data with enhanced details
const aiInsights = [
  {
    id: 1,
    category: 'Performance Analysis',
    title: 'Code Quality Improvement',
    description: 'AI analysis suggests potential for 15% improvement in code quality through better error handling and documentation.',
    impact: 'High',
    confidence: 92,
    suggestedActions: [
      'Implement try-catch blocks in critical sections',
      'Add JSDoc comments for complex functions',
      'Create unit tests for edge cases'
    ],
    timeline: '2 weeks',
    priority: 1
  },
  {
    id: 2,
    category: 'Security',
    title: 'Vulnerability Detection',
    description: 'Identified 3 potential security vulnerabilities in API authentication flow.',
    impact: 'Critical',
    confidence: 95,
    suggestedActions: [
      'Update authentication middleware',
      'Implement rate limiting',
      'Add input validation'
    ],
    timeline: '1 week',
    priority: 1
  },
  {
    id: 3,
    category: 'Optimization',
    title: 'Performance Bottlenecks',
    description: 'Database queries in the user management module could be optimized for better performance.',
    impact: 'Medium',
    confidence: 88,
    suggestedActions: [
      'Add database indexes',
      'Implement query caching',
      'Optimize join operations'
    ],
    timeline: '3 days',
    priority: 2
  },
  {
    id: 4,
    category: 'Architecture',
    title: 'Code Architecture Review',
    description: 'Suggested improvements in module organization and dependency management.',
    impact: 'Medium',
    confidence: 85,
    suggestedActions: [
      'Refactor module structure',
      'Update dependency injection',
      'Implement design patterns'
    ],
    timeline: '1 month',
    priority: 3
  }
];

const predictiveAnalysis = {
  codeQuality: {
    current: 85,
    predicted: 92,
    confidence: 90,
    improvements: [
      'Better error handling',
      'Increased test coverage',
      'Cleaner code structure'
    ]
  },
  security: {
    current: 78,
    predicted: 95,
    confidence: 88,
    improvements: [
      'Enhanced authentication',
      'Secure data handling',
      'Regular security audits'
    ]
  },
  performance: {
    current: 82,
    predicted: 90,
    confidence: 85,
    improvements: [
      'Query optimization',
      'Caching implementation',
      'Load balancing'
    ]
  }
};

const darkThemeColors = {
  primary: '#6366f1',
  secondary: '#22d3ee',
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  background: {
    paper: 'rgba(30, 41, 59, 0.95)',
    default: '#0f172a',
  },
  text: {
    primary: '#f8fafc',
    secondary: '#94a3b8',
  },
  chart: {
    gradient1: ['#6366f1', '#22d3ee'],
    gradient2: ['#22d3ee', '#22c55e'],
    gradient3: ['#f59e0b', '#ef4444'],
  },
};

interface AIInsightsProps {
  deals: any[];
}

const AIInsights: React.FC<AIInsightsProps> = ({ deals }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null);

  const categories = Array.from(new Set(aiInsights.map(insight => insight.category)));

  const filteredInsights = aiInsights.filter(insight => {
    const matchesCategory = selectedCategory === 'all' || insight.category === selectedCategory;
    const matchesSearch = insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         insight.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Box sx={{ p: 3, bgcolor: darkThemeColors.background.default, minHeight: '100vh' }}>
      {/* Header Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600, color: darkThemeColors.text.primary }}>
          AI Insights
        </Typography>
      </Box>

      {/* Search and Filter */}
      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          size="small"
          placeholder="Search insights..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <FiSearch color={darkThemeColors.text.secondary} />
              </InputAdornment>
            ),
            sx: {
              bgcolor: darkThemeColors.background.paper,
              '& input': { color: darkThemeColors.text.primary },
              '& fieldset': { borderColor: 'rgba(148, 163, 184, 0.2)' },
              '&:hover fieldset': { borderColor: 'rgba(148, 163, 184, 0.3)' },
            }
          }}
          sx={{ width: 300 }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['all', ...categories].map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'contained' : 'outlined'}
              onClick={() => setSelectedCategory(category)}
              size="small"
              sx={{
                bgcolor: selectedCategory === category ? darkThemeColors.primary : 'transparent',
                borderColor: selectedCategory === category ? 'transparent' : 'rgba(148, 163, 184, 0.2)',
                color: selectedCategory === category ? '#fff' : darkThemeColors.text.secondary,
                '&:hover': {
                  bgcolor: selectedCategory === category ? '#4f46e5' : 'rgba(148, 163, 184, 0.1)',
                  borderColor: selectedCategory === category ? 'transparent' : 'rgba(148, 163, 184, 0.3)',
                }
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* AI Insights List */}
        <Grid item xs={12} md={8}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredInsights.map((insight) => (
              <Paper
                key={insight.id}
                sx={{
                  p: 3,
                  bgcolor: darkThemeColors.background.paper,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 16px -2px rgba(0, 0, 0, 0.1)',
                  }
                }}
                onClick={() => setSelectedInsight(insight.id)}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Box>
                    <Typography variant="h6" sx={{ color: darkThemeColors.text.primary, mb: 1 }}>
                      {insight.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: darkThemeColors.text.secondary }}>
                      {insight.description}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                    <Chip
                      label={insight.impact}
                      size="small"
                      sx={{
                        bgcolor: insight.impact === 'Critical' 
                          ? 'rgba(239, 68, 68, 0.1)'
                          : insight.impact === 'High'
                          ? 'rgba(34, 197, 94, 0.1)'
                          : 'rgba(245, 158, 11, 0.1)',
                        color: insight.impact === 'Critical'
                          ? darkThemeColors.error
                          : insight.impact === 'High'
                          ? darkThemeColors.success
                          : darkThemeColors.warning,
                      }}
                    />
                    <Typography variant="caption" sx={{ color: darkThemeColors.text.secondary }}>
                      {insight.confidence}% confidence
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" sx={{ color: darkThemeColors.text.primary, mb: 1 }}>
                    Suggested Actions:
                  </Typography>
                  <List dense>
                    {insight.suggestedActions.map((action, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <FiArrowUp size={12} color={darkThemeColors.primary} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={action}
                          sx={{ 
                            '& .MuiTypography-root': { 
                              color: darkThemeColors.text.secondary,
                              fontSize: '0.875rem'
                            }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </Paper>
            ))}
          </Box>
        </Grid>

        {/* AI Analysis Panel */}
        <Grid item xs={12} md={4}>
          <Paper sx={{
            p: 3,
            bgcolor: darkThemeColors.background.paper,
            borderRadius: 2,
            position: 'sticky',
            top: 24
          }}>
            <Typography variant="h6" sx={{ color: darkThemeColors.text.primary, mb: 3 }}>
              AI Analysis
            </Typography>
            {Object.entries(predictiveAnalysis).map(([key, analysis]) => (
              <Box key={key} sx={{ mb: 3 }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: darkThemeColors.text.primary,
                    textTransform: 'capitalize',
                    mb: 1 
                  }}
                >
                  {key}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                  <Typography variant="h4" sx={{ color: darkThemeColors.primary }}>
                    {analysis.predicted}%
                  </Typography>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: darkThemeColors.success,
                    bgcolor: 'rgba(34, 197, 94, 0.1)',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}>
                    <FiArrowUp size={14} />
                    <Typography variant="body2" sx={{ ml: 0.5 }}>
                      +{analysis.predicted - analysis.current}%
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="caption" sx={{ color: darkThemeColors.text.secondary }}>
                  {analysis.confidence}% confidence
                </Typography>
                <List dense sx={{ mt: 1 }}>
                  {analysis.improvements.map((improvement, index) => (
                    <ListItem key={index} sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 24 }}>
                        <FiCheck size={12} color={darkThemeColors.success} />
                      </ListItemIcon>
                      <ListItemText 
                        primary={improvement}
                        sx={{ 
                          '& .MuiTypography-root': { 
                            color: darkThemeColors.text.secondary,
                            fontSize: '0.875rem'
                          }
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AIInsights;
