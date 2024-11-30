import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  IconButton,
  Button,
  Tooltip,
  Divider,
} from '@mui/material';
import { FiMessageSquare, FiTrash2, FiPlus } from 'react-icons/fi';
import { Chat, ChatHistoryProps } from './types';

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  onSelectChat,
  onDeleteChat,
  currentChatId,
  chats,
  onNewChat,
}) => {
  return (
    <Box
      sx={{
        width: '280px',
        height: '100%',
        borderLeft: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontSize: '1rem' }}>
          Chat History
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FiPlus />}
          onClick={onNewChat}
          fullWidth
          size="small"
        >
          New Chat
        </Button>
      </Box>
      <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
        {chats.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2">No chat history yet</Typography>
          </Box>
        ) : (
          chats.map((chat, index) => (
            <React.Fragment key={chat.id}>
              <ListItem
                disablePadding
                secondaryAction={
                  <Tooltip title="Delete chat">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat.id);
                      }}
                      sx={{ color: 'text.secondary', mr: 1 }}
                    >
                      <FiTrash2 size={16} />
                    </IconButton>
                  </Tooltip>
                }
              >
                <ListItemButton
                  selected={currentChatId === chat.id}
                  onClick={() => onSelectChat(chat.id)}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: 'action.selected',
                    },
                    py: 1.5,
                  }}
                >
                  <FiMessageSquare
                    size={16}
                    style={{ marginRight: '12px', opacity: 0.7 }}
                  />
                  <ListItemText
                    primary={chat.title}
                    secondary={new Date(chat.date).toLocaleDateString()}
                    primaryTypographyProps={{
                      sx: { 
                        fontSize: '0.9rem',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      },
                    }}
                    secondaryTypographyProps={{
                      sx: { fontSize: '0.8rem' },
                    }}
                  />
                </ListItemButton>
              </ListItem>
              {index < chats.length - 1 && (
                <Divider component="li" />
              )}
            </React.Fragment>
          ))
        )}
      </List>
    </Box>
  );
};

export default ChatHistory;
