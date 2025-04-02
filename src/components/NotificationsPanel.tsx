
import React from 'react';
import { Notification } from '@/types';
import NotificationItem from './NotificationItem';
import { Button } from '@/components/ui/button';

interface NotificationsPanelProps {
  notifications: Notification[];
  onMarkAllAsRead: () => void;
  onMarkAsRead: (id: string) => void;
}

const NotificationsPanel = ({ 
  notifications, 
  onMarkAllAsRead, 
  onMarkAsRead 
}: NotificationsPanelProps) => {
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-500">{unreadCount} unread</p>
          )}
        </div>
        
        {unreadCount > 0 && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onMarkAllAsRead}
            className="text-xs hover:bg-gray-100"
          >
            Mark all as read
          </Button>
        )}
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <NotificationItem 
              key={notification.id} 
              notification={notification} 
              onMarkAsRead={onMarkAsRead}
            />
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            <p>No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPanel;
