import React from 'react';
import { BrandLogo } from './BrandLogo';

export const Footer: React.FC = () => (
  <footer className="border-t border-sand/15 bg-navy py-12 px-4">
    <div className="max-w-6xl mx-auto text-center">
      <div className="mb-6 flex justify-center">
        <BrandLogo variant="footer" />
      </div>
      <p className="text-sand/90 mb-4">
      Understanding your patterns. Aligning your path.
      </p>
      <p className="text-sm text-sand/70">
        © 2025 Elemental Visions. All rights reserved. | Crafted with ✨ and ancient wisdom
      </p>
    </div>
  </footer>
);
