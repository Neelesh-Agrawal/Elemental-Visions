import React, { useState, useEffect, createContext, useContext } from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Calendar, Star, Eye, Sparkles, Heart, Gem, ChevronLeft, ChevronRight, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { crystals } from '../data/crystals';
import ServiceCard from '../components/ServiceCard';
import CrystalCard from '../components/CrystalCard';
import TestimonialCard from '../components/TestimonialCard';
import BookingModal from '../components/BookingModal';
import ServiceBookingModal from '../components/ServiceBookingModal';
import ServiceBookingForm, { ServiceBookingData } from '../components/ServiceBookingForm';
import Cart from '../components/Cart';
import CheckoutForm from '../components/CheckoutForm';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';

// Cart context for global state
import { CartItem, Crystal, CrystalForm } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (crystal: Crystal, form: CrystalForm, quantity: number) => void;
  updateCartQuantity: (compositeId: string, quantity: number) => void;
  removeFromCart: (compositeId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (crystal: Crystal, form: CrystalForm, quantity: number) => {
    setCart(prev => {
      const idx = prev.findIndex(item => item.crystal.id === crystal.id && item.form.name === form.name);
      if (idx !== -1) {
        // Update quantity
        const updated = [...prev];
        updated[idx].quantity += quantity;
        return updated;
      }
      return [...prev, { crystal, form, quantity }];
    });
  };

  const updateCartQuantity = (compositeId: string, quantity: number) => {
    const [crystalId, formName] = compositeId.split('-');
    setCart(prev => prev.map(item =>
      item.crystal.id === crystalId && item.form.name === formName
        ? { ...item, quantity }
        : item
    ));
  };

  const removeFromCart = (compositeId: string) => {
    const [crystalId, formName] = compositeId.split('-');
    setCart(prev => prev.filter(item => !(item.crystal.id === crystalId && item.form.name === formName)));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartQuantity, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

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
    description: `Curious about the karmic patterns holding you back?\nGet your Pending Karma Analysis done and understand the hidden lessons your soul is still carrying`,
    basePrice: "₹999",
    type: 'karma'
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "Life Coaching",
    description: '“When your mind is clear and your aura is light, your path naturally opens." Book your session today and start your transformation.',
    basePrice: "From ₹999",
    duration: "15-30 mins",
    type: 'coaching'
  },
  {
    icon: <Gem className="w-8 h-8" />,
    title: "Crystal Healing",
    description: `In  a Crystal Healing Session, I use intuitively selected crystals to cleanse, balance, and activate your energy centers (chakras).\nThis gentle yet transformative modality helps you:\n\n🔮 Release emotional blocks\n💖 Heal past traumas\n🧘‍♀️ Regain energetic balance\n🌈 Strengthen aura and spiritual connection\n🌿 Feel lighter, clearer, and more aligned`,
    basePrice: "From ₹299",
    duration: "Varies",
    type: 'crystal'
  }
];

const testimonials = [
  {
    name: "Priya Sharma",
    location: "Mumbai",
    text: "My karma session revealed career blocks I never saw. Now I'm thriving in my new role!",
    rating: 5
  },
  {
    name: "Arjun Patel",
    location: "Delhi",
    text: "The tarot reading was incredibly accurate. Sakshi's insights helped me make important life decisions.",
    rating: 5
  },
  {
    name: "Meera Singh",
    location: "Bangalore",
    text: "The crystal recommendations transformed my meditation practice. Feeling more aligned than ever.",
    rating: 5
  }
];

