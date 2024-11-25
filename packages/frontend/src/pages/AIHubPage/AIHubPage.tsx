import React from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import { FiCpu, FiMessageSquare, FiTool } from 'react-icons/fi';
import AIAssistantPage from './AIAssistantPage';
import AIInsightsPage from './AIInsightsPage';
import AIToolsPage from './AIToolsPage';

const AIHubPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Container maxWidth="xl" sx={{ pt: 3, pb: 2 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: "'Lexend', sans-serif",
            fontWeight: 700,
            color: 'var(--text)',
            mb: 2
          }}
        >
          AI Hub
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'var(--text-secondary)',
            mb: 3
          }}
        >
          Your intelligent hub for AI-powered assistance and insights
        </Typography>

        <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
          <Button
            variant={location.pathname === '/ai-hub/assistant' ? 'contained' : 'outlined'}
            onClick={() => navigate('/ai-hub/assistant')}
            startIcon={<FiMessageSquare />}
            sx={{
              color: location.pathname === '/ai-hub/assistant' ? 'white' : 'var(--text)',
              borderColor: 'var(--border-color)',
              '&:hover': {
                borderColor: 'var(--border-color)',
                backgroundColor: location.pathname === '/ai-hub/assistant' 
                  ? 'var(--primary-dark)' 
                  : 'var(--background-light)'
              }
            }}
          >
            AI Assistant
          </Button>

          <Button
            variant={location.pathname === '/ai-hub/tools' ? 'contained' : 'outlined'}
            onClick={() => navigate('/ai-hub/tools')}
            startIcon={<FiTool />}
            sx={{
              color: location.pathname === '/ai-hub/tools' ? 'white' : 'var(--text)',
              borderColor: 'var(--border-color)',
              '&:hover': {
                borderColor: 'var(--border-color)',
                backgroundColor: location.pathname === '/ai-hub/tools' 
                  ? 'var(--primary-dark)' 
                  : 'var(--background-light)'
              }
            }}
          >
            AI Tools
          </Button>

          <Button
            variant={location.pathname === '/ai-hub/insights' ? 'contained' : 'outlined'}
            onClick={() => navigate('/ai-hub/insights')}
            startIcon={<FiCpu />}
            sx={{
              color: location.pathname === '/ai-hub/insights' ? 'white' : 'var(--text)',
              borderColor: 'var(--border-color)',
              '&:hover': {
                borderColor: 'var(--border-color)',
                backgroundColor: location.pathname === '/ai-hub/insights' 
                  ? 'var(--primary-dark)' 
                  : 'var(--background-light)'
              }
            }}
          >
            AI Insights
          </Button>
        </Stack>
      </Container>

      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Navigate to="assistant" replace />} />
            <Route path="assistant" element={<AIAssistantPage />} />
            <Route path="tools" element={<AIToolsPage />} />
            <Route path="insights" element={<AIInsightsPage />} />
          </Routes>
        </Container>
      </Box>
    </Box>
  );
};

export default AIHubPage;