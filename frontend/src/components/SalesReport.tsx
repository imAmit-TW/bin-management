import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  FormGroup,
  FormControlLabel,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers-pro';
import { AdapterDateFns } from '@mui/x-date-pickers-pro/AdapterDateFns';
import { Download as DownloadIcon, FilterList as FilterIcon } from '@mui/icons-material';
import { io } from 'socket.io-client';

interface ReportData {
  id: string;
  srId: string;
  srName: string;
  agencyName: string;
  date: Date;
  withdrawals: number;
  returns: number;
  netInventory: number;
  plan: string;
  status: string;
  [key: string]: string | number | Date;
}

interface ReportFilter {
  startDate: Date | null;
  endDate: Date | null;
  srId: string;
  agencyId: string;
  plan: string;
  status: string;
  selectedFields: string[];
}

const SalesReport: React.FC = () => {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [filteredData, setFilteredData] = useState<ReportData[]>([]);
  const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState<ReportFilter>({
    startDate: null,
    endDate: null,
    srId: '',
    agencyId: '',
    plan: '',
    status: '',
    selectedFields: ['srName', 'agencyName', 'date', 'withdrawals', 'returns', 'netInventory', 'plan', 'status']
  });

  const availableFields = [
    { id: 'srName', label: 'Sales Rep Name' },
    { id: 'agencyName', label: 'Agency Name' },
    { id: 'date', label: 'Date' },
    { id: 'withdrawals', label: 'Withdrawals' },
    { id: 'returns', label: 'Returns' },
    { id: 'netInventory', label: 'Net Inventory' },
    { id: 'plan', label: 'Plan' },
    { id: 'status', label: 'Status' }
  ];

  useEffect(() => {
    const socket = io('http://localhost:5001');

    socket.on('reportData', (data) => {
      setReportData(data);
      applyFilters(data, filter);
    });

    // Initial data fetch
    fetch('http://localhost:5001/api/reports')
      .then(res => res.json())
      .then(data => {
        setReportData(data);
        applyFilters(data, filter);
      });

    return () => {
      socket.disconnect();
    };
  }, []);

  const applyFilters = (data: ReportData[], currentFilter: ReportFilter) => {
    let filtered = [...data];

    if (currentFilter.startDate) {
      filtered = filtered.filter(item => new Date(item.date) >= currentFilter.startDate!);
    }
    if (currentFilter.endDate) {
      filtered = filtered.filter(item => new Date(item.date) <= currentFilter.endDate!);
    }
    if (currentFilter.srId) {
      filtered = filtered.filter(item => item.srId === currentFilter.srId);
    }
    if (currentFilter.agencyId) {
      filtered = filtered.filter(item => item.agencyId === currentFilter.agencyId);
    }
    if (currentFilter.plan) {
      filtered = filtered.filter(item => item.plan === currentFilter.plan);
    }
    if (currentFilter.status) {
      filtered = filtered.filter(item => item.status === currentFilter.status);
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (field: keyof ReportFilter, value: any) => {
    const newFilter = { ...filter, [field]: value };
    setFilter(newFilter);
    applyFilters(reportData, newFilter);
  };

  const handleFieldToggle = (fieldId: string) => {
    const newSelectedFields = filter.selectedFields.includes(fieldId)
      ? filter.selectedFields.filter(f => f !== fieldId)
      : [...filter.selectedFields, fieldId];
    
    handleFilterChange('selectedFields', newSelectedFields);
  };

  const exportToCSV = () => {
    const headers = availableFields
      .filter(field => filter.selectedFields.includes(field.id))
      .map(field => field.label);

    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => 
        filter.selectedFields
          .map(field => {
            const value = row[field as keyof ReportData];
            return typeof value === 'string' ? `"${value}"` : value;
          })
          .join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Sales Representative Reports</Typography>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FilterIcon />}
            onClick={() => setOpenFilter(true)}
            sx={{ mr: 1 }}
          >
            Filter
          </Button>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={exportToCSV}
          >
            Export
          </Button>
        </Box>
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {availableFields
                .filter(field => filter.selectedFields.includes(field.id))
                .map(field => (
                  <TableCell key={field.id}>{field.label}</TableCell>
                ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                {filter.selectedFields.map(field => (
                  <TableCell key={field}>
                    {field === 'date' ? new Date(row[field] as Date).toLocaleDateString() :
                     field === 'plan' ? (
                       <Chip
                         label={String(row[field])}
                         color={
                           row[field] === 'enterprise' ? 'primary' :
                           row[field] === 'premium' ? 'secondary' : 'default'
                         }
                         size="small"
                       />
                     ) :
                     field === 'status' ? (
                       <Chip
                         label={String(row[field])}
                         color={row[field] === 'active' ? 'success' : 'default'}
                         size="small"
                       />
                     ) :
                     String(row[field])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openFilter} onClose={() => setOpenFilter(false)} maxWidth="md" fullWidth>
        <DialogTitle>Customize Report</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={filter.startDate}
                    onChange={(date: Date | null) => handleFilterChange('startDate', date)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ flex: '1 1 300px', minWidth: 0 }}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={filter.endDate}
                    onChange={(date: Date | null) => handleFilterChange('endDate', date)}
                    slotProps={{ textField: { fullWidth: true } }}
                  />
                </LocalizationProvider>
              </Box>
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1" sx={{ mb: 1 }}>Select Fields to Display</Typography>
                <FormGroup>
                  {availableFields.map(field => (
                    <FormControlLabel
                      key={field.id}
                      control={
                        <Checkbox
                          checked={filter.selectedFields.includes(field.id)}
                          onChange={() => handleFieldToggle(field.id)}
                        />
                      }
                      label={field.label}
                    />
                  ))}
                </FormGroup>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenFilter(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default SalesReport; 