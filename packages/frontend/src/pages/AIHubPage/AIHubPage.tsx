import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ThemeProvider,
  createTheme,
  CssBaseline,
  alpha,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  FiCommand,
  FiDatabase,
  FiTool,
  FiTrendingUp,
  FiZap,
  FiCode,
  FiCpu,
} from 'react-icons/fi';
import { Chat } from '../../components/ChatHistory/types';
import { generateInsights } from '../../services/mistral';
import { Insight, InsightsState } from '../../types/insights';

// Create a custom theme for dark mode
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3B82F6', // Blue
    },
    secondary: {
      main: '#10B981', // Green
    },
    background: {
      default: 'transparent',
      paper: '#1A1A1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: 'rgba(255, 255, 255, 0.7)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1A1A1A',
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1A1A1A',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
          },
        },
      },
    },
  },
});

const StyledIcon = ({ 
  icon: Icon, 
  color = 'primary',
  ...props 
}: { 
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  [key: string]: any; 
}) => {
  const theme = darkTheme;
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 40,
        height: 40,
        borderRadius: '8px',
        backgroundColor: alpha(theme.palette[color].main, 0.1),
        color: theme.palette[color].main,
        marginBottom: 1,
      }}
    >
      <Icon style={{ width: 20, height: 20 }} {...props} />
    </Box>
  );
};

type ToolItem = {
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  title: string;
  description: string;
  color: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
};

type InsightItem = {
  icon: React.ComponentType<{ style?: React.CSSProperties }>;
  title: string;
  description: string;
  tag: string;
  color: 'primary' | 'secondary';
};

const tools: ToolItem[] = [
  {
    icon: FiCode,
    title: 'Code Assistant',
    description: 'Get help with coding tasks and code reviews',
    color: 'primary',
  },
  {
    icon: FiDatabase,
    title: 'Data Analyzer',
    description: 'Analyze and visualize your data',
    color: 'secondary',
  },
  {
    icon: FiCpu,
    title: 'Process Optimizer',
    description: 'Optimize your workflows and processes',
    color: 'primary',
  },
];

const insights: InsightItem[] = [
  {
    icon: FiTrendingUp,
    title: 'Performance Analysis',
    description: 'AI-driven insights about system performance',
    tag: 'New',
    color: 'primary',
  },
  {
    icon: FiZap,
    title: 'Code Quality Report',
    description: 'Weekly analysis of code quality metrics',
    tag: 'Updated',
    color: 'secondary',
  },
];

interface ChatData {
  id: string;
  title: string;
  date: string;
  userId: string;
}

export const AIHubPage = () => {
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [insightsState, setInsights] = useState<InsightsState>({
    items: [],
    loading: false,
    error: null,
  });

  const handleNewChat = () => {
    const newChat: ChatData = {
      id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      title: 'New Chat',
      date: new Date().toISOString(),
      userId: 'user123', // Replace with actual user ID
    };
    setChats(prev => [newChat, ...prev]);
    setCurrentChatId(newChat.id);
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => prev.filter(chat => chat.id !== chatId));
    if (currentChatId === chatId) {
      setCurrentChatId(null);
    }
  };

  const handleSendMessage = async (message: string): Promise<string> => {
    setIsLoading(true);
    try {
      const response = await generateInsights([message]);
      return response[0] || 'I apologize, but I was unable to generate a response.';
    } catch (error) {
      console.error('Error sending message:', error);
      return 'I apologize, but an error occurred while processing your message.';
    } finally {
      setIsLoading(false);
    }
  };

  const resetInsights = () => {
    setInsights({
      items: [],
      loading: false,
      error: null,
    });
  };

  const generateNewInsights = async () => {
    setInsights(prev => ({ ...prev, loading: true, error: null }));
    try {
      // Get chat history from localStorage
      const savedChats = localStorage.getItem('zaaz_chat_history');
      if (!savedChats) {
        throw new Error('No chat history found');
      }

      const chatHistory = JSON.parse(savedChats);
      const messages = chatHistory.map((chat: any) => chat.title).filter(Boolean);

      if (messages.length === 0) {
        throw new Error('No chat messages found');
      }

      const newInsights = await generateInsights(messages);
      
      const formattedInsights: Insight[] = newInsights.map(content => ({
        id: `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content,
        timestamp: new Date().toISOString(),
      }));

      setInsights(prev => ({
        items: [...formattedInsights, ...prev.items].slice(0, 10), // Keep only last 10 insights
        loading: false,
        error: null,
      }));
    } catch (error) {
      setInsights(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to generate insights',
      }));
    }
  };

  // Generate insights periodically or when chat history changes
  useEffect(() => {
    resetInsights(); // Reset insights when component mounts
    const intervalId = setInterval(generateNewInsights, 5 * 60 * 1000); // Every 5 minutes
    generateNewInsights(); // Initial generation
    
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'text.primary' }}>
            AI Hub
          </Typography>
          
          <Grid container spacing={4}>
            {/* Chat Section - Centered with reduced width */}
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Box sx={{ width: '100%', maxWidth: '1000px' }}>
                <Paper
                  elevation={0}
                  sx={{
                    height: '60vh',
                    borderRadius: 2,
                    overflow: 'hidden',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'transparent',
                  }}
                >
                  <iframe
                    src="https://app.vectorshift.ai/chatbots/deployed/674a0e19d7509779a7bda984"
                    style={{
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    title="Vectorshift Chat"
                  />
                </Paper>
              </Box>
            </Grid>

            {/* AI Tools Section */}
            <Grid item xs={12} md={6}>
              <Box>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiTool style={{ strokeWidth: 2.5 }} />
                  <Typography variant="h6">
                    AI Tools
                  </Typography>
                </Box>
                <Grid container spacing={3}>
                  {tools.map((tool, index) => (
                    <Grid item xs={12} md={4} key={index}>
                      <Card>
                        <CardContent sx={{ p: 3 }}>
                          <StyledIcon icon={tool.icon} color={tool.color} />
                          <Typography variant="h6" gutterBottom>
                            {tool.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {tool.description}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label="Try Now" 
                              size="small" 
                              color={tool.color}
                              sx={{ 
                                borderRadius: '6px',
                                fontWeight: 500,
                              }} 
                            />
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Grid>

            {/* AI Insights Section */}
            <Grid item xs={12} md={6}>
              <Box>
                <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiZap style={{ strokeWidth: 2.5 }} />
                  <Typography variant="h6">
                    AI Insights
                  </Typography>
                </Box>
                <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <List>
                    {insightsState.loading ? (
                      <ListItem>
                        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', py: 2 }}>
                          <CircularProgress size={24} />
                        </Box>
                      </ListItem>
                    ) : insightsState.error ? (
                      <ListItem>
                        <ListItemText
                          primary="Error generating insights"
                          secondary={insightsState.error}
                          sx={{ color: 'error.main' }}
                        />
                      </ListItem>
                    ) : insightsState.items.length === 0 ? (
                      <ListItem>
                        <ListItemText
                          primary="No insights yet"
                          secondary="Start chatting to generate insights"
                        />
                      </ListItem>
                    ) : (
                      insightsState.items.map((insight, index) => (
                        <React.Fragment key={insight.id}>
                          <ListItem>
                            <ListItemText
                              primary={insight.content}
                              secondary={new Date(insight.timestamp).toLocaleString()}
                              primaryTypographyProps={{
                                sx: { fontWeight: index === 0 ? 500 : 400 }
                              }}
                            />
                          </ListItem>
                          {index < insightsState.items.length - 1 && <Divider />}
                        </React.Fragment>
                      ))
                    )}
                  </List>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AIHubPage;