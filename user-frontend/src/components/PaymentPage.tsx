import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const PaymentPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Get items and total from location state
  const { items = [], total = 0 } = (location.state as any) || {};

  useEffect(() => {
    AOS.init({ once: true, duration: 900, offset: 60 });
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-indigo-900 to-black flex flex-col">
      <div className="w-full text-center py-10">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">Complete Your Payment</h1>
        <p className="text-purple-200 mt-2 text-lg">Thank you for your order! Please pay using the details below.</p>
      </div>
      <div className="flex flex-col md:flex-row w-full h-full flex-1 gap-0 md:gap-0 justify-center items-stretch">
        {/* Left: QR and UPI */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-purple-500/40 p-10 bg-white/10 backdrop-blur-lg shadow-2xl relative" data-aos="fade-right">
          <div className="rounded-2xl p-3 bg-gradient-to-br from-yellow-400/30 to-orange-400/10 shadow-xl border-4 border-yellow-400/40 mb-6 animate-pulse-slow">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=upi://pay?pa=yourname@upi" alt="UPI QR Code" className="w-56 h-56 rounded-xl shadow-2xl border-4 border-yellow-400/80" />
          </div>
          <div className="text-center">
            <div className="text-2xl text-white font-extrabold mb-1 tracking-wide">Scan & Pay</div>
            <div className="text-yellow-400 font-mono text-lg md:text-xl mb-1">yourname@upi</div>
            <div className="text-xs text-purple-200 mb-2">(UPI ID)</div>
            <div className="text-sm text-yellow-200 bg-black/30 rounded-lg px-4 py-2 mt-2 inline-block shadow-md">After payment, please take a screenshot and share it with us for order confirmation.</div>
          </div>
        </div>
        {/* Divider for desktop */}
        <div className="hidden md:block w-0.5 bg-gradient-to-b from-yellow-400/30 to-purple-400/30 my-16 mx-0"></div>
        {/* Right: Order Summary */}
        <div className="w-full md:w-1/2 flex flex-col p-10 bg-white/10 backdrop-blur-lg shadow-2xl min-h-[400px] justify-center" data-aos="fade-left">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-yellow-400 mb-4 tracking-wide drop-shadow">Order Summary</h3>
            <ul className="divide-y divide-purple-500/20 bg-black/30 rounded-xl shadow-inner p-4">
              {items.length === 0 ? (
                <li className="py-2 text-purple-200">No items in order.</li>
              ) : (
                items.map((item: any, idx: number) => (
                  <li key={item.crystal.id + '-' + item.form.name + '-' + idx} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-white text-lg">{item.crystal.name}</span>
                      <span className="text-xs text-yellow-400 ml-2">({item.form.name})</span>
                      <span className="text-xs text-purple-300 ml-2">x {item.quantity}</span>
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