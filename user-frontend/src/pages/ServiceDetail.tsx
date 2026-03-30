import React from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';

const ServiceDetail: React.FC = () => (
  <div className="min-h-screen bg-sand text-navy overflow-x-hidden">
    <Navbar cartCount={0} onCartClick={() => {}} />
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h1 className="text-4xl font-bold text-teal mb-4">Service Details</h1>
      <p className="text-lg text-navy/75">This page will show details for a specific service.</p>
    </div>
    <Footer />
  </div>
);

export default ServiceDetail;
