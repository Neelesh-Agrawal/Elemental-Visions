import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { crystals } from '../data/crystals';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Crystals: React.FC = () => {
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedCrystal, setSelectedCrystal] = useState(null);
  const [selectedForms, setSelectedForms] = useState({});
  const [crystalScrollPosition, setCrystalScrollPosition] = useState(0);

  const scrollCrystals = (direction: 'left' | 'right') => {
    const container = document.getElementById('crystals-container');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left'
        ? Math.max(0, crystalScrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, crystalScrollPosition + scrollAmount);

      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setCrystalScrollPosition(newPosition);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white overflow-x-hidden">
      <Navbar cartCount={0} onCartClick={() => {}} />
      <section id="crystals" className="py-20 px-4" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent font-unbounded drop-shadow-lg">
              Healing Crystals
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ethically sourced crystals charged with intention to amplify your spiritual journey
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => scrollCrystals('left')}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-purple-600/80 hover:bg-purple-700 p-3 rounded-full transition-all duration-300 shadow-xl border-4 border-transparent"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scrollCrystals('right')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-purple-600/80 hover:bg-purple-700 p-3 rounded-full transition-all duration-300 shadow-xl border-4 border-transparent"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div
              id="crystals-container"
              className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 px-12 relative"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {crystals.map((crystal, idx) => (
                <div
                  key={crystal.id}
                  className={`flex-shrink-0 w-80 h-[500px] glass card-shadow overflow-hidden border border-purple-500/30 hover:border-yellow-400/50 transition-all duration-300 group relative flex flex-col justify-between ${idx === 0 ? 'ml-6' : ''} ${idx === crystals.length - 1 ? 'mr-6' : ''} hover:scale-105 hover:shadow-2xl hover:z-30`}
                  style={{ zIndex: 1 }}
                  data-aos="zoom-in-up"
                >
                  {/* Crystal Image as main focus */}
                  <div className="h-60 w-full relative overflow-hidden rounded-t-2xl flex-shrink-0">
                    <img
                      src={crystal.image}
                      alt={crystal.name}
                      className="w-full h-full object-cover object-center rounded-t-2xl transition-all duration-300"
                    />
                    {/* Glassy overlay for name and purpose */}
                    <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-md p-4 rounded-b-2xl flex flex-col items-start">
                      <h3 className="text-2xl font-bold text-white drop-shadow mb-1">{crystal.name}</h3>
                      <p className="text-yellow-300 font-semibold text-base mb-1 drop-shadow">{crystal.purpose}</p>
                    </div>
                  </div>
                  {/* Card content below image */}
                  <div className="p-4 flex flex-col gap-2 flex-1 min-h-0 justify-between overflow-hidden">
                    <p className="text-gray-300 text-sm line-clamp-3 mb-1">{crystal.description}</p>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {crystal.properties.map((property, index) => (
                        <span
                          key={index}
                          className="text-xs bg-purple-600/30 text-purple-200 px-2 py-1 rounded-full"
                        >
                          {property}
                        </span>
                      ))}
                    </div>
                    {crystal.name !== 'Mixels' && (
                      <div className="text-xs text-purple-200">
                        Available as: {crystal.forms.map(f => f.name).join(' | ')}
                      </div>
                    )}
                    <button
                      onClick={() => {
                        setSelectedCrystal(crystal);
                        setIsFormModalOpen(true);
                        setSelectedForms({});
                      }}
                      className="mt-4 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 px-4 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-all duration-300 w-full"
                    >
                      Select Form
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Modal logic would go here */}
      <Footer />
    </div>
  );
};

export default Crystals;
