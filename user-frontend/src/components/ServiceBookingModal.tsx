import React from 'react';
import { Calendar, X } from 'lucide-react';
import { ServiceSession } from '../types';

interface ServiceBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
  serviceName: string;
  onBookNow: (serviceType: string, serviceName: string, session: ServiceSession) => void;
}

const serviceData: Record<string, { name: string; description: string; sessions: ServiceSession[] }> = {
  tarot: {
    name: "Tarot Reading",
    description: "Navigate life's crossroads with symbolic guidance.",
    sessions: [
      { id: "tarot-3q",   name: "3 Questions Reading",            duration: "10 mins", price: 699,  description: "Perfect for quick insights on specific concerns." },
      { id: "tarot-5q",   name: "1 Tarot Reading Based on 1 Aspect", duration: "20 mins", price: 901,  description: "Comprehensive reading for love, career, finance, etc." },
      { id: "tarot-full", name: "Full Session",                   duration: "30 mins", price: 1500, description: "A detailed reading for your life problems." },
    ],
  },
  palm: {
    name: "Palm Reading",
    description: "Explore your destiny through sacred palm line analysis.",
    sessions: [
      { id: "palm-basic", name: "Palm Reading Session", duration: "20 mins", price: 999, description: "Detailed reading of palm lines and mounts." },
    ],
  },
  karma: {
    name: "Karma Analysis",
    description: "Understand the hidden lessons your soul is still carrying.",
    sessions: [
      { id: "karma-basic", name: "Karma Analysis Session", price: 999, description: "In-depth analysis of karmic patterns and soul lessons." },
    ],
  },
  coaching: {
    name: "Life Coaching",
    description: "Personalized coaching to transform your life.",
    sessions: [
      { id: "coaching-15", name: "15 Minutes Session", duration: "15 mins", price: 999,  description: "Quick consultation for specific goals." },
      { id: "coaching-30", name: "30 Minutes Session", duration: "30 mins", price: 1499, description: "Comprehensive coaching with action plan." },
    ],
  },
  crystal: {
    name: "Crystal Healing",
    description: "Energy alignment, chakra balancing, and intention setting.",
    sessions: [
      { id: "crystal-consultancy", name: "Crystal Consultancy", price: 299, description: "Guidance on which crystal you should wear." },
      { id: "crystal-basic",       name: "Basic Crystal Healing", duration: "20 mins", price: 800, description: "A gentle session for energy cleansing and balance." },
    ],
  },
};

