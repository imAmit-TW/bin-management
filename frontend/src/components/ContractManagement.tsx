import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { io } from 'socket.io-client';

interface Contract {
  id: string;
  srId: string;
  startDate: Date;
  endDate: Date;
  monthlyLimit: number;
  currentMonthUsage: number;
  status: 'active' | 'pending' | 'expired' | 'terminated';
  terms: {
    withdrawalFrequency: string;
    returnPolicy: string;
    minimumOrder: number;
    maximumOrder: number;
  };
}

interface SalesRepresentative {
  id: string;
  name: string;
  agencyId: string;
  withdrawalLimit: number;
  plan: string;
  status: string;
}

interface Agency {
  id: string;
  name: string;
}

interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
  timestamp: Date;
}

const ContractManagement: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [salesReps, setSalesReps] = useState<SalesRepresentative[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContract, setEditingContract] = useState<Contract | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  const [formData, setFormData] = useState({
    srId: '',
    startDate: new Date(),
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
    monthlyLimit: 0,
    terms: {
      withdrawalFrequency: 'daily',
      returnPolicy: 'within 7 days',
      minimumOrder: 10,
      maximumOrder: 0
    }
  });

  useEffect(() => {
    const socket = io('http://localhost:5001');

    socket.on('contractUpdate', (data) => {
      setContracts(data);
    });

    // Initial data fetch
    fetch('http://localhost:5001/api/contracts')
      .then(res => res.json())
      .then(data => setContracts(data));

    fetch('http://localhost:5001/api/sales-representatives')
      .then(res => res.json())
      .then(data => setSalesReps(data));

    fetch('http://localhost:5001/api/agencies')
      .then(res => res.json())
      .then(data => setAgencies(data));

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleOpenDialog = (contract?: Contract) => {
    if (contract) {
      setEditingContract(contract);
      setFormData({
        srId: contract.srId,
        startDate: new Date(contract.startDate),
        endDate: new Date(contract.endDate),
        monthlyLimit: contract.monthlyLimit,
        terms: { ...contract.terms }
      });
    } else {
      setEditingContract(null);
      setFormData({
        srId: '',
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        monthlyLimit: 0,
        terms: {
          withdrawalFrequency: 'daily',
          returnPolicy: 'within 7 days',
          minimumOrder: 10,
          maximumOrder: 0
        }
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingContract(null);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5001/api/contracts', {
        method: editingContract ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: editingContract?.id
        }),
      });

      if (!response.ok) throw new Error('Failed to save contract');

      setNotification({
        type: 'success',
        message: `Contract ${editingContract ? 'updated' : 'created'} successfully`,
        timestamp: new Date()
      });
      handleCloseDialog();
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to save contract',
        timestamp: new Date()
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'pending': return 'warning';
      case 'expired': return 'error';
      case 'terminated': return 'default';
      default: return 'default';
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Contract Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Contract
        </Button>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Sales Representative</TableCell>
              <TableCell>Agency</TableCell>
              <TableCell>Start Date</TableCell>
              <TableCell>End Date</TableCell>
              <TableCell>Monthly Limit</TableCell>
              <TableCell>Current Usage</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {contracts.map((contract) => {
              const sr = salesReps.find(s => s.id === contract.srId);
              const agency = sr ? agencies.find(a => a.id === sr.agencyId) : null;
              
              return (
                <TableRow key={contract.id}>
                  <TableCell>{sr?.name || 'N/A'}</TableCell>
                  <TableCell>{agency?.name || 'N/A'}</TableCell>
                  <TableCell>{new Date(contract.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(contract.endDate).toLocaleDateString()}</TableCell>
                  <TableCell>{contract.monthlyLimit} units</TableCell>
                  <TableCell>{contract.currentMonthUsage} units</TableCell>
                  <TableCell>
                    <Chip
                      label={contract.status}
                      color={getStatusColor(contract.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(contract)}>
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingContract ? 'Edit Contract' : 'Add New Contract'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth>
              <InputLabel>Sales Representative</InputLabel>
              <Select
                value={formData.srId}
                label="Sales Representative"
                onChange={(e) => {
                  const sr = salesReps.find(s => s.id === e.target.value);
                  setFormData({
                    ...formData,
                    srId: e.target.value,
                    monthlyLimit: sr ? sr.withdrawalLimit * 30 : 0,
                    terms: {
                      ...formData.terms,
                      maximumOrder: sr ? sr.withdrawalLimit : 0
                    }
                  });
                }}
              >
                {salesReps.map((sr) => (
                  <MenuItem key={sr.id} value={sr.id}>
                    {sr.name} ({agencies.find(a => a.id === sr.agencyId)?.name})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(date) => setFormData({ ...formData, startDate: date || new Date() })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(date) => setFormData({ ...formData, endDate: date || new Date() })}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </LocalizationProvider>

            <TextField
              fullWidth
              type="number"
              label="Monthly Limit (units)"
              value={formData.monthlyLimit}
              onChange={(e) => setFormData({ ...formData, monthlyLimit: Number(e.target.value) })}
            />

            <TextField
              fullWidth
              type="number"
              label="Minimum Order (units)"
              value={formData.terms.minimumOrder}
              onChange={(e) => setFormData({
                ...formData,
                terms: { ...formData.terms, minimumOrder: Number(e.target.value) }
              })}
            />

            <TextField
              fullWidth
              type="number"
              label="Maximum Order (units)"
              value={formData.terms.maximumOrder}
              onChange={(e) => setFormData({
                ...formData,
                terms: { ...formData.terms, maximumOrder: Number(e.target.value) }
              })}
            />

            <FormControl fullWidth>
              <InputLabel>Withdrawal Frequency</InputLabel>
              <Select
                value={formData.terms.withdrawalFrequency}
                label="Withdrawal Frequency"
                onChange={(e) => setFormData({
                  ...formData,
                  terms: { ...formData.terms, withdrawalFrequency: e.target.value }
                })}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Return Policy</InputLabel>
              <Select
                value={formData.terms.returnPolicy}
                label="Return Policy"
                onChange={(e) => setFormData({
                  ...formData,
                  terms: { ...formData.terms, returnPolicy: e.target.value }
                })}
              >
                <MenuItem value="within 7 days">Within 7 days</MenuItem>
                <MenuItem value="within 14 days">Within 14 days</MenuItem>
                <MenuItem value="within 30 days">Within 30 days</MenuItem>
                <MenuItem value="no returns">No returns allowed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingContract ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
      >
        <Alert
          onClose={() => setNotification(null)}
          severity={notification?.type}
          sx={{ width: '100%' }}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default ContractManagement; 