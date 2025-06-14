import React from 'react';
import { PlusCircle, MinusCircle } from 'lucide-react';

interface Agency { _id: string; name: string; }
interface SR { _id: string; name: string; }
interface Bin { _id: string; name: string; capacity: number; currentStock: number; }

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
  operationType: 'add' | 'withdraw';
  selectedBin: Bin | null;
  quantity: string;
  setQuantity: (v: string) => void;
  agencies: Agency[];
  srs: SR[];
  selectedAgency: string;
  setSelectedAgency: (v: string) => void;
  selectedSR: string;
  setSelectedSR: (v: string) => void;
}

const InventoryOperationModal: React.FC<Props> = ({ open, onClose, onSubmit, operationType, selectedBin, quantity, setQuantity, agencies, srs, selectedAgency, setSelectedAgency, selectedSR, setSelectedSR }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            <div className="flex items-center">
              <div className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${operationType === 'add' ? 'bg-green-100' : 'bg-red-100'}`}>
                {operationType === 'add' ? (
                  <PlusCircle className="h-6 w-6 text-green-600" />
                ) : (
                  <MinusCircle className="h-6 w-6 text-red-600" />
                )}
              </div>
              <div className="ml-4 text-left">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  {operationType === 'add' ? 'Add Stock' : 'Withdraw Stock'}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedBin?.name}
                </p>
              </div>
            </div>
          </div>
          <div className="px-6 pb-6">
            <div className="mt-4">
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                Quantity (units)
              </label>
              <input
                type="number"
                id="quantity"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter quantity"
                min="1"
                max={operationType === 'withdraw' ? selectedBin?.currentStock : selectedBin?.capacity}
              />
              {selectedBin && (
                <p className="text-xs text-gray-500 mt-1">
                  Current stock: {selectedBin.currentStock} / {selectedBin.capacity} units
                </p>
              )}
            </div>
            <div className="mt-4">
              <label htmlFor="agency" className="block text-sm font-medium text-gray-700 mb-2">
                Select Agency
              </label>
              <select
                value={selectedAgency}
                onChange={e => setSelectedAgency(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Agency</option>
                {selectedBin?.owners.concat(selectedBin?.sharers || []).map(a => (
                  <option key={a._id} value={a._id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div className="mt-4">
              <label htmlFor="sr" className="block text-sm font-medium text-gray-700 mb-2">
                Select Sales Rep
              </label>
              <select
                value={selectedSR}
                onChange={e => setSelectedSR(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Sales Rep</option>
                {srs.map(sr => (
                  <option key={sr._id} value={sr._id}>{sr.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              className={`px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors ${operationType === 'add' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {operationType === 'add' ? 'Add Stock' : 'Withdraw Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryOperationModal; 