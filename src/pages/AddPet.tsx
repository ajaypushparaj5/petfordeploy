import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import PetForm from '@/components/PetForm';
import { useAuth } from '@/context/AuthContext';
import { Pet } from '@/types';
import api from '@/api';
import { useToast } from '@/components/ui/use-toast';

const AddPet = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (petData: Partial<Pet>) => {
    try {
      const dataToSend = {
        ...petData,
        ownerId: currentUser?.id || null,
      };

      await api.post('/pets', dataToSend);
      toast({ title: 'Pet added successfully!' });
      navigate('/my-pets');
    } catch (error) {
      toast({
        title: 'Failed to add pet',
        description: 'There was a problem adding your pet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Add a Pet for Adoption</h1>

        <Card className="p-6">
          <PetForm onSubmit={handleSubmit} />
        </Card>
      </div>
    </div>
  );
};

export default AddPet;
