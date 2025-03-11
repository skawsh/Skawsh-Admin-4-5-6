
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
