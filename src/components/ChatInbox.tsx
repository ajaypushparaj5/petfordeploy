// 📁 File: components/ChatInbox.tsx

import React, { useEffect, useState } from 'react';
import api from '@/api';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import ChatWindow from './ChatWindow';
import { Button } from './ui/button';

interface Conversation {
  userId: number;
  name: string;
  profileImage: string;
}

const ChatInbox = () => {
  const { currentUser } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChatUserId, setActiveChatUserId] = useState<number | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    api.get(`/messages/threads/${currentUser.id}`)
      .then(res => setConversations(res.data))
      .catch(err => console.error('❌ Failed to load conversations:', err));
  }, [currentUser]);

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-4">Your Conversations</h3>
      {conversations.length === 0 ? (
        <p className="text-gray-500">No conversations yet.</p>
      ) : (
        <div className="space-y-3">
          {conversations.map((user) => (
            <div key={user.userId} className="flex items-center justify-between border rounded p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <img
                  src={user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              <Button size="sm" onClick={() => setActiveChatUserId(user.userId)}>
                Chat
              </Button>
            </div>
          ))}
        </div>
      )}

      {activeChatUserId && (
        <ChatWindow
          receiverId={activeChatUserId}
          onClose={() => setActiveChatUserId(null)}
        />
      )}
    </div>
  );
};

export default ChatInbox;
