import React, { useState } from 'react';
import { CartItem } from '../types';

interface CheckoutFormProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onOrderComplete: () => void;
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const response = await fetch(`${process.env.API_URL}/orders/`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					customer_name: customerName,
					email: email,
					phone: phone,
					address: address,
					crystal: selectedCrystal,
					form: selectedForm,
					total_amount: totalAmount,
					status: 'pending',
				}),
			});

			if (!response.ok) {
				throw new Error('Failed to place order.');
			}

			const data = await response.json();
			console.log('Order created:', data);

			setShowPayment(true);
			onOrderComplete(); 
		} catch (error) {
			console.error(error);
			alert('Error placing order. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};


	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
		<div className="bg-gradient-to-br from-purple-900 to-indigo-900 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-purple-500/30">
		<div className="flex justify-between items-center mb-6">
		<h3 className="text-2xl font-bold text-white">Checkout</h3>
		<button onClick={onClose} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
		</div>
		{showPayment ? (
			<div className="text-center text-green-400 font-bold text-xl py-12">Order placed! Proceed to payment.</div>
		) : (
		<form onSubmit={handleSubmit} className="space-y-6">
		<div>
		<input
		type="text"
		name="customer_name"
		placeholder="Your Name"
		value={formData.customer_name}
		onChange={handleChange}
		className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
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
		className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
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
		className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors"
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
		className="w-full bg-black/30 border border-purple-500/30 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none transition-colors resize-none"
		required
		/>
		</div>
		<div className="mb-4">
		<h3 className="text-xl font-bold text-yellow-400 mb-2">Order Summary</h3>
		<ul className="divide-y divide-purple-500/20">
		{items.map((item, idx) => (
			<li key={item.crystal.id + '-' + item.form.name + '-' + idx} className="py-2 flex items-center justify-between">
			<div>
			<span className="font-semibold text-white">{item.crystal.name}</span>
			<span className="text-xs text-yellow-400 ml-2">({item.form.name})</span>
			<span className="text-xs text-purple-300 ml-2">x {item.quantity}</span>
			</div>
			<div className="text-yellow-300 font-bold">₹{item.form.price * item.quantity}</div>
			</li>
		))}
		</ul>
		</div>
		<div className="mt-auto border-t border-purple-500/30 pt-4 flex justify-between items-center">
		<span className="text-lg font-bold text-white">Total:</span>
		<span className="text-2xl font-bold text-yellow-400">₹{total}</span>
		</div>
		<button
		type="submit"
		disabled={isSubmitting}
		className="mt-6 w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 py-3 rounded-lg font-semibold transition-all duration-300"
		>
		{isSubmitting ? 'Placing Order...' : 'Place Order'}
		</button>
		</form>
		)}
		</div>
		</div>
	);
};

export default CheckoutForm;
