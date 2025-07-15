import React, { useState } from 'react';
import { X, CreditCard } from 'lucide-react';
import { CartItem, Order } from '../types';
import { supabase } from '../lib/supabase';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onOrderComplete: () => void;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  isOpen,
  onClose,
  items,
  total,
  onOrderComplete
}) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const order: Order = {
        ...formData,
        items,
        total_amount: total,
        status: 'pending'
      };

      const { error } = await supabase
        .from('orders')
        .insert([order]);

      if (error) throw error;

      // Show payment modal instead of closing
      setShowPayment(true);
      onOrderComplete();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error processing order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Payment Modal */}
      {showPayment ? (
        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30 flex flex-col md:flex-row gap-8">
          {/* Left: QR and UPI */}
          <div className="flex-1 flex flex-col items-center justify-center border-r border-purple-500/30 pr-0 md:pr-8 mb-8 md:mb-0">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=yourname@upi" alt="UPI QR Code" className="w-48 h-48 rounded-xl shadow-lg border-2 border-yellow-400 mb-4" />
            <div className="text-center">
              <div className="text-lg text-white font-bold mb-1">Scan & Pay</div>
              <div className="text-yellow-400 font-mono text-base">yourname@upi</div>
              <div className="text-xs text-purple-200 mt-1">(UPI ID)</div>
            </div>
          </div>
          {/* Right: Order Summary */}
          <div className="flex-1 flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-yellow-400 mb-2">Order Summary</h3>
              <ul className="divide-y divide-purple-500/20">
                {items.map((item, idx) => (
                  <li key={item.crystal.id + '-' + item.form.name + '-' + idx} className="py-2 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white">{item.crystal.name}</span>
                      <span className="text-xs text-yellow-400 ml-2">({item.form.name})</span>
                      <span className="text-xs text-purple-300 ml-2">x {item.quantity}</span>
                    </div>
                    <div className="text-yellow-300 font-bold">₹{item.form.price * item.quantity}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto border-t border-purple-500/30 pt-4 flex justify-between items-center">
              <span className="text-lg font-bold text-white">Total:</span>
              <span className="text-2xl font-bold text-yellow-400">₹{total}</span>
            </div>
            <button
              onClick={onClose}
              className="mt-6 w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 py-3 rounded-lg font-semibold transition-all duration-300"
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto border border-purple-500/30">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-white flex items-center">
              <CreditCard className="w-6 h-6 mr-2" />
              Checkout
            </h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.customer_name}
                onChange={(e) => setFormData({...formData, customer_name: e.target.value})}
                className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                placeholder="Enter your phone number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-2">
                Delivery Address *
              </label>
              <textarea
                required
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
                rows={3}
                className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors resize-none"
                placeholder="Enter your complete address"
              />
            </div>
            <div className="border-t border-purple-500/30 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-white">Total Amount:</span>
                <span className="text-xl font-bold text-yellow-400">₹{total}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50"
              >
                {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};