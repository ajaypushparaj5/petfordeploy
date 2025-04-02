import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import api from '@/api';
import { useAuth } from '@/context/AuthContext';

interface ChatWindowProps {
  receiverId: number;
  onClose: () => void;
}

interface Message {
  id: string;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ receiverId, onClose }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${currentUser?.id}/${receiverId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('❌ Failed to fetch messages', err);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;
    try {
      await api.post('/messages', {
        senderId: currentUser?.id,
        receiverId,
        content: newMessage,
      });
      setNewMessage('');
      fetchMessages();
    } catch (err) {
      console.error('❌ Failed to send message', err);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border border-gray-300 rounded-xl shadow-lg flex flex-col z-50">
      <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center bg-yellow-50 rounded-t-xl">
        <h3 className="font-semibold">Chat</h3>
        <button onClick={onClose} className="text-sm text-gray-500 hover:text-black">✕</button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg max-w-[75%] text-sm ${
              msg.senderId === currentUser?.id
                ? 'bg-yellow-100 ml-auto text-right'
                : 'bg-gray-100'
            }`}
          >
            {msg.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-2 border-t border-gray-200 flex items-center gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="text-sm"
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <Button onClick={sendMessage} size="sm" className="bg-yellow-900 text-white">
          Send
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;