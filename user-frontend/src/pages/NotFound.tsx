import React from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';

const NotFound: React.FC = () => (
  <div className="flex min-h-screen flex-col bg-sand text-navy">
    <Navbar cartCount={0} onCartClick={() => {}} />
    <div className="flex flex-1 flex-col items-center justify-center">
      <h1 className="mb-4 text-6xl font-bold text-plum">404</h1>
      <p className="mb-8 text-xl text-navy/75">Page Not Found</p>
      <a href="/" className="bg-teal text-navy px-6 py-3 rounded-lg font-bold hover:bg-sand transition">Go Home</a>
    </div>
    <Footer />
  </div>
);

export default NotFound;
