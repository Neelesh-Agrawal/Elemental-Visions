import React from 'react';
// import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useLocation } from 'react-router-dom';
import PaymentPage from '../components/PaymentPage';
import type { CartItem } from '../types';

interface BookingData {
  booking_id: number;
  total: number;
  customer?: { customer_name?: string; email?: string; phone?: string };
  service?: { name?: string; session?: string; duration?: string; price?: number };
}

interface PaymentRouteState {
  items?: CartItem[];
  total?: number;
  bookingData?: BookingData | null;
  isService?: boolean;
  order_id?: number | null;
}

const Payment: React.FC = () => {
  const location = useLocation();
  const state = (location.state as PaymentRouteState | null) || {};
  
  // Handle both crystal products (items) and service bookings (bookingData)
  const { items = [], total = 0, bookingData = null, isService = false, order_id = null } = state;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-plum via-navy to-navy flex flex-col">
      {/* No Navbar on payment page */}
      {/* Use PaymentPage component for payment UI */}
        <PaymentPage 
          items={items} 
          total={total} 
          bookingData={bookingData} 
          orderId={order_id}
          isService={isService} 
        />
      <Footer />
    </div>
  );
};

export default Payment;
