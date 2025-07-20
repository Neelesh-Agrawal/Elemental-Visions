import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import Cart from '../components/Cart';
import CheckoutForm from '../components/CheckoutForm';
import { CartItem } from '../types';

const Checkout: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]); // You may want to lift this state up for global cart
  const [isCartOpen, setIsCartOpen] = useState(true);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const updateCartQuantity = (compositeId: string, quantity: number) => {
    const [crystalId, formName] = compositeId.split('-');
    if (quantity === 0) {
      removeFromCart(compositeId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.crystal.id === crystalId && item.form.name === formName
          ? { ...item, quantity }
          : item
      )
    );
  };

  const removeFromCart = (compositeId: string) => {
    const [crystalId, formName] = compositeId.split('-');
    setCart(prevCart => prevCart.filter(item => !(item.crystal.id === crystalId && item.form.name === formName)));
  };

  const getTotalPrice = () => {
    return cart.reduce((sum, item) => sum + (item.form.price * item.quantity), 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white overflow-x-hidden">
      <Navbar cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />
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
          // You may want to navigate to payment page here
        }}
      />
      <Footer />
    </div>
  );
};

export default Checkout;
