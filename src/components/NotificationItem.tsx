import React, { useState } from 'react';
import { Notification } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { Bell, Heart, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead?: (id: string) => void;
  onAccept?: (notification: Notification) => void;
  onReject?: (notification: Notification) => void;
}

const NotificationItem = ({ notification, onMarkAsRead, onAccept, onReject }: NotificationItemProps) => {
  const [processing, setProcessing] = useState(false);

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
        "p-4 border-b border-gray-100 hover:bg-gray-50 flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-3 transition-colors",
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

        {notification.type === 'adoption' && onAccept && onReject && (
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              disabled={processing}
              onClick={async () => {
                console.log('✅ Accept clicked:', notification);
                setProcessing(true);
                await onAccept(notification);
                setProcessing(false);
              }}
            >
              Accept
            </Button>
            <Button
              size="sm"
              variant="destructive"
              disabled={processing}
              onClick={async () => {
                console.log('❌ Reject clicked:', notification);
                setProcessing(true);
                await onReject(notification);
                setProcessing(false);
              }}
            >
              Reject
            </Button>
          </div>
        )}
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