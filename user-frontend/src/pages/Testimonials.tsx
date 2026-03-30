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
  <div className="min-h-screen bg-sand text-navy overflow-x-hidden">
    <Navbar cartCount={0} onCartClick={() => {}} />
    <section className="bg-sand py-20 px-4" data-aos="fade-up">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 text-center">
          <h2 className="font-heading mb-6 px-1 pb-0.5 pt-[0.12em] text-4xl font-bold leading-[1.25] text-plum md:text-5xl md:leading-[1.2]">
            Client Transformations
          </h2>
          <p className="text-xl text-navy/70">
            Real stories from souls who found their path
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="glass card-shadow border border-navy/10 bg-white/60 p-8 transition-all duration-300 hover:border-teal/40"
            >
              <div className="mb-4 flex">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current text-teal" />
                ))}
              </div>
              <p className="mb-6 italic leading-relaxed text-navy/80">"{testimonial.text}"</p>
              <div>
                <div className="font-semibold text-navy">{testimonial.name}</div>
                <div className="text-sm text-navy/60">{testimonial.location}</div>
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
