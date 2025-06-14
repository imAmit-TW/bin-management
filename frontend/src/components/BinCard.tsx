import React from 'react';
import { Plus, MinusCircle, Edit3, Trash2, Clock } from 'lucide-react';

interface Bin {
  _id: string;
  name: string;
  capacity: number;
  currentStock: number;
  seedType: string;
  lastUpdated: Date;
  owners: { _id: string; name: string }[];
  sharers: { _id: string; name: string }[];
  withdrawalLimits: { agency: { _id: string; name: string }, limit: number }[];
  history: any[];
}

interface BinCardProps {
  bin: Bin;
  idx: number;
  onAdd: (bin: Bin) => void;
  onWithdraw: (bin: Bin) => void;
  onShowHistory: (bin: Bin) => void;
}

const BinCard: React.FC<BinCardProps> = ({ bin, idx, onAdd, onWithdraw, onShowHistory }) => (
  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
    <div className="flex justify-between items-center mb-2">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">{`Bin ${idx + 1}`}</h2>
        <div className="text-xs text-gray-500 mt-1">Bin ID: <span className="font-mono">{bin._id}</span></div>
      </div>
      <div className="flex items-center gap-2">
        <button
          className="text-green-600 hover:text-green-800 p-1"
          title="Add Stock"
          onClick={() => onAdd(bin)}
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          className="text-red-600 hover:text-red-800 p-1"
          title="Withdraw Stock"
          onClick={() => onWithdraw(bin)}
        >
          <MinusCircle className="w-5 h-5" />
        </button>
        <button
          className="text-blue-600 hover:text-blue-800 p-1"
          title="Edit Bin"
          onClick={() => {}}
        >
          <Edit3 className="w-5 h-5" />
        </button>
        <button
          className="text-gray-400 hover:text-red-600 p-1"
          title="Delete Bin"
          onClick={() => {}}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
    <table className="min-w-full">
      <thead>
        <tr className="border-b border-gray-100">
          <th className="text-left text-xs font-semibold text-gray-600 py-2">Product</th>
          <th className="text-left text-xs font-semibold text-gray-600 py-2">Owner</th>
          <th className="text-right text-xs font-semibold text-gray-600 py-2">Units</th>
          <th className="text-right text-xs font-semibold text-gray-600 py-2">Volume</th>
          <th className="text-right text-xs font-semibold text-gray-600 py-2">Invoiced</th>
        </tr>
      </thead>
      <tbody>
        {/* Primary Owners */}
        {bin.owners.map((owner, i) => (
          <tr key={owner._id} className="border-b border-gray-50">
            <td className="py-2 align-top">
              <div className="font-medium text-sm text-blue-700">{bin.seedType}</div>
            </td>
            <td className="py-2 align-top">
              <div className="text-sm text-gray-900">{owner.name}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span>Primary</span>
              </div>
            </td>
            <td className="py-2 text-right align-top text-sm text-gray-900">{bin.currentStock}</td>
            <td className="py-2 text-right align-top text-sm text-gray-900">{bin.capacity}</td>
            <td className="py-2 text-right align-top text-sm text-gray-900">{bin.currentStock}</td>
          </tr>
        ))}
        {/* Sharers/Partners */}
        {bin.sharers.map((sharer, i) => (
          <tr key={sharer._id} className="border-b border-gray-50">
            <td className="py-2 align-top"></td>
            <td className="py-2 align-top">
              <div className="text-sm text-gray-900">{sharer.name}</div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <span>Partner</span>
              </div>
            </td>
            <td className="py-2 text-right align-top text-sm text-gray-900">{Math.floor(bin.currentStock / 2)}</td>
            <td className="py-2 text-right align-top text-sm text-gray-900">-----</td>
            <td className="py-2 text-right align-top text-sm text-gray-900">{Math.floor(bin.currentStock / 2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
    {/* Withdrawal Limits */}
    {bin.withdrawalLimits && bin.withdrawalLimits.length > 0 && (
      <div className="mt-4">
        <div className="text-xs font-semibold text-gray-600 mb-1">Withdrawal Limits:</div>
        <ul className="text-xs text-gray-700 list-disc list-inside">
          {bin.withdrawalLimits.map((wl, i) => (
            <li key={i}>{wl.agency?.name}: {wl.limit}</li>
          ))}
        </ul>
      </div>
    )}
    {/* View History Button */}
    <div className="mt-4">
      <button
        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
        onClick={() => onShowHistory(bin)}
      >
        <Clock className="w-4 h-4 mr-2" />
        View History
      </button>
    </div>
  </div>
);

export default BinCard; 