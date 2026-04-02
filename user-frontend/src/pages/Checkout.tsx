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
    const subtotal = cart.reduce((sum, item) => sum + (item.form.price * item.quantity), 0);
    const hasCrystals = cart.some(item => item.type === 'crystal');
    const shippingCharge = hasCrystals ? 150 : 0;
    return subtotal + shippingCharge;
  };

  // If cart is empty, show empty state
  const EmptyCart = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-teal mb-4">Your Cart is Empty</h1>
        <p className="mb-8 text-lg text-navy/75">
          Add some services or crystals to your cart to proceed with checkout.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate('/services')}
            className="rounded-lg bg-gradient-to-r from-teal to-plum px-6 py-3 font-semibold text-sand transition-all duration-300 hover:opacity-90"
          >
            Browse Services
          </button>
          <button
            onClick={() => navigate('/crystals')}
            className="rounded-lg bg-gradient-to-r from-plum to-navy px-6 py-3 font-semibold text-sand transition-all duration-300 hover:opacity-90"
          >
            Browse Crystals
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-sand text-navy overflow-x-hidden">
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
            onOrderComplete={(orderId: number) => {
              setIsCheckoutOpen(false);
              navigate('/payment', { state: { items: cart, total: getTotalPrice(), order_id: orderId } });
            }}
          />
        </>
      )}
      
      <Footer />
    </div>
  );
};

export default Checkout;
