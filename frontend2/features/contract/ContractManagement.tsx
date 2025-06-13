import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Calendar,
  FileText,
  Users,
  Building2,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  Filter,
  Download
} from 'lucide-react';

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
  const [searchTerm, setSearchTerm] = useState('');

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
    // Mock data
    const mockAgencies: Agency[] = [
      { id: '1', name: 'AgriCorp Solutions' },
      { id: '2', name: 'Green Valley Seeds' },
      { id: '3', name: 'Harvest Partners' }
    ];

    const mockSalesReps: SalesRepresentative[] = [
      { id: '1', name: 'Mike Wilson', agencyId: '1', withdrawalLimit: 500, plan: 'premium', status: 'active' },
      { id: '2', name: 'Lisa Brown', agencyId: '2', withdrawalLimit: 300, plan: 'basic', status: 'active' },
      { id: '3', name: 'John Davis', agencyId: '3', withdrawalLimit: 800, plan: 'enterprise', status: 'active' }
    ];

    const mockContracts: Contract[] = [
      {
        id: '1',
        srId: '1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        monthlyLimit: 15000,
        currentMonthUsage: 8500,
        status: 'active',
        terms: {
          withdrawalFrequency: 'daily',
          returnPolicy: 'within 7 days',
          minimumOrder: 10,
          maximumOrder: 500
        }
      },
      {
        id: '2',
        srId: '2',
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-12-31'),
        monthlyLimit: 9000,
        currentMonthUsage: 2100,
        status: 'active',
        terms: {
          withdrawalFrequency: 'weekly',
          returnPolicy: 'within 14 days',
          minimumOrder: 5,
          maximumOrder: 300
        }
      }
    ];

    setAgencies(mockAgencies);
    setSalesReps(mockSalesReps);
    setContracts(mockContracts);
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
      const newContract: Contract = {
        id: editingContract?.id || Date.now().toString(),
        srId: formData.srId,
        startDate: formData.startDate,
        endDate: formData.endDate,
        monthlyLimit: formData.monthlyLimit,
        currentMonthUsage: editingContract?.currentMonthUsage || 0,
        status: 'active',
        terms: formData.terms
      };

      if (editingContract) {
        setContracts(prev => prev.map(c => c.id === editingContract.id ? newContract : c));
      } else {
        setContracts(prev => [...prev, newContract]);
      }

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
      case 'active': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'expired': return 'bg-red-50 text-red-700 border-red-200';
      case 'terminated': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getUsagePercentage = (current: number, limit: number) => {
    return (current / limit) * 100;
  };

  const filteredContracts = contracts.filter(contract => {
    const sr = salesReps.find(s => s.id === contract.srId);
    const agency = sr ? agencies.find(a => a.id === sr.agencyId) : null;
    
    return (
      sr?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agency?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.status.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Contract Management</h1>
          <p className="text-gray-600 mt-2">Manage sales representative contracts and terms</p>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/25"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Contract
        </button>
      </div>

      {/* Stats Cards */}
      <div className="flex gap-6 overflow-x-auto mt-6">
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Contracts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{contracts.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Contracts</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{contracts.filter(c => c.status === 'active').length}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {contracts.filter(c => {
                  const daysUntilExpiry = Math.ceil((new Date(c.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
                }).length}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">High Usage</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {contracts.filter(c => getUsagePercentage(c.currentMonthUsage, c.monthlyLimit) > 80).length}
              </p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search contracts by sales rep, agency, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Contracts Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Contracts</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sales Representative</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agency</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contract Period</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monthly Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContracts.map((contract) => {
                const sr = salesReps.find(s => s.id === contract.srId);
                const agency = sr ? agencies.find(a => a.id === sr.agencyId) : null;
                const usagePercentage = getUsagePercentage(contract.currentMonthUsage, contract.monthlyLimit);
                const daysUntilExpiry = Math.ceil((new Date(contract.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                
                return (
                  <tr key={contract.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                            <Users className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{sr?.name || 'N/A'}</div>
                          <div className="text-sm text-gray-500">ID: {contract.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                        <div className="text-sm font-medium text-gray-900">{agency?.name || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                        <div>
                          <div>{new Date(contract.startDate).toLocaleDateString()}</div>
                          <div className="text-xs text-gray-500">to {new Date(contract.endDate).toLocaleDateString()}</div>
                        </div>
                      </div>
                      {daysUntilExpiry <= 30 && daysUntilExpiry > 0 && (
                        <div className="text-xs text-orange-600 mt-1 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          Expires in {daysUntilExpiry} days
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 mr-3">
                          <div className="text-sm font-medium text-gray-900">
                            {contract.currentMonthUsage.toLocaleString()} / {contract.monthlyLimit.toLocaleString()} units
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                            <div 
                              className={`h-1.5 rounded-full ${
                                usagePercentage >= 90 ? 'bg-red-500' :
                                usagePercentage >= 75 ? 'bg-orange-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">{usagePercentage.toFixed(1)}% used</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(contract.status)}`}>
                        {contract.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleOpenDialog(contract)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Contract"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Contract Dialog Modal */}
      {openDialog && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseDialog}></div>
            
            <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-6 pt-6 pb-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {editingContract ? 'Edit Contract' : 'Add New Contract'}
                  </h3>
                  <button
                    onClick={handleCloseDialog}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="px-6 pb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sales Representative</label>
                    <select
                      value={formData.srId}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Sales Representative</option>
                      {salesReps.map((sr) => (
                        <option key={sr.id} value={sr.id}>
                          {sr.name} ({agencies.find(a => a.id === sr.agencyId)?.name})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate.toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, startDate: new Date(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate.toISOString().split('T')[0]}
                      onChange={(e) => setFormData({ ...formData, endDate: new Date(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Limit (units)</label>
                    <input
                      type="number"
                      value={formData.monthlyLimit}
                      onChange={(e) => setFormData({ ...formData, monthlyLimit: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Withdrawal Frequency</label>
                    <select
                      value={formData.terms.withdrawalFrequency}
                      onChange={(e) => setFormData({
                        ...formData,
                        terms: { ...formData.terms, withdrawalFrequency: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Order (units)</label>
                    <input
                      type="number"
                      value={formData.terms.minimumOrder}
                      onChange={(e) => setFormData({
                        ...formData,
                        terms: { ...formData.terms, minimumOrder: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Maximum Order (units)</label>
                    <input
                      type="number"
                      value={formData.terms.maximumOrder}
                      onChange={(e) => setFormData({
                        ...formData,
                        terms: { ...formData.terms, maximumOrder: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Return Policy</label>
                    <select
                      value={formData.terms.returnPolicy}
                      onChange={(e) => setFormData({
                        ...formData,
                        terms: { ...formData.terms, returnPolicy: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="within 7 days">Within 7 days</option>
                      <option value="within 14 days">Within 14 days</option>
                      <option value="within 30 days">Within 30 days</option>
                      <option value="no returns">No returns allowed</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
                <button
                  onClick={handleCloseDialog}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-sm font-medium hover:from-blue-700 hover:to-indigo-700 transition-all"
                >
                  {editingContract ? 'Update' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <div className="fixed bottom-4 right-4 z-50">
          <div className={`rounded-lg p-4 shadow-lg border ${
            notification.type === 'success' ? 'bg-green-50 border-green-200' :
            notification.type === 'error' ? 'bg-red-50 border-red-200' :
            'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center">
              <CheckCircle className={`w-5 h-5 mr-3 ${
                notification.type === 'success' ? 'text-green-600' :
                notification.type === 'error' ? 'text-red-600' :
                'text-blue-600'
              }`} />
              <p className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-green-800' :
                notification.type === 'error' ? 'text-red-800' :
                'text-blue-800'
              }`}>
                {notification.message}
              </p>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractManagement;