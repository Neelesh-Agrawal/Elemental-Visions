import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { crystals } from '../data/crystals';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Crystals: React.FC = () => {
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
    <div className="min-h-screen bg-sand text-navy overflow-x-hidden">
      <Navbar cartCount={0} onCartClick={() => {}} />
      <section id="crystals" className="py-20 px-4" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading mb-6 bg-gradient-to-r from-navy via-plum to-teal bg-clip-text text-4xl font-bold text-transparent md:text-5xl">
              Healing Crystals
            </h2>
            <p className="mx-auto mb-4 max-w-3xl text-xl text-navy/70">
              Ethically sourced crystals charged with intention to amplify your spiritual journey
            </p>
            <div className="bg-teal/20 border border-teal/40 rounded-lg p-3 max-w-2xl mx-auto">
              <p className="text-sm text-teal font-medium">
                ⚠️ Images are for reference only. Actual products may vary due to their natural nature.
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => scrollCrystals('left')}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 transform rounded-full border-4 border-transparent bg-plum p-3 text-sand shadow-xl transition-all duration-300 hover:bg-plum/90"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => scrollCrystals('right')}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 transform rounded-full border-4 border-transparent bg-plum p-3 text-sand shadow-xl transition-all duration-300 hover:bg-plum/90"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div
              id="crystals-container"
              className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 px-12 relative"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {crystals.map((crystal, idx) => (
                <div
                  key={crystal.id}
                  className={`group relative flex h-[500px] w-80 flex-shrink-0 flex-col justify-between overflow-hidden rounded-2xl border border-navy/12 bg-white/50 shadow-lg transition-all duration-300 hover:z-30 hover:scale-105 hover:border-teal/45 hover:shadow-xl ${idx === 0 ? 'ml-6' : ''} ${idx === crystals.length - 1 ? 'mr-6' : ''}`}
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
                      <h3 className="text-2xl font-bold text-sand drop-shadow mb-1">{crystal.name}</h3>
                      <p className="text-teal font-semibold text-base mb-1 drop-shadow">{crystal.purpose}</p>
                    </div>
                  </div>
                  {/* Card content below image */}
                  <div className="flex min-h-0 flex-1 flex-col justify-between gap-2 overflow-hidden border-t border-navy/10 bg-sand/90 p-4">
                    <p className="mb-1 line-clamp-3 text-sm text-navy/75">{crystal.description}</p>
                    <div className="mb-1 flex flex-wrap gap-1">
                      {crystal.properties.map((property, index) => (
                        <span
                          key={index}
                          className="rounded-full border border-teal/25 bg-teal/15 px-2 py-1 text-xs text-navy"
                        >
                          {property}
                        </span>
                      ))}
                    </div>
                    {crystal.name !== 'Mixels' && (
                      <div className="text-xs text-navy/80">
                        <span className="font-medium text-navy">Available as:</span>{' '}
                        <span className="font-semibold text-teal">{crystal.forms.map(f => f.name).join(' | ')}</span>
                      </div>
                    )}
                    <button
                      className="mt-4 w-full rounded-lg bg-gradient-to-r from-teal to-plum px-4 py-2 text-sm font-bold text-sand shadow-lg transition-all duration-300 hover:opacity-90"
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
