import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  basePrice?: string;
  duration?: string;
  onBook: () => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  icon,
  title,
  description,
  basePrice,
  duration,
  onBook,
}) => (
  <div className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 glass card-shadow p-6 sm:p-8 border border-purple-500/30 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group flex flex-col justify-between">
    <div className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
    <p className="text-gray-300 mb-6 leading-relaxed">{description}</p>
    <div className="mt-auto">
      <div className="flex justify-between items-center mb-3">
        <span className="text-yellow-400 font-semibold text-lg">{basePrice}</span>
        <span className="text-purple-300 text-sm">{duration}</span>
      </div>
      <button
        onClick={onBook}
        className="w-full bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
      >
        Book Now
        <ChevronRight className="w-4 h-4 ml-2" />
      </button>
    </div>
  </div>
);

export default ServiceCard;
