import React from 'react';
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
import { CopilotChat } from '../../components/CopilotChat/CopilotChat';

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
      default: '#111827',
      paper: '#1F2937',
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
          transition: 'transform 0.2s, box-shadow 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.2)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
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

export const AIHubPage: React.FC = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ mb: 4, color: 'text.primary' }}>
            AI Hub
          </Typography>
          
          <Grid container spacing={4}>
            {/* Left column - Tools and Insights */}
            <Grid item xs={12} lg={8}>
              {/* AI Tools Section */}
              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiTool style={{ strokeWidth: 2.5 }} />
                  AI Tools
                </Typography>
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

              {/* AI Insights Section */}
              <Box>
                <Typography variant="h5" gutterBottom sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FiZap style={{ strokeWidth: 2.5 }} />
                  AI Insights
                </Typography>
                <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                  <List>
                    {insights.map((insight, index) => (
                      <ListItem 
                        disablePadding 
                        key={index}
                        divider={index !== insights.length - 1}
                      >
                        <ListItemButton sx={{ py: 2 }}>
                          <ListItemIcon>
                            <StyledIcon icon={insight.icon} color={insight.color} />
                          </ListItemIcon>
                          <ListItemText 
                            primary={insight.title}
                            secondary={insight.description}
                            primaryTypographyProps={{ 
                              fontWeight: 500,
                              sx: { color: 'text.primary' }
                            }}
                            secondaryTypographyProps={{
                              sx: { color: 'text.secondary' }
                            }}
                          />
                          <Chip 
                            label={insight.tag} 
                            size="small"
                            color={insight.color}
                            sx={{ 
                              ml: 2,
                              borderRadius: '6px',
                              fontWeight: 500,
                            }}
                          />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Box>
            </Grid>

            {/* Right column - Chat */}
            <Grid item xs={12} lg={4}>
              <Paper
                elevation={0}
                sx={{
                  height: 'calc(100vh - 140px)',
                  position: 'sticky',
                  top: 32,
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box sx={{ 
                  p: 2, 
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <FiCommand style={{ strokeWidth: 2.5 }} />
                  <Typography variant="h6">
                    Zaaz AI Assistant
                  </Typography>
                </Box>
                <Box sx={{ height: 'calc(100% - 57px)' }}>
                  <CopilotChat />
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default AIHubPage;