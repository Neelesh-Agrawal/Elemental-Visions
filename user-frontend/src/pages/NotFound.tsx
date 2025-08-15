import React from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';

const NotFound: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white">
    <Navbar cartCount={0} onCartClick={() => {}} />
    <div className="flex-1 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-bold text-yellow-400 mb-4">404</h1>
      <p className="text-xl text-purple-200 mb-8">Page Not Found</p>
      <a href="/" className="bg-yellow-400 text-purple-900 px-6 py-3 rounded-lg font-bold hover:bg-yellow-300 transition">Go Home</a>
    </div>
    <Footer />
  </div>
);

export default NotFound;
