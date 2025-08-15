<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import BookingModal from '../components/BookingModal';
import ServiceCheckoutForm from '../components/ServiceCheckoutForm';
=======
import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import Cart from '../components/Cart';
import CheckoutForm from '../components/CheckoutForm';
import BookingModal from '../components/BookingModal';
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
import { ChevronRight, Star, Eye, Sparkles, Heart, Gem } from 'lucide-react';
import { CartItem, ServiceSession } from '../types';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    icon: <Star className="w-8 h-8" />,
    title: "Tarot Readings",
    description: "Navigate life's crossroads with symbolic guidance. Choose from different question packages with personalized spreads.",
<<<<<<< HEAD
    basePrice: "From ₹699",
=======
    basePrice: "From ₹600",
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
    duration: "10-30 mins",
    type: 'tarot'
  },
  {
    icon: <Eye className="w-8 h-8" />,
    title: "Palm Reading",
    description: "Your hands reveal your destiny. Explore innate gifts and future pathways through sacred line analysis.",
    basePrice: "₹999",
    duration: "20 mins",
    type: 'palm'
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: "Karma Analysis",
    description: "Curious about the karmic patterns holding you back?\nGet your Pending Karma Analysis done and understand the hidden lessons your soul is still carrying",
    basePrice: "₹999",
<<<<<<< HEAD
    duration: "30 mins",
=======
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
    type: 'karma'
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Life Coaching",
    description: '"When your mind is clear and your aura is light, your path naturally opens." Book your session today and start your transformation.',
    basePrice: "From ₹999",
    duration: "15-30 mins",
    type: 'coaching'
  },
  {
    icon: <Gem className="w-8 h-8" />,
    title: "Crystal Healing",
    description: "In a Crystal Healing Session, I use intuitively selected crystals to cleanse, balance, and activate your energy centers (chakras).\nThis gentle yet transformative modality helps you:\n\n🔮 Release emotional blocks\n💖 Heal past traumas\n🧘‍♀️ Regain energetic balance\n🌈 Strengthen aura and spiritual connection\n🌿 Feel lighter, clearer, and more aligned",
<<<<<<< HEAD
    basePrice: "From ₹800",
    duration: "20-40 mins",
=======
    duration: "Varies",
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
    type: 'crystal'
  }
];