const ServiceBookingModal: React.FC<ServiceBookingModalProps> = ({
  isOpen,
  onClose,
  serviceType,
  serviceName,
  onBookNow,
}) => {
  const data = serviceData[serviceType] ?? { sessions: [] };
  const normalizedServiceName = (serviceName ?? '').trim().toUpperCase();

  const arcanaSessionByTitle: Record<string, { duration?: string; price: number; description: string }> = {
    'THE ELITE ENLIGHTENMENT': {
      duration: '60 minutes',
      price: 7999,
      description: 'Elite Enlightenment session',
    },
    'DEEP INSIGHT EXPERIENCE': {
      duration: '40 minutes',
      price: 4999,
      description: 'Deep Insight Experience session',
    },
    'FOCUSSED INSIGHT SESSION': {
      duration: '15 minutes',
      price: 2499,
      description: 'Focussed Insight Session',
    },
    'MINI CLARITY EDIT': {
      price: 1499,
      description: 'Mini Clarity Edit',
    },
    'QUICK CHECK IN': {
      duration: 'Within 24 hrs',
      price: 499,
      description: 'Quick Check In',
    },
  };

  const derivedCustomSession: ServiceSession | undefined = (() => {
    if (serviceType === 'tarot') {
      const match = arcanaSessionByTitle[normalizedServiceName];
      if (!match) return undefined;
      return {
        id: 'arcana-custom',
        name: serviceName,
        description: match.description,
        duration: match.duration,
        price: match.price,
      };
    }

    if (serviceType === 'karma') {
      if (normalizedServiceName.includes('KARMIC PATTERN INSIGHTS')) {
        return {
          id: 'karmic-custom',
          name: serviceName,
          description: 'Karmic Pattern Insights session',
          duration: '20 minutes',
          price: 1999,
        };
      }
      return undefined;
    }

    if (serviceType === 'coaching') {
      const includes = (substr: string) => normalizedServiceName.includes(substr);
      if (includes('QUANTUM ALIGNMENT EXPERIENCE')) {
        return {
          id: 'alignment-quantum-custom',
          name: serviceName,
          description: 'Quantum Alignment Experience (6 Sessions)',
          duration: 'Each session 24 mins',
          price: 6666,
        };
      }
      if (includes('ALIGNMENT RESET')) {
        return {
          id: 'alignment-reset-custom',
          name: serviceName,
          description: 'Alignment Reset (3 Sessions)',
          duration: 'Each session 24 mins',
          price: 3900,
        };
      }
      if (includes('INTRODUCTORY ALIGNMENT')) {
        return {
          id: 'alignment-intro-custom',
          name: serviceName,
          description: 'Introductory Alignment (1 session)',
          duration: 'Each session 24 mins',
          price: 1699,
        };
      }
      return undefined;
    }

    return undefined;
  })();

  const selectedSession: ServiceSession | undefined = derivedCustomSession ?? data.sessions?.[0];

  if (!isOpen) return null;

  const handleBookNow = () => {
    if (selectedSession) onBookNow(serviceType, serviceName, selectedSession);
  };

  if (!selectedSession) {
    return (
      <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-navy border border-sand/20 rounded-xl p-8 max-w-md w-full text-center">
          <p className="text-sand/80 mb-6" style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '15px' }}>
            Service data not found. Please try again.
          </p>
          <button onClick={onClose} className="ev-btn-primary">Close</button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-navy/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div
        className="w-full max-w-lg max-h-[90vh] flex flex-col"
        style={{
          background: 'linear-gradient(145deg, #0F2346 0%, #1c1a3a 42%, #582045 100%)',
          borderRadius: '12px',
          border: '1px solid rgba(218,198,171,0.18)',
        }}
      >
        {/* ── HEADER ── */}
        <div
          className="flex items-center justify-between px-7 py-5 flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(218,198,171,0.12)' }}
        >
          <div>
            <p
              className="uppercase tracking-[0.22em] text-teal mb-1"
              style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '10px', fontWeight: 500 }}
            >
              Book a Session
            </p>
            <h3 className="font-heading text-2xl text-sand">{serviceName}</h3>
          </div>
          <button
            onClick={onClose}
            style={{ color: 'rgba(218,198,171,0.5)', background: 'none', border: 'none', cursor: 'pointer', padding: 4, transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.color = '#DAC6AB'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.color = 'rgba(218,198,171,0.5)'}
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── BODY (scrollable) ── */}
        <div className="flex-1 overflow-y-auto px-7 py-5">
          <div
            className="mb-4 rounded-lg border border-sand/15 bg-navy/30 px-4 py-4"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <p
              style={{
                fontFamily: "'Gotham', system-ui, sans-serif",
                fontSize: '14px',
                fontWeight: 300,
                color: 'rgba(218,198,171,0.82)',
                lineHeight: 1.75,
              }}
            >
              You&apos;re booking: <span style={{ color: '#DAC6AB', fontWeight: 500 }}>{serviceName}</span>.
              <br />
              Enter your details to confirm your session.
            </p>
          </div>
        </div>

        {/* ── FOOTER: CTA (fixed) ── */}
        <div
          className="px-7 py-5 flex-shrink-0 space-y-3"
          style={{ borderTop: '1px solid rgba(218,198,171,0.12)' }}
        >
          <button
            onClick={handleBookNow}
            className="w-full flex items-center justify-center gap-2"
            style={{
              fontFamily: "'Gotham', system-ui, sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#DAC6AB',
              background: '#256060',
              border: 'none',
              padding: '14px',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background 0.25s',
            }}
            onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#1d4f4f'}
            onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#256060'}
          >
            <Calendar size={15} strokeWidth={1.5} />
            Continue
          </button>

          <p
            className="text-center"
            style={{
              fontFamily: "'Gotham', system-ui, sans-serif",
              fontSize: '11px',
              fontWeight: 300,
              color: 'rgba(218,198,171,0.4)',
              lineHeight: 1.6,
            }}
          >
            We will contact you within 24 hours to schedule your session.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingModal;