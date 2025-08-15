import React from 'react';
import Navbar from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Star } from 'lucide-react';

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

const Testimonials: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-black text-white overflow-x-hidden">
    <Navbar cartCount={0} onCartClick={() => {}} />
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
    <Footer />
  </div>
);

export default Testimonials;
