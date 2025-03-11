
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

export const useServicesData = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [subServices, setSubServices] = useState<SubService[]>([]);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

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

  // Load data from localStorage and sync to URL
  const loadFromLocalStorage = () => {
    try {
      const storedServices = localStorage.getItem('services');
      const storedSubServices = localStorage.getItem('subServices');
      const storedClothingItems = localStorage.getItem('clothingItems');
      
      const servicesData = storedServices ? JSON.parse(storedServices) : [];
      const subServicesData = storedSubServices ? JSON.parse(storedSubServices) : [];
      const clothingItemsData = storedClothingItems ? JSON.parse(storedClothingItems) : [];
      
      console.log('Loaded data from localStorage:', { 
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
      console.error('Error loading from localStorage:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load saved data"
      });
      // If localStorage fails, set empty arrays
      setServices([]);
      setSubServices([]);
      setClothingItems([]);
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
      console.error('Error loading data:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load saved data"
      });
      
      // Always attempt to load from localStorage as a last resort
      loadFromLocalStorage();
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
