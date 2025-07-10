import React, { useState } from 'react';
import { X, Clock, MessageCircle } from 'lucide-react';
import { TarotSlot, CoachingSlot } from '../types';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: 'tarot' | 'coaching' | 'palm' | 'karma' | 'crystal';
  serviceName: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  serviceType,
  serviceName
}) => {
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  const tarotSlots: TarotSlot[] = [
    {
      id: 'tarot-3q',
      name: '3 Questions Reading',
      duration: '10 mins',
      price: 699,
      description: 'Perfect for quick insights on specific concerns'
    },
    {
      id: 'tarot-5q',
      name: '1 tarot reading based on 1 aspect',
      duration: '20 mins',
      price: 901,
      description: 'Comprehensive reading for multiple life areas like love, career, finance, etc.'
    },
    {
      id: 'tarot-full',
      name: 'Full Session',
      duration: '30 mins',
      price: 1500,
      description: 'A detailed reading for your life problems'
    }
  ];

  const coachingSlots: CoachingSlot[] = [
    {
      id: 'coaching-30',
      name: '15 Minutes Session',
      duration: '15 mins',
      price: 999,
      description: 'Quick consultation for specific goals'
    },
    {
      id: 'coaching-60',
      name: '30 Minutes Session',
      duration: '30 mins',
      price: 1499,
      description: 'Comprehensive coaching with action plan'
    }
  ];

  const handleBooking = () => {
    if (!selectedSlot) {
      alert('Please select a slot first');
      return;
    }

    let slot;
    let message = '';

    if (serviceType === 'tarot') {
      slot = tarotSlots.find(s => s.id === selectedSlot);
      message = `Hi! I'd like to book a ${slot?.name} (${slot?.duration}) for ₹${slot?.price}. Please let me know available time slots.`;
    } else if (serviceType === 'coaching') {
      slot = coachingSlots.find(s => s.id === selectedSlot);
      message = `Hi! I'd like to book a ${slot?.name} (${slot?.duration}) for ₹${slot?.price}. Please let me know available time slots.`;
    } else {
      // For other services
      const prices = {
        palm: 999,
        karma: 999,
        crystal: 800
      };
      message = `Hi! I'd like to book a ${serviceName} session for ₹${prices[serviceType as keyof typeof prices]}. Please let me know available time slots.`;
    }

    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto border border-purple-500/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <Clock className="w-6 h-6 mr-2" />
            Book {serviceName}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {serviceType === 'tarot' && (
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-semibold text-purple-300">Choose Your Reading Type:</h4>
            {tarotSlots.map((slot) => (
              <div
                key={slot.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedSlot === slot.id
                    ? 'border-yellow-400 bg-yellow-400/10'
                    : 'border-purple-500/30 bg-black/20 hover:border-purple-400'
                }`}
                onClick={() => setSelectedSlot(slot.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-semibold text-white">{slot.name}</h5>
                  <span className="text-yellow-400 font-bold">₹{slot.price}</span>
                </div>
                <p className="text-purple-300 text-sm mb-2">{slot.description}</p>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">{slot.duration}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {serviceType === 'coaching' && (
          <div className="space-y-4 mb-6">
            <h4 className="text-lg font-semibold text-purple-300">Choose Session Duration:</h4>
            {coachingSlots.map((slot) => (
              <div
                key={slot.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  selectedSlot === slot.id
                    ? 'border-yellow-400 bg-yellow-400/10'
                    : 'border-purple-500/30 bg-black/20 hover:border-purple-400'
                }`}
                onClick={() => setSelectedSlot(slot.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <h5 className="font-semibold text-white">{slot.name}</h5>
                  <span className="text-yellow-400 font-bold">₹{slot.price}</span>
                </div>
                <p className="text-purple-300 text-sm">{slot.description}</p>
              </div>
            ))}
          </div>
        )}

        {!['tarot', 'coaching'].includes(serviceType) && (
          <div className="mb-6">
            <div className="p-4 rounded-lg border border-purple-500/30 bg-black/20">
              <h5 className="font-semibold text-white mb-2">{serviceName} Session</h5>
              <p className="text-purple-300 text-sm mb-2">
                {serviceType === 'palm' && 'Explore your destiny through sacred palm line analysis'}
                {serviceType === 'karma' && (
                  <>
                    Curious about the karmic patterns holding you back?<br/>
                    Get your Pending Karma Analysis done and understand the hidden lessons your soul is still carrying
                  </>
                )}
                {serviceType === 'crystal' && 'Personalized crystal healing session with energy alignment'}
              </p>
              <div className="flex justify-between">
                <span className="text-gray-400">
                  {serviceType === 'palm' && '20 mins'}
                  {serviceType === 'karma'}
                  {serviceType === 'crystal' }
                </span>
                <span className="text-yellow-400 font-bold">
                  {serviceType === 'palm' && '₹999'}
                  {serviceType === 'karma' && '₹999'}
                  {serviceType === 'crystal' && 'Varies'}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleBooking}
          className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
        >
          <MessageCircle className="w-5 h-5 mr-2" />
          Book via WhatsApp
        </button>
      </div>
    </div>
  );
};