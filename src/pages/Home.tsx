import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import PetCard from '@/components/PetCard';
import { usePets } from '@/context/PetContext';
import api from '@/api';
import { Pet } from '@/types';

const Home = () => {
  const { toggleWishlist, isInWishlist } = usePets();
  const [pets, setPets] = useState<Pet[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  // 🐾 Fetch pets from backend
  useEffect(() => {
    api.get('/pets')
      .then(res => setPets(res.data))
      .catch(err => console.error('Error fetching pets:', err));
  }, []);

  // 🔍 Filter logic
  const filteredPets = pets.filter(pet => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || pet.type === filterType;

    return matchesSearch && matchesType;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Perfect Pet Companion</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Browse our selection of lovable pets waiting for their forever homes. 
          Each one has a unique personality and is looking for the perfect match.
        </p>
      </div>

      {/* 🔍 Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Input
            placeholder="Search by name, breed, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        </div>

        <div className="w-full md:w-48">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Pets</SelectItem>
              <SelectItem value="dog">Dogs</SelectItem>
              <SelectItem value="cat">Cats</SelectItem>
              <SelectItem value="bird">Birds</SelectItem>
              <SelectItem value="rabbit">Rabbits</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 🐾 Pet Grid */}
      {filteredPets.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
            <PetCard
              key={pet.id}
              pet={pet}
              isFavorite={isInWishlist(pet.id)}
              onToggleFavorite={toggleWishlist}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No pets found</h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria to find more pets.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;
