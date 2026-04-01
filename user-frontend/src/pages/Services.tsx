import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import Cart from '../components/Cart';
import CheckoutForm from '../components/CheckoutForm';

import ServiceBookingModal from '../components/ServiceBookingModal';
import ServiceBookingForm, { ServiceBookingData } from '../components/ServiceBookingForm';
import ServiceCard from '../components/ServiceCard';
import { Star, Sparkles, Heart, Gem } from 'lucide-react';
import { CartItem, ServiceSession } from '../types';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    icon: <Star className="w-8 h-8" />,
    title: 'ARCANA INSIGHTS',
    description:
      'Arcana refers to the symbolic language of tarot cards. Gain insight into the energies shaping your life and explore possible paths with clarity.',
    basePrice: 'From ₹499',
    duration: 'Varies',
    type: 'arcana'
  },
  {
    icon: <Sparkles className="w-8 h-8" />,
    title: 'KARMIC PATTERN INSIGHTS',
    description:
      'Recognise unresolved cycles that may be shaping your present journey and gain practical clarity to move forward.',
    basePrice: '₹1999',
    duration: '20 mins',
    type: 'karmic'
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'ALIGNMENT SESSIONS',
    description:
      'Align your mindset, intentions, and actions with your goals. This process helps you build clarity and move forward with purpose.',
    basePrice: 'From ₹1699',
    duration: '24 mins/session',
    type: 'alignment'
  },
  {
    icon: <Gem className="w-8 h-8" />,
    title: 'CRYSTALS CURATION',
    description:
      'Personalized crystal selection intuitively aligned to your intentions, challenges, and desired outcomes.',
    basePrice: '₹799',
    duration: 'Varies',
    type: 'crystals'
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

  const handleBookService = (type: string, title: string) => {
    setSelectedService({ type, name: title });
    setIsServiceBookingModalOpen(true);
  };

  // Handle service booking (Book Now)
  const handleServiceBookNow = (serviceType: string, serviceName: string, session: ServiceSession) => {
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
    try {
      // Prepare service booking data for backend
      const orderData = {
        service_name: bookingData.serviceName,
        session_name: bookingData.selectedSession.name,
        quantity: 1,
        unit_price: bookingData.total_amount
      };

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
      
    } catch {
    }
  };



  const updateCartQuantity = (compositeId: string, quantity: number) => {
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
      return updated;
    });
  };

  const removeFromCart = (compositeId: string) => {
    setCart(prevCart => {
      const filtered = prevCart.filter(item => {
        const itemCompositeId = `${item.crystal.id}-${item.form.name}`;
        return itemCompositeId !== compositeId;
      });
      return filtered;
    });
  };

  const getTotalPrice = () => {
    const subtotal = cart.reduce((sum, item) => sum + (item.form.price * item.quantity), 0);
    const hasCrystals = cart.some(item => item.type === 'crystal');
    const shippingCharge = hasCrystals ? 150 : 0;
    const total = subtotal + shippingCharge;
    return total;
  };

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    setIsCheckoutOpen(false);
    navigate('/payment', { state: { items: cart, total: getTotalPrice() } });
  };





  return (
    <div className="min-h-screen bg-sand text-navy overflow-x-hidden">
      <Navbar cartCount={cart.length} onCartClick={handleCartClick} />
      

      
      <Cart
        isOpen={isCartOpen}
        onClose={() => {
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



      <section id="services" className="py-24 px-4 sm:px-6" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <p
              className="mb-3 uppercase tracking-[0.28em] text-teal"
              style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '10px', fontWeight: 500 }}
            >
              What we offer
            </p>
            <h2 className="font-heading px-1 pb-0.5 pt-[0.12em] text-4xl leading-[1.25] text-plum md:text-5xl md:leading-[1.2]">
              Sacred Services
            </h2>
            <div className="mx-auto mt-5 flex items-center justify-center gap-3" style={{ opacity: 0.35 }}>
              <div className="h-px w-16 bg-plum" />
              <div className="h-1.5 w-1.5 rotate-45 bg-plum flex-shrink-0" />
              <div className="h-px w-16 bg-plum" />
            </div>
            <p
              className="mx-auto mt-5 max-w-2xl text-navy/65"
              style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '15px', fontWeight: 300, lineHeight: 1.75 }}
            >
              Each service is crafted to guide you toward clarity, healing, and transformation
            </p>
          </div>

          {/* Cards grid — 4 equal columns on lg, 2 on md, horizontal scroll on mobile */}
          <div
            className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6"
            style={{ overflowX: 'auto' }}
          >
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                title={service.title}
                description={service.description}
                basePrice={service.basePrice}
                duration={service.duration}
                onBook={() => handleBookService(service.type, service.title)}
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Services;