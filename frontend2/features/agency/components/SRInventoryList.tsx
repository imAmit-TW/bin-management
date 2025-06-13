import React from 'react';
import { Users, Package, TrendingUp, Clock } from 'lucide-react';

const SRInventoryList: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center py-12">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Sales Representative Inventory</h3>
        <p className="text-gray-500">This feature will show individual SR inventory allocations and usage patterns.</p>
      </div>
    </div>
  );
};

export default SRInventoryList;