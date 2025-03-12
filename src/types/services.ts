

export interface Service {
  id: string;
  name: string;
  active: boolean;
}

export interface SubService {
  id: string;
  name: string;
  active: boolean;
}

export interface ClothingItem {
  id: string;
  name: string;
  active: boolean;
}

export type ItemType = Service | SubService | ClothingItem;

export interface StudioService {
  id: string;
  name: string;
  active: boolean;
  serviceId: string;
  subServices: Array<{
    name: string;
    standardPricePerKg?: number;
    expressPricePerKg?: number;
    standardPricePerItem?: number;
    expressPricePerItem?: number;
    selectedItems?: string[];
    standardItemPrices?: { [key: string]: number };
    expressItemPrices?: { [key: string]: number };
    itemPrices?: { [key: string]: number };
    active?: boolean; // Added active property to subServices
    clothingItemsStatus?: { [key: string]: boolean }; // Added status tracking for clothing items
  }>;
}

export interface SharedServiceData {
  services: Service[];
  subServices: SubService[];
  clothingItems: ClothingItem[];
  version?: string; // For future compatibility
}

