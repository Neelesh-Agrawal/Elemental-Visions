import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import Cart from '../components/Cart';
import CheckoutForm from '../components/CheckoutForm';
import { CartItem } from '../types';
import { useNavigate, useLocation } from 'react-router-dom';

const Checkout: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get cart data from navigation state if available
  useEffect(() => {
    if (location.state && location.state.cartItems) {
      setCart(location.state.cartItems);
    }
  }, [location.state]);

  const updateCartQuantity = (compositeId: string, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(compositeId);
      return;
    }

    setCart(prevCart =>
      prevCart.map(item => {
        const itemCompositeId = `${item.crystal.id}-${item.form.name}`;
        return itemCompositeId === compositeId
          ? { ...item, quantity }
          : item;
      })
    );
  };

  const removeFromCart = (compositeId: string) => {
    setCart(prevCart => 
      prevCart.filter(item => {
        const itemCompositeId = `${item.crystal.id}-${item.form.name}`;
        return itemCompositeId !== compositeId;
      })
    );
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.form.price * item.quantity), 0);
  };

  // If cart is empty, show empty state
  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-yellow-400 mb-4">Your Cart is Empty</h1>
        <p className="text-lg text-purple-200 mb-8">
          Add some services or crystals to your cart to proceed with checkout.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/services')}
            className="bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Browse Services
          </button>
          <button
            onClick={() => navigate('/crystals')}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
          >
            Browse Crystals
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white overflow-x-hidden">
      <Navbar cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />
      
      {cart.length === 0 ? (
        <EmptyCart />
      ) : (
        <>
          <Cart
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            items={cart}
            onUpdateQuantity={updateCartQuantity}
            onRemoveItem={removeFromCart}
            onProceedToCheckout={() => {
              setIsCartOpen(false);
              setIsCheckoutOpen(true);
            }}
          />
          
          <CheckoutForm
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
            items={cart}
            total={getTotalPrice()}
            onOrderComplete={() => {
              setIsCheckoutOpen(false);
              navigate('/payment', { state: { items: cart, total: getTotalPrice() } });
            }}
          />
        </>
      )}
      
      <Footer />
    </div>
  );
};

export default Checkout;