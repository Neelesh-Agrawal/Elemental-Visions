import React from 'react';
// import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentPage from '../components/PaymentPage';

const Payment: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
<<<<<<< HEAD
  const { items = [], total = 0, orderType = 'crystal' } = (location.state as any) || {};
=======
  const { items = [], total = 0 } = (location.state as any) || {};
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#6a3fa0] via-[#2d0b4e] to-[#181024] flex flex-col">
      {/* No Navbar on payment page */}
      {/* Use PaymentPage component for payment UI */}
<<<<<<< HEAD
      <PaymentPage orderType={orderType} />
=======
      <PaymentPage />
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
      <Footer />
    </div>
  );
};

export default Payment;
