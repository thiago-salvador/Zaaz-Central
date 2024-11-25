import React, { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  TextField,
  MenuItem,
  Menu,
  Grid,
  InputAdornment
} from '@mui/material';
import {
  FiDollarSign,
  FiBarChart2,
  FiPlus,
  FiFilter,
  FiSearch,
  FiCalendar,
} from 'react-icons/fi';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import DealCard from './DealCard';
import DealDialog from './DealDialog';
import { Deal } from './types';
import { PIPELINE_STAGES, STAGE_COLORS } from './constants';
import AIInsights from '../../components/AIInsights/AIInsights';

const BusinessPipelinePage: React.FC = () => {
  const [deals, setDeals] = useState<Deal[]>([
    {
      id: '1',
      name: 'Enterprise Software Solution',
      value: 150000,
      probability: 75,
      stage: 'Proposal',
      company: 'Tech Corp',
      dueDate: '2024-12-15',
      contacts: ['John Smith', 'Sarah Johnson'],
    },
    {
      id: '2',
      name: 'Cloud Migration Project',
      value: 85000,
      probability: 60,
      stage: 'First meeting',
      company: 'Cloud Systems Inc',
      dueDate: '2024-11-30',
      contacts: ['Mike Wilson'],
    },
    {
      id: '3',
      name: 'Security Implementation',
      value: 95000,
      probability: 90,
      stage: 'Discovery',
      company: 'SecureNet Ltd',
      dueDate: '2024-12-05',
      contacts: ['Emma Davis', 'Tom Brown'],
    },
  ]);

  const [filterAnchor, setFilterAnchor] = useState<null | HTMLElement>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'value' | 'probability' | 'dueDate'>('value');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const filteredDeals = useMemo(() => {
    return deals.filter(deal => 
      deal.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [deals, searchQuery]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const deal = deals.find(d => d.id === result.draggableId);
    if (!deal) return;

    const updatedDeals = deals.map(d => 
      d.id === deal.id 
        ? { ...d, stage: PIPELINE_STAGES[parseInt(result.destination.droppableId)] }
        : d
    );
    setDeals(updatedDeals);
  };

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setShowDialog(true);
  };

  const handleEditDeal = (deal: Deal) => {
    setSelectedDeal(deal);
    setShowDialog(true);
  };

  const handleSaveDeal = async (dealData: Partial<Deal>) => {
    if (selectedDeal) {
      setDeals(deals.map(d => d.id === selectedDeal.id ? { ...selectedDeal, ...dealData } : d));
    } else {
      const newDeal = {
        ...dealData,
        id: String(deals.length + 1),
      } as Deal;
      setDeals([...deals, newDeal]);
    }
    setShowDialog(false);
  };

  return (
    <Box sx={{ 
      minHeight: '100vh',
      backgroundColor: 'var(--background-default)',
      pt: 3,
      pb: 6
    }}>
      <Container maxWidth="xl">
        {/* Header Section */}
        <Box sx={{ 
          mb: 4,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', md: 'center' },
          gap: 2
        }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 600,
            color: 'var(--text-primary)',
            mb: { xs: 2, md: 0 }
          }}>
            Business Pipeline
          </Typography>
          
          <Box sx={{ 
            display: 'flex',
            gap: 2,
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: 'center'
          }}>
            <Paper sx={{
              p: 1,
              display: 'flex',
              alignItems: 'center',
              backgroundColor: 'var(--background)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <TextField
                placeholder="Search deals..."
                variant="outlined"
                size="small"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <FiSearch style={{ color: 'var(--text-secondary)' }} />
                    </InputAdornment>
                  ),
                  sx: {
                    backgroundColor: 'var(--background)',
                  }
                }}
                sx={{
                  width: '300px',
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'var(--background)',
                    '& fieldset': {
                      borderColor: 'var(--border-color)',
                    },
                    '& input': {
                      color: 'white',
                      '&::placeholder': {
                        color: 'var(--text-secondary)',
                        opacity: 1,
                      },
                    },
                  },
                }}
              />
            </Paper>

            <Button
              variant="outlined"
              startIcon={<FiFilter />}
              onClick={(e) => setFilterAnchor(e.currentTarget)}
              sx={{
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)',
                '&:hover': {
                  borderColor: 'var(--border-color-hover)',
                  backgroundColor: 'var(--background-hover)'
                }
              }}
            >
              Filter
            </Button>

            <Button
              variant="contained"
              startIcon={<FiPlus />}
              onClick={handleAddDeal}
              sx={{
                backgroundColor: 'var(--primary)',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'var(--primary-dark)'
                }
              }}
            >
              Add Deal
            </Button>
          </Box>
        </Box>

        <Grid container spacing={4}>
          <Grid item xs={12}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 3,
                mb: 3
              }}>
                {PIPELINE_STAGES.slice(0, 4).map((stage, index) => (
                  <Droppable key={stage} droppableId={index.toString()}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          backgroundColor: 'var(--background-secondary)',
                          borderRadius: 2,
                          p: 2,
                          height: '100%'
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            px: 1,
                            color: STAGE_COLORS[stage],
                            borderBottom: `2px solid ${STAGE_COLORS[stage]}`
                          }}
                        >
                          {stage}
                        </Typography>
                        {filteredDeals
                          .filter(deal => deal.stage === stage)
                          .map((deal, index) => (
                            <Draggable
                              key={deal.id}
                              draggableId={deal.id}
                              index={index}
                            >
                              {(provided) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{ mb: 2 }}
                                >
                                  <DealCard
                                    deal={deal}
                                    onEdit={() => handleEditDeal(deal)}
                                  />
                                </Box>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                ))}
              </Box>
              <Box sx={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 3
              }}>
                {PIPELINE_STAGES.slice(4).map((stage, index) => (
                  <Droppable key={stage} droppableId={(index + 4).toString()}>
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        sx={{
                          backgroundColor: 'var(--background-secondary)',
                          borderRadius: 2,
                          p: 2,
                          height: '100%'
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          sx={{
                            fontWeight: 600,
                            mb: 2,
                            px: 1,
                            color: STAGE_COLORS[stage],
                            borderBottom: `2px solid ${STAGE_COLORS[stage]}`
                          }}
                        >
                          {stage}
                        </Typography>
                        {filteredDeals
                          .filter(deal => deal.stage === stage)
                          .map((deal, index) => (
                            <Draggable
                              key={deal.id}
                              draggableId={deal.id}
                              index={index}
                            >
                              {(provided) => (
                                <Box
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  sx={{ mb: 2 }}
                                >
                                  <DealCard
                                    deal={deal}
                                    onEdit={() => handleEditDeal(deal)}
                                  />
                                </Box>
                              )}
                            </Draggable>
                          ))}
                        {provided.placeholder}
                      </Box>
                    )}
                  </Droppable>
                ))}
              </Box>
            </DragDropContext>
          </Grid>

          <Grid item xs={12}>
            <AIInsights deals={deals} />
          </Grid>
        </Grid>

        <DealDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          deal={selectedDeal || undefined}
          onSave={handleSaveDeal}
        />

        <Menu
          anchorEl={filterAnchor}
          open={Boolean(filterAnchor)}
          onClose={() => setFilterAnchor(null)}
          PaperProps={{
            sx: {
              mt: 1,
              backgroundColor: 'var(--card-background)',
              border: '1px solid var(--border-color)',
              borderRadius: 2,
              boxShadow: 'var(--shadow-lg)'
            }
          }}
        >
          <MenuItem onClick={() => setSortBy('value')}>
            <FiDollarSign style={{ marginRight: 8 }} />
            Sort by Value
          </MenuItem>
          <MenuItem onClick={() => setSortBy('probability')}>
            <FiBarChart2 style={{ marginRight: 8 }} />
            Sort by Probability
          </MenuItem>
          <MenuItem onClick={() => setSortBy('dueDate')}>
            <FiCalendar style={{ marginRight: 8 }} />
            Sort by Due Date
          </MenuItem>
        </Menu>
      </Container>
    </Box>
  );
};

export default BusinessPipelinePage;
