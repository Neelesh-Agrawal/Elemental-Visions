import React, { useEffect, useState } from 'react';
import { ShoppingCart, Menu, X } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onCartClick: () => void;
  forceSolidBg?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ cartCount, onCartClick, forceSolidBg }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        forceSolidBg || scrolled
          ? 'bg-gradient-to-r from-[#181024]/90 to-[#0a0916]/90 shadow-lg backdrop-blur-md'
          : 'bg-transparent'
      }`}
      style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center space-x-3">
            <img src="/image.png" alt="Elemental Visions" className="w-12 h-12 rounded-full" />
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-yellow-400 font-unbounded tracking-tight" style={{ letterSpacing: 0 }}>
                Elemental Visions
              </h1>
              <p className="text-xs text-purple-300 font-medium">with Sakshi</p>
            </div>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-10">
            <a href="#home" className="text-white font-semibold hover:text-yellow-400 transition-colors text-lg">Home</a>
            <a href="#services" className="text-white font-semibold hover:text-yellow-400 transition-colors text-lg">Services</a>
            <a href="#about" className="text-white font-semibold hover:text-yellow-400 transition-colors text-lg">About</a>
            <a href="#crystals" className="text-white font-semibold hover:text-yellow-400 transition-colors text-lg">Crystals</a>
            <a href="#contact" className="text-white font-semibold hover:text-yellow-400 transition-colors text-lg">Contact</a>
            <button 
              onClick={onCartClick}
              className="relative p-2 hover:text-yellow-400 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={onCartClick}
              className="relative p-2 hover:text-yellow-400 transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-md rounded-lg mt-2 p-4">
            <div className="flex flex-col space-y-4">
              <a href="#home" className="text-white font-semibold hover:text-yellow-400 transition-colors text-lg" onClick={() => setIsMenuOpen(false)}>Home</a>
              <a href="#services" className="text-white font-semibold hover:text-yellow-400 transition-colors text-lg" onClick={() => setIsMenuOpen(false)}>Services</a>
              <a href="#about" className="text-white font-semibold hover:text-yellow-400 transition-colors text-lg" onClick={() => setIsMenuOpen(false)}>About</a>
              <a href="#crystals" className="text-white font-semibold hover:text-yellow-400 transition-colors text-lg" onClick={() => setIsMenuOpen(false)}>Crystals</a>
              <a href="#contact" className="text-white font-semibold hover:text-yellow-400 transition-colors text-lg" onClick={() => setIsMenuOpen(false)}>Contact</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
