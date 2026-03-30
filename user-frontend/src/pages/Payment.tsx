import React from 'react';
// import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useLocation } from 'react-router-dom';
import PaymentPage from '../components/PaymentPage';

const Payment: React.FC = () => {
  const location = useLocation();
  const state = location.state as any || {};
  
  // Handle both crystal products (items) and service bookings (bookingData)
  const { items = [], total = 0, bookingData = null, isService = false } = state;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-plum via-navy to-navy flex flex-col">
      {/* No Navbar on payment page */}
      {/* Use PaymentPage component for payment UI */}
      <PaymentPage 
        items={items} 
        total={total} 
        bookingData={bookingData} 
        isService={isService} 
      />
      <Footer />
    </div>
  );
};

export default Payment;
