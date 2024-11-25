import React, { useState, useCallback } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Paper,
  Alert,
  IconButton,
  useTheme,
  Fade,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Stack
} from '@mui/material';
import { FiMic, FiClock, FiCheckCircle, FiAlertCircle, FiBarChart2 } from 'react-icons/fi';
import CloseIcon from '@mui/icons-material/Close';
import UploadFile from './components/UploadFile';
import SummaryDisplay from './components/SummaryDisplay';
import InsightsTable from './components/InsightsTable';
import { Meeting } from '../../types/shared';
import { recordingService } from '../../services/recordingService';
import { transcribeFile, transcribeAudio } from '../../services/transcriptionService';
import { alpha } from '@mui/material/styles';

interface Summary {
  text: string;
  keyTopics: string[];
  confidenceScore: number;
  actionItems: string[];
  highlights: string[];
  sentiment: {
    overall: 'positive' | 'neutral' | 'negative';
    score: number;
  };
}

const MeetingSummarizerPage: React.FC = () => {
  const theme = useTheme();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [meeting, setMeeting] = useState<Meeting>({
    id: 'sample-1',
    title: 'Q4 Product Strategy Meeting',
    date: new Date().toISOString(),
    duration: '45 minutes',
    status: 'completed',
    insights: {
      summary: 'The Q4 Product Strategy meeting focused on aligning priorities for the upcoming quarter. The team unanimously agreed to prioritize mobile app development, allocating significant resources to this initiative.',
      keyTopics: ['Mobile App Development', 'Q4 Planning', 'Resource Allocation'],
      sentimentAnalysis: {
        overall: 'positive',
      },
      actionItems: [
        {
          id: '1',
          description: 'Create detailed roadmap for mobile app development',
          assignee: 'Sarah Johnson',
          priority: 'high',
          status: 'not-started'
        },
        {
          id: '2',
          description: 'Prepare marketing campaign for new feature launch',
          assignee: 'Mike Chen',
          priority: 'medium',
          status: 'not-started'
        }
      ]
    },
  });
  
  const [summary, setSummary] = useState<Summary>({
    text: 'The Q4 Product Strategy meeting focused on aligning priorities for the upcoming quarter. The team unanimously agreed to prioritize mobile app development, allocating significant resources to this initiative. Key decisions include a December 15th feature rollout and a 20% increase in marketing budget.',
    keyTopics: ['Mobile App Development', 'Q4 Planning', 'Resource Allocation', 'Marketing Strategy'],
    confidenceScore: 89,
    actionItems: [
      'Create detailed roadmap for mobile app development',
      'Prepare marketing campaign for new feature launch',
      'Begin recruitment process for frontend developers'
    ],
    highlights: [
      'Decided to prioritize mobile app development for Q1 2024',
      'New feature rollout scheduled for December 15th',
      'Budget increase of 20% approved for marketing initiatives',
      'Team to hire 3 new frontend developers by end of Q4'
    ],
    sentiment: {
      overall: 'positive',
      score: 0.89,
    },
  });
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [stats, setStats] = useState({
    totalMeetings: 3,
    processedMeetings: 2,
    pendingMeetings: 1,
    averageConfidence: 85,
  });

  const handleFileUpload = useCallback(async (file: File) => {
    try {
      const result = await transcribeFile(file);
      setMeeting({
        id: Date.now().toString(),
        title: file.name,
        date: new Date().toISOString(),
        duration: result.meeting.duration,
        status: 'completed',
        insights: {
          summary: result.summary.summary,
          keyTopics: result.summary.topics,
          sentimentAnalysis: {
            overall: result.summary.sentimentAnalysis.overall.toLowerCase() as 'positive' | 'neutral' | 'negative',
          },
          actionItems: result.summary.actionItems.map((item, index) => ({
            id: (index + 1).toString(),
            description: item.task,
            assignee: item.assignee,
            priority: 'medium',
            status: 'not-started'
          }))
        },
      });
      setSummary({
        text: result.summary.summary,
        keyTopics: result.summary.topics,
        confidenceScore: result.summary.confidenceScore * 100,
        actionItems: result.summary.actionItems.map(item => item.task),
        highlights: result.summary.keyPoints,
        sentiment: {
          overall: result.summary.sentimentAnalysis.overall.toLowerCase() as 'positive' | 'neutral' | 'negative',
          score: result.summary.confidenceScore,
        },
      });
    } catch (error) {
      setErrorMessage('Failed to process the file. Please try again.');
    }
  }, []);

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        backgroundColor: 'var(--background-primary)',
        color: 'var(--text-primary)',
        pt: 3,
        pb: 6,
        animation: 'fadeIn 0.3s ease-out'
      }}
    >
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: "'Lexend', sans-serif",
              fontWeight: 700,
              color: 'var(--text-primary)',
              mb: 1
            }}
          >
            Meeting Summarizer
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'var(--text-secondary)',
              mb: 3 
            }}
          >
            Upload or record your meeting to get an AI-powered summary with key insights, action items, and sentiment analysis
          </Typography>

          {/* Stats Section */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              { 
                icon: <FiBarChart2 />, 
                label: 'Total Meetings', 
                value: stats.totalMeetings,
                description: 'Meetings analyzed this month'
              },
              { 
                icon: <FiCheckCircle />, 
                label: 'Processed', 
                value: stats.processedMeetings,
                description: 'Successfully analyzed'
              },
              { 
                icon: <FiClock />, 
                label: 'Pending', 
                value: stats.pendingMeetings,
                description: 'Awaiting analysis'
              },
              { 
                icon: <FiAlertCircle />, 
                label: 'Avg. Confidence', 
                value: `${stats.averageConfidence}%`,
                description: 'AI analysis accuracy'
              },
            ].map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    bgcolor: 'var(--card-background)',
                    border: '1px solid var(--border-color)',
                    boxShadow: 'none',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px var(--shadow-color)',
                      borderColor: 'var(--primary-color)',
                    }
                  }}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box 
                        sx={{ 
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: 'var(--primary-light)',
                          color: 'var(--primary-color)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.5rem'
                        }}
                      >
                        {stat.icon}
                      </Box>
                      <Box>
                        <Typography variant="h5" sx={{ color: 'var(--text-primary)', fontWeight: 600, mb: 0.5 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'var(--text-primary)', mb: 0.5 }}>
                          {stat.label}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'var(--text-secondary)' }}>
                          {stat.description}
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Error Message */}
          {errorMessage && (
            <Alert
              severity="error"
              sx={{ 
                mb: 3,
                bgcolor: 'var(--error-light)',
                color: 'var(--error-color)',
                border: '1px solid var(--error-color)',
                '& .MuiAlert-icon': {
                  color: 'var(--error-color)'
                }
              }}
              action={
                <IconButton
                  aria-label="close"
                  color="inherit"
                  size="small"
                  onClick={() => setErrorMessage(null)}
                >
                  <CloseIcon fontSize="inherit" />
                </IconButton>
              }
            >
              {errorMessage}
            </Alert>
          )}

          {/* Main Content */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ height: 400 }}>
                <UploadFile 
                  onFileUpload={handleFileUpload}
                  isRecording={isRecording}
                  onRecordingToggle={() => setIsRecording(!isRecording)}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ height: 400 }}>
                <SummaryDisplay 
                  summary={summary} 
                  meeting={meeting || undefined}
                />
              </Box>
            </Grid>
            {summary && meeting && (
              <Grid item xs={12}>
                <InsightsTable 
                  meeting={meeting}
                  confidenceScore={summary.confidenceScore}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default MeetingSummarizerPage;
