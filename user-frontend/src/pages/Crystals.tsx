import React from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';

const Crystals: React.FC = () => {
  return (
    <div className="min-h-screen bg-sand text-navy overflow-x-hidden">
      <Navbar cartCount={0} onCartClick={() => {}} />
      <section id="crystals" className="py-20 px-4" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading mb-6 bg-gradient-to-r from-navy via-plum to-teal bg-clip-text px-1 pb-0.5 pt-[0.12em] text-4xl font-bold leading-[1.25] text-transparent md:text-5xl md:leading-[1.2]">
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
          <div className="mx-auto w-full max-w-4xl">
            <div className="rounded-2xl border border-sand/20 bg-plum px-6 py-20 text-center shadow-lg">
              <p
                className="text-4xl uppercase text-sand md:text-5xl"
                style={{
                  fontFamily: "'Gotham', system-ui, sans-serif",
                  fontWeight: 500,
                  letterSpacing: '0.12em',
                }}
              >
                Coming Soon
              </p>
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
