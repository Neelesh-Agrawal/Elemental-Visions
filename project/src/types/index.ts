export interface CrystalForm {
  name: string; // e.g., Bracelet, Tumble, Tree, Pendant, Raw
  price: number;
  image: string;
  description?: string;
}

export interface Crystal {
  id: string;
  name: string;
  purpose: string;
  description: string;
  properties: string[];
  forms: CrystalForm[];
  image?: string;
  price?: number;
}

export interface CartItem {
  crystal: Crystal;
  form: CrystalForm;
  quantity: number;
}

export interface Order {
  id?: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  items: CartItem[];
  total_amount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  created_at?: string;
}

export interface TarotSlot {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
}

export interface CoachingSlot {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
}