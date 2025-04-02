
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Pet, Notification } from '@/types';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';

interface PetContextType {
  pets: Pet[];
  userPets: Pet[];
  wishlist: string[];
  notifications: Notification[];
  unreadNotificationsCount: number;
  addPet: (petData: Partial<Pet>) => void;
  updatePet: (id: string, petData: Partial<Pet>) => void;
  deletePet: (id: string) => void;
  getPetById: (id: string) => Pet | undefined;
  toggleWishlist: (petId: string) => void;
  isInWishlist: (petId: string) => boolean;
  expressInterest: (petId: string) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const usePets = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error('usePets must be used within a PetProvider');
  }
  return context;
};

// Mock data for demo purposes
const MOCK_PETS: Pet[] = [
  {
    id: '1',
    name: 'Buddy',
    age: 3,
    breed: 'Golden Retriever',
    type: 'dog',
    description: 'Buddy is a friendly and energetic dog who loves to play and go for walks. He is great with children and other pets, making him a perfect addition to any family.',
    location: 'New York, NY',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500&ixlib=rb-4.0.3',
    ownerId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(), // 7 days ago
  },
  {
    id: '2',
    name: 'Whiskers',
    age: 2,
    breed: 'Siamese',
    type: 'cat',
    description: 'Whiskers is a curious and affectionate cat. She enjoys lounging in sunny spots and playing with string toys. She is fully litter trained and has all her vaccinations.',
    location: 'Boston, MA',
    image: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?auto=format&fit=crop&q=80&w=500&ixlib=rb-4.0.3',
    ownerId: '2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days ago
  },
  {
    id: '3',
    name: 'Max',
    age: 1,
    breed: 'Beagle',
    type: 'dog',
    description: 'Max is a playful puppy with lots of energy. He loves going for runs and playing fetch. He is still in training but has mastered basic commands.',
    location: 'San Francisco, CA',
    image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=500&ixlib=rb-4.0.3',
    ownerId: '2',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days ago
  },
  {
    id: '4',
    name: 'Daisy',
    age: 4,
    breed: 'Persian',
    type: 'cat',
    description: 'Daisy is a gentle and calm cat who enjoys peaceful environments. She likes to be petted and is very clean. She would be perfect for someone looking for a low-maintenance pet.',
    location: 'Chicago, IL',
    image: 'https://images.unsplash.com/photo-1596854372407-baba7fef6e51?auto=format&fit=crop&q=80&w=500&ixlib=rb-4.0.3',
    ownerId: '1',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
];

// Mock notifications for demo purposes
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    type: 'interest',
    message: 'Jane Smith is interested in adopting Buddy.',
    petId: '1',
    fromUserId: '2',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
  },
  {
    id: '2',
    type: 'system',
    message: 'Welcome to PetMagic! Start by adding a pet or browsing available pets.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(), // 2 days ago
  },
];

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [pets, setPets] = useState<Pet[]>([...MOCK_PETS]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([...MOCK_NOTIFICATIONS]);

  // Load saved data from localStorage on initialization
  useEffect(() => {
    if (currentUser) {
      try {
        const savedWishlist = localStorage.getItem(`wishlist_${currentUser.id}`);
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      }
    } else {
      // Reset state when user logs out
      setWishlist([]);
    }
  }, [currentUser]);

  // Filter pets owned by current user
  const userPets = currentUser 
    ? pets.filter(pet => pet.ownerId === currentUser.id)
    : [];

  // Count unread notifications
  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  // Add a new pet
  const addPet = (petData: Partial<Pet>) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to add a pet.",
        variant: "destructive",
      });
      return;
    }

    const newPet: Pet = {
      id: uuidv4(),
      name: petData.name || 'Unnamed Pet',
      age: petData.age || 0,
      breed: petData.breed || 'Unknown',
      type: petData.type || 'other',
      description: petData.description || '',
      location: petData.location || 'Unknown',
      image: petData.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500&ixlib=rb-4.0.3',
      ownerId: currentUser.id,
      createdAt: new Date().toISOString(),
    };

    setPets(prevPets => [...prevPets, newPet]);
    
    toast({
      title: "Pet added successfully",
      description: `${newPet.name} is now listed for adoption.`,
    });
  };

  // Update an existing pet
  const updatePet = (id: string, petData: Partial<Pet>) => {
    if (!currentUser) return;

    setPets(prevPets => 
      prevPets.map(pet => 
        pet.id === id && pet.ownerId === currentUser.id
          ? { ...pet, ...petData }
          : pet
      )
    );
    
    toast({
      title: "Pet updated",
      description: `The pet information has been updated.`,
    });
  };

  // Delete a pet
  const deletePet = (id: string) => {
    if (!currentUser) return;

    const petToDelete = pets.find(p => p.id === id);
    if (!petToDelete || petToDelete.ownerId !== currentUser.id) return;

    setPets(prevPets => prevPets.filter(pet => pet.id !== id));
    
    toast({
      title: "Pet removed",
      description: `${petToDelete.name} has been removed from the listings.`,
    });
  };

  // Get a pet by ID
  const getPetById = (id: string) => {
    return pets.find(pet => pet.id === id);
  };

  // Toggle wishlist status
  const toggleWishlist = (petId: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to add pets to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    const isInList = wishlist.includes(petId);
    const newWishlist = isInList
      ? wishlist.filter(id => id !== petId)
      : [...wishlist, petId];
    
    setWishlist(newWishlist);
    localStorage.setItem(`wishlist_${currentUser.id}`, JSON.stringify(newWishlist));
    
    toast({
      title: isInList ? "Removed from wishlist" : "Added to wishlist",
      description: isInList 
        ? "The pet has been removed from your wishlist." 
        : "The pet has been added to your wishlist.",
    });
  };

  // Check if a pet is in the wishlist
  const isInWishlist = (petId: string) => {
    return wishlist.includes(petId);
  };

  // Express interest in adopting a pet
  const expressInterest = (petId: string) => {
    if (!currentUser) {
      toast({
        title: "Authentication required",
        description: "Please log in to express interest in a pet.",
        variant: "destructive",
      });
      return;
    }

    const pet = pets.find(p => p.id === petId);
    if (!pet) return;
    
    if (pet.ownerId === currentUser.id) {
      toast({
        title: "Cannot express interest",
        description: "You cannot express interest in your own pet.",
        variant: "destructive",
      });
      return;
    }

    // Check if already expressed interest (in a real app, this would check the database)
    const alreadyInterested = notifications.some(
      n => n.type === 'interest' && n.petId === petId && n.fromUserId === currentUser.id
    );

    if (alreadyInterested) {
      toast({
        title: "Already expressed interest",
        description: "You have already expressed interest in this pet.",
        variant: "destructive",
      });
      return;
    }

    // Create notification for pet owner
    const newNotification: Notification = {
      id: uuidv4(),
      type: 'interest',
      message: `${currentUser.name} is interested in adopting ${pet.name}.`,
      petId,
      fromUserId: currentUser.id,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    toast({
      title: "Interest expressed",
      description: `The owner of ${pet.name} has been notified of your interest.`,
    });
  };

  // Mark notification as read
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        userPets,
        wishlist,
        notifications,
        unreadNotificationsCount,
        addPet,
        updatePet,
        deletePet,
        getPetById,
        toggleWishlist,
        isInWishlist,
        expressInterest,
        markNotificationAsRead,
        markAllNotificationsAsRead,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};