// CrystalFormModal for selecting form and quantity
const CrystalFormModal: React.FC<{
  isOpen: boolean;
  crystal: Crystal | null;
  onClose: () => void;
  onAddToCart: (formQuantities: { form: CrystalForm; quantity: number }[]) => void;
}> = ({ isOpen, crystal, onClose, onAddToCart }) => {
  const [quantities, setQuantities] = useState<{ [formName: string]: number }>({});
  useEffect(() => {
    if (crystal) {
      const initial: { [formName: string]: number } = {};
      crystal.forms.forEach(f => { initial[f.name] = 0; });
      setQuantities(initial);
    }
  }, [crystal]);
  if (!isOpen || !crystal) return null;
  const selectedForms = crystal.forms.filter(f => quantities[f.name] > 0);
  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#1a1333] to-[#2d0b4e] rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl flex flex-col md:flex-row">
        {/* Left: Crystal Info */}
        <div className="md:w-1/2 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-purple-500/20">
          <img src={crystal.image} alt={crystal.name} className="w-40 h-40 object-cover rounded-2xl border-4 border-yellow-400/40 mb-4" />
          <div className="text-3xl font-extrabold text-yellow-400 font-unbounded uppercase mb-2 text-center">{crystal.name}</div>
          <div className="text-lg font-bold text-purple-200 mb-2 text-center">{crystal.purpose}</div>
          <div className="text-base text-white mb-4 text-center">{crystal.description}</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {crystal.properties.map((prop, i) => (
              <span key={i} className="bg-purple-700/60 text-purple-200 px-3 py-1 rounded-full text-xs font-semibold">{prop}</span>
            ))}
          </div>
        </div>
        {/* Right: Form Grid */}
        <div className="md:w-1/2 p-6 flex flex-col">
          <div className="text-2xl font-bold text-white font-unbounded mb-4 text-center md:text-left">Select Form(s)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {crystal.forms.map(form => (
              <div key={form.name} className="bg-black/30 rounded-xl p-4 flex flex-col items-center border-2 border-yellow-400/30">
                <img src={form.image} alt={form.name} className="w-20 h-20 object-cover rounded-lg mb-2 border-2 border-yellow-400/40" />
                <div className="text-sm font-extrabold text-yellow-400 font-unbounded uppercase mb-1 text-center leading-none">{form.name}</div>
                <div className="text-base font-bold text-yellow-400 mb-1">
                  ₹{form.price}{form.name === 'Raw' ? ' onwards' : ''}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => setQuantities(q => ({ ...q, [form.name]: Math.max(0, (q[form.name] || 0) - 1) }))} className="w-8 h-8 rounded-full bg-yellow-400 text-black font-bold text-xl flex items-center justify-center">-</button>
                  <span className="text-xl font-bold text-white w-6 text-center">{quantities[form.name] || 0}</span>
                  <button onClick={() => setQuantities(q => ({ ...q, [form.name]: (q[form.name] || 0) + 1 }))} className="w-8 h-8 rounded-full bg-yellow-400 text-black font-bold text-xl flex items-center justify-center">+</button>
                </div>
              </div>
            ))}
          </div>
          <button
            disabled={selectedForms.length === 0}
            onClick={() => {
              onAddToCart(
                crystal.forms
                  .filter(f => quantities[f.name] > 0)
                  .map(f => ({ form: f, quantity: quantities[f.name] }))
              );
              onClose();
            }}
            className={`mt-8 w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg ${selectedForms.length === 0 ? 'bg-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white'}`}
          >
            Add to Cart
          </button>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-yellow-400 hover:text-white text-3xl font-bold bg-black/30 rounded-full w-10 h-10 flex items-center justify-center">&times;</button>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [bookingService, setBookingService] = useState<{ type: string; name: string } | null>(null);
  const [isServiceBookingModalOpen, setIsServiceBookingModalOpen] = useState(false);
  const [isServiceBookingFormOpen, setIsServiceBookingFormOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<{
    serviceType: string;
    serviceName: string;
    session: any;
  } | null>(null);
  const [isCrystalModalOpen, setIsCrystalModalOpen] = useState(false);
  const [selectedCrystal, setSelectedCrystal] = useState<any>(null);
  const [crystalScrollPosition, setCrystalScrollPosition] = useState(0);
  const { cart, addToCart, updateCartQuantity, removeFromCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCrystalFormModalOpen, setIsCrystalFormModalOpen] = useState(false);
  const [crystalForModal, setCrystalForModal] = useState<Crystal | null>(null);
  const navigate = useNavigate();

  useEffect(() => { AOS.init({ once: true, duration: 900, offset: 60 }); }, []);

  // Responsive scroll for crystals
  const scrollCrystals = (direction: 'left' | 'right') => {
    const container = document.getElementById('crystals-container');
    if (container) {
      const scrollAmount = window.innerWidth < 640 ? 220 : 300;
      const newPosition = direction === 'left'
        ? Math.max(0, crystalScrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, crystalScrollPosition + scrollAmount);
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setCrystalScrollPosition(newPosition);
    }
  };

  // Handlers for booking
  const handleBookService = (type: string, name: string) => {
    setBookingService({ type, name });
    setIsServiceBookingModalOpen(true);
  };

  // Handle service booking (Book Now)
  const handleServiceBookNow = (serviceType: string, serviceName: string, session: any) => {
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
  const handleBookCrystal = (crystal: Crystal) => {
    setCrystalForModal(crystal);
    setIsCrystalFormModalOpen(true);
  };
  const handleAddCrystalToCart = (formQuantities: { form: CrystalForm; quantity: number }[]) => {
    if (crystalForModal) {
      formQuantities.forEach(({ form, quantity }) => {
        addToCart(crystalForModal, form, quantity);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-purple-300 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 left-20 w-3 h-3 bg-teal-400 rounded-full animate-bounce"></div>
        <div className="absolute top-60 left-1/3 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
        <div className="absolute bottom-60 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-ping"></div>
      </div>
      <Navbar cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />
      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative pt-24 pb-12 sm:pt-32 sm:pb-20" data-aos="fade-up">
        <div className="text-center max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <img src="/image.png" alt="Elemental Visions Logo" className="w-32 h-32 mx-auto mb-6 rounded-full shadow-2xl" />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent font-unbounded drop-shadow-lg">
            Elemental Visions
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-4 text-purple-200">
            ✨ Where Ancient Wisdom Meets Modern Insight ✨
          </p>
          <p className="text-base sm:text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
            Unlock your destiny through mystical arts • Transform your journey with sacred guidance • Discover your true path with Sakshi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact">
              <button 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg w-full sm:w-auto"
              >
                <Calendar className="w-5 h-5 inline mr-2" />
                Book Your Session
              </button>
            </a>
            <a href="#services">
              <button 
                className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 rounded-full font-semibold transition-all duration-300 w-full sm:w-auto"
              >
                Explore Services
              </button>
            </a>
          </div>
        </div>
      </section>
      {/* About Section */}
      <section id="about" className="py-16 px-2 sm:px-4 bg-gradient-to-r from-purple-900/50 to-indigo-900/50" data-aos="fade-up">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-unbounded drop-shadow-lg">
                Guiding you with Tarot, Intuition & Vision
              </h2>
              <p className="text-base sm:text-lg text-gray-300 mb-6 leading-relaxed">
                At Elemental Visions, I weave a sacred space where seekers come home to their inner truth.
                Through Tarot, Palmistry, Crystals, and Intuitive whispers, I listen to the language of the universe—
                a language written in symbols, synchronicities, and the dance of the elements.
              </p>
              <p className="text-base sm:text-lg text-gray-300 mb-6 leading-relaxed">
                If your heart longs for clarity in love, career, or destiny,
                if you are drawn to the healing light of crystals,
                if your soul seeks to remember its deepest essence—
                I am here to walk beside you, with compassion, intuition, and sacred vision.
              </p>
              <p className="text-base sm:text-lg text-gray-300 mb-8 leading-relaxed font-medium text-center italic">
                Step into the mystery. The cards await. The vision unfolds.
              </p>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent">
                  What Awaits You Here:
                </h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-400 font-bold">✨</span>
                    <div>
                      <span className="font-semibold text-yellow-400">Tarot Readings:</span> Whispers of guidance woven through the cards, illuminating the path ahead.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-400 font-bold">🖐️</span>
                    <div>
                      <span className="font-semibold text-yellow-400">Palmistry:</span> The ancient story etched in your hands, revealing the wisdom you already carry.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-400 font-bold">💎</span>
                    <div>
                      <span className="font-semibold text-yellow-400">Crystal Guidance:</span> Sacred stones attuned to heal, align, and awaken your energy.
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="text-yellow-400 font-bold">📚</span>
                    <div>
                      <span className="font-semibold text-yellow-400">Courses & Resources:</span> A doorway to learn, explore, and journey deeper into the mysteries of Tarot.
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">1000+</div>
                  <div className="text-sm text-purple-300">Readings Given</div>
                </div>
                <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">5+</div>
                  <div className="text-sm text-purple-300">Years Experience</div>
                </div>
              </div>
            </div>
            <div className="relative flex justify-center items-center">
              <img src="/image.png" alt="Sakshi" className="w-64 h-64 object-cover rounded-2xl shadow-2xl border-4 border-yellow-400/30" />
            </div>
          </div>
        </div>
      </section>
      {/* Services Section */}
      <section id="services" className="py-16 px-2 sm:px-4" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent font-unbounded drop-shadow-lg">
              Sacred Services
            </h2>
            <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto">
              Each service is crafted to guide you toward clarity, healing, and transformation
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
      {/* Crystals Section */}
      <section id="crystals" className="py-16 px-2 sm:px-4" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent font-unbounded drop-shadow-lg">
              Healing Crystals
            </h2>
            <p className="text-base sm:text-xl text-gray-300 max-w-3xl mx-auto mb-4">
              Ethically sourced crystals charged with intention to amplify your spiritual journey
            </p>
            <div className="bg-yellow-400/20 border border-yellow-400/40 rounded-lg p-3 max-w-2xl mx-auto">
              <p className="text-sm text-yellow-300 font-medium">
                ⚠️ Images are for reference only. Actual products may vary due to their natural nature.
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => scrollCrystals('left')}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-purple-600/80 hover:bg-purple-700 p-3 rounded-full transition-all duration-300 shadow-xl border-4 border-transparent"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => scrollCrystals('right')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-purple-600/80 hover:bg-purple-700 p-3 rounded-full transition-all duration-300 shadow-xl border-4 border-transparent"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div
              id="crystals-container"
              className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 px-6 sm:px-12 relative"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {crystals.map((crystal, idx) => (
                <CrystalCard
                  key={crystal.id}
                  image={crystal.image || ''}
                  name={crystal.name}
                  purpose={crystal.purpose}
                  description={crystal.description}
                  properties={crystal.properties}
                  forms={crystal.forms.map(f => f.name)}
                  onSelect={() => handleBookCrystal(crystal)}
                  isMixels={crystal.name === 'Mixels'}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      {/* Testimonials Section */}
      <section className="py-16 px-2 sm:px-4 bg-gradient-to-r from-purple-900/50 to-indigo-900/50" data-aos="fade-up">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-unbounded drop-shadow-lg">
              Client Transformations
            </h2>
            <p className="text-base sm:text-xl text-gray-300">
              Real stories from souls who found their path
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                location={testimonial.location}
                text={testimonial.text}
                rating={testimonial.rating}
              />
            ))}
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section id="contact" className="py-16 px-2 sm:px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent font-unbounded drop-shadow-lg">
              Begin Your Journey
            </h2>
            <p className="text-base sm:text-xl text-gray-300">
              Ready to illuminate your path? Let's connect
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0">
                  <Phone className="w-6 h-6 text-yellow-400" />
                  <span className="text-gray-300">+91 9176133139</span>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="w-6 h-6 text-yellow-400" />
                  <span className="text-gray-300">elementalvisions.in@gmail.com</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="w-6 h-6 text-yellow-400" />
                  <span className="text-gray-300">India</span>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="text-lg font-semibold mb-4 text-white">Follow the Journey</h4>
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/elemental.visions/" target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-6 h-6 text-purple-400 hover:text-yellow-400 cursor-pointer transition-colors" />
                  </a>
                  <Facebook className="w-6 h-6 text-purple-400 hover:text-yellow-400 cursor-pointer transition-colors" />
                  <Twitter className="w-6 h-6 text-purple-400 hover:text-yellow-400 cursor-pointer transition-colors" />
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 glass card-shadow rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-2xl font-bold mb-6 text-white">Book a Session</h3>
              <form className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Your Email"
                    className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <select className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white focus:border-yellow-400 focus:outline-none transition-colors">
                    <option value="">Select Service</option>
                    <option value="tarot">Tarot Reading</option>
                    <option value="palm">Palm Reading</option>
                    <option value="karma">Karma Analysis</option>
                    <option value="coaching">Life Coaching</option>
                    <option value="crystal">Crystal Healing</option>
                  </select>
                </div>
                <div>
                  <textarea 
                    placeholder="Tell me about your journey..."
                    rows={4}
                    className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors resize-none"
                  ></textarea>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    const whatsappUrl = `https://wa.me/919176133139?text=${encodeURIComponent('Hi! I would like to book a session. Please let me know available time slots.')}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  Send Message via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      {/* Service Booking Modal - New booking flow */}
      {bookingService && (
        <ServiceBookingModal
          isOpen={isServiceBookingModalOpen}
          onClose={() => setIsServiceBookingModalOpen(false)}
          serviceType={bookingService.type}
          serviceName={bookingService.name}
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
      {/* Booking Modal for Crystals */}
      {selectedCrystal && (
        <BookingModal
          isOpen={isCrystalModalOpen}
          onClose={() => setIsCrystalModalOpen(false)}
          serviceType="crystal"
          serviceName={selectedCrystal.name}
        />
      )}
      {/* Crystal Form Modal */}
      <CrystalFormModal isOpen={isCrystalFormModalOpen} crystal={crystalForModal} onClose={() => setIsCrystalFormModalOpen(false)} onAddToCart={handleAddCrystalToCart} />
      {/* Cart Modal */}
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={updateCartQuantity} onRemoveItem={removeFromCart} onProceedToCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }} />
      {/* Checkout Form Modal */}
      <CheckoutForm isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} items={cart} total={cart.reduce((sum, item) => sum + (item.form.price * item.quantity), 0)} onOrderComplete={() => { setIsCheckoutOpen(false); navigate('/payment', { state: { items: cart, total: cart.reduce((sum, item) => sum + (item.form.price * item.quantity), 0) } }); }} />
      <Footer />
    </div>
  );
};

// Wrap the Home component export with CartProvider
const HomeWithCartProvider: React.FC = () => (
  <CartProvider>
    <Home />
  </CartProvider>
);

export default HomeWithCartProvider;
