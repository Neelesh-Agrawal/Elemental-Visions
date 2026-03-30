import React from 'react';
import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  text: string;
  rating: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ name, location, text, rating }) => (
  <div className="glass card-shadow bg-white/60 p-8 border border-navy/10 hover:border-teal/40 transition-all duration-300">
    <div className="flex mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-teal fill-current" />
      ))}
    </div>
    <p className="text-navy/80 mb-6 italic leading-relaxed">"{text}"</p>
    <div>
      <div className="font-semibold text-navy">{name}</div>
      <div className="text-navy/60 text-sm">{location}</div>
    </div>
  </div>
);

export default TestimonialCard;
