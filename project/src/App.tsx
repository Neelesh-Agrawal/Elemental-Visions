import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { 
  Star, 
  Moon, 
  Sparkles, 
  Eye, 
  Heart, 
  Gem, 
  Calendar, 
  Menu, 
  X,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  ShoppingCart,
  ChevronLeft
} from 'lucide-react';
import { Cart } from './components/Cart';
import { CheckoutForm } from './components/CheckoutForm';
import { BookingModal } from './components/BookingModal';
import { crystals } from './data/crystals';
import { CartItem } from './types';
import { Crystal, CrystalForm } from './types';
import PaymentPage from './components/PaymentPage';

function MainApp() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const navigate = useNavigate();
  const [bookingModal, setBookingModal] = useState<{
    isOpen: boolean;
    serviceType: 'tarot' | 'coaching' | 'palm' | 'karma' | 'crystal';
    serviceName: string;
  }>({
    isOpen: false,
    serviceType: 'tarot',
    serviceName: ''
  });
  const [crystalScrollPosition, setCrystalScrollPosition] = useState(0);
  // Add state for form modal
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedCrystal, setSelectedCrystal] = useState<Crystal | null>(null);
  const [selectedForms, setSelectedForms] = useState<{[formName: string]: number}>({});

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    AOS.init({ once: true, duration: 900, offset: 60 });
  }, []);

  const services = [
    {
      icon: <Star className="w-8 h-8" />,
      title: "Tarot Readings",
      description: "Navigate life's crossroads with symbolic guidance. Choose from different question packages with personalized spreads.",
      basePrice: "From ₹600",
      duration: "10-30 mins",
      type: 'tarot' as const
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Palm Reading",
      description: "Your hands reveal your destiny. Explore innate gifts and future pathways through sacred line analysis.",
      basePrice: "₹999",
      duration: "20 mins",
      type: 'palm' as const
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "Karma Analysis",
      description: `Curious about the karmic patterns holding you back?\nGet your Pending Karma Analysis done and understand the hidden lessons your soul is still carrying`,
      basePrice: "₹999",
      type: 'karma' as const
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Life Coaching",
      description: '“When your mind is clear and your aura is light, your path naturally opens." Book your session today and start your transformation.',
      basePrice: "From ₹999",
      duration: "15-30 mins",
      type: 'coaching' as const
    },
    {
      icon: <Gem className="w-8 h-8" />,
      title: "Crystal Healing",
      description: `In  a Crystal Healing Session, I use intuitively selected crystals to cleanse, balance, and activate your energy centers (chakras).
This gentle yet transformative modality helps you:

🔮 Release emotional blocks
💖 Heal past traumas
🧘‍♀️ Regain energetic balance
🌈 Strengthen aura and spiritual connection
🌿 Feel lighter, clearer, and more aligned`,
      duration: "Varies",
      type: 'crystal' as const
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

  // Update addToCart to accept crystal and form
  const addToCart = (crystal: Crystal, form: CrystalForm, quantity: number = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.crystal.id === crystal.id && item.form.name === form.name);
      if (existingItem) {
        return prevCart.map(item =>
          item.crystal.id === crystal.id && item.form.name === form.name
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { crystal, form, quantity }];
      }
    });
    // Do NOT open the cart automatically
  };

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

  const handleBookService = (serviceType: typeof services[0]['type'], serviceName: string) => {
    setBookingModal({
      isOpen: true,
      serviceType,
      serviceName
    });
  };

  const scrollCrystals = (direction: 'left' | 'right') => {
    const container = document.getElementById('crystals-container');
    if (container) {
      const scrollAmount = 300;
      const newPosition = direction === 'left' 
        ? Math.max(0, crystalScrollPosition - scrollAmount)
        : Math.min(container.scrollWidth - container.clientWidth, crystalScrollPosition + scrollAmount);
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setCrystalScrollPosition(newPosition);
    }
  };

  const handleExploreServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBookYourSession = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper to close the form modal
  const handleCloseFormModal = () => setIsFormModalOpen(false);

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

      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-40 transition-all duration-300 ${scrollY > 50 ? 'bg-black/80 backdrop-blur-md' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <img src="/image.png" alt="Elemental Visions" className="w-12 h-12 rounded-full" />
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  Elemental Visions
                </h1>
                <p className="text-xs text-purple-300">with Sakshi</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="hover:text-yellow-400 transition-colors">Home</a>
              <a href="#services" className="hover:text-yellow-400 transition-colors">Services</a>
              <a href="#about" className="hover:text-yellow-400 transition-colors">About</a>
              <a href="#crystals" className="hover:text-yellow-400 transition-colors">Crystals</a>
              <a href="#contact" className="hover:text-yellow-400 transition-colors">Contact</a>
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:text-yellow-400 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 hover:text-yellow-400 transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.reduce((sum, item) => sum + item.quantity, 0)}
                  </span>
                )}
              </button>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/90 backdrop-blur-md rounded-lg mt-2 p-4">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="hover:text-yellow-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Home</a>
                <a href="#services" className="hover:text-yellow-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Services</a>
                <a href="#about" className="hover:text-yellow-400 transition-colors" onClick={() => setIsMenuOpen(false)}>About</a>
                <a href="#crystals" className="hover:text-yellow-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Crystals</a>
                <a href="#contact" className="hover:text-yellow-400 transition-colors" onClick={() => setIsMenuOpen(false)}>Contact</a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative" data-aos="fade-up">
        <div className="text-center max-w-4xl mx-auto px-4">
          <div className="mb-8">
            <img src="/image.png" alt="Elemental Visions Logo" className="w-32 h-32 mx-auto mb-6 rounded-full shadow-2xl" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent font-unbounded drop-shadow-lg">
            Elemental Visions
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-purple-200">
            ✨ Where Ancient Wisdom Meets Modern Insight ✨
          </p>
          <p className="text-lg mb-8 text-gray-300 max-w-2xl mx-auto">
            Unlock your destiny through mystical arts • Transform your journey with sacred guidance • Discover your true path with Sakshi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleBookYourSession}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <Calendar className="w-5 h-5 inline mr-2" />
              Book Your Session
            </button>
            <button 
              onClick={handleExploreServices}
              className="border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 rounded-full font-semibold transition-all duration-300"
            >
              Explore Services
            </button>
          </div>
        </div>
      </section>

      {/* Services Section */}
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
                <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-yellow-400 font-semibold text-lg">{service.basePrice}</span>
                    <span className="text-purple-300 text-sm">{service.duration}</span>
                  </div>
                  <button 
                    onClick={() => handleBookService(service.type, service.title)}
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

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-indigo-900/50" data-aos="fade-up">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-unbounded drop-shadow-lg">
                Meet Sakshi
              </h2>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                With over 10 years in the spiritual arts, I blend intuition with practical wisdom to guide souls toward their highest potential. My journey began with a profound spiritual awakening that led me to study ancient divination arts and modern coaching techniques.
              </p>
              <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                My philosophy is simple: Karma isn't fate—it's actionable energy. Through personalized readings and coaching, I help you transform obstacles into opportunities and confusion into clarity.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">1000+</div>
                  <div className="text-sm text-purple-300">Readings Given</div>
                </div>
                <div className="text-center p-4 bg-purple-800/30 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">10+</div>
                  <div className="text-sm text-purple-300">Years Experience</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-purple-600/30 to-teal-600/30 rounded-2xl flex items-center justify-center">
                <Moon className="w-24 h-24 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Crystals Section */}
      <section id="crystals" className="py-20 px-4" data-aos="fade-up">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent font-unbounded drop-shadow-lg">
              Healing Crystals
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Ethically sourced crystals charged with intention to amplify your spiritual journey
            </p>
          </div>

          <div className="relative">
            <button
              onClick={() => scrollCrystals('left')}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 z-20 bg-purple-600/80 hover:bg-purple-700 p-3 rounded-full transition-all duration-300 shadow-xl border-4 border-transparent"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <button
              onClick={() => scrollCrystals('right')}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 z-20 bg-purple-600/80 hover:bg-purple-700 p-3 rounded-full transition-all duration-300 shadow-xl border-4 border-transparent"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <div 
              id="crystals-container"
              className="flex space-x-6 overflow-x-auto scrollbar-hide pb-4 px-12 relative"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {crystals.map((crystal, idx) => (
                <div
                  key={crystal.id}
                  className={`flex-shrink-0 w-80 h-[500px] glass card-shadow overflow-hidden border border-purple-500/30 hover:border-yellow-400/50 transition-all duration-300 group relative flex flex-col justify-between ${idx === 0 ? 'ml-6' : ''} ${idx === crystals.length - 1 ? 'mr-6' : ''} hover:scale-105 hover:shadow-2xl hover:z-30`}
                  style={{ zIndex: 1 }}
                  data-aos="zoom-in-up"
                >
                  {/* Crystal Image as main focus */}
                  <div className="h-60 w-full relative overflow-hidden rounded-t-2xl flex-shrink-0">
                    <img 
                      src={crystal.image} 
                      alt={crystal.name}
                      className="w-full h-full object-cover object-center rounded-t-2xl transition-all duration-300"
                    />
                    {/* Glassy overlay for name and purpose */}
                    <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-md p-4 rounded-b-2xl flex flex-col items-start">
                      <h3 className="text-2xl font-bold text-white drop-shadow mb-1">{crystal.name}</h3>
                      <p className="text-yellow-300 font-semibold text-base mb-1 drop-shadow">{crystal.purpose}</p>
                    </div>
                  </div>
                  {/* Card content below image */}
                  <div className="p-4 flex flex-col gap-2 flex-1 min-h-0 justify-between overflow-hidden">
                    <p className="text-gray-300 text-sm line-clamp-3 mb-1">{crystal.description}</p>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {crystal.properties.map((property, index) => (
                        <span 
                          key={index}
                          className="text-xs bg-purple-600/30 text-purple-200 px-2 py-1 rounded-full"
                        >
                          {property}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-purple-200">
                      Available as: {crystal.forms.map(f => f.name).join(' | ')}
                    </div>
                    <button
                      onClick={() => {
                        setSelectedCrystal(crystal);
                        setIsFormModalOpen(true);
                        setSelectedForms({});
                      }}
                      className="mt-4 bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 px-4 py-2 rounded-lg text-sm font-bold text-white shadow-lg transition-all duration-300 w-full"
                    >
                      Select Form
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-900/50 to-indigo-900/50" data-aos="fade-up">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent font-unbounded drop-shadow-lg">
              Client Transformations
            </h2>
            <p className="text-xl text-gray-300">
              Real stories from souls who found their path
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 glass card-shadow p-8 border border-purple-500/30 hover:border-yellow-400/50 transition-all duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-white">{testimonial.name}</div>
                  <div className="text-purple-300 text-sm">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-teal-400 to-purple-400 bg-clip-text text-transparent font-unbounded drop-shadow-lg">
              Begin Your Journey
            </h2>
            <p className="text-xl text-gray-300">
              Ready to illuminate your path? Let's connect
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-bold mb-6 text-white">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-yellow-400" />
                  <span className="text-gray-300">+91 9176133139</span>
                  <Phone className="w-6 h-6 text-yellow-400" />
                  <span className="text-gray-300">+91 9884084043</span>
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
                  <Instagram className="w-6 h-6 text-purple-400 hover:text-yellow-400 cursor-pointer transition-colors" />
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
                    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent('Hi! I would like to book a session. Please let me know available time slots.')}`;
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

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/50 border-t border-purple-500/30">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <img src="/image.png" alt="Elemental Visions" className="w-10 h-10 rounded-full" />
            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Elemental Visions
              </h3>
              <p className="text-xs text-purple-300">with Sakshi</p>
            </div>
          </div>
          <p className="text-gray-400 mb-4">
            ✨ Where Ancient Wisdom Meets Modern Insight ✨
          </p>
          <p className="text-sm text-purple-300">
            © 2024 Elemental Visions. All rights reserved. | Crafted with ✨ and ancient wisdom
          </p>
        </div>
      </footer>

      {/* Modals */}
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

      <BookingModal
        isOpen={bookingModal.isOpen}
        onClose={() => setBookingModal({ ...bookingModal, isOpen: false })}
        serviceType={bookingModal.serviceType}
        serviceName={bookingModal.serviceName}
      />

      {/* Modal for selecting forms */}
      {isFormModalOpen && selectedCrystal && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center pt-10 pb-6"
          onClick={handleCloseFormModal}
        >
          <div
            className="glass card-shadow bg-gradient-to-br from-purple-900/90 to-indigo-900/90 rounded-3xl max-w-3xl w-full relative shadow-2xl border-2 border-yellow-400/40 animate-fadeIn max-h-[90vh] overflow-y-auto backdrop-blur-xl flex flex-col md:flex-row p-0"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 text-yellow-400 hover:text-white text-2xl font-bold transition-colors bg-black/40 rounded-full w-10 h-10 flex items-center justify-center shadow-xl z-20 border-2 border-yellow-400/40"
              onClick={handleCloseFormModal}
              aria-label="Close"
            >
              &times;
            </button>
            {/* Left: Crystal Info */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 border-b md:border-b-0 md:border-r border-purple-500/30 min-w-[260px] max-w-[340px]">
              <img src={selectedCrystal.image} alt={selectedCrystal.name} className="w-32 h-32 object-cover rounded-2xl shadow-xl border-4 border-yellow-400/40 mb-6" />
              <h3 className="text-2xl font-extrabold mb-2 text-yellow-400 text-center tracking-tight drop-shadow-lg uppercase font-unbounded">{selectedCrystal.name}</h3>
              <div className="text-yellow-300 font-semibold text-base mb-2 drop-shadow text-center">{selectedCrystal.purpose}</div>
              <div className="text-purple-200 text-sm mb-4 text-center">{selectedCrystal.description}</div>
              <div className="flex flex-wrap gap-2 justify-center mb-2">
                {selectedCrystal.properties.map((property, idx) => (
                  <span key={idx} className="text-xs bg-purple-600/30 text-purple-200 px-2 py-1 rounded-full">
                    {property}
                  </span>
                ))}
              </div>
              <div className="w-full h-0.5 bg-gradient-to-r from-yellow-400/20 to-purple-400/20 my-4 rounded-full" />
            </div>
            {/* Right: Forms Grid */}
            <div className="flex-1 flex flex-col p-8 min-w-[260px]">
              <h4 className="text-lg font-bold text-yellow-300 mb-4 text-center font-unbounded tracking-wide">Select Form(s)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {selectedCrystal.forms.map((form: CrystalForm) => {
                  const selected = (selectedForms[form.name] || 0) > 0;
                  return (
                    <div
                      key={form.name}
                      className={`flex flex-col items-center glass bg-gradient-to-br from-purple-800/90 to-indigo-800/90 border-2 ${selected ? 'border-yellow-400 shadow-2xl scale-105' : 'border-purple-500/30'} rounded-2xl px-6 py-6 shadow-lg hover:shadow-2xl transition-all duration-200 focus-within:ring-2 focus-within:ring-yellow-400 relative group min-h-[180px] min-w-0 overflow-visible`}
                    >
                      <img src={form.image} alt={form.name} className="w-24 h-24 object-cover rounded-2xl border-2 border-yellow-400 shadow-lg bg-black/20 mb-3" />
                      <div className="w-full flex flex-col items-center text-center mb-2">
                        <div className="font-bold text-xl md:text-2xl text-yellow-200 mb-1 uppercase tracking-wide font-unbounded break-words leading-tight">{form.name}</div>
                        <div className="text-yellow-400 font-extrabold text-lg md:text-xl mb-1">₹{form.price}</div>
                        {form.description && <div className="text-sm text-purple-200 mb-2 text-center break-words italic leading-snug max-w-[220px] md:max-w-[260px]">{form.description}</div>}
                      </div>
                      <div className="flex items-center justify-center gap-3 mt-2 mb-1 w-full">
                        <button
                          type="button"
                          aria-label={`Decrease quantity of ${form.name}`}
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-400 text-purple-900 font-bold hover:bg-yellow-300 transition text-xl shadow-lg border-2 border-yellow-300"
                          onClick={() => {
                            setSelectedForms(prev => {
                              const qty = (prev[form.name] || 0) - 1;
                              if (qty <= 0) {
                                const { [form.name]: _, ...rest } = prev;
                                return rest;
                              }
                              return { ...prev, [form.name]: qty };
                            });
                          }}
                        >-</button>
                        <span className="font-bold text-xl text-white w-10 text-center select-none drop-shadow-lg">{selectedForms[form.name] || 0}</span>
                        <button
                          type="button"
                          aria-label={`Increase quantity of ${form.name}`}
                          className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-400 text-purple-900 font-bold hover:bg-yellow-300 transition text-xl shadow-lg border-2 border-yellow-300"
                          onClick={() => setSelectedForms(prev => ({ ...prev, [form.name]: (prev[form.name] || 0) + 1 }))}
                        >+</button>
                      </div>
                      {selected && (
                        <span className="absolute top-2 left-2 bg-yellow-400 text-purple-900 rounded-full p-1 shadow-lg z-10 border-2 border-white/40">
                          <svg width="18" height="18" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              {Object.values(selectedForms).some(qty => qty > 0) && (
                <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-r from-yellow-400/90 to-orange-400/90 rounded-b-2xl p-4 mt-2 flex justify-center shadow-2xl z-10 animate-fadeIn">
                  <button
                    className="w-full max-w-xs bg-gradient-to-r from-purple-900 to-indigo-900 hover:from-purple-800 hover:to-indigo-800 py-3 rounded-xl text-yellow-300 font-extrabold text-lg shadow-xl transition-all duration-300 drop-shadow border-2 border-yellow-400/60 tracking-wide"
                    onClick={() => {
                      Object.entries(selectedForms).forEach(([formName, qty]) => {
                        if (qty > 0) {
                          const form = selectedCrystal.forms.find(f => f.name === formName);
                          if (form) addToCart(selectedCrystal, form, qty);
                        }
                      });
                      handleCloseFormModal();
                    }}
                  >
                    Add Selected to Cart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainApp />} />
        <Route path="/payment" element={<PaymentPage />} />
      </Routes>
    </BrowserRouter>
  );
}