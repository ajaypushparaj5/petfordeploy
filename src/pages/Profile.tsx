import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import PetCard from '@/components/PetCard';
import NotificationsPanel from '@/components/NotificationsPanel';
import EmptyState from '@/components/EmptyState';
import { User } from 'lucide-react';
import api from '@/api';
import { Pet, Notification } from '@/types';
import ChatWindow from '@/components/ChatWindow';

interface MessageThread {
  userId: number;
  name: string;
  profileImage: string;
}

const Profile = () => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [chatUserId, setChatUserId] = useState<number | null>(null);
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !currentUser) {
      navigate('/');
      return;
    }

    api.get('/pets')
      .then(res => {
        const owned = res.data.filter((pet: Pet) => pet.ownerId === currentUser.id);
        setUserPets(owned);
      })
      .catch(err => console.error('❌ Failed to fetch pets:', err));

    api.get(`/notifications/${currentUser.id}`)
      .then(res => {
        console.log('🔔 Notifications fetched:', res.data);
        setNotifications(res.data);
      })
      .catch(err => console.error('❌ Failed to fetch notifications:', err));

    api.get(`/messages/threads/${currentUser.id}`)
      .then(res => setThreads(res.data))
      .catch(err => console.error('❌ Failed to fetch chat threads:', err));
  }, [isAuthenticated, currentUser, navigate]);

  const markAsRead = (id: string) => {
    api.put(`/notifications/${id}`)
      .then(() => {
        setNotifications(prev => prev.map(n =>
          n.id === id ? { ...n, isRead: true } : n
        ));
      })
      .catch(err => console.error('❌ Error marking notification as read:', err));
  };

  const markAllAsRead = () => {
    api.put(`/notifications/mark-all/${currentUser?.id}`)
      .then(() => {
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      })
      .catch(err => console.error('❌ Error marking all notifications as read:', err));
  };

  const handleAccept = async (notification: Notification) => {
    try {
      await api.post('/notifications', {
        type: 'confirmation',
        message: `Your adoption request for pet ID ${notification.petId} was accepted!`,
        fromUserId: currentUser?.id,
        toUserId: notification.fromUserId,
        petId: notification.petId,
      });
      markAsRead(notification.id);
    } catch (err) {
      console.error('❌ Failed to send confirmation:', err);
    }
  };

  const handleReject = async (notification: Notification) => {
    try {
      await api.post('/notifications', {
        type: 'rejection',
        message: `Your adoption request for pet ID ${notification.petId} was declined.`,
        fromUserId: currentUser?.id,
        toUserId: notification.fromUserId,
        petId: notification.petId,
      });
      markAsRead(notification.id);
    } catch (err) {
      console.error('❌ Failed to send rejection:', err);
    }
  };

  const handleOpenChat = (userId: number) => {
    setChatUserId(userId);
  };

  const handleCloseChat = () => {
    setChatUserId(null);
  };

  if (!isAuthenticated || !currentUser) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">My Profile</h1>
        <p className="text-gray-600">Manage your profile and see your activities</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="chat">Messages</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
            <div className="p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={
                      currentUser.profileImage ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=FFD700&color=000`
                    }
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl font-bold">{currentUser.name}</h2>
                  <p className="text-gray-600 mt-1">{currentUser.email}</p>

                  <div className="flex flex-wrap gap-4 mt-4 justify-center sm:justify-start">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <p className="text-xs text-gray-500">My Pets</p>
                      <p className="text-xl font-semibold">{userPets.length}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="font-semibold mb-4">Account Settings</h3>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-left">
                    <User size={18} className="mr-2" />
                    Edit Profile
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start text-left text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={logout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold mb-4">My Pets for Adoption</h3>

            {userPets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} isOwner={true} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No pets listed"
                description="You haven't added any pets for adoption yet."
                actionLabel="Add a Pet"
                actionHref="/add-pet"
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationsPanel
            notifications={notifications}
            onMarkAllAsRead={markAllAsRead}
            onMarkAsRead={markAsRead}
            onAccept={handleAccept}
            onReject={handleReject}
          />
        </TabsContent>

        <TabsContent value="chat">
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4">
            <h3 className="text-lg font-semibold mb-4">Your Conversations</h3>
            {threads.length > 0 ? (
              <ul className="space-y-3">
                {threads.map((thread) => (
                  <li
                    key={thread.userId}
                    className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={thread.profileImage || `https://ui-avatars.com/api/?name=${thread.name}`}
                        alt={thread.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="font-medium">{thread.name}</span>
                    </div>
                    <Button size="sm" onClick={() => handleOpenChat(thread.userId)}>
                      Chat
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No conversations yet.</p>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {chatUserId && <ChatWindow receiverId={chatUserId} onClose={handleCloseChat} />}
    </div>
  );
};

export default Profile;
