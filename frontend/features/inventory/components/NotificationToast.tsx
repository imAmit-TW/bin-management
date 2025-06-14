import React from 'react';
import { CheckCircle } from 'lucide-react';

interface Notification {
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

interface Props {
  notification: Notification | null;
  onClose: () => void;
}

const NotificationToast: React.FC<Props> = ({ notification, onClose }) => {
  if (!notification) return null;
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`rounded-lg p-4 shadow-lg border ${
        notification.type === 'success' ? 'bg-green-50 border-green-200' :
        notification.type === 'error' ? 'bg-red-50 border-red-200' :
        notification.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
        'bg-blue-50 border-blue-200'
      }`}>
        <div className="flex items-center">
          <CheckCircle className={`w-5 h-5 mr-3 ${
            notification.type === 'success' ? 'text-green-600' :
            notification.type === 'error' ? 'text-red-600' :
            notification.type === 'warning' ? 'text-yellow-600' :
            'text-blue-600'
          }`} />
          <p className={`text-sm font-medium ${
            notification.type === 'success' ? 'text-green-800' :
            notification.type === 'error' ? 'text-red-800' :
            notification.type === 'warning' ? 'text-yellow-800' :
            'text-blue-800'
          }`}>
            {notification.message}
          </p>
          <button
            onClick={onClose}
            className="ml-4 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast; 