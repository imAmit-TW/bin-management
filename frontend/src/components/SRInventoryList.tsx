import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Avatar,
  Tooltip,
  Snackbar,
  Alert,
} from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

interface SRAllocation {
  srId: string;
  name: string;
  email: string;
  binId: string;
  binName: string;
  allocation: number;
  lastUpdated: Date;
}

interface Notification {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

const SRInventoryList: React.FC = () => {
  const [srAllocations, setSRAllocations] = useState<SRAllocation[]>([]);
  const [notification, setNotification] = useState<Notification | null>(null);

  useEffect(() => {
    const socket = io('http://localhost:5001');

    // Listen for SR allocation updates
    socket.on('srAllocationUpdate', (data) => {
      setSRAllocations(data);
    });

    // Listen for inventory notifications
    socket.on('inventoryNotification', (data) => {
      setNotification({
        type: data.type,
        message: data.message,
        timestamp: new Date(data.timestamp)
      });
    });

    // Initial data fetch
    fetch('http://localhost:5001/api/sr-allocations')
      .then(res => res.json())
      .then(data => setSRAllocations(data));

    return () => {
      socket.disconnect();
    };
  }, []);

  // Group allocations by SR
  const srGroups = srAllocations.reduce((groups, allocation) => {
    if (!groups[allocation.srId]) {
      groups[allocation.srId] = {
        srId: allocation.srId,
        name: allocation.name,
        email: allocation.email,
        totalAllocation: 0,
        allocations: [],
      };
    }
    groups[allocation.srId].allocations.push(allocation);
    groups[allocation.srId].totalAllocation += allocation.allocation;
    return groups;
  }, {} as Record<string, { srId: string; name: string; email: string; totalAllocation: number; allocations: SRAllocation[] }>);

  return (
    <Paper sx={{ p: 2, mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Sales Representatives Inventory
      </Typography>
      
      {Object.values(srGroups).map((sr) => (
        <Box key={sr.srId} sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
              <PersonIcon />
            </Avatar>
            <Box>
              <Typography variant="subtitle1">{sr.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                {sr.email}
              </Typography>
            </Box>
            <Box sx={{ ml: 'auto' }}>
              <Tooltip title="Total Allocation">
                <Chip
                  label={`Total: ${sr.totalAllocation} units`}
                  color="primary"
                  variant="outlined"
                />
              </Tooltip>
            </Box>
          </Box>

          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Bin ID</TableCell>
                  <TableCell>Bin Name</TableCell>
                  <TableCell>Allocation</TableCell>
                  <TableCell>Last Updated</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {sr.allocations.map((allocation) => (
                  <TableRow key={`${sr.srId}-${allocation.binId}`}>
                    <TableCell>{allocation.binId}</TableCell>
                    <TableCell>{allocation.binName}</TableCell>
                    <TableCell>{allocation.allocation} units</TableCell>
                    <TableCell>
                      {new Date(allocation.lastUpdated).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ))}

      {/* Notifications */}
      <Snackbar
        open={!!notification}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
      >
        <Alert 
          onClose={() => setNotification(null)} 
          severity={notification?.type || 'info'}
        >
          {notification?.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default SRInventoryList; 