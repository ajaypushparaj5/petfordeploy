
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Pet } from '@/types';
import { cn } from '@/lib/utils';

interface PetCardProps {
  pet: Pet;
  isFavorite?: boolean;
  onToggleFavorite?: (petId: string) => void;
  isOwner?: boolean;
  className?: string;
}

const PetCard = ({ 
  pet, 
  isFavorite = false, 
  onToggleFavorite,
  isOwner = false,
  className 
}: PetCardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 transition-all hover:shadow-md card-hover",
      className
    )}>
      <div className="p-4">
        <div className="relative mb-4">
          <img 
            src={pet.image} 
            alt={pet.name} 
            className="w-full h-48 pet-image" 
          />
          {onToggleFavorite && !isOwner && (
            <button
              onClick={() => onToggleFavorite(pet.id)}
              className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
              aria-label={isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart 
                size={20} 
                className={cn(
                  "transition-colors",
                  isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                )} 
              />
            </button>
          )}
        </div>
        
        <h3 className="text-lg font-bold mb-1">{pet.name}</h3>
        
        <div className="text-sm text-gray-600 mb-2">
          <p className="flex justify-between">
            <span>{pet.breed}</span>
            <span>{pet.age} {pet.age === 1 ? 'year' : 'years'} old</span>
          </p>
          <p className="mt-1">{pet.location}</p>
        </div>
        
        <div className="mt-4">
          <Link to={`/pet/${pet.id}`}>
            <Button className="w-full bg-yellow-900 hover:bg-yellow-800 text-black">
              {isOwner ? 'Manage' : 'View Details'}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PetCard;
