import React from 'react';
// import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentPage from '../components/PaymentPage';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], total = 0 } = (location.state as any) || {};

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#6a3fa0] via-[#2d0b4e] to-[#181024] flex flex-col">
      {/* No Navbar on payment page */}
      {/* Use PaymentPage component for payment UI */}
      <PaymentPage />
      <Footer />
    </div>
  );
};

export default Payment;
