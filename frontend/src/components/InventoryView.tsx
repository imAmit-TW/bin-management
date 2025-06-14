import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  PlusCircle, 
  MinusCircle,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import BinCard from './BinCard';
import StatsHeader from './StatsHeader';
import SearchAndFilterBar from './SearchAndFilterBar';
import InventoryOperationModal from './InventoryOperationModal';
import NotificationToast from './NotificationToast';
import HistoryModal from './HistoryModal';

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

interface Notification {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

interface InventoryAlert {
  binId: string;
  binName: string;
  alertType: 'surplus' | 'replenish' | 'normal';
  message: string;
  currentStock: number;
  capacity: number;
  usageRatio: number;
}

const InventoryView: React.FC = () => {
  const [bins, setBins] = useState<Bin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [selectedBin, setSelectedBin] = useState<Bin | null>(null);
  const [inventoryDialog, setInventoryDialog] = useState(false);
  const [quantity, setQuantity] = useState('');
  const [operationType, setOperationType] = useState<'add' | 'withdraw'>('add');
  const [notification, setNotification] = useState<Notification | null>(null);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [agencies, setAgencies] = useState<{ _id: string; name: string }[]>([]);
  const [srs, setSRs] = useState<{ _id: string; name: string }[]>([]);
  const [selectedAgency, setSelectedAgency] = useState<string>('');
  const [selectedSR, setSelectedSR] = useState<string>('');
  const [historyModalBin, setHistoryModalBin] = useState<Bin | null>(null);
  const [binHistory, setBinHistory] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/inventory/bins')
      .then(res => res.json())
      .then(setBins)
      .catch(() => setNotification({ type: 'error', message: 'Failed to load inventory bins', timestamp: new Date() }));
    fetch('/api/agencies')
      .then(res => res.json())
      .then(setAgencies);
    fetch('/api/sales-reps')
      .then(res => res.json())
      .then(setSRs);
  }, []);

  const filteredBins = bins.filter(bin =>
    bin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bin.seedType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (currentStock: number, capacity: number) => {
    const percentage = (currentStock / capacity) * 100;
    if (percentage >= 90) return { label: 'Full', color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' };
    if (percentage >= 70) return { label: 'Good', color: 'green', bgColor: 'bg-green-50', textColor: 'text-green-700', borderColor: 'border-green-200' };
    if (percentage >= 30) return { label: 'Moderate', color: 'yellow', bgColor: 'bg-yellow-50', textColor: 'text-yellow-700', borderColor: 'border-yellow-200' };
    return { label: 'Low', color: 'red', bgColor: 'bg-red-50', textColor: 'text-red-700', borderColor: 'border-red-200' };
  };

  const handleInventoryOperation = (bin: Bin, type: 'add' | 'withdraw') => {
    setSelectedBin(bin);
    setOperationType(type);
    setQuantity('');
    setInventoryDialog(true);
  };

  const handleInventorySubmit = async () => {
    if (selectedBin && quantity && selectedAgency && selectedSR) {
      const endpoint = operationType === 'add' ? 'add' : 'withdraw';
      const res = await fetch(`/api/inventory/bins/${selectedBin._id}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          quantity: parseInt(quantity),
          agencyId: selectedAgency,
          srId: selectedSR
        })
      });
      if (res.ok) {
        const updatedBin = await res.json();
        setBins(bins => bins.map(b => b._id === updatedBin._id ? updatedBin : b));
        setNotification({
          type: 'success',
          message: `Successfully ${operationType === 'add' ? 'added' : 'withdrew'} ${quantity} units ${operationType === 'add' ? 'to' : 'from'} ${selectedBin.name}`,
          timestamp: new Date()
        });
        setInventoryDialog(false);
      } else {
        const err = await res.json();
        setNotification({ type: 'error', message: err.error || 'Operation failed', timestamp: new Date() });
      }
    }
  };

  const totalCapacity = bins.reduce((sum, bin) => sum + (bin.capacity || 0), 0);
  const totalStock = bins.reduce((sum, bin) => sum + (bin.currentStock || 0), 0);
  const utilizationRate = totalCapacity > 0 ? (totalStock / totalCapacity) * 100 : 0;

  const handleShowHistory = (bin: Bin) => {
    setHistoryModalBin(bin);
    fetch(`/api/inventory/bins/${bin._id}/history`)
      .then(res => res.json())
      .then(setBinHistory);
  };

  const handleCloseHistory = () => {
    setHistoryModalBin(null);
    setBinHistory([]);
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex gap-4 overflow-x-auto items-stretch">
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-500">Total Bins</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{bins.length}</p>
        </div>
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-500">Total Volume</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalCapacity.toLocaleString()}</p>
        </div>
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-500">Current Stock</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{totalStock.toLocaleString()}</p>
        </div>
        <div className="w-64 bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex-shrink-0">
          <h3 className="text-sm font-medium text-gray-500">Utilization</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{utilizationRate.toFixed(1)}%</p>
        </div>
      </div>
      {/* Search and Filters */}
      <SearchAndFilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* Bin Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bins.filter(bin =>
          bin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          bin.seedType.toLowerCase().includes(searchTerm.toLowerCase())
        ).map((bin, idx) => (
          <BinCard
            key={bin._id}
            bin={bin}
            idx={idx}
            onAdd={b => handleInventoryOperation(b, 'add')}
            onWithdraw={b => handleInventoryOperation(b, 'withdraw')}
            onShowHistory={handleShowHistory}
          />
        ))}
      </div>
      {/* Inventory Operation Modal */}
      <InventoryOperationModal
        open={inventoryDialog}
        onClose={() => setInventoryDialog(false)}
        onSubmit={handleInventorySubmit}
        operationType={operationType}
        selectedBin={selectedBin}
        quantity={quantity}
        setQuantity={setQuantity}
        agencies={agencies}
        srs={srs}
        selectedAgency={selectedAgency}
        setSelectedAgency={setSelectedAgency}
        selectedSR={selectedSR}
        setSelectedSR={setSelectedSR}
      />
      {/* Notification */}
      <NotificationToast
        notification={notification}
        onClose={() => setNotification(null)}
      />
      {/* History Modal */}
      <HistoryModal
        open={!!historyModalBin}
        onClose={handleCloseHistory}
        bin={historyModalBin}
        binHistory={binHistory}
      />
    </div>
  );
};

export default InventoryView;