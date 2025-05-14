import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface Studio {
  id: number;
  studioId: string;
  studioName: string;
  ownerName: string;
  contact: string;
  services: number;
  rating: number;
  status: boolean;
}

export const useStudios = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [ratingFilter, setRatingFilter] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [studiosData, setStudiosData] = useState<Studio[]>([]);

  const defaultStudios: Studio[] = [
    {
      id: 1,
      studioId: 'STU10001',
      studioName: 'Saiteja Laundry',
      ownerName: 'Saiteja',
      contact: '8099830308',
      services: 56,
      rating: 4.5,
      status: true
    },
    {
      id: 2,
      studioId: 'STU10002',
      studioName: 'Sparkle Clean Laundry',
      ownerName: 'Ravi Kumar',
      contact: '9876543210',
      services: 48,
      rating: 4.7,
      status: true
    },
    {
      id: 3,
      studioId: 'STU10003',
      studioName: 'Fresh & Clean',
      ownerName: 'Priya Sharma',
      contact: '7654321098',
      services: 42,
      rating: 4.3,
      status: true
    },
    {
      id: 4,
      studioId: 'STU10004',
      studioName: 'Express Wash',
      ownerName: 'Ajay Patel',
      contact: '9988776655',
      services: 38,
      rating: 4.1,
      status: true
    },
    {
      id: 5,
      studioId: 'STU10005',
      studioName: 'Royal Laundry',
      ownerName: 'Sneha Reddy',
      contact: '8765432109',
      services: 52,
      rating: 4.6,
      status: true
    },
    {
      id: 6,
      studioId: 'STU10006',
      studioName: 'Quick Clean',
      ownerName: 'Vikram Singh',
      contact: '9876123450',
      services: 35,
      rating: 3.9,
      status: false
    },
    {
      id: 7,
      studioId: 'STU10007',
      studioName: 'Urban Laundry',
      ownerName: 'Meera Desai',
      contact: '8123456789',
      services: 44,
      rating: 4.2,
      status: false
    },
    {
      id: 8,
      studioId: 'STU10008',
      studioName: 'Elite Washing',
      ownerName: 'Rahul Gupta',
      contact: '7890123456',
      services: 39,
      rating: 3.8,
      status: false
    }
  ];

  useEffect(() => {
    const savedStudios = localStorage.getItem('laundryStudios');
    
    if (savedStudios) {
      setStudiosData(JSON.parse(savedStudios));
    } else {
      setStudiosData(defaultStudios);
      localStorage.setItem('laundryStudios', JSON.stringify(defaultStudios));
    }
  }, []);

  const filteredStudios = studiosData.filter((studio) => {
    const matchesSearch = searchTerm === '' || 
      studio.studioName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.studioId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studio.contact.includes(searchTerm);
    
    const matchesStatus = statusFilter === null || 
      (statusFilter === 'active' && studio.status) ||
      (statusFilter === 'inactive' && !studio.status);
    
    const matchesRating = ratingFilter === null ||
      (ratingFilter === 'above4.5' && studio.rating >= 4.5) ||
      (ratingFilter === '4to4.5' && studio.rating >= 4 && studio.rating < 4.5) ||
      (ratingFilter === 'below4' && studio.rating < 4);
    
    return matchesSearch && matchesStatus && matchesRating;
  }).sort((a, b) => {
    return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter(null);
    setRatingFilter(null);
    setSortDirection('asc');
  };

  const toggleSort = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleStatusToggle = (studioId: number, newStatus: boolean) => {
    const updatedStudios = studiosData.map(studio => 
      studio.id === studioId ? { ...studio, status: newStatus } : studio
    );
    
    setStudiosData(updatedStudios);
    localStorage.setItem('laundryStudios', JSON.stringify(updatedStudios));
  };

  const handleDeleteStudio = (studio: Studio) => {
    const updatedStudios = studiosData.filter(s => s.id !== studio.id);
    setStudiosData(updatedStudios);
    localStorage.setItem('laundryStudios', JSON.stringify(updatedStudios));
  };

  const totalStudios = studiosData.length;
  const activeStudios = studiosData.filter(s => s.status).length;
  const inactiveStudios = studiosData.filter(s => !s.status).length;

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    ratingFilter,
    setRatingFilter,
    sortDirection,
    filteredStudios,
    resetFilters,
    toggleSort,
    handleStatusToggle,
    handleDeleteStudio,
    totalStudios,
    activeStudios,
    inactiveStudios
  };
};
