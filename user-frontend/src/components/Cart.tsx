import React from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (crystalId: string, quantity: number) => void;
  onRemoveItem: (crystalId: string) => void;
  onProceedToCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout
}) => {
  const total = items.reduce((sum, item) => sum + (item.form.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto border border-purple-500/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-white flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2" />
            Your Cart
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-gray-300 text-center py-8">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.crystal.id + '-' + item.form.name} className="bg-black/30 rounded-lg p-4 border border-purple-500/20 flex items-center space-x-4">
                  <img 
                    src={item.crystal.image} 
                    alt={item.crystal.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <div className="mb-2">
                      <h4 className="text-white font-bold text-lg">{item.crystal.name}</h4>
                      <span className="text-xs text-yellow-400 font-semibold tracking-wide block">Form: {item.form.name}</span>
                      <p className="text-purple-300 text-sm mt-1">{item.crystal.purpose}</p>
                      <span className="text-yellow-400 font-semibold text-base block mt-1">Price: ₹{item.form.price}</span>
                      <span className="text-green-300 font-semibold text-base block mt-1">Subtotal: ₹{item.form.price * item.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => onUpdateQuantity(item.crystal.id + '-' + item.form.name, Math.max(0, item.quantity - 1))}
                          className="bg-purple-600 hover:bg-purple-700 p-1 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-white px-3 text-lg font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.crystal.id + '-' + item.form.name, item.quantity + 1)}
                          className="bg-purple-600 hover:bg-purple-700 p-1 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(item.crystal.id + '-' + item.form.name)}
                        className="text-red-400 hover:text-red-300 text-sm border border-red-400/30 rounded px-4 py-1 ml-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-purple-500/30 pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-bold text-white">Total:</span>
                <span className="text-2xl font-bold text-yellow-400">₹{total}</span>
              </div>
              <button 
                onClick={onProceedToCheckout}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 py-3 rounded-lg font-semibold transition-all duration-300"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
