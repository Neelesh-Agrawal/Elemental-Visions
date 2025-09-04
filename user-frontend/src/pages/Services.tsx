import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import Cart from '../components/Cart';
import CheckoutForm from '../components/CheckoutForm';

import ServiceBookingModal from '../components/ServiceBookingModal';
import ServiceBookingForm, { ServiceBookingData } from '../components/ServiceBookingForm';
import { ChevronRight, Star, Eye, Sparkles, Heart, Gem } from 'lucide-react';
import { CartItem, ServiceSession } from '../types';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    icon: <Star className="w-8 h-8" />,
    title: "Tarot Readings",
    description: "Navigate life's crossroads with symbolic guidance. Choose from different question packages with personalized spreads.",
    basePrice: "From ₹600",
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
    basePrice: "From ₹299",
    duration: "Varies",
    type: 'crystal'
  }
];

const Services: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [isServiceBookingModalOpen, setIsServiceBookingModalOpen] = useState(false);
  const [isServiceBookingFormOpen, setIsServiceBookingFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({ type: '', name: '' });
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<{
    serviceType: string;
    serviceName: string;
    session: ServiceSession;
  } | null>(null);
  const navigate = useNavigate();

  // Debug: Log cart changes
  useEffect(() => {
    console.log('🛒 Cart updated:', cart);
    console.log('🛒 Cart length:', cart.length);
  }, [cart]);

  // Debug: Monitor service booking modal state changes
  useEffect(() => {
    if (isServiceBookingModalOpen) {
      console.log('🚨 Service booking modal opened:', {
        serviceType: selectedService.type,
        serviceName: selectedService.name
      });
    }
  }, [isServiceBookingModalOpen, selectedService]);

  const handleBookService = (type: string, title: string) => {
    console.log('📋 Opening service booking modal for:', { type, title });
    setSelectedService({ type, name: title });
    setIsServiceBookingModalOpen(true);
  };

  // Handle service booking (Book Now)
  const handleServiceBookNow = (serviceType: string, serviceName: string, session: ServiceSession) => {
    console.log('📅 Service book now called with:', { serviceType, serviceName, session });
    
    setSelectedServiceForBooking({
      serviceType,
      serviceName,
      session
    });
    
    setIsServiceBookingModalOpen(false);
    setIsServiceBookingFormOpen(true);
  };

  // Handle service booking form submission
  const handleServiceBookingSubmit = async (bookingData: ServiceBookingData) => {
    console.log('📦 Service booking submission:', bookingData);
    
    try {
      // Prepare service booking data for backend
      const orderData = {
        service_name: bookingData.serviceName,
        session_name: bookingData.selectedSession.name,
        quantity: 1,
        unit_price: bookingData.total_amount
      };

      console.log('📦 Preparing service booking:', {
        customer: {
          customer_name: bookingData.customer_name,
          email: bookingData.email,
          phone: bookingData.phone
        },
        items: [orderData],
        total: bookingData.total_amount
      });

      // Call API endpoint for service bookings
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/service-bookings/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_name: bookingData.customer_name,
          email: bookingData.email,
          phone: bookingData.phone,
          items: [orderData],
          total_amount: bookingData.total_amount,
          status: 'pending'
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to place service booking.');
      }

      const data = await response.json();
      console.log('✅ Service booking created:', data);

      // Close form and redirect to payment
      setIsServiceBookingFormOpen(false);
      
      // Navigate to payment with service booking data
      navigate('/payment', { 
        state: { 
          bookingData: {
            customer: {
              customer_name: bookingData.customer_name,
              email: bookingData.email,
              phone: bookingData.phone
            },
            service: {
              name: bookingData.serviceName,
              session: bookingData.selectedSession.name,
              duration: bookingData.selectedSession.duration,
              price: bookingData.total_amount
            },
            total: bookingData.total_amount,
            booking_id: data.id || 'temp-' + Date.now()
          },
          isService: true
        } 
      });
      
    } catch (error) {
      console.error('❌ Service booking error:', error);
      alert(`Error placing service booking: ${error.message}. Please try again.`);
    }
  };



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
  };





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

      {/* Service Booking Modal - New booking flow */}
      {isServiceBookingModalOpen && (
        <ServiceBookingModal
          key={`${selectedService.type}-${selectedService.name}-${isServiceBookingModalOpen}`}
          isOpen={isServiceBookingModalOpen}
          onClose={() => setIsServiceBookingModalOpen(false)}
          serviceType={selectedService.type}
          serviceName={selectedService.name}
          onBookNow={handleServiceBookNow}
        />
      )}

      {/* Service Booking Form */}
      {isServiceBookingFormOpen && selectedServiceForBooking && (
        <ServiceBookingForm
          isOpen={isServiceBookingFormOpen}
          onClose={() => setIsServiceBookingFormOpen(false)}
          serviceType={selectedServiceForBooking.serviceType}
          serviceName={selectedServiceForBooking.serviceName}
          selectedSession={selectedServiceForBooking.session}
          onProceedToCheckout={handleServiceBookingSubmit}
        />
      )}

      {/* Debug info for troubleshooting */}
      <div className="fixed top-32 right-4 bg-green-900/80 text-white p-2 rounded text-xs z-40 max-w-xs">
        <div>Service Modal: {isServiceBookingModalOpen.toString()}</div>
        <div>Booking Form: {isServiceBookingFormOpen.toString()}</div>
        <div>Service Type: {selectedService.type}</div>
        <div>Service Name: {selectedService.name}</div>
        <div>Selected for Booking: {selectedServiceForBooking ? 'YES' : 'NO'}</div>
      </div>

      <section id="services" className="py-20 px-6 sm:px-4" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent font-unbounded drop-shadow-lg">
              Sacred Services
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Each service is crafted to guide you toward clarity, healing, and transformation
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {services.map((service, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 glass card-shadow p-6 sm:p-8 border border-purple-500/30 hover:border-yellow-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group flex flex-col justify-between"
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
                      handleBookService(service.type, service.title);
                    }}
                    className="w-full bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
                  >
                    Select Service
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