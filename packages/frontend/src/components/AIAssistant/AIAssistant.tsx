import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
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
import { langflowService } from '../../services/langflowService';

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

    try {
      setIsProcessing(true);
      const userMessage: Message = {
        id: Date.now().toString(),
        content: input,
        role: 'user',
        type: 'text',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const response = await langflowService.sendMessage(input);
      console.log('AI response:', response);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        type: 'text',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error: any) {
      console.error('Error in chat:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error.message || 'An unexpected error occurred',
        role: 'assistant',
        type: 'error',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
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
                      {message.role === 'user' ? (
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
                      ) : (
                        <Box sx={{
                          '& .markdown-content': {
                            color: 'var(--text-primary)',
                            '& h1, & h2, & h3, & h4, & h5, & h6': {
                              color: 'var(--text-primary)',
                              marginTop: '16px',
                              marginBottom: '8px',
                              fontWeight: 600,
                            },
                            '& h1': { fontSize: '2em' },
                            '& h2': { fontSize: '1.5em' },
                            '& h3': { fontSize: '1.17em' },
                            '& p': {
                              marginBottom: '16px',
                              lineHeight: 1.6,
                              '& strong': {
                                color: 'var(--primary-color)',
                                fontWeight: 600,
                              },
                              '& em': {
                                fontStyle: 'italic',
                                color: 'var(--text-secondary)',
                              },
                            },
                            '& ul, & ol': {
                              marginLeft: '24px',
                              marginBottom: '16px',
                              '& li': {
                                marginBottom: '8px',
                                '& strong': {
                                  color: 'var(--primary-color)',
                                  fontWeight: 600,
                                },
                                '& em': {
                                  fontStyle: 'italic',
                                  color: 'var(--text-secondary)',
                                },
                                '&::marker': {
                                  color: 'var(--primary-color)',
                                },
                              },
                            },
                            '& code': {
                              backgroundColor: 'var(--background-primary)',
                              padding: '2px 4px',
                              borderRadius: '4px',
                              fontSize: '0.9em',
                              color: 'var(--primary-color)',
                              fontFamily: 'monospace',
                            },
                            '& pre': {
                              backgroundColor: 'var(--background-primary)',
                              padding: '16px',
                              borderRadius: '8px',
                              overflow: 'auto',
                              marginBottom: '16px',
                              '& code': {
                                backgroundColor: 'transparent',
                                padding: 0,
                                color: 'var(--text-primary)',
                              },
                            },
                            '& blockquote': {
                              borderLeft: '4px solid var(--primary-color)',
                              paddingLeft: '16px',
                              marginLeft: 0,
                              marginBottom: '16px',
                              color: 'var(--text-secondary)',
                              fontStyle: 'italic',
                            },
                            '& hr': {
                              border: 'none',
                              borderTop: '2px solid var(--border-color)',
                              margin: '24px 0',
                            },
                            '& a': {
                              color: 'var(--primary-color)',
                              textDecoration: 'none',
                              '&:hover': {
                                textDecoration: 'underline',
                              },
                            },
                            '& table': {
                              width: '100%',
                              borderCollapse: 'collapse',
                              marginBottom: '16px',
                              '& th, & td': {
                                border: '1px solid var(--border-color)',
                                padding: '8px',
                                textAlign: 'left',
                              },
                              '& th': {
                                backgroundColor: 'var(--background-primary)',
                                fontWeight: 600,
                              },
                            },
                            '& br': {
                              marginBottom: '8px',
                            },
                          },
                        }}>
                          <ReactMarkdown 
                            className="markdown-content"
                            remarkPlugins={[remarkGfm, remarkBreaks]}
                            components={{
                              strong: ({node, ...props}) => (
                                <strong style={{color: 'var(--primary-color)', fontWeight: 600}} {...props} />
                              ),
                              em: ({node, ...props}) => (
                                <em style={{color: 'var(--text-secondary)', fontStyle: 'italic'}} {...props} />
                              ),
                              li: ({node, children, ...props}) => (
                                <li style={{marginBottom: '8px'}} {...props}>
                                  {children}
                                </li>
                              ),
                            }}
                          >
                            {message.content}
                          </ReactMarkdown>
                        </Box>
                      )}
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
