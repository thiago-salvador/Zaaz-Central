import React from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  FiEdit2,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
} from 'react-icons/fi';
import { Deal } from './types';

interface DealCardProps {
  deal: Deal;
  onEdit: (deal: Deal) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onEdit }) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value);

  const getDueColor = (dueDate: string) => {
    const days = Math.ceil(
      (new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (days < 0) return 'error.main';
    if (days < 7) return 'warning.main';
    return 'success.main';
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        backgroundColor: 'var(--card-background)',
        border: '1px solid var(--border-color)',
        borderRadius: 2,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 'var(--shadow-md)',
          borderColor: 'var(--border-color-hover)',
        },
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            color: 'var(--text-primary)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            flex: 1,
          }}
        >
          {deal.name}
        </Typography>
        <IconButton
          size="small"
          onClick={() => onEdit(deal)}
          sx={{
            ml: 1,
            color: 'var(--text-secondary)',
            '&:hover': {
              color: 'var(--primary)',
              backgroundColor: 'var(--primary-light)',
            },
          }}
        >
          <FiEdit2 size={16} />
        </IconButton>
      </Box>

      <Typography
        variant="body2"
        sx={{
          color: 'var(--text-secondary)',
          mb: 2,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          height: '40px',
        }}
      >
        {deal.company}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <LinearProgress
            variant="determinate"
            value={deal.probability}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: 'var(--background-secondary)',
              flex: 1,
              mr: 1,
              '& .MuiLinearProgress-bar': {
                backgroundColor: 'var(--primary)',
              },
            }}
          />
          <Typography
            variant="caption"
            sx={{
              color: 'var(--text-secondary)',
              fontWeight: 600,
            }}
          >
            {deal.probability}%
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <Tooltip title="Deal value">
          <Chip
            icon={<FiDollarSign size={14} />}
            label={formatCurrency(deal.value)}
            size="small"
            sx={{
              backgroundColor: 'var(--background-secondary)',
              '& .MuiChip-label': {
                color: 'var(--text-primary)',
              },
            }}
          />
        </Tooltip>

        <Tooltip title="Due date">
          <Chip
            icon={<FiCalendar size={14} />}
            label={new Date(deal.dueDate).toLocaleDateString()}
            size="small"
            sx={{
              backgroundColor: 'var(--background-secondary)',
              '& .MuiChip-label': {
                color: getDueColor(deal.dueDate),
              },
            }}
          />
        </Tooltip>
      </Box>
    </Paper>
  );
};

export default DealCard;
