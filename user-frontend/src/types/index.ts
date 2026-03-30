// Crystal and Service Types
export interface Crystal {
  id: string;
  name: string;
  image: string;
  purpose: string;
  description: string;
  price?: number;
  category?: string;
  properties?: string[];
  forms?: CrystalForm[];
}

export interface CrystalForm {
  name: string;
  price: number;
  description?: string;
}

export interface CartItem {
  crystal: Crystal;
  form: CrystalForm;
  quantity: number;
  type: 'crystal' | 'service';
}

export interface ServiceSession {
  id: string;
  name: string;
  duration?: string;
  price: number | string;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  basePrice: string;
  duration?: string;
  type: string;
  sessions: ServiceSession[];
}

// Order Types
export interface OrderItem {
  crystal: string;
  form: string;
  quantity: number;
  unit_price: number;
}

export interface Order {
  id?: string;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
}

// Component Props
export interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
}

export interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (compositeId: string, quantity: number) => void;
  onRemoveItem: (compositeId: string) => void;
  onProceedToCheckout: () => void;
}

export interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onOrderComplete: () => void;
}

export interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
  serviceName: string;
  onBookService: (serviceType: string, serviceName: string, session: ServiceSession) => void;
}