import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

interface PaymentPageProps {
  items?: any[];
  total?: number;
  bookingData?: any;
  isService?: boolean;
  orderId?: number | null;
}

const PaymentPage: React.FC<PaymentPageProps> = ({
  items = [],
  total = 0,
  bookingData = null,
  isService = false,
  orderId = null,
}) => {
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const entityType = isService ? 'service_booking' : 'order';
  const entityId = useMemo(() => {
    if (isService) {
      return Number(bookingData?.booking_id || 0);
    }
    return Number(orderId || 0);
  }, [isService, bookingData, orderId]);

  const finalTotal = isService ? Number(bookingData?.total || 0) : total;

  useEffect(() => {
    if (window.Razorpay) {
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const getCreateOrderEndpoint = () => {
    if (entityType === 'service_booking') {
      return `${apiUrl}/payments/service-bookings/${entityId}/create-razorpay-order`;
    }
    return `${apiUrl}/payments/orders/${entityId}/create-razorpay-order`;
  };

  const proceedToPayment = async () => {
    setErrorMessage('');
    if (!entityId) {
      setStatus('error');
      setErrorMessage('Missing order details. Please go back and place the order again.');
      return;
    }
    if (!window.Razorpay) {
      setStatus('error');
      setErrorMessage('Payment gateway failed to load. Please refresh and try again.');
      return;
    }

    setStatus('processing');

    try {
      const createOrderResponse = await fetch(getCreateOrderEndpoint(), { method: 'POST' });
      if (!createOrderResponse.ok) {
        const errorData = await createOrderResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to create payment order.');
      }

      const orderData = await createOrderResponse.json();

      const razorpay = new window.Razorpay({
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Elemental Visions',
        description: isService ? 'Service Booking Payment' : 'Crystal Order Payment',
        order_id: orderData.razorpay_order_id,
        prefill: {
          name: bookingData?.customer?.customer_name || '',
          email: bookingData?.customer?.email || '',
          contact: bookingData?.customer?.phone || '',
        },
        notes: {
          entity_type: entityType,
          entity_id: String(entityId),
        },
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch(`${apiUrl}/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                entity_type: entityType,
                entity_id: entityId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              const errorData = await verifyResponse.json().catch(() => ({}));
              throw new Error(errorData.detail || 'Payment verification failed.');
            }

            setStatus('success');
            setTimeout(() => navigate('/'), 1500);
          } catch (err: any) {
            setStatus('error');
            setErrorMessage(err?.message || 'Payment verification failed.');
          }
        },
        modal: {
          ondismiss: () => {
            setStatus('idle');
          },
        },
        theme: {
          color: '#0F2346',
        },
      });

      razorpay.open();
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err?.message || 'Unable to start payment. Please try again.');
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10">
      <div className="rounded-2xl border border-plum/20 bg-sand p-6 shadow-lg">
        <h1 className="text-3xl font-bold text-plum">Complete Your Payment</h1>
        <p className="mt-2 text-navy/70">Review your order and proceed with Razorpay.</p>

        <div className="mt-6 rounded-xl border border-plum/20 bg-white p-4">
          <h2 className="text-xl font-semibold text-navy">Order Summary</h2>

          {isService ? (
            <div className="mt-4 space-y-2 text-navy/90">
              <div>
                <span className="font-semibold">Service:</span> {bookingData?.service?.name}
              </div>
              <div>
                <span className="font-semibold">Session:</span> {bookingData?.service?.session}
              </div>
              <div>
                <span className="font-semibold">Duration:</span> {bookingData?.service?.duration}
              </div>
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {items.map((item: any, idx: number) => (
                <li
                  key={`${item.crystal.id}-${item.form.name}-${idx}`}
                  className="flex items-center justify-between text-navy/90"
                >
                  <span>
                    {item.crystal.name} ({item.form.name}) x {item.quantity}
                  </span>
                  <span className="font-semibold">INR {item.form.price * item.quantity}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-plum/20 pt-4">
            <span className="text-lg font-semibold text-navy">Total</span>
            <span className="text-2xl font-bold text-teal">INR {finalTotal}</span>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}

        {status === 'success' && (
          <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            Payment successful. Redirecting to home...
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-1/2 rounded-lg border border-plum/30 px-4 py-3 font-semibold text-navy"
            disabled={status === 'processing'}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={proceedToPayment}
            className="w-1/2 rounded-lg bg-navy px-4 py-3 font-semibold text-sand"
            disabled={status === 'processing'}
          >
            {status === 'processing' ? 'Processing...' : 'Proceed to Payment'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
