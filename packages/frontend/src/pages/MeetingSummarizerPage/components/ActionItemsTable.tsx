import React, { useState, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  TableSortLabel,
  Chip,
  Typography
} from '@mui/material';

interface ActionItem {
  id: string;
  description: string;
  assignee: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed';
}

interface ActionItemsTableProps {
  actionItems: ActionItem[];
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High': return 'error';
    case 'Medium': return 'warning';
    case 'Low': return 'info';
    default: return 'default';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Not Started': return 'default';
    case 'In Progress': return 'warning';
    case 'Completed': return 'success';
    default: return 'default';
  }
};

const ActionItemsTable: React.FC<ActionItemsTableProps> = ({ actionItems }) => {
  const [orderBy, setOrderBy] = useState<keyof ActionItem>('priority');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const handleSort = (property: keyof ActionItem) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedActionItems = useMemo(() => {
    return [...actionItems].sort((a, b) => {
      const multiplier = order === 'asc' ? 1 : -1;
      return a[orderBy] < b[orderBy] ? -1 * multiplier : 1 * multiplier;
    });
  }, [actionItems, orderBy, order]);

  return (
    <Paper>
      <Typography variant="h6" sx={{ p: 2 }}>
        Action Items
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'description'}
                  direction={orderBy === 'description' ? order : 'asc'}
                  onClick={() => handleSort('description')}
                >
                  Description
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'assignee'}
                  direction={orderBy === 'assignee' ? order : 'asc'}
                  onClick={() => handleSort('assignee')}
                >
                  Assignee
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'priority'}
                  direction={orderBy === 'priority' ? order : 'asc'}
                  onClick={() => handleSort('priority')}
                >
                  Priority
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'status'}
                  direction={orderBy === 'status' ? order : 'asc'}
                  onClick={() => handleSort('status')}
                >
                  Status
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedActionItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.assignee}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.priority} 
                    color={getPriorityColor(item.priority)} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                  <Chip 
                    label={item.status} 
                    color={getStatusColor(item.status)} 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ActionItemsTable;
