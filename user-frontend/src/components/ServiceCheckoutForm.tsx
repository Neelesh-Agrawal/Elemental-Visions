import React, { useState } from 'react';
import { CartItem } from '../types';

interface ServiceCheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onOrderComplete: () => void;
}

const ServiceCheckoutForm: React.FC<ServiceCheckoutFormProps> = ({
  isOpen,
  onClose,
  items,
  total,
  onOrderComplete
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
      // Prepare service booking data
      const orderItems = items.map(item => ({
        service_name: item.crystal.name,
        session_name: item.crystal.purpose, // This contains the session name
        session_duration: item.form.name,
        quantity: item.quantity,
        unit_price: item.form.price,
      }));

      // Call API endpoint for service bookings
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/service-bookings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: formData.customer_name,
          email: formData.email,
          phone: formData.phone,
          items: orderItems,
          total_amount: total,
          status: 'pending',
          booking_type: 'service'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to place service booking.');
      }

      await response.json();

      // Show success message and proceed to payment
      onOrderComplete();
      
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-navy to-plum rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-plum/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-sand">Book Your Service</h3>
          <button onClick={onClose} className="text-navy/60 hover:text-sand text-2xl font-bold">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sand/90 text-sm font-medium mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="customer_name"
              placeholder="Enter your full name"
              value={formData.customer_name}
              onChange={handleChange}
              className="w-full bg-navy/30 border border-plum/30 rounded-lg px-4 py-3 text-sand placeholder-navy/40 focus:border-teal focus:outline-none transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sand/90 text-sm font-medium mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-navy/30 border border-plum/30 rounded-lg px-4 py-3 text-sand placeholder-navy/40 focus:border-teal focus:outline-none transition-colors"
              required
            />
          </div>
          
          <div>
            <label className="block text-sand/90 text-sm font-medium mb-2">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-navy/30 border border-plum/30 rounded-lg px-4 py-3 text-sand placeholder-navy/40 focus:border-teal focus:outline-none transition-colors"
              required
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
            />
          </div>

          {/* Service Summary */}
          <div className="bg-black/20 rounded-lg p-4 border border-plum/20">
            <h4 className="text-xl font-bold text-teal mb-3">Service Summary</h4>
            <ul className="divide-y divide-plum/20">
              {items.map((item, idx) => (
                <li key={`${item.crystal.id}-${idx}`} className="py-3 flex items-center justify-between">
                  <div className="flex-1">
                    <div className="font-semibold text-sand text-lg">{item.crystal.name}</div>
                    <div className="text-teal text-sm">{item.crystal.purpose}</div>
                    <div className="text-sand/70 text-xs">{item.form.name}</div>
                  </div>
                  <div className="text-teal font-bold text-lg ml-4">
                    ₹{item.form.price}{item.form.name === 'Raw' ? ' onwards' : ''}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Total */}
          <div className="bg-gradient-to-r from-sand/15 to-teal/10 rounded-lg p-4 border-2 border-teal/30">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold text-sand">Total Amount:</span>
              <span className="text-2xl font-bold text-teal">₹{total}</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-300 ${
              isSubmitting 
                ? 'bg-navy/50 cursor-not-allowed' 
                : 'bg-gradient-to-r from-teal to-navy hover:opacity-90 transform hover:scale-105'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              'Proceed to Payment'
            )}
          </button>
        </form>

        {/* Info Note */}
        <div className="mt-4 p-3 bg-navy/40 rounded-lg border border-teal/30">
          <p className="text-sand/90 text-sm">
            <strong>Note:</strong> After payment confirmation, we will contact you within 24 hours to schedule your session at your preferred time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceCheckoutForm;