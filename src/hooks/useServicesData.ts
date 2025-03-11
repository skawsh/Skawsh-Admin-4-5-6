import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Service, SubService, ClothingItem, SharedServiceData } from '../types/services';
import { useToast } from "@/hooks/use-toast";

// Improved URL encoding with compression for larger datasets
const encodeDataForUrl = (data: SharedServiceData): string => {
  try {
    // Add a version marker for future compatibility
    const dataWithVersion = { ...data, version: "1.0" };
    const jsonString = JSON.stringify(dataWithVersion);
    return btoa(encodeURIComponent(jsonString));
  } catch (error) {
    console.error('Error encoding data:', error);
    return '';
  }
};

const decodeDataFromUrl = (encodedData: string): SharedServiceData | null => {
  if (!encodedData) return null;
  
  try {
    const jsonString = decodeURIComponent(atob(encodedData));
    const parsed = JSON.parse(jsonString);
    
    // Ensure we have all required fields with proper defaults
    return {
      services: Array.isArray(parsed.services) ? parsed.services : [],
      subServices: Array.isArray(parsed.subServices) ? parsed.subServices : [],
      clothingItems: Array.isArray(parsed.clothingItems) ? parsed.clothingItems : []
    };
  } catch (error) {
    console.error('Error decoding data:', error);
    return null;
  }
};

// Updated default services data
const DEFAULT_SERVICES: Service[] = [
  { id: "service-1", name: "Core Laundry Services", active: true },
  { id: "service-2", name: "Dry Cleaning", active: true },
  { id: "service-3", name: "Specialized Laundry Services", active: true },
  { id: "service-4", name: "Shoe and Sneaker Services", active: true },
];

// Updated default sub-services data
const DEFAULT_SUB_SERVICES: SubService[] = [
  { id: "subservice-1", name: "Wash&Fold", active: true },
  { id: "subservice-2", name: "Wash&Iron", active: true },
  { id: "subservice-3", name: "Steam Ironing", active: true },
];

// Updated default clothing items data
const DEFAULT_CLOTHING_ITEMS: ClothingItem[] = [
  { id: "clothing-1", name: "Shirt", active: true },
  { id: "clothing-2", name: "Pant", active: true },
  { id: "clothing-3", name: "T-shirt", active: true },
  { id: "clothing-4", name: "Short", active: true },
];

