
import React from 'react';
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Heart, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
}

const NotificationItem = ({ notification, onMarkAsRead }: NotificationItemProps) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'interest':
        return <Heart className="text-red-500" size={18} />;
      case 'adoption':
        return <Check className="text-green-500" size={18} />;
      default:
        return <Bell className="text-blue-500" size={18} />;
    }
  };

  return (
    <div 
      className={cn(
        "p-4 border-b border-gray-100 hover:bg-gray-50 flex items-start space-x-3 transition-colors",
        !notification.isRead && "bg-yellow-50"
      )}
    >
      <div className="bg-white p-2 rounded-full border border-gray-100 shadow-sm">
        {getIcon()}
      </div>
      
      <div className="flex-1">
        <p className="text-sm text-gray-900">{notification.message}</p>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
        </p>
      </div>
      
      {!notification.isRead && onMarkAsRead && (
        <button 
          onClick={() => onMarkAsRead(notification.id)}
          className="text-xs font-medium text-primary hover:underline"
        >
          Mark as read
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
