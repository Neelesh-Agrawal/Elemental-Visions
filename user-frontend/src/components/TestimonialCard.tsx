import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  text: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, location, text, rating }) => (
  <div className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 glass card-shadow p-8 border border-purple-500/30 hover:border-yellow-400/50 transition-all duration-300">
    <div className="flex mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
      ))}
    </div>
    <p className="text-gray-300 mb-6 italic leading-relaxed">"{text}"</p>
    <div>
      <div className="font-semibold text-white">{name}</div>
      <div className="text-purple-300 text-sm">{location}</div>
    </div>
  </div>
);

export default TestimonialCard;
