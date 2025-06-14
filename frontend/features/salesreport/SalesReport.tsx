import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar,
  BarChart3,
  TrendingUp,
  Users,
  Building2,
  X,
  CheckCircle
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');
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
    // Mock data
    const mockData: ReportData[] = [
      {
        id: '1',
        srId: '1',
        srName: 'Mike Wilson',
        agencyName: 'AgriCorp Solutions',
        date: new Date('2024-01-15'),
        withdrawals: 450,
        returns: 25,
        netInventory: 425,
        plan: 'premium',
        status: 'active'
      },
      {
        id: '2',
        srId: '2',
        srName: 'Lisa Brown',
        agencyName: 'Green Valley Seeds',
        date: new Date('2024-01-16'),
        withdrawals: 280,
        returns: 15,
        netInventory: 265,
        plan: 'basic',
        status: 'active'
      },
      {
        id: '3',
        srId: '3',
        srName: 'John Davis',
        agencyName: 'Harvest Partners',
        date: new Date('2024-01-17'),
        withdrawals: 650,
        returns: 40,
        netInventory: 610,
        plan: 'enterprise',
        status: 'active'
      }
    ];

    setReportData(mockData);
    applyFilters(mockData, filter);
  }, []);

  const applyFilters = (data: ReportData[], currentFilter: ReportFilter) => {
    let filtered = [...data];

    // Apply search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.srName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.plan.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply date filters
    if (currentFilter.startDate) {
      filtered = filtered.filter(item => new Date(item.date) >= currentFilter.startDate!);
    }
    if (currentFilter.endDate) {
      filtered = filtered.filter(item => new Date(item.date) <= currentFilter.endDate!);
    }

    // Apply other filters
    if (currentFilter.srId) {
      filtered = filtered.filter(item => item.srId === currentFilter.srId);
    }
    if (currentFilter.plan) {
      filtered = filtered.filter(item => item.plan === currentFilter.plan);
    }
    if (currentFilter.status) {
      filtered = filtered.filter(item => item.status === currentFilter.status);
    }

    setFilteredData(filtered);
  };

  useEffect(() => {
    applyFilters(reportData, filter);
  }, [searchTerm, reportData, filter]);

  const handleFilterChange = (field: keyof ReportFilter, value: any) => {
    const newFilter = { ...filter, [field]: value };
    setFilter(newFilter);
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

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'premium': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const totalWithdrawals = filteredData.reduce((sum, item) => sum + item.withdrawals, 0);
  const totalReturns = filteredData.reduce((sum, item) => sum + item.returns, 0);
  const totalNet = filteredData.reduce((sum, item) => sum + item.netInventory, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Representative Reports</h1>
          <p className="text-gray-600 mt-2">Analyze sales performance and inventory movements</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setOpenFilter(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 mr-2" />
            Customize
          </button>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="flex gap-6 overflow-x-auto mt-6">
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{filteredData.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Withdrawals</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalWithdrawals.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Returns</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalReturns.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Inventory</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalNet.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Building2 className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by sales rep, agency, plan, or status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Sales Activity Report</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {availableFields
                  .filter(field => filter.selectedFields.includes(field.id))
                  .map(field => (
                    <th key={field.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {field.label}
                    </th>
                  ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {filter.selectedFields.map(field => (
                    <td key={field} className="px-6 py-4 whitespace-nowrap">
                      {field === 'date' ? (
                        <div className="flex items-center text-sm text-gray-900">
                          <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                          {new Date(row[field] as Date).toLocaleDateString()}
                        </div>
                      ) : field === 'plan' ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPlanColor(String(row[field]))}`}>
                          {String(row[field])}
                        </span>
                      ) : field === 'status' ? (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                          row[field] === 'active' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-700 border-gray-200'
                        }`}>
                          {String(row[field])}
                        </span>
                      ) : field === 'srName' ? (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                              <Users className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{String(row[field])}</div>
                          </div>
                        </div>
                      ) : field === 'agencyName' ? (
                        <div className="flex items-center text-sm text-gray-900">
                          <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                          {String(row[field])}
                        </div>
                      ) : typeof row[field] === 'number' ? (
                        <div className="text-sm font-medium text-gray-900">
                          {(row[field] as number).toLocaleString()}
                          {(field === 'withdrawals' || field === 'returns' || field === 'netInventory') && (
                            <span className="text-xs text-gray-500 ml-1">units</span>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-900">{String(row[field])}</div>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customize Report Modal */}
      {openFilter && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setOpenFilter(false)}></div>
            
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">Customize Report</h3>
                  <button
                    onClick={() => setOpenFilter(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 pb-6">
                <div className="space-y-6">
                  {/* Date Range */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Date Range</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={filter.startDate?.toISOString().split('T')[0] || ''}
                          onChange={(e) => handleFilterChange('startDate', e.target.value ? new Date(e.target.value) : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                          type="date"
                          value={filter.endDate?.toISOString().split('T')[0] || ''}
                          onChange={(e) => handleFilterChange('endDate', e.target.value ? new Date(e.target.value) : null)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Field Selection */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Select Fields to Display</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {availableFields.map(field => (
                        <label key={field.id} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            checked={filter.selectedFields.includes(field.id)}
                            onChange={() => handleFieldToggle(field.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm font-medium text-gray-700">{field.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Additional Filters */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Additional Filters</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Plan</label>
                        <select
                          value={filter.plan}
                          onChange={(e) => handleFilterChange('plan', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">All Plans</option>
                          <option value="basic">Basic</option>
                          <option value="premium">Premium</option>
                          <option value="enterprise">Enterprise</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                          value={filter.status}
                          onChange={(e) => handleFilterChange('status', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">All Statuses</option>
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={() => setOpenFilter(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    applyFilters(reportData, filter);
                    setOpenFilter(false);
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SalesReport;