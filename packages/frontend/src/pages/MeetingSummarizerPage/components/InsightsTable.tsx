import React from 'react';
import {
  Box,
  Chip,
  Stack,
  Typography,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  FiFlag,
  FiCheckCircle,
  FiAlertCircle,
  FiClock,
} from 'react-icons/fi';
import { Meeting } from '../../../types/shared';
import { styled } from '@mui/material/styles';

interface InsightsTableProps {
  meeting: Meeting;
  confidenceScore: number;
}

const StyledContainer = styled(Paper)(({ theme }) => ({
  backgroundColor: 'var(--card-background)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  overflow: 'hidden',
}));

const InsightsTable: React.FC<InsightsTableProps> = ({ meeting, confidenceScore }) => {
  if (!meeting?.insights) return null;

  const { keyTopics, actionItems, sentimentAnalysis } = meeting.insights;

  return (
    <StyledContainer>
      <Box sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>
            Meeting Insights
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
              AI Confidence:
            </Typography>
            <Box sx={{ width: 100, mr: 1 }}>
              <LinearProgress
                variant="determinate"
                value={confidenceScore * 100}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'var(--background-secondary)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'var(--primary-color)',
                  },
                }}
              />
            </Box>
            <Typography variant="body2" sx={{ color: 'var(--text-primary)' }}>
              {Math.round(confidenceScore * 100)}%
            </Typography>
          </Stack>
        </Stack>

        <Stack spacing={3}>
          <Box>
            <Typography variant="subtitle1" sx={{ color: 'var(--text-primary)', mb: 2 }}>
              Key Topics
            </Typography>
            <Stack direction="row" flexWrap="wrap" gap={1}>
              {keyTopics.map((topic, index) => (
                <Chip
                  key={index}
                  label={topic}
                  icon={<FiFlag />}
                  sx={{
                    bgcolor: 'var(--primary-light)',
                    color: 'var(--primary-color)',
                    '& .MuiChip-icon': {
                      color: 'var(--primary-color)',
                    },
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ color: 'var(--text-primary)', mb: 2 }}>
              Action Items
            </Typography>
            <Stack spacing={2}>
              {actionItems.map((item, index) => (
                <Paper
                  key={index}
                  sx={{
                    p: 2,
                    bgcolor: 'var(--background-secondary)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="body1" sx={{ color: 'var(--text-primary)', mb: 0.5 }}>
                        {item.description}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          size="small"
                          label={item.assignee}
                          sx={{ bgcolor: 'var(--primary-light)', color: 'var(--primary-color)' }}
                        />
                        <Chip
                          size="small"
                          label={item.priority}
                          sx={{ 
                            bgcolor: item.priority === 'high' 
                              ? 'var(--error-light)' 
                              : item.priority === 'medium'
                              ? 'var(--warning-light)'
                              : 'var(--success-light)',
                            color: item.priority === 'high'
                              ? 'var(--error-color)'
                              : item.priority === 'medium'
                              ? 'var(--warning-color)'
                              : 'var(--success-color)',
                          }}
                        />
                      </Stack>
                    </Box>
                    <Chip
                      size="small"
                      label={item.status}
                      sx={{
                        bgcolor: item.status === 'completed'
                          ? 'var(--success-light)'
                          : item.status === 'in-progress'
                          ? 'var(--warning-light)'
                          : 'var(--error-light)',
                        color: item.status === 'completed'
                          ? 'var(--success-color)'
                          : item.status === 'in-progress'
                          ? 'var(--warning-color)'
                          : 'var(--error-color)',
                      }}
                    />
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ color: 'var(--text-primary)', mb: 2 }}>
              Sentiment Analysis
            </Typography>
            <Chip
              icon={
                sentimentAnalysis.overall === 'positive' ? <FiCheckCircle /> :
                sentimentAnalysis.overall === 'negative' ? <FiAlertCircle /> :
                <FiClock />
              }
              label={`${sentimentAnalysis.overall.charAt(0).toUpperCase()}${sentimentAnalysis.overall.slice(1)} Sentiment`}
              sx={{
                bgcolor: sentimentAnalysis.overall === 'positive'
                  ? 'var(--success-light)'
                  : sentimentAnalysis.overall === 'negative'
                  ? 'var(--error-light)'
                  : 'var(--warning-light)',
                color: sentimentAnalysis.overall === 'positive'
                  ? 'var(--success-color)'
                  : sentimentAnalysis.overall === 'negative'
                  ? 'var(--error-color)'
                  : 'var(--warning-color)',
                '& .MuiChip-icon': {
                  color: 'inherit',
                },
              }}
            />
          </Box>
        </Stack>
      </Box>
    </StyledContainer>
  );
};

export default InsightsTable;
