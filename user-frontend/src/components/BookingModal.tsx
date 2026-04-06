import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { ServiceSession } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
  serviceName: string;
  onAddToCart: (serviceType: string, serviceName: string, session: ServiceSession) => void;
}

interface ServiceData {
  name: string;
  description: string;
  sessions: ServiceSession[];
}

// Service data based on your JSON files
const serviceData: Record<string, ServiceData> = {
  tarot: {
    name: "Tarot Reading",
    description: "Navigate life's crossroads with symbolic guidance. Choose from different question packages with personalized spreads.",
    sessions: [
      {
        id: "tarot-3q",
        name: "3 Questions Reading",
        duration: "10 mins",
        price: 699,
        description: "Perfect for quick insights on specific concerns."
      },
      {
        id: "tarot-5q",
        name: "1 tarot reading based on 1 aspect",
        duration: "20 mins",
        price: 901,
        description: "Comprehensive reading for multiple life areas like love, career, finance, etc."
      },
      {
        id: "tarot-full",
        name: "Full Session",
        duration: "30 mins",
        price: 1500,
        description: "A detailed reading for your life problems."
      }
    ]
  },
  palm: {
    name: "Palm Reading",
    description: "Explore your destiny through sacred palm line analysis. Discover your innate gifts and future pathways.",
    sessions: [
      {
        id: "palm-basic",
        name: "Palm Reading Session",
        duration: "20 mins",
        price: 999,
        description: "Detailed reading of palm lines and mounts."
      }
    ]
  },
  karma: {
    name: "Karma Analysis",
    description: "Get your Pending Karma Analysis done and understand the hidden lessons your soul is still carrying.",
    sessions: [
      {
        id: "karma-basic",
        name: "Karma Analysis Session",
        price: 999,
        description: "In-depth analysis of karmic patterns and soul lessons."
      }
    ]
  },
  coaching: {
    name: "Life Coaching",
    description: "Personalized coaching to help you achieve your goals, overcome obstacles, and transform your life.",
    sessions: [
      {
        id: "coaching-15",
        name: "15 Minutes Session",
        duration: "15 mins",
        price: 999,
        description: "Quick consultation for specific goals."
      },
      {
        id: "coaching-30",
        name: "30 Minutes Session",
        duration: "30 mins",
        price: 1499,
        description: "Comprehensive coaching with action plan."
      }
    ]
  },
  crystal: {
    name: "Crystal Healing",
    description: "Personalized crystal healing session with energy alignment, chakra balancing, and intention setting.",
    sessions: [
      {
        id: "crystal-consultancy",
        name: "Crystal Consultancy",
        price: 299,
        description: "We will guide you on what crystal you should wear"
      },
      {
        id: "crystal-basic",
        name: "Basic Crystal Healing",
        duration: "20 mins",
        price: 800,
        description: "A gentle session for energy cleansing and balance."
      }
    ]
  }
};

const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  serviceType, 
  serviceName, 
  onAddToCart 
}) => {
  const [selected, setSelected] = useState<string>('');

  // Get service data
  const data = serviceData[serviceType] || { name: serviceName, description: '', sessions: [] };

  useEffect(() => {
    if (data.sessions && data.sessions.length > 0 && !selected) {
      setSelected(data.sessions[0].id);
    }
  }, [data, selected]);

  if (!isOpen) return null;

  const selectedSession = data.sessions?.find((s: ServiceSession) => s.id === selected) || data.sessions?.[0];

  const handleAddToCart = () => {
    if (!onAddToCart) {
      return;
    }

    if (typeof onAddToCart !== 'function') {
      return;
    }

    if (!selectedSession) {
      return;
    }

    try {
      onAddToCart(serviceType, serviceName, selectedSession);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  const getSelectionLabel = () => {
    switch (serviceType) {
      case 'tarot': return 'Choose Your Reading Type:';
      case 'coaching': return 'Choose Session Duration:';
      case 'palm': return 'Palm Reading Session:';
      case 'karma': return 'Karma Analysis Session:';
      case 'crystal': return 'Crystal Healing Session:';
      default: return 'Choose Your Session:';
    }
  };

  if (!data.sessions || data.sessions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-plum to-navy rounded-2xl p-6 max-w-lg w-full border border-plum/30 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-extrabold text-sand font-heading">Service Error</h3>
            <button onClick={onClose} className="text-sand/80 hover:text-sand text-3xl font-bold">&times;</button>
          </div>
          <p className="text-sand/90 mb-4">
            {`Service data not found for ${serviceType}. Please check your service configuration.`}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-plum to-navy hover:opacity-90 py-3 rounded-lg font-bold text-sand text-lg transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-plum to-navy rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-plum/30 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-extrabold text-sand flex items-center font-heading">
            <span className="mr-2">🕊</span> Select {serviceName}
          </h3>
          <button onClick={onClose} className="text-sand/80 hover:text-sand text-3xl font-bold">&times;</button>
        </div>

        {/* Debug info - remove in production */}
        
        
        <div className="mb-6">
          <p className="text-lg font-semibold text-sand/90 mb-4">
            {getSelectionLabel()}
          </p>
          
          <div className="space-y-4">
            {data.sessions.map((session: ServiceSession) => (
              <div
                key={session.id}
                className={`rounded-xl p-5 border transition-all duration-200 cursor-pointer ${
                  selected === session.id 
                    ? 'border-teal bg-plum/80 ring-2 ring-teal/30' 
                    : 'border-transparent bg-navy/60 hover:bg-plum/60'
                } ${data.sessions.length === 1 ? 'pointer-events-none border-teal bg-plum/80' : ''}`}
                onClick={() => {
                  if (data.sessions.length > 1) {
                    setSelected(session.id);
                  }
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xl sm:text-2xl font-bold text-sand font-heading">
                    {session.name}
                  </div>
                  <div className="text-lg font-bold text-teal">
                    ₹{session.price}
                  </div>
                </div>
                <div className="text-sand/90 text-base mb-2">
                  {session.description}
                </div>
                {session.duration && (
                  <div className="text-sand/70 text-sm">
                    Duration: {session.duration}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {selectedSession && (
          <div className="border-t border-plum/30 pt-4">
            <div className="mb-4 p-4 bg-navy/30 rounded-lg">
              <div className="flex justify-between items-center text-lg">
                <span className="text-sand/90">Selected:</span>
                <span className="text-sand font-bold">{selectedSession.name}</span>
              </div>
              <div className="flex justify-between items-center text-lg mt-2">
                <span className="text-sand/90">Price:</span>
                <span className="text-teal font-bold">₹{selectedSession.price}</span>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="block w-full bg-gradient-to-r from-teal to-plum hover:opacity-90 py-3 rounded-lg font-bold text-sand text-lg text-center transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Add to Cart
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;