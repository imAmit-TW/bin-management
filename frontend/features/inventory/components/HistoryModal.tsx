import React from 'react';

interface HistoryModalProps {
  open: boolean;
  onClose: () => void;
  bin: any;
  binHistory: any[];
}

const HistoryModal: React.FC<HistoryModalProps> = ({ open, onClose, bin, binHistory }) => {
  if (!open || !bin) return null;
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>
        <div className="inline-block align-bottom bg-white rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white px-6 pt-6 pb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-2">History for {bin.name}</h3>
            <table className="min-w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2">Action</th>
                  <th className="text-left py-2">Quantity</th>
                  <th className="text-left py-2">Agency</th>
                  <th className="text-left py-2">Sales Rep</th>
                  <th className="text-left py-2">Date</th>
                </tr>
              </thead>
              <tbody>
              {binHistory.map((h, i) => (
                <tr key={i} className="border-b border-gray-50">
                  <td className="py-2">{h.type}</td>
                  <td className="py-2">{h.quantity}</td>
                  <td className="py-2">{h.agency?.name || '-'}</td>
                  <td className="py-2">{h.sr?.name || '-'}</td>
                  <td className="py-2">{h.date ? new Date(h.date).toLocaleString() : '-'}</td>
                </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal; 