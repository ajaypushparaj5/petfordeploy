
export interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

export interface Pet {
  id: string;
  name: string;
  age: number;
  breed: string;
  type: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  description: string;
  location: string;
  image: string;
  ownerId: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'interest' | 'adoption' | 'system';
  message: string;
  petId?: string;
  fromUserId?: string;
  isRead: boolean;
  createdAt: string;
}
