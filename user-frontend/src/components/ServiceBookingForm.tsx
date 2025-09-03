import React, { useState } from 'react';
import { ServiceSession } from '../types';

interface ServiceBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
  serviceName: string;
  selectedSession: ServiceSession;
  onProceedToCheckout: (bookingData: ServiceBookingData) => void;
}

export interface ServiceBookingData {
  customer_name: string;
  email: string;
  phone: string;
  serviceType: string;
  serviceName: string;
  selectedSession: ServiceSession;
  total_amount: number;
}

const ServiceBookingForm: React.FC<ServiceBookingFormProps> = ({
  isOpen,
  onClose,
  serviceType,
  serviceName,
  selectedSession,
  onProceedToCheckout
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.customer_name.trim()) {
        throw new Error('Please enter your full name');
      }
      if (!formData.email.trim()) {
        throw new Error('Please enter your email address');
      }
      if (!formData.phone.trim() || formData.phone.length < 10) {
        throw new Error('Please enter a valid phone number');
      }

      // Convert price to number
      const price = typeof selectedSession.price === 'string' ? 
        parseInt(selectedSession.price.replace(/[^\d]/g, '')) : 
        Number(selectedSession.price);

      const bookingData: ServiceBookingData = {
        customer_name: formData.customer_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        serviceType,
        serviceName,
        selectedSession,
        total_amount: price
      };

      console.log('📦 Preparing service booking data:', bookingData);
      
      // Show success message and proceed to payment
      onProceedToCheckout(bookingData);
      
    } catch (error) {
      console.error('❌ Service booking form error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSessionIcon = () => {
    switch (serviceType) {
      case 'tarot': return '🔮';
      case 'palm': return '✋';
      case 'karma': return '🔄';
      case 'coaching': return '💪';
      case 'crystal': return '💎';
      default: return '🌟';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-2">{getSessionIcon()}</span>
            Book Your Service
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
        </div>

        {/* Service Summary */}
        <div className="bg-black/20 rounded-lg p-4 border border-purple-500/20 mb-6">
          <h4 className="text-xl font-bold text-yellow-400 mb-3">Service Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-purple-200">Service:</span>
              <span className="text-white font-semibold">{serviceName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-200">Session:</span>
              <span className="text-white font-semibold">{selectedSession.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-purple-200">Duration:</span>
              <span className="text-purple-300">{selectedSession.duration}</span>
            </div>
            <div className="flex justify-between items-center border-t border-purple-500/30 pt-2 mt-2">
              <span className="text-purple-200 text-lg">Total:</span>
              <span className="text-yellow-400 font-bold text-xl">₹{selectedSession.price}</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="customer_name"
              placeholder="Enter your full name"
              value={formData.customer_name}
              onChange={handleChange}
              className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-purple-200 text-sm font-medium mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
              isSubmitting 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 transform hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Proceed to Checkout'
            )}
          </button>
        </form>

        {/* Info Note */}
        <div className="mt-4 p-3 bg-blue-900/30 rounded-lg border border-blue-500/30">
          <p className="text-blue-200 text-sm">
            <strong>Note:</strong> After payment confirmation, we will contact you within 24 hours to schedule your session at your preferred time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingForm;
