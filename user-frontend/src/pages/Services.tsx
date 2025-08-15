import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import BookingModal from '../components/BookingModal';
import ServiceCheckoutForm from '../components/ServiceCheckoutForm';
import { ChevronRight, Star, Eye, Sparkles, Heart, Gem } from 'lucide-react';
import { CartItem, ServiceSession } from '../types';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    icon: <Star className="w-8 h-8" />,
    title: "Tarot Readings",
    description: "Navigate life's crossroads with symbolic guidance. Choose from different question packages with personalized spreads.",
    basePrice: "From ₹699",
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
    duration: "30 mins",
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
    basePrice: "From ₹800",
    duration: "20-40 mins",
    type: 'crystal'
  }
];

const Services: React.FC = () => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isServiceCheckoutOpen, setIsServiceCheckoutOpen] = useState(false);
  const [selectedService, setSelectedService] = useState({ type: '', name: '' });
  const [selectedServiceData, setSelectedServiceData] = useState<CartItem | null>(null);
  const navigate = useNavigate();

  // Handle service booking from modal
  const handleBookService = (serviceType: string, serviceName: string, session: ServiceSession) => {
    console.log('🎯 handleBookService called with:', { serviceType, serviceName, session });
    
    if (!serviceType || !serviceName || !session) {
      console.error('❌ Missing required parameters:', { serviceType, serviceName, session });
      alert('Invalid service data. Please try again.');
      return;
    }
    
    try {
      // Convert price to number if it's a string
      const price = typeof session.price === 'string' ? 
        parseInt(session.price.replace(/[^\d]/g, '')) : 
        Number(session.price);
      
      if (isNaN(price) || price <= 0) {
        console.error('❌ Invalid price:', session.price);
        alert('Invalid price. Please try again.');
        return;
      }
      
      console.log('💰 Processed price:', price);

      // Create service item for checkout
      const serviceItem: CartItem = {
        crystal: {
          id: `service-${serviceType}-${session.id}`,
          name: serviceName,
          image: '/api/placeholder/300/200',
          purpose: session.name,
          description: session.description || `${serviceName} - ${session.name}`
        },
        form: {
          name: session.duration || 'Standard Session',
          price: price
        },
        quantity: 1,
        type: 'service'
      };

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
  };

  const handleCloseBookingModal = () => {
    console.log('📋 Closing booking modal');
    setIsBookingModalOpen(false);
  };

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
                      openBookingModal(service.type, service.title);
                    }}
                    className="w-full bg-gradient-to-r from-teal-600 to-purple-600 hover:from-teal-700 hover:to-purple-700 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center"
                  >
                    Book Now
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