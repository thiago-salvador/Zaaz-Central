import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import { FiPlay } from 'react-icons/fi';

interface AnalysisResult {
  content: string;
  timestamp: string;
}

const BusinessAnalyzerPage: React.FC = () => {
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleStartWorkflow = async () => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual Make.com API endpoint
      const response = await fetch('YOUR_MAKE_WEBHOOK_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyName,
          website,
          comment,
        }),
      });

      const data = await response.json();
      setResult({
        content: data.result || 'Analysis completed successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error:', error);
      setResult({
        content: 'Error occurred during analysis. Please try again.',
        timestamp: new Date().toISOString(),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: 'var(--background-default)',
      pt: 3,
      pb: 6
    }}>
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ 
          fontWeight: 600,
          color: 'var(--text-primary)',
          mb: 4
        }}>
          Business Analyzer
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 4,
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            backgroundColor: 'var(--card-background)',
            mb: 4,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Company Name"
              variant="outlined"
              fullWidth
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--border-color)',
                  },
                  '& input': {
                    color: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text-secondary)',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                },
              }}
            />
            
            <TextField
              label="Website"
              variant="outlined"
              fullWidth
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--border-color)',
                  },
                  '& input': {
                    color: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text-secondary)',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                },
              }}
            />

            <TextField
              label="Comment"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--border-color)',
                  },
                  '& textarea': {
                    color: 'white',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text-secondary)',
                  '&.Mui-focused': {
                    color: 'white',
                  },
                },
              }}
            />

            <Button
              variant="contained"
              startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <FiPlay />}
              onClick={handleStartWorkflow}
              disabled={isLoading || !companyName || !website}
              sx={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'var(--primary-dark)',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  color: 'rgba(255, 255, 255, 0.3)',
                },
              }}
            >
              {isLoading ? 'Processing...' : 'Start Workflow'}
            </Button>
          </Box>
        </Paper>

        {result && (
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              backgroundColor: 'var(--card-background)',
            }}
          >
            <Typography variant="h6" sx={{ 
              fontWeight: 600,
              color: 'var(--text-primary)',
              mb: 2
            }}>
              Analysis Result
            </Typography>
            
            <TextField
              fullWidth
              multiline
              rows={8}
              value={result.content}
              InputProps={{
                readOnly: true,
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'var(--border-color)',
                  },
                  '& textarea': {
                    color: 'white',
                  },
                },
              }}
            />
            
            <Typography variant="caption" sx={{ 
              color: 'var(--text-secondary)',
              display: 'block',
              mt: 1
            }}>
              Generated at: {new Date(result.timestamp).toLocaleString()}
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default BusinessAnalyzerPage;
