import React from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';

const ServiceDetail: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white overflow-x-hidden">
    <Navbar cartCount={0} onCartClick={() => {}} />
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">Service Details</h1>
      <p className="text-lg text-purple-200">This page will show details for a specific service.</p>
    </div>
    <Footer />
  </div>
);

export default ServiceDetail;
