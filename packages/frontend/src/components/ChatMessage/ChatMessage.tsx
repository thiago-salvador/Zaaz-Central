import React from 'react';
import { Box, Typography, Paper, Avatar } from '@mui/material';
import { FiUser, FiCpu } from 'react-icons/fi';

interface ChatMessageProps {
  content: string;
  isUser: boolean;
  timestamp: string;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ content, isUser, timestamp }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        mb: 2,
        flexDirection: isUser ? 'row-reverse' : 'row',
        px: 2,
      }}
    >
      <Avatar
        sx={{
          bgcolor: isUser ? 'primary.main' : 'secondary.main',
          width: 32,
          height: 32,
        }}
      >
        {isUser ? <FiUser /> : <FiCpu />}
      </Avatar>
      <Box sx={{ maxWidth: '70%' }}>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            bgcolor: isUser ? 'primary.light' : 'grey.100',
            borderRadius: 2,
          }}
        >
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {content}
          </Typography>
        </Paper>
        <Typography
          variant="caption"
          sx={{
            mt: 0.5,
            display: 'block',
            textAlign: isUser ? 'right' : 'left',
            color: 'text.secondary',
          }}
        >
          {new Date(timestamp).toLocaleTimeString()}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatMessage;
