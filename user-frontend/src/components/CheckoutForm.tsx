import React, { useEffect, useRef, useState } from 'react';
import { CartItem } from '../types';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onOrderComplete: (orderId: number) => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({
  isOpen,
  onClose,
  items,
  total,
  onOrderComplete
}) => {
  const [formData, setFormData] = useState({
    customer_name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const gpayBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only run if Google Pay script is loaded and modal is open
    if (window.google && window.google.payments && isOpen && gpayBtnRef.current) {
      const paymentsClient = new window.google.payments.api.PaymentsClient({
        environment: 'TEST', // Change to 'PRODUCTION' after approval
      });

      const paymentRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: 'UPI',
          parameters: {
            payeeVpa: 'your-upi-id@bank', // <-- Replace with your UPI ID
            payeeName: 'Your Business Name', // <-- Replace with your business name
          },
          tokenizationSpecification: {
            type: 'PAYMENT_GATEWAY',
            parameters: {
              gateway: 'upi',
            },
          },
        }],
        transactionInfo: {
          totalPriceStatus: 'FINAL',
          totalPrice: total.toString(),
          currencyCode: 'INR',
        },
        merchantInfo: {
          merchantName: 'Your Business Name', // <-- Replace with your business name
        },
      };

      paymentsClient.isReadyToPay({ allowedPaymentMethods: paymentRequest.allowedPaymentMethods })
        .then(function(response) {
          if (response.result) {
            const button = paymentsClient.createButton({
              onClick: () => {
                paymentsClient.loadPaymentData(paymentRequest)
                  .then(() => {})
                  .catch(() => {});
              },
              buttonColor: 'default',
              buttonType: 'long',
            });
            gpayBtnRef.current.innerHTML = '';
            gpayBtnRef.current.appendChild(button);
          }
        });
    }
  }, [total, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
    setErrorMessage('');

		try {
			const orderItems = items.map(item => ({
				crystal: item.crystal.name,
				form: item.form.name,
				quantity: item.quantity,
				unit_price: item.form.price,
			}));
			const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
			const response = await fetch(`${apiUrl}/orders/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					customer_name: formData.customer_name,
					email: formData.email,
					phone: formData.phone,
					address: formData.address,
					items: orderItems,
					total_amount: total,
					status: 'pending',
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to place order.');
			}

      const createdOrder = await response.json();

      setShowPayment(true);
      onOrderComplete(createdOrder.id);
		} catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to place order.';
      setErrorMessage(message);
		} finally {
			setIsSubmitting(false);
		}
	};


  if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
		<div className="bg-gradient-to-br from-navy to-plum rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-plum/30">
		<div className="flex justify-between items-center mb-6">
		<h3 className="text-2xl font-bold text-sand">Checkout</h3>
		<button onClick={onClose} className="text-navy/60 hover:text-sand text-2xl font-bold">&times;</button>
		</div>
    {errorMessage ? (
      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {errorMessage}
      </div>
    ) : null}
		{showPayment ? (
			<div className="text-center text-teal font-bold text-xl py-12">Order placed! Proceed to payment.</div>
		) : (
		<form onSubmit={handleSubmit} className="space-y-6">
		<div>
		<input
		type="text"
		name="customer_name"
		placeholder="Your Name"
		value={formData.customer_name}
		onChange={handleChange}
		className="w-full bg-navy/30 border border-plum/30 rounded-lg px-4 py-3 text-sand placeholder-navy/40 focus:border-teal focus:outline-none transition-colors"
		required
		/>
		</div>
		<div>
		<input
		type="email"
		name="email"
		placeholder="Your Email"
		value={formData.email}
		onChange={handleChange}
		className="w-full bg-navy/30 border border-plum/30 rounded-lg px-4 py-3 text-sand placeholder-navy/40 focus:border-teal focus:outline-none transition-colors"
		required
		/>
		</div>
		<div>
		<input
		type="tel"
		name="phone"
		placeholder="Your Phone"
		value={formData.phone}
		onChange={handleChange}
		className="w-full bg-navy/30 border border-plum/30 rounded-lg px-4 py-3 text-sand placeholder-navy/40 focus:border-teal focus:outline-none transition-colors"
		required
		/>
		</div>
		<div>
		<textarea
		name="address"
		placeholder="Your Address"
		value={formData.address}
		onChange={handleChange}
		rows={3}
		className="w-full bg-navy/30 border border-plum/30 rounded-lg px-4 py-3 text-sand placeholder-navy/40 focus:border-teal focus:outline-none transition-colors resize-none"
		required
		/>
		</div>
		<div className="mb-4">
		<h3 className="text-xl font-bold text-teal mb-2">Order Summary</h3>
		<ul className="divide-y divide-plum/20">
		{items.map((item, idx) => (
			<li key={item.crystal.id + '-' + item.form.name + '-' + idx} className="py-2 flex items-center justify-between">
			<div>
			<span className="font-semibold text-sand">{item.crystal.name}</span>
			<span className="text-xs text-teal ml-2">({item.form.name})</span>
			<span className="text-xs text-sand/70 ml-2">x {item.quantity}</span>
			</div>
			<div className="text-teal font-bold">
				₹{item.form.price * item.quantity}{item.form.name === 'Raw' ? ' onwards' : ''}
			</div>
			</li>
		))}
		</ul>
		<div className="mt-2 space-y-2">
		{(() => {
			const subtotal = items.reduce((sum, item) => sum + (item.form.price * item.quantity), 0);
			const hasCrystals = items.some(item => item.type === 'crystal');
			const shippingCharge = hasCrystals ? 150 : 0;
			return (
				<>
					<div className="flex justify-between text-sand">
						<span>Subtotal:</span>
						<span>₹{subtotal}</span>
					</div>
					{hasCrystals && (
						<div className="flex justify-between text-sand/70 text-sm">
							<span>Shipping within India:</span>
							<span>₹{shippingCharge}</span>
						</div>
					)}
				</>
			);
		})()}
		</div>
		</div>
		<div className="mt-auto border-t border-plum/30 pt-4 flex justify-between items-center">
		<span className="text-lg font-bold text-sand">Total:</span>
		<span className="text-2xl font-bold text-teal">₹{total}</span>
		</div>
		<button
		type="submit"
		disabled={isSubmitting}
		className="mt-6 w-full bg-gradient-to-r from-teal to-navy hover:opacity-90 py-3 rounded-lg font-semibold transition-all duration-300"
		>
		{isSubmitting ? 'Placing Order...' : 'Place Order'}
		</button>
		</form>
		)}
		<div className="mt-6 flex flex-col items-center">
          <div ref={gpayBtnRef}></div>
          <span className="text-xs text-navy/60 mt-2">Pay securely with Google Pay</span>
        </div>
		</div>
		</div>
	);
};

export default CheckoutForm;
