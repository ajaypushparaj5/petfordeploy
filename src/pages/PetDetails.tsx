import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Pet } from '@/types';
import { Heart, Edit, Trash, ArrowLeft, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { cn } from '@/lib/utils';
import api from '@/api';

const PetDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    if (id) {
      api
        .get(`/pets/${id}`)
        .then((res) => setPet(res.data))
        .catch(() => {
          toast({
            title: 'Pet not found',
            description: 'The pet you are looking for does not exist.',
            variant: 'destructive',
          });
          navigate('/');
        })
        .finally(() => setLoading(false));
    }
  }, [id, navigate, toast]);

  const handleDelete = async () => {
    try {
      await api.delete(`/pets/${id}`);
      toast({ title: 'Pet deleted successfully.' });
      navigate('/my-pets');
    } catch (err) {
      toast({
        title: 'Delete failed',
        description: 'Could not delete pet. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? 'Removed from wishlist' : 'Added to wishlist',
    });
  };

  const handleExpressInterest = async () => {
    if (!isAuthenticated || !currentUser) {
      toast({
        title: 'Login required',
        description: 'Please log in to express interest in adopting.',
        variant: 'destructive',
      });
      return;
    }

    if (pet?.ownerId === currentUser.id) {
      toast({
        title: 'This is your own pet!',
        description: 'You cannot express interest in your own listing.',
        variant: 'destructive',
      });
      return;
    }

    try {
      await api.post('/notifications', {
        type: 'interest',
        message: `${currentUser.name} expressed interest in adopting ${pet.name}.`,
        petId: pet.id,
        fromUserId: currentUser.id,
        toUserId: pet.ownerId,
      });

      toast({
        title: 'Interest recorded!',
        description: `You expressed interest in adopting ${pet.name}.`,
      });
    } catch (err) {
      toast({
        title: 'Notification failed',
        description: 'Could not send interest notification.',
        variant: 'destructive',
      });
    }
  };

  const isOwner = currentUser && pet?.ownerId === currentUser.id;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Loading pet details...</h2>
      </div>
    );
  }

  if (!pet) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
        <ArrowLeft size={18} className="mr-2" />
        Back to all pets
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Image & Favorite */}
        <div className="relative">
          <div className="w-full h-96 rounded-2xl overflow-hidden">
            <img
              src={pet.image}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          </div>

          {isAuthenticated && !isOwner && (
            <Button
              onClick={handleToggleFavorite}
              variant="outline"
              className={cn(
                'absolute top-4 right-4 rounded-full w-12 h-12 flex items-center justify-center',
                isFavorite ? 'text-red-500' : 'text-gray-400'
              )}
              aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={isFavorite ? 'fill-red-500' : ''} size={20} />
            </Button>
          )}
        </div>

        {/* Right Column - Details */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{pet.name}</h1>

          <div className="flex flex-wrap gap-3 mb-4">
            <span className="bg-yellow-100 text-black px-3 py-1 rounded-full text-sm">
              {pet.type.charAt(0).toUpperCase() + pet.type.slice(1)}
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              {pet.breed}
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
              {pet.age} {pet.age === 1 ? 'year' : 'years'} old
            </span>
          </div>

          <div className="flex items-center text-gray-600 mb-2">
            <MapPin size={18} className="mr-2" />
            {pet.location}
          </div>

          <div className="flex items-center text-gray-600 mb-6">
            <Calendar size={18} className="mr-2" />
            Listed on {format(new Date(pet.createdAt), 'MMMM d, yyyy')}
          </div>

          <Card className="p-4 mb-6 bg-gray-50 border-gray-100">
            <h2 className="font-semibold mb-2">About {pet.name}</h2>
            <p className="text-gray-700 whitespace-pre-line">{pet.description}</p>
          </Card>

          {/* Owner or Viewer Action */}
          {isOwner ? (
            <div className="space-y-3">
              <Link to={`/edit-pet/${pet.id}`}>
                <Button variant="outline" className="w-full flex items-center justify-center">
                  <Edit size={18} className="mr-2" />
                  Edit Pet
                </Button>
              </Link>
              <Button
                variant="destructive"
                className="w-full flex items-center justify-center"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                <Trash size={18} className="mr-2" />
                Delete Listing
              </Button>
            </div>
          ) : (
            <Button
              onClick={handleExpressInterest}
              className="w-full bg-yellow-900 hover:bg-yellow-800 text-black font-semibold py-3"
            >
              Express Interest in Adopting
            </Button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{pet.name}</strong>'s listing.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PetDetails;
