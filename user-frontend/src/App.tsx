import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Crystals from './pages/Crystals';
import Testimonials from './pages/Testimonials';
import Checkout from './pages/Checkout';
import Payment from './pages/Payment';
import NotFound from './pages/NotFound';
import ServiceDetail from './pages/ServiceDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:serviceId" element={<ServiceDetail />} />
        <Route path="/crystals" element={<Crystals />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}