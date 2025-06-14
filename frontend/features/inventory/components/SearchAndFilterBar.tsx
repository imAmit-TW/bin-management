import React from 'react';
import { Search, Filter, Download } from 'lucide-react';

interface SearchAndFilterBarProps {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  children?: React.ReactNode;
}

const SearchAndFilterBar: React.FC<SearchAndFilterBarProps> = ({ searchTerm, setSearchTerm, children }) => (
  <div className="flex flex-col sm:flex-row gap-4 mt-6">
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <input
        type="text"
        placeholder="Search products, owners, or bins..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
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
      {children}
    </div>
  </div>
);

export default SearchAndFilterBar; 