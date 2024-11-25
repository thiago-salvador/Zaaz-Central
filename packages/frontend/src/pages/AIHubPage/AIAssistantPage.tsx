import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import AIAssistant from '../../components/AIAssistant/AIAssistant';

const AIAssistantPage: React.FC = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--background-primary)', pt: 3, pb: 6 }}>
      <Container maxWidth="xl">
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: "'Lexend', sans-serif",
            fontWeight: 700,
            color: 'var(--text-primary)',
            mb: 2
          }}
        >
          AI Assistant
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'var(--text-secondary)',
            mb: 4 
          }}
        >
          Your intelligent AI-powered assistant
        </Typography>
        
        <AIAssistant />
      </Container>
    </Box>
  );
};

export default AIAssistantPage;
