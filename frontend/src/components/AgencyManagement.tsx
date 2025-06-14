import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Tabs,
  Tab,
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
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { io } from 'socket.io-client';

interface Agency {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface SalesRepresentative {
  id: string;
  name: string;
  email: string;
  phone: string;
  agencyId: string;
  withdrawalLimit: number;
  plan: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'inactive';
  createdAt: Date;
}

interface Notification {
  type: 'success' | 'error' | 'info';
  message: string;
}

const AgencyManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [srs, setSRs] = useState<SalesRepresentative[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'agency' | 'sr'>('agency');
  const [editingItem, setEditingItem] = useState<Agency | SalesRepresentative | null>(null);
  const [notification, setNotification] = useState<Notification | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    agencyId: '',
    withdrawalLimit: 0,
    plan: 'basic',
    status: 'active',
  });

  useEffect(() => {
    const socket = io('http://localhost:5001');

    socket.on('agencyUpdate', (data) => {
      setAgencies(data);
    });

    socket.on('srUpdate', (data) => {
      setSRs(data);
    });

    // Initial data fetch
    fetch('http://localhost:5001/api/agencies')
      .then(res => res.json())
      .then(data => setAgencies(data));

    fetch('http://localhost:5001/api/sales-representatives')
      .then(res => res.json())
      .then(data => setSRs(data));

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type: 'agency' | 'sr', item?: Agency | SalesRepresentative) => {
    setDialogType(type);
    if (item) {
      setEditingItem(item);
      setFormData({
        name: item.name,
        contactPerson: 'contactPerson' in item ? item.contactPerson : '',
        email: item.email,
        phone: item.phone,
        address: 'address' in item ? item.address : '',
        agencyId: 'agencyId' in item ? item.agencyId : '',
        withdrawalLimit: 'withdrawalLimit' in item ? item.withdrawalLimit : 0,
        plan: 'plan' in item ? item.plan : 'basic',
        status: item.status,
      });
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
        agencyId: '',
        withdrawalLimit: 0,
        plan: 'basic',
        status: 'active',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    try {
      const endpoint = dialogType === 'agency' ? '/api/agencies' : '/api/sales-representatives';
      const method = editingItem ? 'PUT' : 'POST';
      const response = await fetch(`http://localhost:5001${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          id: editingItem?.id,
        }),
      });

      if (!response.ok) throw new Error('Failed to save');

      setNotification({
        type: 'success',
        message: `${dialogType === 'agency' ? 'Agency' : 'Sales Representative'} ${editingItem ? 'updated' : 'added'} successfully`,
      });
      handleCloseDialog();
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to save changes',
      });
    }
  };

  const handleDelete = async (type: 'agency' | 'sr', id: string) => {
    try {
      const endpoint = type === 'agency' ? '/api/agencies' : '/api/sales-representatives';
      const response = await fetch(`http://localhost:5001${endpoint}/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      setNotification({
        type: 'success',
        message: `${type === 'agency' ? 'Agency' : 'Sales Representative'} deleted successfully`,
      });
    } catch (error) {
      setNotification({
        type: 'error',
        message: 'Failed to delete',
      });
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Agency & SR Management</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(activeTab === 0 ? 'agency' : 'sr')}
        >
          Add {activeTab === 0 ? 'Agency' : 'Sales Representative'}
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Agencies" />
        <Tab label="Sales Representatives" />
      </Tabs>

      {activeTab === 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Contact Person</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {agencies.map((agency) => (
                <TableRow key={agency.id}>
                  <TableCell>{agency.name}</TableCell>
                  <TableCell>{agency.contactPerson}</TableCell>
                  <TableCell>{agency.email}</TableCell>
                  <TableCell>{agency.phone}</TableCell>
                  <TableCell>
                    <Chip
                      label={agency.status}
                      color={agency.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog('agency', agency)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete('agency', agency.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Agency</TableCell>
                <TableCell>Withdrawal Limit</TableCell>
                <TableCell>Plan</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {srs.map((sr) => (
                <TableRow key={sr.id}>
                  <TableCell>{sr.name}</TableCell>
                  <TableCell>{sr.email}</TableCell>
                  <TableCell>
                    {agencies.find(a => a.id === sr.agencyId)?.name || 'N/A'}
                  </TableCell>
                  <TableCell>{sr.withdrawalLimit} units</TableCell>
                  <TableCell>
                    <Chip
                      label={sr.plan}
                      color={
                        sr.plan === 'enterprise' ? 'primary' :
                        sr.plan === 'premium' ? 'secondary' : 'default'
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={sr.status}
                      color={sr.status === 'active' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog('sr', sr)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete('sr', sr.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Edit' : 'Add'} {dialogType === 'agency' ? 'Agency' : 'Sales Representative'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 1 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </Box>
              {dialogType === 'agency' ? (
                <>
                  <Box>
                    <TextField
                      fullWidth
                      label="Contact Person"
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                    />
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      label="Address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </Box>
                </>
              ) : (
                <>
                  <Box>
                    <FormControl fullWidth>
                      <InputLabel>Agency</InputLabel>
                      <Select
                        value={formData.agencyId}
                        label="Agency"
                        onChange={(e) => setFormData({ ...formData, agencyId: e.target.value })}
                      >
                        {agencies.map((agency) => (
                          <MenuItem key={agency.id} value={agency.id}>
                            {agency.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Box>
                    <TextField
                      fullWidth
                      type="number"
                      label="Withdrawal Limit (units)"
                      value={formData.withdrawalLimit}
                      onChange={(e) => setFormData({ ...formData, withdrawalLimit: Number(e.target.value) })}
                    />
                  </Box>
                  <Box>
                    <FormControl fullWidth>
                      <InputLabel>Plan</InputLabel>
                      <Select
                        value={formData.plan}
                        label="Plan"
                        onChange={(e) => setFormData({ ...formData, plan: e.target.value as 'basic' | 'premium' | 'enterprise' })}
                      >
                        <MenuItem value="basic">Basic</MenuItem>
                        <MenuItem value="premium">Premium</MenuItem>
                        <MenuItem value="enterprise">Enterprise</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </>
              )}
              <Box>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </Box>
              <Box>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingItem ? 'Update' : 'Add'}
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

export default AgencyManagement; 