export const useServicesData = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  // Update both URL and localStorage when data changes
  const syncStateWithUrl = (data: SharedServiceData) => {
    try {
      const encodedData = encodeDataForUrl(data);
      if (encodedData) {
        // Update URL without triggering navigation
        const newUrl = `${window.location.pathname}?data=${encodedData}`;
        window.history.replaceState({ path: newUrl }, '', newUrl);
        console.log('URL updated with new data hash:', encodedData.substring(0, 20) + '...');
      }
    } catch (error) {
      console.error('Error updating URL:', error);
    }
  };

  // Save data to both localStorage and URL
  const saveAllData = (
    updatedServices: Service[], 
    updatedSubServices: SubService[], 
    updatedClothingItems: ClothingItem[]
  ) => {
    try {
      // Save to localStorage as backup
      localStorage.setItem('services', JSON.stringify(updatedServices));
      localStorage.setItem('subServices', JSON.stringify(updatedSubServices));
      localStorage.setItem('clothingItems', JSON.stringify(updatedClothingItems));
      
      // Create shared data structure
      const sharedData: SharedServiceData = {
        services: updatedServices,
        subServices: updatedSubServices,
        clothingItems: updatedClothingItems
      };
      
      // Update URL with encoded data
      syncStateWithUrl(sharedData);
      
      console.log('Data saved successfully:', {
        services: updatedServices.length,
        subServices: updatedSubServices.length,
        clothingItems: updatedClothingItems.length
      });
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save data"
      });
    }
  };

  // Load data from localStorage or use defaults
  const loadFromLocalStorage = () => {
    try {
      const storedServices = localStorage.getItem('services');
      const storedSubServices = localStorage.getItem('subServices');
      const storedClothingItems = localStorage.getItem('clothingItems');
      
      const servicesData = storedServices ? JSON.parse(storedServices) : DEFAULT_SERVICES;
      const subServicesData = storedSubServices ? JSON.parse(storedSubServices) : DEFAULT_SUB_SERVICES;
      const clothingItemsData = storedClothingItems ? JSON.parse(storedClothingItems) : DEFAULT_CLOTHING_ITEMS;
      
      console.log('Loaded data from localStorage or using defaults:', { 
        services: servicesData.length, 
        subServices: subServicesData.length, 
        clothingItems: clothingItemsData.length 
      });
      
      setServices(servicesData);
      setSubServices(subServicesData);
      setClothingItems(clothingItemsData);
      
      // Create shared data object
      const sharedData: SharedServiceData = {
        services: servicesData,
        subServices: subServicesData,
        clothingItems: clothingItemsData
      };
      
      // Also update the URL to match localStorage data
      syncStateWithUrl(sharedData);
    } catch (error) {
      console.error('Error loading from localStorage, using defaults:', error);
      
      // Use default values if localStorage fails
      setServices(DEFAULT_SERVICES);
      setSubServices(DEFAULT_SUB_SERVICES);
      setClothingItems(DEFAULT_CLOTHING_ITEMS);
      
      // Create shared data object with defaults
      const sharedData: SharedServiceData = {
        services: DEFAULT_SERVICES,
        subServices: DEFAULT_SUB_SERVICES,
        clothingItems: DEFAULT_CLOTHING_ITEMS
      };
      
      // Update URL with default data
      syncStateWithUrl(sharedData);
      
      toast({
        title: "Using Default Data",
        description: "Could not load saved data, using defaults"
      });
    }
  };

  // Load data on component mount and URL changes
  useEffect(() => {
    if (isDataLoaded) return; // Prevent multiple loads

    try {
      console.log('Loading data from URL or localStorage...');
      const searchParams = new URLSearchParams(location.search);
      const dataParam = searchParams.get('data');
      
      if (dataParam) {
        console.log('Found data parameter in URL, attempting to decode...');
        const decodedData = decodeDataFromUrl(dataParam);
        
        if (decodedData) {
          console.log('Successfully loaded data from URL:', {
            services: decodedData.services.length,
            subServices: decodedData.subServices.length,
            clothingItems: decodedData.clothingItems.length
          });
          
          // Update state with URL data
          setServices(decodedData.services);
          setSubServices(decodedData.subServices);
          setClothingItems(decodedData.clothingItems);
          
          // Also save to localStorage for backup
          localStorage.setItem('services', JSON.stringify(decodedData.services));
          localStorage.setItem('subServices', JSON.stringify(decodedData.subServices));
          localStorage.setItem('clothingItems', JSON.stringify(decodedData.clothingItems));
          
          setIsDataLoaded(true);
          return;
        } else {
          console.warn('Failed to decode URL data, falling back to localStorage');
        }
      } else {
        console.log('No data parameter found in URL');
      }
      
      // Fallback to localStorage if URL data is not available or invalid
      loadFromLocalStorage();
      setIsDataLoaded(true);
    } catch (error) {
      console.error('Error loading data, using defaults:', error);
      
      // Use default values if all else fails
      setServices(DEFAULT_SERVICES);
      setSubServices(DEFAULT_SUB_SERVICES);
      setClothingItems(DEFAULT_CLOTHING_ITEMS);
      
      // Save defaults to localStorage and URL
      const sharedData: SharedServiceData = {
        services: DEFAULT_SERVICES,
        subServices: DEFAULT_SUB_SERVICES,
        clothingItems: DEFAULT_CLOTHING_ITEMS
      };
      
      localStorage.setItem('services', JSON.stringify(DEFAULT_SERVICES));
      localStorage.setItem('subServices', JSON.stringify(DEFAULT_SUB_SERVICES));
      localStorage.setItem('clothingItems', JSON.stringify(DEFAULT_CLOTHING_ITEMS));
      
      syncStateWithUrl(sharedData);
      
      toast({
        title: "Using Default Data",
        description: "Could not load saved data, using defaults"
      });
      
      setIsDataLoaded(true);
    }
  }, [location.search]);

  const addService = (newServiceName: string) => {
    if (!newServiceName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Service name cannot be empty"
      });
      return false;
    }

    const newService = {
      id: Date.now().toString(),
      name: newServiceName.trim(),
      active: true
    };

    const updatedServices = [...services, newService];
    setServices(updatedServices);
    saveAllData(updatedServices, subServices, clothingItems);
    
    toast({
      title: "Success",
      description: "Service added successfully"
    });
    return true;
  };

  const addSubService = (newSubServiceName: string) => {
    if (!newSubServiceName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Sub-service name cannot be empty"
      });
      return false;
    }

    const newSubService = {
      id: Date.now().toString(),
      name: newSubServiceName.trim(),
      active: true
    };

    const updatedSubServices = [...subServices, newSubService];
    setSubServices(updatedSubServices);
    saveAllData(services, updatedSubServices, clothingItems);
    
    toast({
      title: "Success",
      description: "Sub-service added successfully"
    });
    return true;
  };

  const addClothingItem = (newClothingItemName: string) => {
    if (!newClothingItemName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Clothing item name cannot be empty"
      });
      return false;
    }

    const newClothingItem = {
      id: Date.now().toString(),
      name: newClothingItemName.trim(),
      active: true
    };

    const updatedClothingItems = [...clothingItems, newClothingItem];
    setClothingItems(updatedClothingItems);
    saveAllData(services, subServices, updatedClothingItems);
    
    toast({
      title: "Success",
      description: "Clothing item added successfully"
    });
    return true;
  };

  const updateServiceItem = (itemType: string, itemId: string, updatedName: string) => {
    if (!updatedName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Name cannot be empty"
      });
      return false;
    }

    let updatedServices = [...services];
    let updatedSubServices = [...subServices];
    let updatedClothingItems = [...clothingItems];

    if (itemType === 'sub-services') {
      updatedSubServices = subServices.map(item => 
        item.id === itemId ? { ...item, name: updatedName.trim() } : item
      );
      setSubServices(updatedSubServices);
    } else if (itemType === 'clothing-items') {
      updatedClothingItems = clothingItems.map(item => 
        item.id === itemId ? { ...item, name: updatedName.trim() } : item
      );
      setClothingItems(updatedClothingItems);
    } else {
      updatedServices = services.map(item => 
        item.id === itemId ? { ...item, name: updatedName.trim() } : item
      );
      setServices(updatedServices);
    }

    saveAllData(updatedServices, updatedSubServices, updatedClothingItems);
    
    toast({
      title: "Success",
      description: "Item updated successfully"
    });
    return true;
  };

  const handleServiceStatusChange = (id: string, newStatus: boolean) => {
    const updatedServices = services.map(service => 
      service.id === id ? { ...service, active: newStatus } : service
    );
    setServices(updatedServices);
    saveAllData(updatedServices, subServices, clothingItems);
    
    toast({
      title: "Status Updated",
      description: `Service ${newStatus ? 'activated' : 'deactivated'} successfully`
    });
  };

  const handleSubServiceStatusChange = (id: string, newStatus: boolean) => {
    const updatedSubServices = subServices.map(subService => 
      subService.id === id ? { ...subService, active: newStatus } : subService
    );
    setSubServices(updatedSubServices);
    saveAllData(services, updatedSubServices, clothingItems);
    
    toast({
      title: "Status Updated",
      description: `Sub-service ${newStatus ? 'activated' : 'deactivated'} successfully`
    });
  };

  const handleClothingItemStatusChange = (id: string, newStatus: boolean) => {
    const updatedClothingItems = clothingItems.map(item => 
      item.id === id ? { ...item, active: newStatus } : item
    );
    setClothingItems(updatedClothingItems);
    saveAllData(services, subServices, updatedClothingItems);
    
    toast({
      title: "Status Updated",
      description: `Clothing item ${newStatus ? 'activated' : 'deactivated'} successfully`
    });
  };

  const handleServiceDelete = (id: string) => {
    const updatedServices = services.filter(service => service.id !== id);
    setServices(updatedServices);
    saveAllData(updatedServices, subServices, clothingItems);
    
    toast({
      title: "Service Deleted",
      description: "Service removed successfully"
    });
  };

  const handleSubServiceDelete = (id: string) => {
    const updatedSubServices = subServices.filter(subService => subService.id !== id);
    setSubServices(updatedSubServices);
    saveAllData(services, updatedSubServices, clothingItems);
    
    toast({
      title: "Sub-service Deleted",
      description: "Sub-service removed successfully"
    });
  };

  const handleClothingItemDelete = (id: string) => {
    const updatedClothingItems = clothingItems.filter(item => item.id !== id);
    setClothingItems(updatedClothingItems);
    saveAllData(services, subServices, updatedClothingItems);
    
    toast({
      title: "Clothing Item Deleted",
      description: "Clothing item removed successfully"
    });
  };

  return {
    services,
    subServices,
    clothingItems,
    addService,
    addSubService,
    addClothingItem,
    updateServiceItem,
    handleServiceStatusChange,
    handleServiceDelete,
    handleSubServiceStatusChange,
    handleSubServiceDelete,
    handleClothingItemStatusChange,
    handleClothingItemDelete
  };
};
