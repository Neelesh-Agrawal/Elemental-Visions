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
  const subtotal = items.reduce((sum, item) => sum + (item.form.price * item.quantity), 0);
  const hasCrystals = items.some(item => item.type === 'crystal');
  const shippingCharge = hasCrystals ? 150 : 0;
  const total = subtotal + shippingCharge;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-navy to-plum rounded-2xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto border border-plum/30">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-sand flex items-center">
            <ShoppingCart className="w-6 h-6 mr-2" />
            Your Cart
          </h3>
          <button onClick={onClose} className="text-navy/60 hover:text-sand">
            <X className="w-6 h-6" />
          </button>
        </div>

        {items.length === 0 ? (
          <p className="text-sand/80 text-center py-8">Your cart is empty</p>
        ) : (
          <>
            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.crystal.id + '-' + item.form.name} className="bg-navy/30 rounded-lg p-4 border border-plum/20 flex items-center space-x-4">
                  <img 
                    src={item.crystal.image} 
                    alt={item.crystal.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 flex flex-col justify-between h-full">
                    <div className="mb-2">
                      <h4 className="text-sand font-bold text-lg">{item.crystal.name}</h4>
                      <span className="text-xs text-teal font-semibold tracking-wide block">Form: {item.form.name}</span>
                      <p className="text-sand/70 text-sm mt-1">{item.crystal.purpose}</p>
                      <span className="text-teal font-semibold text-base block mt-1">
                        Price: ₹{item.form.price}{item.form.name === 'Raw' ? ' onwards' : ''}
                      </span>
                      <span className="text-teal font-semibold text-base block mt-1">Subtotal: ₹{item.form.price * item.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => onUpdateQuantity(item.crystal.id + '-' + item.form.name, Math.max(0, item.quantity - 1))}
                          className="bg-plum hover:bg-plum/90 p-1 rounded"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="text-sand px-3 text-lg font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.crystal.id + '-' + item.form.name, item.quantity + 1)}
                          className="bg-plum hover:bg-plum/90 p-1 rounded"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => onRemoveItem(item.crystal.id + '-' + item.form.name)}
                        className="text-plum hover:text-plum/80 text-sm border border-plum/30 rounded px-4 py-1 ml-4"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-plum/30 pt-4">
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg text-sand">Subtotal:</span>
                  <span className="text-lg text-sand">₹{subtotal}</span>
                </div>
                {hasCrystals && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-sand/70">Shipping within India:</span>
                    <span className="text-sm text-sand/70">₹{shippingCharge}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-plum/30 pt-2">
                  <span className="text-xl font-bold text-sand">Total:</span>
                  <span className="text-2xl font-bold text-teal">₹{total}</span>
                </div>
              </div>
              <button 
                onClick={onProceedToCheckout}
                className="w-full bg-gradient-to-r from-teal to-navy hover:opacity-90 py-3 rounded-lg font-semibold transition-all duration-300"
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
