import React, { useEffect, useState } from 'react';


import BinCard from './components/BinCard';
import StatsHeader from './components/StatsHeader';
import SearchAndFilterBar from './components/SearchAndFilterBar';
import InventoryOperationModal from './components/InventoryOperationModal';
import NotificationToast from './components/NotificationToast';
import HistoryModal from './components/HistoryModal';

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

  const totalCapacity = bins.reduce((sum, bin) => sum + bin.capacity, 0);
  const totalStock = bins.reduce((sum, bin) => sum + bin.currentStock, 0);
  const utilizationRate = (totalStock / totalCapacity) * 100;

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
      <StatsHeader
        bins={bins}
        totalCapacity={totalCapacity}
        totalStock={totalStock}
        utilizationRate={utilizationRate}
      />
      {/* Search and Filters */}
      <SearchAndFilterBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      {/* Bin Cards */}
      <div className="mt-8 space-y-8">
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