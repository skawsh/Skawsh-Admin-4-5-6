
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

// Serializable data structure for sharing
export interface SharedServiceData {
  services: Service[];
  subServices: SubService[];
  clothingItems: ClothingItem[];
}
