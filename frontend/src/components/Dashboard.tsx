import React, { useEffect, useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  AlertTriangle,
  Activity,
  BarChart3,
  PieChart,
  X,
  User
} from 'lucide-react';

interface Agency {
  id: number;
  name: string;
  allocation: number;
  lastUpdated: Date;
}

interface StorageData {
  totalCapacity: number;
  currentUsage: number;
  agencies: Agency[];
}

const Dashboard: React.FC = () => {
  const [storageData, setStorageData] = useState<StorageData | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeComponent, setActiveComponent] = useState('dashboard');

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setStorageData)
      .catch(() => setNotification('Failed to load dashboard data'));
  }, []);

  if (!storageData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const usagePercentage = (storageData.currentUsage / storageData.totalCapacity) * 100;
  const availableSpace = storageData.totalCapacity - storageData.currentUsage;

  const stats = [
    {
      name: 'Total Capacity',
      value: `${storageData.totalCapacity.toLocaleString()}`,
      unit: 'units',
      change: '+2.5%',
      changeType: 'increase',
      icon: Package,
      color: 'blue'
    },
    {
      name: 'Current Usage',
      value: `${storageData.currentUsage.toLocaleString()}`,
      unit: 'units',
      change: '+12.3%',
      changeType: 'increase',
      icon: Activity,
      color: 'green'
    },
    {
      name: 'Available Space',
      value: `${availableSpace.toLocaleString()}`,
      unit: 'units',
      change: '-5.2%',
      changeType: 'decrease',
      icon: TrendingDown,
      color: 'orange'
    },
    {
      name: 'Active Agencies',
      value: storageData.agencies.length.toString(),
      unit: 'agencies',
      change: '+1',
      changeType: 'increase',
      icon: Users,
      color: 'purple'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-600 border-blue-200',
      green: 'bg-green-50 text-green-600 border-green-200',
      orange: 'bg-orange-50 text-orange-600 border-orange-200',
      purple: 'bg-purple-50 text-purple-600 border-purple-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const navigation = [
    { name: 'Dashboard', component: 'dashboard', icon: BarChart3 },
    { name: 'Agencies', component: 'agencies', icon: Users },
    { name: 'Storage', component: 'storage', icon: Package },
    { name: 'Reports', component: 'reports', icon: PieChart },
  ];

  return (
    <div className="w-full max-w-full p-4 sm:p-6 md:p-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Seed Storage Dashboard</h1>
          <p className="text-gray-600 mt-2 text-base sm:text-lg">Monitor your inventory and agency allocations in real-time</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="bg-white rounded-lg px-4 py-2 shadow-sm border border-gray-200">
            <span className="text-sm text-gray-500">Last updated:</span>
            <span className="ml-2 text-sm font-medium text-gray-900">
              {new Date().toLocaleTimeString()}
            </span>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {usagePercentage > 75 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="text-sm font-medium text-orange-800">High Storage Usage Alert</h3>
              <p className="text-sm text-orange-700 mt-1">
                Storage capacity is at {usagePercentage.toFixed(1)}%. Consider redistributing inventory or expanding capacity.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg border ${getColorClasses(stat.color)}`}> 
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center space-x-1 text-sm ${
                  stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span className="font-medium">{stat.change}</span>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-500">{stat.name}</h3>
                <div className="flex items-baseline space-x-2 mt-1">
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.unit}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
        {/* Storage Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Storage Overview</h2>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Capacity Utilization</span>
              <span className="font-medium text-gray-900">{usagePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-500 ${
                  usagePercentage > 90 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                  usagePercentage > 75 ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                  'bg-gradient-to-r from-blue-500 to-blue-600'
                }`}
                style={{ width: `${usagePercentage}%` }}
              ></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 mt-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-xl sm:text-2xl font-bold text-blue-600">{storageData.totalCapacity.toLocaleString()}</p>
                <p className="text-sm text-blue-700 mt-1">Total Capacity</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-100">
                <p className="text-xl sm:text-2xl font-bold text-green-600">{storageData.currentUsage.toLocaleString()}</p>
                <p className="text-sm text-green-700 mt-1">In Use</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-xl sm:text-2xl font-bold text-gray-600">{availableSpace.toLocaleString()}</p>
                <p className="text-sm text-gray-700 mt-1">Available</p>
              </div>
            </div>
          </div>
        </div>
        {/* Agency Allocations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Top Agencies</h2>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {storageData.agencies.map((agency, index) => {
              const percentage = (agency.allocation / storageData.currentUsage) * 100;
              const colors = ['bg-blue-500', 'bg-green-500', 'bg-orange-500', 'bg-purple-500'];
              return (
                <div key={agency.id} className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${colors[index % colors.length]}`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{agency.name}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-500">{agency.allocation.toLocaleString()} units</p>
                      <p className="text-xs font-medium text-gray-700">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Agency Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {storageData.agencies.map((agency) => (
          <div key={agency.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 truncate">{agency.name}</h3>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Allocation</span>
                <span className="text-sm font-medium text-gray-900">{agency.allocation.toLocaleString()} units</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Last Updated</span>
                <span className="text-sm text-gray-700">{new Date(agency.lastUpdated).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
