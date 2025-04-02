
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Pet } from '@/types';

interface PetFormProps {
  onSubmit: (petData: Partial<Pet>) => void;
  initialData?: Partial<Pet>;
  isEditing?: boolean;
}

const PetForm = ({ onSubmit, initialData, isEditing = false }: PetFormProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [age, setAge] = useState(initialData?.age?.toString() || '');
  const [breed, setBreed] = useState(initialData?.breed || '');
  const [type, setType] = useState<string>(initialData?.type || 'dog');
  const [description, setDescription] = useState(initialData?.description || '');
  const [location, setLocation] = useState(initialData?.location || '');
  const [image, setImage] = useState(initialData?.image || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500&ixlib=rb-4.0.3');
  
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !age || !breed || !type || !description || !location) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid age",
        variant: "destructive",
      });
      return;
    }
    
    onSubmit({
      name,
      age: ageNum,
      breed,
      type: type as Pet['type'],
      description,
      location,
      image,
    });
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="pet-name">Pet Name*</Label>
          <Input 
            id="pet-name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="E.g., Max, Bella"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pet-age">Age (years)*</Label>
          <Input 
            id="pet-age" 
            type="number" 
            min="0" 
            value={age} 
            onChange={(e) => setAge(e.target.value)} 
            placeholder="E.g., 2"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pet-breed">Breed*</Label>
          <Input 
            id="pet-breed" 
            value={breed} 
            onChange={(e) => setBreed(e.target.value)} 
            placeholder="E.g., Golden Retriever, Siamese"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="pet-type">Pet Type*</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger id="pet-type">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="dog">Dog</SelectItem>
              <SelectItem value="cat">Cat</SelectItem>
              <SelectItem value="bird">Bird</SelectItem>
              <SelectItem value="rabbit">Rabbit</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="pet-location">Location*</Label>
          <Input 
            id="pet-location" 
            value={location} 
            onChange={(e) => setLocation(e.target.value)} 
            placeholder="E.g., New York, NY"
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="pet-description">Description*</Label>
          <Textarea 
            id="pet-description" 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            placeholder="Tell us about your pet's personality, habits, needs, etc."
            rows={5}
          />
        </div>
        
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="pet-image">Image URL</Label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <Input 
                id="pet-image" 
                value={image} 
                onChange={(e) => setImage(e.target.value)} 
                placeholder="URL of pet's image"
              />
              <p className="text-xs text-gray-500 mt-1">
                For this demo, please use a direct image URL. In a full app, this would be a file upload.
              </p>
            </div>
            {image && (
              <div className="w-16 h-16 overflow-hidden rounded-full flex-shrink-0">
                <img 
                  src={image} 
                  alt="Preview" 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=500&ixlib=rb-4.0.3';
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-yellow-900 hover:bg-yellow-800 text-black"
      >
        {isEditing ? 'Update Pet' : 'Add Pet for Adoption'}
      </Button>
    </form>
  );
};

export default PetForm;
