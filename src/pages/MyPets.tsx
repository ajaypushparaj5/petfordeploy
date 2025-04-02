import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PetCard from '@/components/PetCard';
import EmptyState from '@/components/EmptyState';
import { useAuth } from '@/context/AuthContext';
import AuthModal from '@/components/AuthModal';
import api from '@/api';
import { Pet } from '@/types';

const MyPets = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [myPets, setMyPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated && currentUser) {
      api
        .get('/pets')
        .then((res) => {
          const ownedPets = res.data.filter(
            (pet: Pet) => Number(pet.ownerId) === Number(currentUser.id)
          );
          setMyPets(ownedPets);
        })
        .catch((err) => {
          console.error('❌ Error fetching pets:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, currentUser]);

  const handleAddPet = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    }
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-600">Loading your pets...</p>;
    }

    if (!isAuthenticated) {
      return (
        <EmptyState
          title="Sign in to manage your pets"
          description="You need to be logged in to view and manage your pets."
          actionLabel="Sign In"
          onAction={() => setIsAuthModalOpen(true)}
        />
      );
    }

    if (myPets.length === 0) {
      return (
        <EmptyState
          title="No pets added yet"
          description="You haven't added any pets for adoption. Start by adding your first pet."
          actionLabel="Add Your First Pet"
          actionHref="/add-pet"
        />
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myPets.map((pet) => (
          <PetCard key={pet.id} pet={pet} isOwner />
        ))}
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold mb-2">My Pets</h1>
          <p className="text-gray-600">Manage the pets you've put up for adoption</p>
        </div>

        <div className="mt-4 sm:mt-0">
          <Link to="/add-pet">
            <Button className="bg-yellow-900 hover:bg-yellow-800 text-black">
              <Plus size={18} className="mr-2" />
              Add New Pet
            </Button>
          </Link>
        </div>
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

export default MyPets;
