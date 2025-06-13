import React from 'react';
import { Package, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface StatsHeaderProps {
  bins: any[];
  totalCapacity: number;
  totalStock: number;
  utilizationRate: number;
}

const StatsHeader: React.FC<StatsHeaderProps> = ({ bins, totalCapacity, totalStock, utilizationRate }) => (
  <>
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bulk Storage Inventory</h1>
        <p className="text-gray-600 mt-2">Manage and track your bulk storage inventory across bins</p>
      </div>
    </div>
    <div className="flex gap-6 overflow-x-auto mt-6">
      <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Bins</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{bins.length}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <Package className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>
      <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Volume</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalCapacity.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>
      <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Current Stock</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalStock.toLocaleString()}</p>
          </div>
          <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
            <Clock className="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
      <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Utilization</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{utilizationRate.toFixed(1)}%</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
            <AlertTriangle className="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  </>
);

export default StatsHeader; 