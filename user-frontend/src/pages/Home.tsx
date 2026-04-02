import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import Navbar from '../components/Navbar';
import { BrandLogo } from '../components/BrandLogo';
import { AboutSection } from '../components/AboutSection';
import { Footer } from '../components/Footer';
import { Calendar, ChevronLeft, ChevronRight, Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { crystals } from '../data/crystals';
import FeaturedServiceCard, {
  type FeaturedServiceMeta,
} from '../components/FeaturedServiceCard';
import FeaturedServiceModal from '../components/FeaturedServiceModal';
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
      return [...prev, { crystal, form, quantity, type: 'crystal' }];
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

const featuredHomeServices: FeaturedServiceMeta[] = [
  {
    id: 'arcana',
    title: 'ARCANA INSIGHTS',
    description:
      'Arcana refers to the symbolic language of tarot cards. Gain insight into the energies shaping your life. Tarot offers clarity and helps you explore possible paths.',
    bookingType: 'tarot',
    bookingName: 'Tarot Readings',
    artworkSrc: '/featured/arcana-insights.png',
  },
  {
    id: 'alignment',
    title: 'ALIGNMENT SESSIONS',
    description:
      'Align your mindset, intentions, and actions with your goals. This process helps you build clarity and move forward with purpose.',
    bookingType: 'coaching',
    bookingName: 'Life Coaching',
    artworkSrc: '/featured/alignment-sessions.png',
  },
  {
    id: 'karmic',
    title: 'KARMIC PATTERN INSIGHTS',
    description:
      "Some patterns don't just come from the present. These insights help you recognise unresolved cycles that may be affecting your current path.",
    bookingType: 'karma',
    bookingName: 'Karma Analysis',
    artworkSrc: '/featured/karmic-insights.png',
  },
  {
    id: 'crystals',
    title: 'CRYSTALS CURATION',
    description:
      'A curated selection of crystals chosen for their natural energy and purpose. Find pieces that align with your intentions, enhance focus, and support your inner balance.',
    bookingType: 'crystal',
    bookingName: 'Crystal Healing',
    artworkSrc: '/featured/crystals-curation.png',
  },
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
    <div className="fixed inset-0 bg-navy/80 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-navy to-plum rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-plum/30 shadow-2xl flex flex-col md:flex-row">
        {/* Left: Crystal Info */}
        <div className="md:w-1/2 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-plum/20">
          <img src={crystal.image} alt={crystal.name} className="w-40 h-40 object-cover rounded-2xl border-4 border-teal/40 mb-4" />
          <div className="text-3xl font-extrabold text-teal font-heading uppercase mb-2 text-center">{crystal.name}</div>
          <div className="text-lg font-bold text-sand/90 mb-2 text-center">{crystal.purpose}</div>
          <div className="text-base text-sand mb-4 text-center">{crystal.description}</div>
          <div className="flex flex-wrap gap-2 justify-center">
            {crystal.properties.map((prop, i) => (
              <span key={i} className="bg-plum/50 text-sand px-3 py-1 rounded-full text-xs font-semibold">{prop}</span>
            ))}
          </div>
        </div>
        {/* Right: Form Grid */}
        <div className="md:w-1/2 p-6 flex flex-col">
          <div className="text-2xl font-bold text-sand font-heading mb-4 text-center md:text-left">Select Form(s)</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {crystal.forms.map(form => (
              <div key={form.name} className="bg-navy/30 rounded-xl p-4 flex flex-col items-center border-2 border-teal/30">
                <img src={form.image} alt={form.name} className="w-20 h-20 object-cover rounded-lg mb-2 border-2 border-teal/40" />
                <div className="text-sm font-extrabold text-teal font-heading uppercase mb-1 text-center leading-none">{form.name}</div>
                <div className="text-base font-bold text-teal mb-1">
                  ₹{form.price}{form.name === 'Raw' ? ' onwards' : ''}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <button onClick={() => setQuantities(q => ({ ...q, [form.name]: Math.max(0, (q[form.name] || 0) - 1) }))} className="w-8 h-8 rounded-full bg-teal text-navy font-bold text-xl flex items-center justify-center">-</button>
                  <span className="text-xl font-bold text-sand w-6 text-center">{quantities[form.name] || 0}</span>
                  <button onClick={() => setQuantities(q => ({ ...q, [form.name]: (q[form.name] || 0) + 1 }))} className="w-8 h-8 rounded-full bg-teal text-navy font-bold text-xl flex items-center justify-center">+</button>
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
            className={`mt-8 w-full py-3 rounded-lg font-bold text-lg transition-all duration-300 shadow-lg ${selectedForms.length === 0 ? 'bg-navy/40 cursor-not-allowed' : 'bg-gradient-to-r from-teal to-navy hover:opacity-90 text-sand'}`}
          >
            Add to Cart
          </button>
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-teal hover:text-sand text-3xl font-bold bg-navy/30 rounded-full w-10 h-10 flex items-center justify-center">&times;</button>
      </div>
    </div>
  );
};

const Home: React.FC = () => {
  const [bookingService, setBookingService] = useState<{ type: string; name: string } | null>(null);
  const [isServiceBookingModalOpen, setIsServiceBookingModalOpen] = useState(false);
  const [isServiceBookingFormOpen, setIsServiceBookingFormOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<{
    serviceType: string;
    serviceName: string;
    session: any;
  } | null>(null);
  const [isCrystalModalOpen, setIsCrystalModalOpen] = useState(false);
  const [selectedCrystal] = useState<any>(null);
  const [crystalScrollPosition, setCrystalScrollPosition] = useState(0);
  const { cart, addToCart, updateCartQuantity, removeFromCart } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isCrystalFormModalOpen, setIsCrystalFormModalOpen] = useState(false);
  const [crystalForModal, setCrystalForModal] = useState<Crystal | null>(null);
  const [featuredDetail, setFeaturedDetail] = useState<FeaturedServiceMeta | null>(null);
  const featuredServicesScrollRef = useRef<HTMLDivElement>(null);
  const [featuredCarouselIndex, setFeaturedCarouselIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => { AOS.init({ once: true, duration: 900, offset: 60 }); }, []);

  useEffect(() => {
    const container = featuredServicesScrollRef.current;
    if (!container) return;

    const syncIndex = () => {
      if (typeof window !== 'undefined' && window.innerWidth >= 640) return;
      const center = container.scrollLeft + container.clientWidth / 2;
      const items = Array.from(container.children) as HTMLElement[];
      let best = 0;
      let bestDist = Infinity;
      items.forEach((child, i) => {
        const mid = child.offsetLeft + child.offsetWidth / 2;
        const d = Math.abs(center - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setFeaturedCarouselIndex(best);
    };

    syncIndex();
    container.addEventListener('scroll', syncIndex, { passive: true });
    window.addEventListener('resize', syncIndex);
    return () => {
      container.removeEventListener('scroll', syncIndex);
      window.removeEventListener('resize', syncIndex);
    };
  }, []);

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
      if (!data?.id) {
        throw new Error('Service booking ID missing in response.');
      }

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
            booking_id: data.id
          },
          isService: true
        } 
      });
      
    } catch {
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
    <div className="min-h-screen bg-sand text-navy overflow-x-hidden">
      <Navbar cartCount={cart.length} onCartClick={() => setIsCartOpen(true)} />

      {/* ── HERO SECTION ── */}
      <section
        id="home"
        className="relative flex min-h-screen flex-col items-center justify-center pb-16 pt-24 sm:pt-28"
        data-aos="fade-up"
      >
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 text-center sm:max-w-4xl">
          <BrandLogo variant="hero" />

          <h1
            className="hero-primary-title font-heading mt-8 font-bold"
            style={{ color: '#582045' }}
          >
            Elemental Visions
          </h1>

          <p
            className="mt-5 text-base sm:text-lg md:text-xl"
            style={{
              fontFamily: "'Gotham', system-ui, sans-serif",
              fontWeight: 400,
              letterSpacing: '0.04em',
              color: '#582045',
            }}
          >
            Understanding your patterns. Aligning your path.
          </p>

          {/* Supporting text */}
          <p
            className="mt-3 max-w-xl text-sm sm:text-base"
            style={{
              fontFamily: "'Gotham', system-ui, sans-serif",
              fontWeight: 300,
              letterSpacing: '0.03em',
              color: 'rgba(15, 35, 70, 0.55)',
              lineHeight: 1.7,
            }}
          >
            Unlock your destiny through mystical arts • Transform your journey with sacred guidance • Discover your true path with Sakshi
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a href="#contact">
              <button
                style={{
                  fontFamily: "'Gotham', system-ui, sans-serif",
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#DAC6AB',
                  background: '#0F2346',
                  border: 'none',
                  borderRadius: '9999px',
                  padding: '14px 32px',
                  cursor: 'pointer',
                  transition: 'background 0.25s ease, opacity 0.25s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.92')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
              >
                <Calendar className="h-4 w-4" strokeWidth={1.75} />
                Book Your Session
              </button>
            </a>

            <a href="#services">
              <button
                style={{
                  fontFamily: "'Gotham', system-ui, sans-serif",
                  fontSize: '12px',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: '#0F2346',
                  background: 'transparent',
                  border: '1px solid rgba(15, 35, 70, 0.35)',
                  borderRadius: '9999px',
                  padding: '14px 32px',
                  cursor: 'pointer',
                  transition: 'border-color 0.25s ease, background 0.25s ease',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = '#0F2346';
                  el.style.background = 'rgba(15, 35, 70, 0.05)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = 'rgba(15, 35, 70, 0.35)';
                  el.style.background = 'transparent';
                }}
              >
                Explore Services
              </button>
            </a>
          </div>

          <div className="mt-14 h-px w-full max-w-[200px] bg-navy/15" aria-hidden />
        </div>
      </section>
      <AboutSection />
      {/* Services Section */}
      <section id="services" className="py-16 px-2 sm:px-4" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-heading mb-6 inline-block bg-gradient-to-r from-navy via-plum to-teal bg-clip-text px-1 pb-0.5 pt-[0.12em] text-3xl font-bold leading-[1.25] text-transparent sm:text-4xl sm:leading-[1.22] md:text-5xl md:leading-[1.2]">
              Sacred Services
            </h2>
            <p className="mx-auto max-w-3xl text-base text-navy/70 sm:text-xl">
              Each service is crafted to guide you toward clarity, healing, and transformation
            </p>
          </div>
          <div
            ref={featuredServicesScrollRef}
            className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto px-1 pb-1 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 md:gap-8 lg:grid-cols-4 [&::-webkit-scrollbar]:h-0 [&::-webkit-scrollbar]:w-0"
            style={{ msOverflowStyle: 'none' }}
            aria-label="Featured services (swipe sideways on mobile)"
          >
            {featuredHomeServices.map((service) => (
              <div
                key={service.id}
                className="w-[min(88vw,20rem)] shrink-0 snap-center sm:w-auto sm:min-w-0 sm:snap-none"
              >
                <FeaturedServiceCard service={service} onViewService={() => setFeaturedDetail(service)} />
              </div>
            ))}
          </div>
          <div
            className="mt-4 flex flex-col items-center gap-2 sm:hidden"
            role="tablist"
            aria-label="Scroll between services"
          >
            <div className="flex items-center justify-center gap-2">
              {featuredHomeServices.map((service, i) => (
                <button
                  key={service.id}
                  type="button"
                  role="tab"
                  aria-selected={i === featuredCarouselIndex}
                  aria-label={`Show ${service.title}`}
                  onClick={() => {
                    const container = featuredServicesScrollRef.current;
                    const child = container?.children[i] as HTMLElement | undefined;
                    child?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
                  }}
                  className={`rounded-full transition-all duration-200 ${
                    i === featuredCarouselIndex
                      ? 'h-2 w-6 bg-teal'
                      : 'h-2 w-2 bg-navy/25 hover:bg-navy/40'
                  }`}
                />
              ))}
            </div>
            <p
              className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-navy/45"
              style={{ fontFamily: "'Gotham', system-ui, sans-serif" }}
            >
              Swipe for more
            </p>
          </div>
        </div>
      </section>
      {/* Crystals Section */}
      <section id="crystals" className="py-16 px-2 sm:px-4" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="font-heading mb-6 bg-gradient-to-r from-navy via-plum to-teal bg-clip-text text-3xl font-bold text-transparent sm:text-4xl md:text-5xl">
              Healing Crystals
            </h2>
            <p className="mx-auto mb-4 max-w-3xl text-base text-navy/70 sm:text-xl">
              Ethically sourced crystals charged with intention to amplify your spiritual journey
            </p>
            <div className="bg-teal/10 border border-teal/40 rounded-lg p-3 max-w-2xl mx-auto">
              <p className="text-sm text-navy font-medium">
                ⚠️ Images are for reference only. Actual products may vary due to their natural nature.
              </p>
            </div>
          </div>
          <div className="relative">
            <button
              onClick={() => scrollCrystals('left')}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 transform rounded-full border-4 border-transparent bg-plum p-3 text-sand shadow-xl transition-all duration-300 hover:bg-plum/90"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={() => scrollCrystals('right')}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 transform rounded-full border-4 border-transparent bg-plum p-3 text-sand shadow-xl transition-all duration-300 hover:bg-plum/90"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div
              id="crystals-container"
              className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 px-6 sm:px-12 relative"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {crystals.map((crystal) => (
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
      <section className="bg-sand py-16 px-2 sm:px-4" data-aos="fade-up">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center sm:mb-16">
            <h2 className="font-heading mb-6 px-1 pb-0.5 pt-[0.12em] text-3xl font-bold leading-[1.25] text-plum sm:text-4xl sm:leading-[1.22] md:text-5xl md:leading-[1.2]">
              Client Transformations
            </h2>
            <p className="text-base text-navy/70 sm:text-xl">
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
            <h2 className="font-heading mb-6 inline-block bg-gradient-to-r from-navy via-plum to-teal bg-clip-text px-1 pb-0.5 pt-[0.12em] text-3xl font-bold leading-[1.25] text-transparent sm:text-4xl sm:leading-[1.22] md:text-5xl md:leading-[1.2]">
              Begin Your Journey
            </h2>
            <p className="text-base text-navy/70 sm:text-xl">
              Ready to illuminate your path? Let's connect
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
            <div>
              <h3 className="mb-6 text-2xl font-bold text-navy">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="h-6 w-6 shrink-0 text-teal" />
                  <a
                    href="tel:+919176133139"
                    className="min-w-0 text-navy/80 no-underline hover:text-teal"
                  >
                    +91 9176133139
                  </a>
                </div>
                <div className="flex items-center space-x-4">
                  <Mail className="h-6 w-6 shrink-0 text-teal" />
                  <span className="text-navy/80">elementalvisions.in@gmail.com</span>
                </div>
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 shrink-0 text-teal" />
                  <span className="text-navy/80">India</span>
                </div>
              </div>
              <div className="mt-8">
                <h4 className="mb-4 text-lg font-semibold text-navy">Follow the Journey</h4>
                <div className="flex space-x-4">
                  <a href="https://www.instagram.com/elemental.visions/" target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-6 w-6 cursor-pointer text-plum transition-colors hover:text-teal" />
                  </a>
                  <Facebook className="h-6 w-6 cursor-pointer text-plum transition-colors hover:text-teal" />
                  <Twitter className="h-6 w-6 cursor-pointer text-plum transition-colors hover:text-teal" />
                </div>
              </div>
            </div>
            <div className="card-shadow rounded-2xl border border-navy/15 bg-gradient-to-br from-navy to-plum p-8 shadow-lg">
              <h3 className="mb-6 text-2xl font-bold text-sand">Book a Session</h3>
              <form className="space-y-6">
                <div>
                  <input 
                    type="text" 
                    placeholder="Your Name"
                    className="w-full rounded-lg border border-sand/25 bg-navy/40 px-4 py-3 text-sand placeholder-sand/45 transition-colors focus:border-teal focus:outline-none"
                  />
                </div>
                <div>
                  <input 
                    type="email" 
                    placeholder="Your Email"
                    className="w-full rounded-lg border border-sand/25 bg-navy/40 px-4 py-3 text-sand placeholder-sand/45 transition-colors focus:border-teal focus:outline-none"
                  />
                </div>
                <div>
                  <select
                    className="w-full rounded-lg border border-sand/25 bg-navy/40 px-4 py-3 text-sand transition-colors focus:border-teal focus:outline-none"
                  >
                    <option value="" style={{ backgroundColor: '#0F2346', color: '#DAC6AB' }}>Select Service</option>
                    <option value="arcana-insights" style={{ backgroundColor: '#0F2346', color: '#DAC6AB' }}>
                      Arcana Insights
                    </option>
                    <option value="karmic-pattern-insights" style={{ backgroundColor: '#0F2346', color: '#DAC6AB' }}>
                      Karmic Pattern Insights
                    </option>
                    <option value="alignment-sessions" style={{ backgroundColor: '#0F2346', color: '#DAC6AB' }}>
                      Alignment Sessions
                    </option>
                    <option value="crystals-curation" style={{ backgroundColor: '#0F2346', color: '#DAC6AB' }}>
                      Crystals Curation
                    </option>
                  </select>
                </div>
                <div>
                  <textarea 
                    placeholder="Tell me about your journey..."
                    rows={4}
                    className="w-full resize-none rounded-lg border border-sand/25 bg-navy/40 px-4 py-3 text-sand placeholder-sand/45 transition-colors focus:border-teal focus:outline-none"
                  ></textarea>
                </div>
                <button 
                  type="button"
                  onClick={() => {
                    const whatsappUrl = `https://wa.me/919176133139?text=${encodeURIComponent('Hi! I would like to book a session. Please let me know available time slots.')}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                  className="w-full transform rounded-lg bg-teal py-3 font-semibold text-sand shadow-md transition-all duration-300 hover:scale-[1.02] hover:bg-teal/90"
                >
                  Send Message via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
      <FeaturedServiceModal
        isOpen={!!featuredDetail}
        onClose={() => setFeaturedDetail(null)}
        service={featuredDetail}
        onBookSession={handleBookService}
      />

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
      <CheckoutForm isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} items={cart} total={(() => {
        const subtotal = cart.reduce((sum, item) => sum + (item.form.price * item.quantity), 0);
        const hasCrystals = cart.some(item => item.type === 'crystal');
        const shippingCharge = hasCrystals ? 150 : 0;
        return subtotal + shippingCharge;
      })()} onOrderComplete={(orderId: number) => {
        setIsCheckoutOpen(false); 
        const subtotal = cart.reduce((sum, item) => sum + (item.form.price * item.quantity), 0);
        const hasCrystals = cart.some(item => item.type === 'crystal');
        const shippingCharge = hasCrystals ? 150 : 0;
        const totalWithShipping = subtotal + shippingCharge;
        navigate('/payment', { state: { items: cart, total: totalWithShipping, order_id: orderId } });
      }} />
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
