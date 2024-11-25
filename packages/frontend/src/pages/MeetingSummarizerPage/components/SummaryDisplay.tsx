import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Chip, 
  Button, 
  LinearProgress,
  useTheme,
  Paper,
  Stack,
  IconButton,
  Tooltip,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import { jsPDF } from 'jspdf';
import {
  FiDownload,
  FiEdit2,
  FiMessageCircle,
  FiBarChart2,
  FiBookmark,
  FiShare2
} from 'react-icons/fi';
import { styled } from '@mui/material/styles';
import { Meeting } from '../../../types/shared';

interface SummaryDisplayProps {
  meeting?: Meeting;
  summary: {
    text: string;
    keyTopics: string[];
    confidenceScore: number;
    actionItems: string[];
    highlights: string[];
    sentiment: {
      overall: 'positive' | 'neutral' | 'negative';
      score: number;
    };
  } | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const StyledPaper = styled(Paper)(({ theme }) => ({
  height: '100%',
  backgroundColor: 'var(--card-background)',
  border: '1px solid var(--border-color)',
  borderRadius: '12px',
  transition: 'all 0.2s ease',
  overflow: 'hidden',
  '&:hover': {
    borderColor: 'var(--primary-color)',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 12px var(--shadow-color)',
  },
}));

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`summary-tabpanel-${index}`}
      aria-labelledby={`summary-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const SummaryDisplay: React.FC<SummaryDisplayProps> = ({ meeting, summary }) => {
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleDownloadPDF = () => {
    if (!summary) return;

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Meeting Summary', 20, 20);
    
    doc.setFontSize(12);
    doc.text('Summary:', 20, 40);
    doc.setFontSize(10);
    const splitText = doc.splitTextToSize(summary.text, 170);
    doc.text(splitText, 20, 50);
    
    doc.save(meeting ? `${meeting.title}-summary.pdf` : 'meeting-summary.pdf');
  };

  if (!summary) {
    return (
      <StyledPaper>
        <Box 
          sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            p: 3,
          }}
        >
          <FiMessageCircle size={48} color="var(--text-secondary)" />
          <Typography sx={{ color: 'var(--text-secondary)' }}>
            Upload or record a meeting to see the summary
          </Typography>
        </Box>
      </StyledPaper>
    );
  }

  return (
    <StyledPaper>
      {meeting && (
        <Box sx={{ p: 3, borderBottom: '1px solid var(--border-color)' }}>
          <Typography variant="h6" sx={{ color: 'var(--text-primary)' }}>
            {meeting.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'var(--text-secondary)' }}>
            {new Date(meeting.date).toLocaleDateString()} • {meeting.duration}
          </Typography>
        </Box>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'var(--border-color)' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{
            '& .MuiTab-root': {
              color: 'var(--text-secondary)',
              '&.Mui-selected': {
                color: 'var(--primary-color)',
              },
            },
            '& .MuiTabs-indicator': {
              backgroundColor: 'var(--primary-color)',
            },
          }}
        >
          <Tab 
            icon={<FiMessageCircle />} 
            iconPosition="start" 
            label="Summary" 
          />
          <Tab 
            icon={<FiBarChart2 />} 
            iconPosition="start" 
            label="Key Points" 
          />
          <Tab 
            icon={<FiBookmark />} 
            iconPosition="start" 
            label="Action Items" 
          />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Stack spacing={2}>
          <Box sx={{ mb: 2 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'var(--text-primary)',
                lineHeight: 1.6,
              }}
            >
              {summary.text}
            </Typography>
          </Box>
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                color: 'var(--text-secondary)',
                mb: 1,
              }}
            >
              Confidence Score
            </Typography>
            <LinearProgress
              variant="determinate"
              value={summary.confidenceScore * 100}
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Chip
              icon={<FiMessageCircle />}
              label={`${summary.sentiment.overall} (${Math.round(summary.sentiment.score * 100)}%)`}
              sx={{ 
                bgcolor: 'var(--primary-light)',
                color: 'var(--primary-color)',
                borderRadius: '8px',
              }}
            />
          </Box>
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Stack spacing={2}>
          {summary.keyTopics.map((topic, index) => (
            <Chip
              key={index}
              label={topic}
              sx={{
                bgcolor: 'var(--primary-light)',
                color: 'var(--primary-color)',
                borderRadius: '8px',
              }}
            />
          ))}
        </Stack>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Stack spacing={2}>
          {summary.actionItems.map((item, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                borderRadius: '8px',
                bgcolor: 'var(--background-secondary)',
                border: '1px solid var(--border-color)',
              }}
            >
              <Typography sx={{ color: 'var(--text-primary)' }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Stack>
      </TabPanel>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ px: 3, pb: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        <Tooltip title="Share">
          <IconButton 
            sx={{ 
              color: 'var(--text-secondary)',
              '&:hover': {
                color: 'var(--primary-color)',
                backgroundColor: 'var(--primary-light)',
              },
            }}
          >
            <FiShare2 />
          </IconButton>
        </Tooltip>
        <Tooltip title="Download PDF">
          <IconButton
            onClick={handleDownloadPDF}
            sx={{ 
              color: 'var(--text-secondary)',
              '&:hover': {
                color: 'var(--primary-color)',
                backgroundColor: 'var(--primary-light)',
              },
            }}
          >
            <FiDownload />
          </IconButton>
        </Tooltip>
        <Tooltip title="Edit">
          <IconButton
            sx={{ 
              color: 'var(--text-secondary)',
              '&:hover': {
                color: 'var(--primary-color)',
                backgroundColor: 'var(--primary-light)',
              },
            }}
          >
            <FiEdit2 />
          </IconButton>
        </Tooltip>
      </Box>
    </StyledPaper>
  );
};

export default SummaryDisplay;
