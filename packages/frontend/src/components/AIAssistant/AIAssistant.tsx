import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  IconButton,
  Typography,
  Paper,
  Stack,
  Chip,
  Fade,
  useTheme,
  Button,
  Tooltip,
  CircularProgress,
  Divider
} from '@mui/material';
import { 
  FiSend, 
  FiUser, 
  FiCpu, 
  FiCode, 
  FiClipboard, 
  FiCheck,
  FiRefreshCw,
  FiImage,
  FiFile,
  FiMic,
  FiZap
} from 'react-icons/fi';
import { Message, MessageRole, MessageType } from '../../types/assistant';

const AIAssistant: React.FC = () => {
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const [suggestedPrompts] = useState([
    {
      title: "Code Help",
      prompts: [
        "Help me optimize this function",
        "Explain this code snippet",
        "Debug this error",
        "Convert this code to TypeScript"
      ]
    },
    {
      title: "Documentation",
      prompts: [
        "Generate API documentation",
        "Write unit test cases",
        "Create a README file",
        "Document this component"
      ]
    },
    {
      title: "UI/UX",
      prompts: [
        "Improve component accessibility",
        "Add responsive design",
        "Optimize performance",
        "Enhance user interaction"
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      type: 'text',
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    // Simulate AI response with more detailed content
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        type: 'text',
        content: "I understand your request. Here's a detailed response:\n\n1. First, let's analyze the key points...\n2. Based on best practices...\n3. Here's a code example:\n\n```typescript\nconst example = () => {\n  // Your code here\n};\n```\n\nLet me know if you need any clarification!",
        timestamp: new Date().toISOString(),
        metadata: {
          confidence: 0.95,
          executionTime: '0.8s',
          model: 'GPT-4',
        },
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1500);
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = (content: string) => {
    navigator.clipboard.writeText(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const handleVoiceInput = () => {
    setIsRecording(!isRecording);
    // Add voice recording logic here
  };

  return (
    <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Message History */}
      <Paper
        elevation={0}
        sx={{
          flex: 1,
          mb: 2,
          p: 3,
          overflow: 'auto',
          backgroundColor: 'var(--card-background)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0, 0, 0, 0.15)',
          },
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'var(--background-secondary)',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'var(--border-color)',
            borderRadius: '4px',
            '&:hover': {
              background: 'var(--primary-color)',
            },
          },
        }}
      >
        <Stack spacing={3}>
          {messages.map((message) => (
            <Fade key={message.id} in={true} timeout={500}>
              <Card
                elevation={0}
                sx={{
                  backgroundColor: message.role === 'user' 
                    ? 'var(--primary-light)' 
                    : 'var(--background-secondary)',
                  borderRadius: '12px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="flex-start">
                    <Box
                      sx={{
                        backgroundColor: message.role === 'user' 
                          ? 'var(--primary-color)' 
                          : 'var(--secondary-color)',
                        borderRadius: '50%',
                        p: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {message.role === 'user' ? (
                        <FiUser color="white" size={20} />
                      ) : (
                        <FiCpu color="white" size={20} />
                      )}
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography
                        variant="body1"
                        sx={{
                          color: 'var(--text-primary)',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {message.content}
                      </Typography>
                      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                        {message.metadata?.confidence && (
                          <Chip
                            label={`Confidence: ${(message.metadata.confidence * 100).toFixed(0)}%`}
                            size="small"
                            sx={{
                              backgroundColor: 'var(--background-primary)',
                              color: 'var(--text-secondary)',
                            }}
                          />
                        )}
                        {message.metadata?.executionTime && (
                          <Chip
                            label={`Time: ${message.metadata.executionTime}`}
                            size="small"
                            sx={{
                              backgroundColor: 'var(--background-primary)',
                              color: 'var(--text-secondary)',
                            }}
                          />
                        )}
                        {message.metadata?.model && (
                          <Chip
                            label={`Model: ${message.metadata.model}`}
                            size="small"
                            sx={{
                              backgroundColor: 'var(--background-primary)',
                              color: 'var(--text-secondary)',
                            }}
                          />
                        )}
                        {message.role === 'assistant' && (
                          <Tooltip title={isCopied ? "Copied!" : "Copy to clipboard"}>
                            <IconButton 
                              size="small" 
                              onClick={() => copyToClipboard(message.content)}
                              sx={{ color: 'var(--text-secondary)' }}
                            >
                              {isCopied ? <FiCheck /> : <FiClipboard />}
                            </IconButton>
                          </Tooltip>
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Fade>
          ))}
          {isProcessing && (
            <Fade in={true} timeout={500}>
              <Card
                elevation={0}
                sx={{
                  backgroundColor: 'var(--background-secondary)',
                  borderRadius: '12px',
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CircularProgress size={20} sx={{ color: 'var(--primary-color)' }} />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'var(--text-secondary)',
                        fontStyle: 'italic',
                      }}
                    >
                      AI is thinking...
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Fade>
          )}
          <div ref={messagesEndRef} />
        </Stack>
      </Paper>

      {/* Input Area */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          backgroundColor: 'var(--card-background)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here... (Shift + Enter for new line)"
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'var(--background-secondary)',
                borderRadius: '12px',
                '& fieldset': {
                  borderColor: 'var(--border-color)',
                },
                '&:hover fieldset': {
                  borderColor: 'var(--primary-color)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: 'var(--primary-color)',
                },
              },
            }}
          />
          <Stack direction="row" spacing={1}>
            <Tooltip title={isRecording ? 'Stop recording' : 'Start voice input'}>
              <IconButton
                onClick={handleVoiceInput}
                sx={{
                  color: isRecording ? 'var(--error-color)' : 'var(--text-secondary)',
                  backgroundColor: 'var(--background-secondary)',
                  border: '1px solid var(--border-color)',
                  '&:hover': {
                    backgroundColor: 'var(--background-primary)',
                  },
                }}
              >
                <FiMic />
              </IconButton>
            </Tooltip>
            <Tooltip title="Clear chat">
              <IconButton
                onClick={handleClearChat}
                sx={{
                  color: 'var(--text-secondary)',
                  backgroundColor: 'var(--background-secondary)',
                  border: '1px solid var(--border-color)',
                  '&:hover': {
                    backgroundColor: 'var(--background-primary)',
                  },
                }}
              >
                <FiRefreshCw />
              </IconButton>
            </Tooltip>
            <IconButton
              onClick={handleSendMessage}
              disabled={!input.trim() || isProcessing}
              sx={{
                backgroundColor: 'var(--primary-color)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'var(--primary-dark)',
                },
                '&.Mui-disabled': {
                  backgroundColor: 'var(--background-secondary)',
                },
              }}
            >
              {isProcessing ? <CircularProgress size={24} color="inherit" /> : <FiSend />}
            </IconButton>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AIAssistant;
