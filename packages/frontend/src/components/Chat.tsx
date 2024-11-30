import React, { useState } from 'react';
import { Box, TextField, Button, Paper, Typography, Container } from '@mui/material';
import { chatService, ChatMessage } from '../services/chatService';

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await chatService.sendMessage(input.trim());
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: response.content,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your message.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, height: '80vh', display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h4" gutterBottom>
          AI Assistant Chat
        </Typography>
        
        <Box sx={{ flexGrow: 1, overflow: 'auto', mb: 2 }}>
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                mb: 2
              }}
            >
              <Paper
                elevation={1}
                sx={{
                  p: 2,
                  maxWidth: '70%',
                  backgroundColor: message.role === 'user' ? '#e3f2fd' : '#f5f5f5'
                }}
              >
                <Typography>{message.content}</Typography>
                <Typography variant="caption">{message.timestamp.toLocaleTimeString()}</Typography>
              </Paper>
            </Box>
          ))}
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <Button
            type="submit"
            variant="contained"
            disabled={isLoading}
            sx={{ minWidth: 100 }}
          >
            {isLoading ? 'Sending...' : 'Send'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Chat;
