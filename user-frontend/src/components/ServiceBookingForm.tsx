import React, { useState } from 'react';
import { X } from 'lucide-react';
import { ServiceSession } from '../types';

interface ServiceBookingFormProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string;
  serviceName: string;
  selectedSession: ServiceSession;
  onProceedToCheckout: (bookingData: ServiceBookingData) => void;
}

export interface ServiceBookingData {
  customer_name: string;
  email: string;
  phone: string;
  serviceType: string;
  serviceName: string;
  selectedSession: ServiceSession;
  total_amount: number;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(218,198,171,0.06)',
  border: '1px solid rgba(218,198,171,0.18)',
  borderRadius: '6px',
  padding: '12px 16px',
  fontFamily: "'Gotham', system-ui, sans-serif",
  fontSize: '14px',
  fontWeight: 300,
  color: '#DAC6AB',
  outline: 'none',
  transition: 'border-color 0.2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontFamily: "'Gotham', system-ui, sans-serif",
  fontSize: '10px',
  fontWeight: 500,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'rgba(218,198,171,0.55)',
  marginBottom: '8px',
};

const ServiceBookingForm: React.FC<ServiceBookingFormProps> = ({
  isOpen,
  onClose,
  serviceType,
  serviceName,
  selectedSession,
  onProceedToCheckout,
}) => {
  const [formData, setFormData] = useState({ customer_name: '', email: '', phone: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string>('');

  if (!isOpen) return null;

  const price = typeof selectedSession.price === 'string'
    ? parseInt(selectedSession.price.replace(/[^\d]/g, ''))
    : Number(selectedSession.price);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (!formData.customer_name.trim()) throw new Error('Please enter your full name');
      if (!formData.email.trim())         throw new Error('Please enter your email address');
      if (formData.phone.trim().length < 10) throw new Error('Please enter a valid 10-digit phone number');

      onProceedToCheckout({
        customer_name: formData.customer_name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        serviceType,
        serviceName,
        selectedSession,
        total_amount: price,
      });
    } catch (err: unknown) {
      // This form is reused in multiple flows; keep it non-blocking but visible in console.
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

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
              Almost there
            </p>
            <h3 className="font-heading text-2xl text-sand">Your Details</h3>
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

          {/* Session summary */}
          <div
            className="mb-6 p-4 space-y-2"
            style={{ background: 'rgba(37,96,96,0.1)', borderRadius: '8px', border: '1px solid rgba(37,96,96,0.2)' }}
          >
            <div className="flex justify-between items-center">
              <span style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '12px', fontWeight: 300, color: 'rgba(218,198,171,0.55)' }}>Service</span>
              <span style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '13px', fontWeight: 400, color: '#DAC6AB' }}>{serviceName}</span>
            </div>
            <div
              className="flex justify-between items-center pt-2"
              style={{ borderTop: '1px solid rgba(218,198,171,0.1)', marginTop: 4 }}
            >
              <span
                style={{
                  fontFamily: "'Gotham', system-ui, sans-serif",
                  fontSize: '12px',
                  fontWeight: 500,
                  color: 'rgba(218,198,171,0.7)',
                  letterSpacing: '0.06em',
                }}
              >
                Energy Exchange
              </span>
              <span className="font-heading text-xl text-teal">INR {price}</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5" id="booking-form">
            <div>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                name="customer_name"
                placeholder="Enter your full name"
                value={formData.customer_name}
                onChange={handleChange}
                onFocus={() => setFocusedField('customer_name')}
                onBlur={() => setFocusedField('')}
                style={{
                  ...inputStyle,
                  borderColor: focusedField === 'customer_name' ? '#256060' : 'rgba(218,198,171,0.18)',
                }}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                style={{
                  ...inputStyle,
                  borderColor: focusedField === 'email' ? '#256060' : 'rgba(218,198,171,0.18)',
                }}
                required
              />
            </div>

            <div>
              <label style={labelStyle}>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="10-digit phone number"
                value={formData.phone}
                onChange={handleChange}
                onFocus={() => setFocusedField('phone')}
                onBlur={() => setFocusedField('')}
                style={{
                  ...inputStyle,
                  borderColor: focusedField === 'phone' ? '#256060' : 'rgba(218,198,171,0.18)',
                }}
                required
                pattern="[0-9]{10}"
                title="Please enter a valid 10-digit phone number"
              />
            </div>
          </form>
        </div>

        {/* ── FOOTER ── */}
        <div
          className="px-7 py-5 flex-shrink-0 space-y-3"
          style={{ borderTop: '1px solid rgba(218,198,171,0.12)' }}
        >
          <button
            type="submit"
            form="booking-form"
            disabled={isSubmitting}
            style={{
              width: '100%',
              fontFamily: "'Gotham', system-ui, sans-serif",
              fontSize: '11px',
              fontWeight: 500,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#DAC6AB',
              background: isSubmitting ? 'rgba(37,96,96,0.4)' : '#256060',
              border: 'none',
              padding: '14px',
              borderRadius: '6px',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              transition: 'background 0.25s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
            }}
            onMouseEnter={e => { if (!isSubmitting) (e.currentTarget as HTMLElement).style.background = '#1d4f4f'; }}
            onMouseLeave={e => { if (!isSubmitting) (e.currentTarget as HTMLElement).style.background = '#256060'; }}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-sand/30 border-t-sand rounded-full" />
                Processing...
              </>
            ) : (
              'Proceed to Checkout'
            )}
          </button>

          <p
            className="text-center"
            style={{ fontFamily: "'Gotham', system-ui, sans-serif", fontSize: '11px', fontWeight: 300, color: 'rgba(218,198,171,0.4)', lineHeight: 1.6 }}
          >
            We will contact you within 24 hours to schedule your session.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingForm;