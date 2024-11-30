import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Menu,
  MenuItem,
  Tooltip,
} from '@mui/material';
import {
  FiTrendingUp,
  FiUsers,
  FiTarget,
  FiSearch,
  FiCalendar,
  FiDownload,
  FiShare2,
  FiMessageSquare,
  FiFilter,
  FiMoreVertical,
  FiArrowUp,
  FiArrowDown,
} from 'react-icons/fi';
import { chatService } from '../../services/chatService';

// Mock data for insights
const mockInsights = {
  marketTrends: [
    {
      id: 1,
      title: 'Market Growth Opportunity',
      description: 'AI analysis suggests 15% growth potential in APAC region',
      impact: 'High',
      confidence: 85,
      trend: 'up',
      category: 'Market Trends',
      date: '2024-03-15',
    },
    // Add more market trend insights
  ],
  customerBehavior: [
    {
      id: 2,
      title: 'Customer Retention Pattern',
      description: 'Identified key factors driving customer loyalty',
      impact: 'Medium',
      confidence: 78,
      trend: 'up',
      category: 'Customer Behavior',
      date: '2024-03-14',
    },
    // Add more customer behavior insights
  ],
  competitiveAnalysis: [
    {
      id: 3,
      title: 'Competitor Strategy Shift',
      description: 'Major competitor focusing on digital transformation',
      impact: 'High',
      confidence: 92,
      trend: 'down',
      category: 'Competitive Analysis',
      date: '2024-03-13',
    },
    // Add more competitive analysis insights
  ],
};

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AIInsightsPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInsight, setSelectedInsight] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I am your AI assistant. How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    setFilterAnchor(event.currentTarget);
  };

  const handleFilterClose = () => {
    setFilterAnchor(null);
  };

  const handleInsightClick = (insight: any) => {
    setSelectedInsight(insight);
  };

  const getInsightsByCategory = () => {
    switch (selectedTab) {
      case 0:
        return mockInsights.marketTrends;
      case 1:
        return mockInsights.customerBehavior;
      case 2:
        return mockInsights.competitiveAnalysis;
      default:
        return [];
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputMessage,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      const currentMessage = inputMessage;
      setInputMessage('');
      setIsLoading(true);

      const response = await chatService.sendMessage(currentMessage);
      console.log('Response from Langflow:', response);

      if (response && response.message) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      console.error('Error in handleSendMessage:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `Error: ${error.message || 'There was an error processing your request. Please try again.'}`,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: (theme) => theme.palette.background.default, pt: 3, pb: 6 }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: (theme) => theme.palette.text.primary, mb: 2 }}>
            AI Insights
          </Typography>
          <Typography variant="body1" sx={{ color: (theme) => theme.palette.text.secondary }}>
            AI-powered analysis and insights to help you make better business decisions
          </Typography>
        </Box>

        {/* Search and Filter Section */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
          <TextField
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              flex: 1,
              maxWidth: 400,
              '& .MuiOutlinedInput-root': {
                bgcolor: (theme) => theme.palette.background.paper,
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <FiSearch />
                </InputAdornment>
              ),
            }}
          />

          <Button
            variant="outlined"
            startIcon={<FiFilter />}
            onClick={handleFilterClick}
            sx={{
              borderColor: (theme) => theme.palette.divider,
              color: (theme) => theme.palette.text.primary,
            }}
          >
            Filter
          </Button>
        </Box>

        {/* Tabs Section */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={selectedTab} onChange={handleTabChange}>
            <Tab label="Market Trends" />
            <Tab label="Customer Behavior" />
            <Tab label="Competitive Analysis" />
          </Tabs>
        </Box>

        {/* Insights Grid */}
        <Grid container spacing={3}>
          {getInsightsByCategory()
            .filter((insight) =>
              insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              insight.description.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((insight) => (
              <Grid item xs={12} md={6} lg={4} key={insight.id}>
                <Card
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: (theme) => theme.shadows[4],
                    },
                  }}
                  onClick={() => handleInsightClick(insight)}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {insight.title}
                      </Typography>
                      <IconButton size="small">
                        <FiMoreVertical />
                      </IconButton>
                    </Box>

                    <Typography variant="body2" sx={{ mb: 2, color: (theme) => theme.palette.text.secondary }}>
                      {insight.description}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                      <Chip
                        size="small"
                        label={`Impact: ${insight.impact}`}
                        sx={{ bgcolor: (theme) => theme.palette.action.hover }}
                      />
                      <Chip
                        size="small"
                        label={`${insight.confidence}% Confidence`}
                        sx={{ bgcolor: (theme) => theme.palette.action.hover }}
                      />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <FiCalendar size={14} />
                      <Typography variant="caption" sx={{ color: (theme) => theme.palette.text.secondary }}>
                        {new Date(insight.date).toLocaleDateString()}
                      </Typography>
                      {insight.trend === 'up' ? (
                        <FiArrowUp color="green" />
                      ) : (
                        <FiArrowDown color="red" />
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
        </Grid>

        {/* Filter Menu */}
        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={handleFilterClose}
          sx={{
            '& .MuiPaper-root': {
              bgcolor: (theme) => theme.palette.background.paper,
              boxShadow: (theme) => theme.shadows[4],
            },
          }}
        >
          <MenuItem onClick={handleFilterClose}>High Impact</MenuItem>
          <MenuItem onClick={handleFilterClose}>Medium Impact</MenuItem>
          <MenuItem onClick={handleFilterClose}>Low Impact</MenuItem>
          <MenuItem onClick={handleFilterClose}>High Confidence</MenuItem>
          <MenuItem onClick={handleFilterClose}>Recent First</MenuItem>
        </Menu>

        {/* Insight Detail Dialog */}
        <Dialog
          open={Boolean(selectedInsight)}
          onClose={() => setSelectedInsight(null)}
          maxWidth="md"
          fullWidth
        >
          {selectedInsight && (
            <>
              <DialogTitle>{selectedInsight.title}</DialogTitle>
              <DialogContent>
                <Typography variant="body1" paragraph>
                  {selectedInsight.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <Chip label={`Impact: ${selectedInsight.impact}`} />
                  <Chip label={`${selectedInsight.confidence}% Confidence`} />
                  <Chip label={selectedInsight.category} />
                </Box>
                <Typography variant="body2" sx={{ color: (theme) => theme.palette.text.secondary }}>
                  Generated on {new Date(selectedInsight.date).toLocaleDateString()}
                </Typography>
              </DialogContent>
              <DialogActions>
                <Button startIcon={<FiShare2 />}>Share</Button>
                <Button startIcon={<FiDownload />}>Download</Button>
                <Button startIcon={<FiMessageSquare />}>Add Comment</Button>
                <Button variant="contained" onClick={() => setSelectedInsight(null)}>
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>

        {/* Chat Interface */}
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, width: 400, height: 500, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 4, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">AI Assistant</Typography>
            <IconButton size="small">
              <FiMessageSquare />
            </IconButton>
          </Box>
          
          <Box sx={{ flex: 1, p: 2, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  alignSelf: message.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  bgcolor: message.sender === 'user' ? 'primary.main' : 'background.default',
                  color: message.sender === 'user' ? 'primary.contrastText' : 'text.primary',
                  p: 2,
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2">{message.text}</Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                  {message.timestamp.toLocaleTimeString()}
                </Typography>
              </Box>
            ))}
            {isLoading && (
              <Box sx={{ alignSelf: 'flex-start', p: 2 }}>
                <Typography variant="body2">Thinking...</Typography>
              </Box>
            )}
          </Box>

          <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
            <TextField
              fullWidth
              placeholder="Ask me anything..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSendMessage} disabled={isLoading || !inputMessage.trim()}>
                      <FiMessageSquare />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AIInsightsPage;
