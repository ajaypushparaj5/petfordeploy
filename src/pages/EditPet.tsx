import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import PetForm from '@/components/PetForm';
import { useAuth } from '@/context/AuthContext';
import { Pet } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import api from '@/api';

const EditPet = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, currentUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [pet, setPet] = useState<Pet | null>(null);

  // 🔄 Load pet data from backend
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }

    if (id) {
      api.get(`/pets/${id}`)
        .then(res => {
          const petData = res.data;

          if (petData.ownerId && petData.ownerId !== currentUser?.id) {
            toast({
              title: "Unauthorized",
              description: "You can only edit your own pets.",
              variant: "destructive",
            });
            navigate('/my-pets');
            return;
          }

          setPet(petData);
        })
        .catch(() => {
          toast({
            title: "Pet not found",
            description: "The pet you're trying to edit doesn't exist.",
            variant: "destructive",
          });
          navigate('/my-pets');
        });
    }
  }, [id, isAuthenticated, currentUser, navigate, toast]);

  // ✅ Handle form submission
  const handleSubmit = async (petData: Partial<Pet>) => {
    try {
      await api.put(`/pets/${id}`, petData);
      toast({ title: "Pet updated successfully!" });
      navigate(`/pet/${id}`);
    } catch (err) {
      toast({
        title: "Update failed",
        description: "Something went wrong while updating the pet.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated || !pet) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit {pet.name}</h1>

        <Card className="p-6">
          <PetForm
            onSubmit={handleSubmit}
            initialData={pet}
            isEditing={true}
          />
        </Card>
      </div>
    </div>
  );
};

export default EditPet;