const Services: React.FC = () => {
<<<<<<< HEAD
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isServiceCheckoutOpen, setIsServiceCheckoutOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({ type: '', name: '' });
  const [selectedServiceData, setSelectedServiceData] = useState<CartItem | null>(null);
  const navigate = useNavigate();

  // Handle service booking from modal
  const handleBookService = (serviceType: string, serviceName: string, session: ServiceSession) => {
    console.log('🎯 handleBookService called with:', { serviceType, serviceName, session });
=======
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({ type: '', name: '' });
  const navigate = useNavigate();

  // Debug: Log cart changes
  useEffect(() => {
    console.log('🛒 Cart updated:', cart);
    console.log('🛒 Cart length:', cart.length);
  }, [cart]);

  // Debug: Monitor function when modal state changes
  useEffect(() => {
    if (isBookingModalOpen) {
      console.log('🚨 Modal opened - checking handleAddToCart:');
      console.log('🚨 Function exists:', !!handleAddToCart);
      console.log('🚨 Function type:', typeof handleAddToCart);
      console.log('🚨 Function reference:', handleAddToCart);
      console.log('🚨 Selected service:', selectedService);
    }
  }, [isBookingModalOpen, handleAddToCart, selectedService]);

  const handleBookService = (type: string, title: string) => {
    console.log('📋 Opening booking modal for:', { type, title });
    console.log('📋 handleAddToCart function before setting modal:', typeof handleAddToCart, handleAddToCart);
    setSelectedService({ type, name: title });
    setIsBookingModalOpen(true);
  };

  // Define handleAddToCart function as a regular function first
  const handleAddToCartInternal = (serviceType: string, serviceName: string, session: ServiceSession) => {
    console.log('🔍 handleAddToCart called with:', { serviceType, serviceName, session });
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
    
    if (!serviceType || !serviceName || !session) {
      console.error('❌ Missing required parameters:', { serviceType, serviceName, session });
      alert('Invalid service data. Please try again.');
      return;
    }
    
    try {
<<<<<<< HEAD
      // Convert price to number if it's a string
=======
      // Convert price to number
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
      const price = typeof session.price === 'string' ? 
        parseInt(session.price.replace(/[^\d]/g, '')) : 
        Number(session.price);
      
      if (isNaN(price) || price <= 0) {
        console.error('❌ Invalid price:', session.price);
        alert('Invalid price. Please try again.');
        return;
      }
      
      console.log('💰 Processed price:', price);

<<<<<<< HEAD
      // Create service item for checkout
      const serviceItem: CartItem = {
=======
      const newItem: CartItem = {
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
        crystal: {
          id: `service-${serviceType}-${session.id}`,
          name: serviceName,
          image: '/api/placeholder/300/200',
          purpose: session.name,
<<<<<<< HEAD
          description: session.description || `${serviceName} - ${session.name}`
        },
        form: {
          name: session.duration || 'Standard Session',
=======
          description: session.description
        },
        form: {
          name: session.duration || 'Standard',
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
          price: price
        },
        quantity: 1,
        type: 'service'
      };

<<<<<<< HEAD
      console.log('🆕 Service item created:', serviceItem);

      // Store the service data and open checkout
      setSelectedServiceData(serviceItem);
      setIsBookingModalOpen(false);
      setIsServiceCheckoutOpen(true);
      
      console.log('✅ Service booking flow started');
      
    } catch (error) {
      console.error('❌ Error processing service booking:', error);
      alert('Error processing service booking. Please try again.');
    }
  };

  const openBookingModal = (type: string, title: string) => {
    console.log('📋 Opening booking modal for:', { type, title });
    setSelectedService({ type, name: title });
    setIsBookingModalOpen(true);
  };

  const handleServiceOrderComplete = () => {
    console.log('🎉 Service order completed with data:', selectedServiceData);
    if (selectedServiceData) {
      setIsServiceCheckoutOpen(false);
      navigate('/payment', { 
        state: { 
          items: [selectedServiceData], 
          total: selectedServiceData.form.price,
          orderType: 'service' 
        } 
      });
    }
=======
      console.log('🆕 New item created:', newItem);

      setCart(prevCart => {
        console.log('📦 Previous cart:', prevCart);
        
        const existingItemIndex = prevCart.findIndex(
          item => item.crystal.id === newItem.crystal.id && item.form.name === newItem.form.name
        );

        console.log('🔍 Existing item index:', existingItemIndex);

        let updatedCart;
        if (existingItemIndex > -1) {
          updatedCart = prevCart.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          console.log('➕ Updated existing item in cart:', updatedCart);
        } else {
          updatedCart = [...prevCart, newItem];
          console.log('🆕 Added new item to cart:', updatedCart);
        }
        
        return updatedCart;
      });

      // Close modal and show success
      setIsBookingModalOpen(false);
      console.log('✅ Item should be added to cart');
      
      // Show success message
      setTimeout(() => {
        alert(`✅ ${serviceName} - ${session.name} added to cart!`);
      }, 100);
      
    } catch (error) {
      console.error('❌ Error adding to cart:', error);
      alert('Error adding item to cart. Please try again.');
    }
  };

  // Now memoize it with useCallback
  const handleAddToCart = useCallback(handleAddToCartInternal, [setCart, setIsBookingModalOpen]);

  const updateCartQuantity = (compositeId: string, quantity: number) => {
    console.log('🔢 Updating cart quantity:', { compositeId, quantity });
    
    if (quantity === 0) {
      removeFromCart(compositeId);
      return;
    }

    setCart(prevCart => {
      const updated = prevCart.map(item => {
        const itemCompositeId = `${item.crystal.id}-${item.form.name}`;
        return itemCompositeId === compositeId
          ? { ...item, quantity }
          : item;
      });
      console.log('📊 Cart after quantity update:', updated);
      return updated;
    });
  };

  const removeFromCart = (compositeId: string) => {
    console.log('🗑️ Removing from cart:', compositeId);
    
    setCart(prevCart => {
      const filtered = prevCart.filter(item => {
        const itemCompositeId = `${item.crystal.id}-${item.form.name}`;
        return itemCompositeId !== compositeId;
      });
      console.log('🗑️ Cart after removal:', filtered);
      return filtered;
    });
  };

  const getTotalPrice = () => {
    const total = cart.reduce((sum, item) => sum + (item.form.price * item.quantity), 0);
    console.log('💰 Total price calculated:', total);
    return total;
  };

  const handleCartClick = () => {
    console.log('🛒 Cart clicked, current cart:', cart);
    setIsCartOpen(true);
  };

  const handleProceedToCheckout = () => {
    console.log('✅ Proceeding to checkout with cart:', cart);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    console.log('🎉 Order completed with cart:', cart);
    setIsCheckoutOpen(false);
    navigate('/payment', { state: { items: cart, total: getTotalPrice() } });
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
  };

  const handleCloseBookingModal = () => {
    console.log('📋 Closing booking modal');
    setIsBookingModalOpen(false);
  };

<<<<<<< HEAD
  const handleCloseServiceCheckout = () => {
    console.log('📋 Closing service checkout');
    setIsServiceCheckoutOpen(false);
    setSelectedServiceData(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white overflow-x-hidden">
      <Navbar cartCount={0} onCartClick={() => {}} />

      {/* BookingModal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBookingModal}
        serviceType={selectedService.type}
        serviceName={selectedService.name}
        onBookService={handleBookService}
      />

      {/* ServiceCheckoutForm */}
      <ServiceCheckoutForm
        isOpen={isServiceCheckoutOpen}
        onClose={handleCloseServiceCheckout}
        items={selectedServiceData ? [selectedServiceData] : []}
        total={selectedServiceData ? selectedServiceData.form.price : 0}
        onOrderComplete={handleServiceOrderComplete}
      />

=======
  // Debug: Log the function reference when component renders
  console.log('🔧 Services component render - handleAddToCart function:', handleAddToCart);
  console.log('🔧 Services component render - typeof handleAddToCart:', typeof handleAddToCart);
  console.log('🔧 Services component render - function exists:', !!handleAddToCart);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white overflow-x-hidden">
      <Navbar cartCount={cart.length} onCartClick={handleCartClick} />
      
      {/* Debug info - remove in production */}
      <div className="fixed top-20 right-4 bg-black/80 text-white p-2 rounded text-xs z-40">
        Cart: {cart.length} items
      </div>
      
      <Cart
        isOpen={isCartOpen}
        onClose={() => {
          console.log('🛒 Closing cart');
          setIsCartOpen(false);
        }}
        items={cart}
        onUpdateQuantity={updateCartQuantity}
        onRemoveItem={removeFromCart}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <CheckoutForm
        isOpen={isCheckoutOpen}
        onClose={() => {
          console.log('📋 Closing checkout');
          setIsCheckoutOpen(false);
        }}
        items={cart}
        total={getTotalPrice()}
        onOrderComplete={handleOrderComplete}
      />

      {/* BookingModal with explicit validation before rendering */}
      {isBookingModalOpen && handleAddToCart && (
        <BookingModal
          key={`${selectedService.type}-${selectedService.name}-${isBookingModalOpen}`}
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          serviceType={selectedService.type}
          serviceName={selectedService.name}
          onAddToCart={handleAddToCart}
        />
      )}

      {/* Show error if function is missing */}
      {isBookingModalOpen && !handleAddToCart && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-red-900/90 rounded-2xl p-6 max-w-lg w-full border border-red-500/50">
            <h3 className="text-2xl font-bold text-white mb-4">⚠️ Function Error</h3>
            <p className="text-red-200 mb-4">
              The add to cart function is not available. This is a development issue.
            </p>
            <button
              onClick={() => setIsBookingModalOpen(false)}
              className="w-full bg-red-600 hover:bg-red-700 py-2 px-4 rounded font-bold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Debug info for troubleshooting */}
      <div className="fixed top-32 right-4 bg-red-900/80 text-white p-2 rounded text-xs z-40 max-w-xs">
        <div>Modal Open: {isBookingModalOpen.toString()}</div>
        <div>Service Type: {selectedService.type}</div>
        <div>Service Name: {selectedService.name}</div>
        <div>Handler Type: {typeof handleAddToCart}</div>
        <div>Handler Exists: {handleAddToCart ? 'YES' : 'NO'}</div>
        <div>Function Name: {handleAddToCart?.name || 'Anonymous'}</div>
        <div>Function Valid: {typeof handleAddToCart === 'function' ? 'YES' : 'NO'}</div>
      </div>

>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
      <section id="services" className="py-20 px-4" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent font-unbounded drop-shadow-lg">
              Sacred Services
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Each service is crafted to guide you toward clarity, healing, and transformation
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 glass card-shadow p-8 border border-purple-500/30 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group flex flex-col justify-between"
                data-aos="zoom-in"
              >
                <div className="text-yellow-400 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{service.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed whitespace-pre-line">{service.description}</p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-yellow-400 font-semibold text-lg">{service.basePrice}</span>
                    {service.duration && <span className="text-purple-300 text-sm">{service.duration}</span>}
                  </div>
                  <button 
                    onClick={() => {
                      console.log('🎯 Service button clicked:', service.type, service.title);
<<<<<<< HEAD
                      openBookingModal(service.type, service.title);
                    }}
                    className="w-full bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
                  >
                    Book Now
=======
                      handleBookService(service.type, service.title);
                    }}
                    className="w-full bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
                  >
                    Select Service
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Services;