import React, { useState, useEffect } from 'react';
import { ShoppingCart } from 'lucide-react';
import { ServiceSession } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
  serviceName: string;
<<<<<<< HEAD
  onBookService: (serviceType: string, serviceName: string, session: ServiceSession) => void;
=======
  onAddToCart: (serviceType: string, serviceName: string, session: ServiceSession) => void;
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
}

// Service data based on your JSON files
const serviceData: Record<string, any> = {
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
        duration: "30 mins",
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
        id: "crystal-basic",
        name: "Basic Crystal Healing",
        duration: "20 mins",
        price: 800,
        description: "A gentle session for energy cleansing and balance."
      },
      {
        id: "crystal-advanced",
        name: "Advanced Crystal Healing",
        duration: "40 mins",
        price: 1500,
        description: "Deep healing with advanced crystal layouts and chakra work."
      }
    ]
  }
};

const BookingModal: React.FC<BookingModalProps> = ({ 
  isOpen, 
  onClose, 
  serviceType, 
  serviceName, 
<<<<<<< HEAD
  onBookService 
=======
  onAddToCart 
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
}) => {
  const [selected, setSelected] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

<<<<<<< HEAD
  // Debug logging
  console.log('🎯 BookingModal render:', {
    isOpen,
    serviceType,
    serviceName,
    onBookServiceType: typeof onBookService,
    onBookServiceExists: !!onBookService
  });

=======
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
  // Get service data
  const data = serviceData[serviceType] || { sessions: [] };

  useEffect(() => {
    if (data.sessions && data.sessions.length > 0 && !selected) {
      setSelected(data.sessions[0].id);
      console.log('🎯 Auto-selected first session:', data.sessions[0].id);
    }
  }, [data, selected]);

  if (!isOpen) return null;

  const selectedSession = data.sessions?.find((s: ServiceSession) => s.id === selected) || data.sessions?.[0];

<<<<<<< HEAD
  const handleBookService = () => {
    console.log('🔄 handleBookService called, checking params:', {
      selectedSession,
      onBookService: typeof onBookService,
      serviceType,
      serviceName
    });

    if (!selectedSession) {
=======
  console.log('📋 BookingModal render:', {
    serviceType,
    serviceName,
    dataLoaded: !!data.sessions,
    sessionsCount: data.sessions?.length || 0,
    selectedSession,
    loading,
    error,
    onAddToCart: typeof onAddToCart
  });

  const handleAddToCart = () => {
    console.log('🛒 Add to cart button clicked');
    console.log('📊 onAddToCart prop:', onAddToCart);
    console.log('📊 typeof onAddToCart:', typeof onAddToCart);
    console.log('📊 Current state:', { selectedSession, serviceType, serviceName });
    
    if (!onAddToCart) {
      console.error('❌ onAddToCart prop is missing or undefined');
      alert('Add to cart function not available. Please refresh the page and try again.');
      return;
    }

    if (typeof onAddToCart !== 'function') {
      console.error('❌ onAddToCart is not a function, it is:', typeof onAddToCart);
      alert('Add to cart function is invalid. Please refresh the page and try again.');
      return;
    }

    if (!selectedSession) {
      console.error('❌ No session selected');
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
      alert('Please select a session first');
      return;
    }

<<<<<<< HEAD
    if (!onBookService || typeof onBookService !== 'function') {
      console.error('❌ onBookService is not a function:', {
        type: typeof onBookService, 
        value: onBookService,
        isNull: onBookService === null,
        isUndefined: onBookService === undefined
      });
      alert('Booking function not available. Please refresh the page and try again.');
      return;
    }

    try {
      console.log('📞 Calling onBookService with:', { serviceType, serviceName, selectedSession });
      onBookService(serviceType, serviceName, selectedSession);
      console.log('✅ onBookService call successful');
    } catch (error) {
      console.error('❌ Error in handleBookService:', error);
      alert('Error processing booking. Please try again.');
=======
    try {
      console.log('📄 Calling onAddToCart with:', { serviceType, serviceName, selectedSession });
      onAddToCart(serviceType, serviceName, selectedSession);
      console.log('✅ onAddToCart called successfully');
    } catch (error) {
      console.error('❌ Error in handleAddToCart:', error);
      alert('Error adding to cart. Please try again.');
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
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

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-[#6a3fa0] to-[#2d0b4e] rounded-2xl p-6 max-w-lg w-full border border-purple-500/30 shadow-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
            <h3 className="text-2xl font-bold text-white mb-2">Loading...</h3>
            <p className="text-purple-200">Loading service options...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data.sessions || data.sessions.length === 0) {
    return (
      <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-gradient-to-br from-[#6a3fa0] to-[#2d0b4e] rounded-2xl p-6 max-w-lg w-full border border-purple-500/30 shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-3xl font-extrabold text-white font-unbounded">Service Error</h3>
            <button onClick={onClose} className="text-gray-300 hover:text-white text-3xl font-bold">&times;</button>
          </div>
          <p className="text-purple-200 mb-4">
            {error || `Service data not found for ${serviceType}. Please check your service configuration.`}
          </p>
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-700 hover:to-purple-700 py-3 rounded-lg font-bold text-white text-lg transition-all duration-300"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#6a3fa0] to-[#2d0b4e] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-extrabold text-white flex items-center font-unbounded">
            <span className="mr-2">🕊</span> Select {serviceName}
          </h3>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-3xl font-bold">&times;</button>
        </div>

<<<<<<< HEAD
=======
        {/* Debug info - remove in production */}
        
        
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
        <div className="mb-6">
          <p className="text-lg font-semibold text-purple-200 mb-4">
            {getSelectionLabel()}
          </p>
          
          <div className="space-y-4">
            {data.sessions.map((session: ServiceSession) => (
              <div
                key={session.id}
                className={`rounded-xl p-5 border transition-all duration-200 cursor-pointer ${
                  selected === session.id 
                    ? 'border-yellow-400 bg-[#3d2466]/80 ring-2 ring-yellow-400/30' 
                    : 'border-transparent bg-[#2d0b4e]/60 hover:bg-[#3d2466]/60'
                } ${data.sessions.length === 1 ? 'pointer-events-none border-yellow-400 bg-[#3d2466]/80' : ''}`}
                onClick={() => {
                  if (data.sessions.length > 1) {
                    console.log('🎯 Session selected:', session.id);
                    setSelected(session.id);
                  }
                }}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="text-xl sm:text-2xl font-bold text-white font-unbounded">
                    {session.name}
                  </div>
                  <div className="text-lg font-bold text-yellow-400">
                    ₹{session.price}
                  </div>
                </div>
                <div className="text-purple-200 text-base mb-2">
                  {session.description}
                </div>
                <div className="text-purple-300 text-sm">
                  Duration: {session.duration}
                </div>
              </div>
            ))}
          </div>
        </div>

        {selectedSession && (
          <div className="border-t border-purple-500/30 pt-4">
            <div className="mb-4 p-4 bg-black/30 rounded-lg">
              <div className="flex justify-between items-center text-lg">
                <span className="text-purple-200">Selected:</span>
                <span className="text-white font-bold">{selectedSession.name}</span>
              </div>
              <div className="flex justify-between items-center text-lg mt-2">
                <span className="text-purple-200">Price:</span>
                <span className="text-yellow-400 font-bold">₹{selectedSession.price}</span>
              </div>
            </div>

            <button
<<<<<<< HEAD
              onClick={handleBookService}
=======
              onClick={handleAddToCart}
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
              className="block w-full bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 py-3 rounded-lg font-bold text-white text-lg text-center transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
<<<<<<< HEAD
                Book Now
=======
                Add to Cart
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingModal;