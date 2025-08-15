import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

<<<<<<< HEAD
interface PaymentPageProps {
  orderType?: 'crystal' | 'service';
}

const PaymentPage: React.FC<PaymentPageProps> = ({ orderType = 'crystal' }) => {
=======
const PaymentPage: React.FC = () => {
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
  const location = useLocation();
  const navigate = useNavigate();
  const { items = [], total = 0 } = (location.state as any) || {};

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
      script.onerror = () => {
        console.error('Failed to load Google Pay script');
      };
      document.head.appendChild(script);
    };

    loadGooglePayScript();
  }, [total]);

  const initializeGooglePay = () => {
    if (!window.google?.payments || total <= 0) return;

    const paymentsClient = new window.google.payments.api.PaymentsClient({
      environment: 'TEST' // Change to 'PRODUCTION' for live payments
    });

    // Configuration for UPI payments in India
    const paymentDataRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: 'UPI',
          parameters: {
            payeeVpa: 'elementalvisions@upi',
            payeeName: 'Elemental Visions',
          },
        },
      ],
      transactionInfo: {
        totalPriceStatus: 'FINAL',
        totalPrice: total.toString(),
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
    }).catch((err) => {
      console.error('Google Pay not available:', err);
    });
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
      const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);
      // Here you would typically send the payment data to your backend
      console.log('Payment data received:', paymentData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setPaymentStatus('success');
      alert('Payment successful! Order confirmed.');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      console.error('Payment failed:', err);
      setPaymentStatus('error');
      if (err.statusCode === 'CANCELED') {
        alert('Payment was cancelled.');
      } else {
        alert('Payment failed. Please try again.');
      }
    }
  };

  // Alternative UPI payment handler for direct UPI apps
  const handleUPIPayment = () => {
    const upiUrl = `upi://pay?pa=elementalvisions@upi&pn=Elemental Visions&am=${total}&cu=INR&tn=Order Payment`;
    // Try to open UPI app
    const link = document.createElement('a');
    link.href = upiUrl;
    link.click();
    // Fallback: show instructions
    setTimeout(() => {
      alert('If UPI app didn\'t open automatically, please use the QR code or UPI ID to make payment.');
    }, 1000);
  };

  const getStatusColor = () => {
    switch (paymentStatus) {
      case 'processing': return 'from-blue-500 to-blue-600';
      case 'success': return 'from-green-500 to-green-600';
      case 'error': return 'from-red-500 to-red-600';
      default: return 'from-yellow-500 to-orange-500';
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
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex flex-col">
      {/* Header */}
      <div className="w-full text-center py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
          Complete Your Payment
        </h1>
        <p className="text-purple-200 mt-2 text-lg">
<<<<<<< HEAD
          Thank you for your {orderType === 'service' ? 'service booking' : 'order'}! Choose your preferred payment method.
=======
          Thank you for your order! Choose your preferred payment method.
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
        </p>
        {/* Payment Status Indicator */}
        <div className={`mt-4 inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r ${getStatusColor()} text-white font-semibold shadow-lg`}>
          {paymentStatus === 'processing' && (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          )}
          {getStatusText()}
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full h-full flex-1 gap-0 md:gap-0 justify-center items-stretch">
        {/* Left: Payment Methods */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-purple-500/40 p-10 bg-white/10 backdrop-blur-lg shadow-2xl relative" data-aos="fade-right">
          {/* Google Pay Button */}
          {isGooglePayReady && (
            <div className="mb-8 w-full max-w-xs">
              <h3 className="text-xl font-bold text-white mb-4 text-center">Pay with Google Pay</h3>
              <div ref={gpayBtnRef} className="w-full"></div>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center w-full max-w-xs mb-8">
            <div className="flex-grow border-t border-purple-400/30"></div>
            <span className="flex-shrink mx-4 text-purple-200 text-sm">OR</span>
            <div className="flex-grow border-t border-purple-400/30"></div>
          </div>

          {/* QR Code and UPI */}
          <div className="text-center flex flex-col items-center">
            <div className="flex justify-center items-center mb-6">
              <div className="p-3 bg-gradient-to-br from-yellow-400/30 to-orange-400/10 shadow-xl border-4 border-yellow-400/40 rounded-2xl flex justify-center items-center"
                style={{ width: 'max-content', minWidth: '240px', minHeight: '240px' }}>
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=elementalvisions@upi&pn=Elemental Visions&am=${total}&cu=INR&tn=Order Payment`}
                  alt="UPI QR Code"
                  className="w-56 h-56 rounded-xl shadow-2xl border-4 border-yellow-400/80"
                />
              </div>
            </div>
            <div className="text-2xl text-white font-extrabold mb-1 tracking-wide">Scan & Pay</div>
            <div className="flex items-center justify-center mb-1">
              <span className="text-yellow-400 font-mono text-lg md:text-xl mr-2 select-all">elementalvisions@upi</span>
              <button
                onClick={() => {
                  navigator.clipboard.writeText('elementalvisions@upi');
                }}
                className="bg-yellow-400 text-black px-2 py-1 rounded font-bold text-xs hover:bg-yellow-300 transition"
                title="Copy UPI ID"
              >
                Copy
              </button>
            </div>
            <div className="text-xs text-purple-200 mb-4">(UPI ID)</div>
            {/* Direct UPI Payment Button */}
            <button
              onClick={handleUPIPayment}
              className="mb-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-6 py-3 rounded-xl font-bold text-white shadow-xl transition-all duration-300 tracking-wide"
              disabled={paymentStatus === 'processing'}
            >
              Pay with UPI App
            </button>
            <div className="text-sm text-yellow-200 bg-black/30 rounded-lg px-4 py-2 mt-2 inline-block shadow-md">
              After payment, please take a screenshot and share it with us for order confirmation.
            </div>
          </div>
        </div>

        {/* Divider for desktop */}
        <div className="hidden md:block w-0.5 bg-gradient-to-b from-yellow-400/30 to-purple-400/30 my-16 mx-0"></div>

        {/* Right: Order Summary */}
        <div className="w-full md:w-1/2 flex flex-col p-10 bg-white/10 backdrop-blur-lg shadow-2xl min-h-[400px] justify-center" data-aos="fade-left">
          <div className="mb-6">
<<<<<<< HEAD
            <h3 className="text-2xl font-bold text-yellow-400 mb-4 tracking-wide drop-shadow">
              {orderType === 'service' ? 'Service Booking Summary' : 'Order Summary'}
            </h3>
            <ul className="divide-y divide-purple-500/20 bg-black/30 rounded-xl shadow-inner p-4">
              {items.length === 0 ? (
                <li className="py-2 text-purple-200">No items in {orderType === 'service' ? 'booking' : 'order'}.</li>
=======
            <h3 className="text-2xl font-bold text-yellow-400 mb-4 tracking-wide drop-shadow">Order Summary</h3>
            <ul className="divide-y divide-purple-500/20 bg-black/30 rounded-xl shadow-inner p-4">
              {items.length === 0 ? (
                <li className="py-2 text-purple-200">No items in order.</li>
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
              ) : (
                items.map((item: any, idx: number) => (
                  <li key={item.crystal.id + '-' + item.form.name + '-' + idx} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white text-lg">{item.crystal.name}</span>
                      <span className="text-xs text-yellow-400 ml-2">({item.form.name})</span>
<<<<<<< HEAD
                      {orderType === 'crystal' && <span className="text-xs text-purple-300 ml-2">x {item.quantity}</span>}
=======
                      <span className="text-xs text-purple-300 ml-2">x {item.quantity}</span>
>>>>>>> 4fa3d9f04f846c48e9bc284634a30cc2d33ab7dc
                    </div>
                    <div className="text-yellow-300 font-bold text-lg">₹{item.form.price * item.quantity}</div>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="mt-auto">
            <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl p-6 flex justify-between items-center shadow-lg border-2 border-yellow-400/30">
              <span className="text-xl font-bold text-white">Total:</span>
              <span className="text-3xl font-extrabold text-yellow-400 drop-shadow">₹{total}</span>
            </div>
            <button
              onClick={() => navigate('/')}
              className="mt-8 w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 py-4 rounded-xl font-bold text-lg text-white shadow-xl transition-all duration-300 tracking-wide"
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