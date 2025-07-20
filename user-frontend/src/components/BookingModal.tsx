import React, { useState } from 'react';

interface Session {
  id: string;
  name: string;
  duration: string;
  price: number | string;
  description: string;
}

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  serviceType: string; // 'tarot', 'palm', 'karma', 'coaching', 'crystal'
  serviceName: string;
}

// Import all service data
import tarotData from '../data/services/tarot.json';
import palmData from '../data/services/palm.json';
import karmaData from '../data/services/karma.json';
import coachingData from '../data/services/coaching.json';
import crystalData from '../data/services/crystal.json';

const serviceMap: Record<string, any> = {
  tarot: tarotData,
  palm: palmData,
  karma: karmaData,
  coaching: coachingData,
  crystal: crystalData,
};

const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, serviceType, serviceName }) => {
  if (!isOpen) return null;
  const data = serviceMap[serviceType] || { sessions: [] };
  const [selected, setSelected] = useState(data.sessions[0]?.id || '');
  const selectedSession = data.sessions.find((s: Session) => s.id === selected) || data.sessions[0];

  // WhatsApp booking message
  const getWhatsAppUrl = () => {
    const msg = `Hi! I would like to book a ${serviceName} session: ${selectedSession.name} (${selectedSession.duration || ''}) for ₹${selectedSession.price}.`;
    return `https://wa.me/919876543210?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-[#6a3fa0] to-[#2d0b4e] rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto border border-purple-500/30 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-extrabold text-white flex items-center font-unbounded">
            <span className="mr-2">🕒</span> Book {serviceName}
          </h3>
          <button onClick={onClose} className="text-gray-300 hover:text-white text-3xl font-bold">&times;</button>
        </div>
        <div className="mb-6">
          <p className="text-lg font-semibold text-purple-200 mb-2">
            {serviceType === 'tarot' && 'Choose Your Reading Type:'}
            {serviceType === 'coaching' && 'Choose Session Duration:'}
          </p>
          <div className="space-y-4">
            {data.sessions.map((session: Session) => (
              <div
                key={session.id}
                className={`rounded-xl p-5 border transition-all duration-200 cursor-pointer ${selected === session.id ? 'border-yellow-400 bg-[#3d2466]/80' : 'border-transparent bg-[#2d0b4e]/60'} ${data.sessions.length === 1 ? 'pointer-events-none' : ''}`}
                onClick={() => setSelected(session.id)}
              >
                <div className="flex justify-between items-center mb-1">
                  <div className="text-xl sm:text-2xl font-bold text-white font-unbounded">{session.name}</div>
                  <div className="text-lg font-bold text-yellow-400">₹{session.price}</div>
                </div>
                <div className="text-purple-200 text-base mb-1">{session.description}</div>
                <div className="text-purple-300 text-sm">{session.duration}</div>
              </div>
            ))}
          </div>
        </div>
        <a
          href={getWhatsAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full mt-4 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 py-3 rounded-lg font-bold text-white text-lg text-center transition-all duration-300 shadow-lg"
        >
          <span className="inline-flex items-center justify-center gap-2">
            <svg width="22" height="22" fill="currentColor" className="inline-block"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.198.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.151-.174.2-.298.3-.497.099-.198.05-.372-.025-.52-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.007-.372-.009-.571-.009-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.363.709.306 1.262.489 1.694.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 5.617h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.999-3.648-.235-.374A9.86 9.86 0 0 1 .96 10.012C.96 4.771 5.729 0 11.004 0c2.652 0 5.144 1.037 7.019 2.921a9.825 9.825 0 0 1 2.925 7.006c-.003 5.234-4.772 9.995-10.006 9.995m8.413-18.407A10.944 10.944 0 0 0 11.004-1C4.934-1-.96 4.893-.96 10.012c0 1.77.462 3.504 1.34 5.034l-1.417 5.184a1.001 1.001 0 0 0 1.225 1.225l5.197-1.415A10.96 10.96 0 0 0 11.004 21c6.07 0 11.964-5.893 11.964-10.988 0-2.934-1.144-5.692-3.223-7.82"/></svg>
            Book via WhatsApp
          </span>
        </a>
      </div>
    </div>
  );
};

export default BookingModal;
