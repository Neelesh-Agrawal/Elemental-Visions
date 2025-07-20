import React from 'react';

export const Footer: React.FC = () => (
  <footer className="py-12 px-4 bg-black/50 border-t border-purple-500/30">
    <div className="max-w-6xl mx-auto text-center">
      <div className="flex items-center justify-center space-x-3 mb-6">
        <img src="/image.png" alt="Elemental Visions" className="w-10 h-10 rounded-full" />
        <div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
            Elemental Visions
          </h3>
          <p className="text-xs text-purple-300">with Sakshi</p>
        </div>
      </div>
      <p className="text-gray-400 mb-4">
        ✨ Where Ancient Wisdom Meets Modern Insight ✨
      </p>
      <p className="text-sm text-purple-300">
        © 2024 Elemental Visions. All rights reserved. | Crafted with ✨ and ancient wisdom
      </p>
    </div>
  </footer>
);
