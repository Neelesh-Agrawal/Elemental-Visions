import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// TypeScript declarations for Google Pay API
declare global {
  interface Window {
    google?: {
      payments: {
        api: {
          PaymentsClient: new (config: any) => {
            isReadyToPay: (request: any) => Promise<{ result: boolean }>;
            loadPaymentData: (request: any) => Promise<any>;
            createButton: (config: any) => HTMLElement;
          };
        };
      };
    };
  }
}

interface PaymentPageProps {
  items?: any[];
  total?: number;
  bookingData?: any;
  isService?: boolean;
}

const PaymentPage: React.FC<PaymentPageProps> = ({ 
  items = [], 
  total = 0, 
  bookingData = null, 
  isService = false 
}) => {
  const navigate = useNavigate();
  
  // Use service booking total if it's a service, otherwise use items total
  const finalTotal = isService && bookingData ? bookingData.total : total;
  

  const [isGooglePayReady, setIsGooglePayReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const gpayBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    AOS.init({ once: true, duration: 900, offset: 60 });
  }, []);

  // Load Google Pay script
  useEffect(() => {
    const loadGooglePayScript = () => {
      if (window.google?.payments) {
        initializeGooglePay();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://pay.google.com/gp/p/js/pay.js';
      script.async = true;
      script.onload = () => {
        initializeGooglePay();
      };
      script.onerror = () => {};
      document.head.appendChild(script);
    };

    loadGooglePayScript();
  }, [finalTotal]);

  const initializeGooglePay = () => {
    if (!window.google?.payments || finalTotal <= 0) return;

    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: 'PRODUCTION' // Change to 'PRODUCTION' for live payments
    });

    // Configuration for UPI payments in India
    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'UPI',
          parameters: {
            payeeVpa: 'elementalvisions.in@okhdfcbank',
            payeeName: 'Elemental Visions',
          },
        },
      ],
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: finalTotal.toString(),
        currencyCode: 'INR',
      },
      merchantInfo: {
        merchantName: 'Elemental Visions',
      },
    };

    paymentsClient.isReadyToPay({
      allowedPaymentMethods: paymentDataRequest.allowedPaymentMethods
    }).then((response) => {
      if (response.result) {
        setIsGooglePayReady(true);
        createGooglePayButton(paymentsClient, paymentDataRequest);
      }
    }).catch(() => {});
  };

  const createGooglePayButton = (paymentsClient: any, paymentDataRequest: any) => {
    if (!gpayBtnRef.current) return;

    const button = paymentsClient.createButton({
      onClick: () => handleGooglePayClick(paymentsClient, paymentDataRequest),
      buttonColor: 'default',
      buttonType: 'long',
    });

    gpayBtnRef.current.innerHTML = '';
    gpayBtnRef.current.appendChild(button);
  };

  const handleGooglePayClick = async (paymentsClient: any, paymentDataRequest: any) => {
    setPaymentStatus('processing');
    try {
      await paymentsClient.loadPaymentData(paymentDataRequest);
      // Here you would typically send the payment data to your backend
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentStatus('success');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch {
      setPaymentStatus('error');
    }
  };

  // Alternative UPI payment handler for direct UPI apps
  const handleUPIPayment = () => {
    const upiUrl = `upi://pay?pa=elementalvisions.in@okhdfcbank&pn=Elemental Visions&am=${finalTotal}&cu=INR&tn=Order Payment`;
    // Try to open UPI app
    const link = document.createElement('a');
    link.href = upiUrl;
    link.click();
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'processing': return 'bg-plum';
      case 'success': return 'bg-teal';
      case 'error': return 'bg-plum';
      default: return 'bg-teal';
    }
  };

  const getStatusText = () => {
    switch (paymentStatus) {
      case 'processing': return 'Processing Payment...';
      case 'success': return 'Payment Successful!';
      case 'error': return 'Payment Failed';
      default: return 'Ready to Pay';
    }
  };

  return (
    <div className="min-h-screen w-full bg-sand flex flex-col">
      {/* Header */}
      <div className="w-full text-center py-10">
        <h1 className="inline-block px-1 pb-1 pt-[0.14em] text-4xl font-extrabold leading-[1.22] tracking-tight text-plum md:text-5xl md:leading-[1.2]">
          Complete Your Payment
        </h1>
        <p className="mt-2 text-lg text-navy/75">
          Thank you for your order! Choose your preferred payment method.
        </p>
        {/* Payment Status Indicator */}
        <div className={`mt-4 inline-flex items-center px-4 py-2 rounded-full ${getStatusColor()} text-sand font-semibold shadow-lg`}>
          {paymentStatus === 'processing' && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-sand mr-2"></div>
          )}
          {getStatusText()}
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full h-full flex-1 gap-0 md:gap-0 justify-center items-stretch">
        {/* Left: Payment Methods */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-plum/40 p-10 bg-sand/10 backdrop-blur-lg shadow-2xl relative" data-aos="fade-right">
          {/* Google Pay Button */}
          {isGooglePayReady && (
            <div className="mb-8 w-full max-w-xs">
              <h3 className="mb-4 text-center text-xl font-bold text-navy">Pay with Google Pay</h3>
              <div ref={gpayBtnRef} className="w-full"></div>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center w-full max-w-xs mb-8">
            <div className="flex-grow border-t border-plum/30"></div>
            <span className="mx-4 flex-shrink text-sm text-navy/70">OR</span>
            <div className="flex-grow border-t border-plum/30"></div>
          </div>

          {/* QR Code and UPI */}
          <div className="text-center flex flex-col items-center">
            <div className="flex justify-center items-center mb-6">
              <div className="p-3 bg-gradient-to-br from-sand/25 to-teal/10 shadow-xl border-4 border-teal/40 rounded-2xl flex justify-center items-center"
                style={{ width: 'max-content', minWidth: '240px', minHeight: '240px' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=elementalvisions.in@okhdfcbank&pn=Elemental Visions&am=${finalTotal}&cu=INR&tn=Order Payment`}
                  alt="UPI QR Code"
                  className="w-56 h-56 rounded-xl shadow-2xl border-4 border-teal/80"
                />
              </div>
            </div>
            <div className="mb-1 text-2xl font-extrabold tracking-wide text-navy">Scan & Pay</div>
            <div className="flex items-center justify-center mb-1">
              <span className="text-teal font-mono text-lg md:text-xl mr-2 select-all">elementalvisions.in@okhdfcbank</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('elementalvisions.in@okhdfcbank');
                }}
                className="bg-teal text-navy px-2 py-1 rounded font-bold text-xs hover:bg-sand transition"
                title="Copy UPI ID"
              >
                Copy
              </button>
            </div>
            <div className="mb-4 text-xs text-navy/70">(UPI ID)</div>
            {/* Direct UPI Payment Button */}
            <button
              onClick={handleUPIPayment}
              className="mb-4 bg-gradient-to-r from-navy to-plum hover:opacity-90 px-6 py-3 rounded-xl font-bold text-sand shadow-xl transition-all duration-300 tracking-wide"
              disabled={paymentStatus === 'processing'}
            >
              Pay with UPI App
            </button>
            <div className="text-sm text-sand bg-navy/30 rounded-lg px-4 py-2 mt-2 inline-block shadow-md">
              After payment, please take a screenshot and share it with us for order confirmation.
            </div>
          </div>
        </div>

        {/* Divider for desktop */}
        <div className="hidden md:block w-0.5 bg-gradient-to-b from-teal/30 to-plum/30 my-16 mx-0"></div>

        {/* Right: Order Summary */}
        <div className="w-full md:w-1/2 flex flex-col p-10 bg-sand/10 backdrop-blur-lg shadow-2xl min-h-[400px] justify-center" data-aos="fade-left">
          {/* Customer Info for Service Bookings */}
          {isService && bookingData && (
            <div className="mb-6">
              <h3 className="mb-3 text-2xl font-bold tracking-wide text-plum">Booking Details</h3>
              <div className="rounded-xl border border-sand/15 bg-navy p-4 shadow-lg">
                <div className="mb-1 text-sm text-sand/95">
                  <span className="font-semibold">Customer:</span> {bookingData.customer.customer_name}
                </div>
                <div className="mb-1 text-sm text-sand/95">
                  <span className="font-semibold">Email:</span> {bookingData.customer.email}
                </div>
                <div className="text-sm text-sand/95">
                  <span className="font-semibold">Phone:</span> {bookingData.customer.phone}
                </div>
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h3 className="mb-4 text-2xl font-bold tracking-wide text-plum">
              {isService ? 'Service Summary' : 'Order Summary'}
            </h3>
            <ul className="divide-y divide-sand/20 rounded-xl border border-sand/15 bg-navy p-4 shadow-lg">
              {isService && bookingData ? (
                <li className="py-3 flex items-center justify-between">
                  <div>
                    <span className="text-lg font-semibold text-sand">{bookingData.service.name}</span>
                    <span className="ml-2 text-xs text-teal/90">({bookingData.service.session})</span>
                    <div className="mt-1 text-xs text-sand/75">{bookingData.service.duration}</div>
                  </div>
                  <div className="text-lg font-bold text-teal">₹{bookingData.service.price}</div>
                </li>
              ) : items.length === 0 ? (
                <li className="py-2 text-sand/90">No items in order.</li>
              ) : (
                items.map((item: any, idx: number) => (
                  <li key={item.crystal.id + '-' + item.form.name + '-' + idx} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-sand text-lg">{item.crystal.name}</span>
                      <span className="text-xs text-teal ml-2">({item.form.name})</span>
                      <span className="text-xs text-sand/70 ml-2">x {item.quantity}</span>
                    </div>
                    <div className="text-teal font-bold text-lg">
                      ₹{item.form.price * item.quantity}{item.form.name === 'Raw' ? ' onwards' : ''}
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>
          
          {/* Shipping and Total Breakdown */}
          {!isService && items.length > 0 && (
            <div className="mb-4 space-y-2">
              {(() => {
                const subtotal = items.reduce((sum: number, item: any) => sum + (item.form.price * item.quantity), 0);
                const hasCrystals = items.some((item: any) => item.type === 'crystal');
                const shippingCharge = hasCrystals ? 150 : 0;
                return (
                  <>
                    <div className="flex justify-between text-navy/80">
                      <span>Subtotal:</span>
                      <span>₹{subtotal}</span>
                    </div>
                    {hasCrystals && (
                      <div className="flex justify-between text-sm text-navy/60">
                        <span>Shipping within India:</span>
                        <span>₹{shippingCharge}</span>
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          )}
          
          <div className="mt-auto">
            <div className="bg-gradient-to-r from-sand/15 to-teal/15 rounded-xl p-6 flex justify-between items-center shadow-lg border-2 border-teal/30">
              <span className="text-xl font-bold text-navy">Total:</span>
              <span className="text-3xl font-extrabold text-teal drop-shadow">₹{finalTotal}</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-8 w-full bg-gradient-to-r from-teal to-navy hover:opacity-90 py-4 rounded-xl font-bold text-lg text-sand shadow-xl transition-all duration-300 tracking-wide"
              disabled={paymentStatus === 'processing'}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;