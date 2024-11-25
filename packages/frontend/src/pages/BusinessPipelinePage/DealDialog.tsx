import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { FiX } from 'react-icons/fi';
import { Deal } from './types';
import { PIPELINE_STAGES } from './constants';

interface DealDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (deal: Partial<Deal>) => Promise<void>;
  deal?: Deal;
}

const DealDialog: React.FC<DealDialogProps> = ({ open, onClose, onSave, deal }) => {
  const [formData, setFormData] = React.useState<Partial<Deal>>({
    name: '',
    company: '',
    value: 0,
    probability: 50,
    stage: PIPELINE_STAGES[0],
    contacts: [],
    dueDate: new Date().toISOString().split('T')[0],
    ...deal,
  });

  const handleChange = (field: keyof Deal) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          backgroundColor: 'var(--card-background)',
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {deal ? 'Edit Deal' : 'New Deal'}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <FiX />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Deal Name"
                fullWidth
                required
                value={formData.name}
                onChange={handleChange('name')}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Company"
                fullWidth
                required
                value={formData.company}
                onChange={handleChange('company')}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Value"
                type="number"
                fullWidth
                required
                value={formData.value}
                onChange={handleChange('value')}
                InputProps={{
                  startAdornment: '$',
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Probability"
                type="number"
                fullWidth
                required
                value={formData.probability}
                onChange={handleChange('probability')}
                InputProps={{
                  endAdornment: '%',
                }}
                inputProps={{
                  min: 0,
                  max: 100,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Stage"
                fullWidth
                required
                value={formData.stage}
                onChange={handleChange('stage')}
              >
                {PIPELINE_STAGES.map((stage) => (
                  <MenuItem key={stage} value={stage}>
                    {stage}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Due Date"
                type="date"
                fullWidth
                required
                value={formData.dueDate}
                onChange={handleChange('dueDate')}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: 'var(--primary-color)',
              '&:hover': {
                backgroundColor: 'var(--primary-color-dark)',
              },
            }}
          >
            {deal ? 'Save Changes' : 'Create Deal'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default DealDialog;
