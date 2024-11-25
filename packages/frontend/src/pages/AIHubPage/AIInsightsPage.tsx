import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import AIInsights from '../../components/AIInsights/AIInsights';

const AIInsightsPage: React.FC = () => {
  const mockDeals = [
    {
      id: '1',
      name: 'Enterprise Software Solution',
      value: 150000,
      probability: 75,
      stage: 'Proposal',
      company: 'Tech Corp',
      dueDate: '2024-12-15',
      contacts: ['John Smith', 'Sarah Johnson'],
    },
    {
      id: '2',
      name: 'Cloud Migration Project',
      value: 85000,
      probability: 60,
      stage: 'First meeting',
      company: 'Cloud Systems Inc',
      dueDate: '2024-11-30',
      contacts: ['Mike Wilson'],
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'var(--background-primary)', pt: 3, pb: 6 }}>
      <Container maxWidth="xl">
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: "'Lexend', sans-serif",
            fontWeight: 700,
            color: 'var(--text-primary)',
            mb: 3
          }}
        >
          AI Insights
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: 'var(--text-secondary)',
            mb: 4 
          }}
        >
          Data-driven insights powered by AI
        </Typography>
        
        <AIInsights deals={mockDeals} />
      </Container>
    </Box>
  );
};

export default AIInsightsPage;
