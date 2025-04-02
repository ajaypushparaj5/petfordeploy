import React, { useEffect, useState } from 'react';
import { usePets } from '@/context/PetContext';
import { useAuth } from '@/context/AuthContext';
import PetCard from '@/components/PetCard';
import EmptyState from '@/components/EmptyState';
import AuthModal from '@/components/AuthModal';
import { Heart } from 'lucide-react';
import api from '@/api';
import { Pet } from '@/types';

const Wishlist = () => {
  const { wishlist, toggleWishlist } = usePets();
  const { isAuthenticated } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/pets')
        .then(res => setPets(res.data))
        .catch(err => console.error('Failed to fetch pets:', err));
    }
  }, [isAuthenticated]);

  // 🎯 Pets that are in wishlist
  const wishlistPets = pets.filter(pet => wishlist.includes(pet.id));

  const renderContent = () => {
    if (!isAuthenticated) {
      return (
        <EmptyState
          title="Sign in to view your wishlist"
          description="Create an account or sign in to save your favorite pets."
          actionLabel="Sign In"
          onAction={() => setIsAuthModalOpen(true)}
          icon={<Heart size={48} className="text-red-400" />}
        />
      );
    }

    if (wishlistPets.length === 0) {
      return (
        <EmptyState
          title="Your wishlist is empty"
          description="When you find pets you love, add them to your wishlist to find them later."
          actionLabel="Find Pets"
          actionHref="/"
          icon={<Heart size={48} className="text-red-400" />}
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {wishlistPets.map(pet => (
          <PetCard
            key={pet.id}
            pet={pet}
            isFavorite={true}
            onToggleFavorite={toggleWishlist}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">My Wishlist</h1>
        <p className="text-gray-600">
          {isAuthenticated
            ? `You have ${wishlistPets.length} pet${wishlistPets.length !== 1 ? 's' : ''} in your wishlist`
            : 'Sign in to save your favorite pets'}
        </p>
      </div>

      {renderContent()}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={() => {}}
        onSignup={() => {}}
      />
    </div>
  );
};

export default Wishlist;
