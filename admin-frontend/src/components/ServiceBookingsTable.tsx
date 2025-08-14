import React, { useState } from 'react';
import { Search, Filter, Check, Clock, Calendar } from 'lucide-react';
import { Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface ServiceBooking {
  id: number;
  orderId: number;
  name: string;
  serviceType: string;
  status: 'pending' | 'confirmed' | 'completed';
  date: string;
  time: string;
  notes?: string;
  whatsapp: string;
}

const FEEDBACK_FORM_LINK = 'https://forms.gle/your-feedback-form-link';

const ServiceBookingsTable: React.FC = () => {
  const [bookings, setBookings] = useState<ServiceBooking[]>([
    { id: 1, orderId: 1, name: 'John Doe', serviceType: 'Crystal Healing Session', status: 'pending', date: '2024-01-15', time: '10:00 AM', notes: 'First time client', whatsapp: '919999999999' },
    { id: 2, orderId: 2, name: 'Jane Smith', serviceType: 'Chakra Alignment', status: 'pending', date: '2024-01-14', time: 'TBD', whatsapp: '919888888888' },
    { id: 3, orderId: 3, name: 'Mike Johnson', serviceType: 'Aura Reading', status: 'confirmed', date: '2024-01-13', time: '2:00 PM', whatsapp: '919777777777' },
    { id: 4, orderId: 4, name: 'Sarah Wilson', serviceType: 'Energy Cleansing', status: 'completed', date: '2024-01-12', time: '11:00 AM', whatsapp: '919666666666' },
  ]);
  const [feedbackSent, setFeedbackSent] = useState<{ [id: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusSelections, setStatusSelections] = useState<{ [id: number]: ServiceBooking['status'] }>({});
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const highlightOrderId = params.get('highlightOrderId');

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.orderId.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateBookingStatus = (bookingId: number) => {
    const newStatus = statusSelections[bookingId];
    if (!newStatus) return;
    setBookings(bookings.map(booking => 
      booking.id === bookingId ? { ...booking, status: newStatus } : booking
    ));
    setStatusSelections(prev => ({ ...prev, [bookingId]: undefined }));
    // Here you would typically send a notification to the user
    console.log(`Service booking ${newStatus} for booking ${bookingId} - User will be notified`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <Check className="h-4 w-4" />;
      case 'confirmed': return <Calendar className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg border border-amber-200">
      {/* Filters */}
      <div className="p-6 border-b border-amber-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5 z-10" />
            <input
              type="text"
              placeholder="Search by order ID, name, service type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white/80 backdrop-blur-sm font-serif"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5 z-10" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent appearance-none bg-white/80 backdrop-blur-sm font-serif"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-amber-100 to-orange-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Booking Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Service Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Update</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Feedback</th>
            </tr>
          </thead>
          <tbody className="bg-white/60 backdrop-blur-sm divide-y divide-amber-200">
            {filteredBookings.map((booking) => {
              const highlight = highlightOrderId && booking.orderId === Number(highlightOrderId);
              return (
                <tr
                  key={booking.id}
                  id={highlight ? `highlight-row-${highlightOrderId}` : undefined}
                  className={`hover:bg-amber-50/80 transition-colors duration-200${highlight ? ' ring-2 ring-amber-500 bg-yellow-100/60' : ''}`}
                >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-amber-900 font-serif">Order #{booking.orderId}</div>
                    <div className="text-sm text-amber-700">{booking.name}</div>
                    <div className="text-sm text-amber-600">{booking.date}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-amber-900 font-serif">{booking.serviceType}</div>
                    {booking.notes && (
                      <div className="text-sm text-amber-700">{booking.notes}</div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                    {getStatusIcon(booking.status)}
                    <span className="ml-1">{booking.status}</span>
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={statusSelections[booking.id] ?? booking.status}
                    onChange={e => setStatusSelections(prev => ({ ...prev, [booking.id]: e.target.value as ServiceBooking['status'] }))}
                    className="border border-amber-300 rounded-lg px-2 py-1 text-sm font-serif bg-white/80"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => updateBookingStatus(booking.id)}
                    disabled={
                      !statusSelections[booking.id] || statusSelections[booking.id] === booking.status
                    }
                    className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white ${statusSelections[booking.id] && statusSelections[booking.id] !== booking.status ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' : 'bg-gray-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 font-serif`}
                  >
                    ✓ Update
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {booking.status === 'completed' && !feedbackSent[booking.id] ? (
                    <button
                      onClick={() => {
                        const message = encodeURIComponent(
                          `Hi ${booking.name},%0AThank you for booking a ${booking.serviceType} with us! We hope you had a wonderful experience.%0AWe would appreciate your feedback to help us improve our services. Please fill out this short form: ${FEEDBACK_FORM_LINK}`
                        );
                        window.open(`https://wa.me/${booking.whatsapp}?text=${message}`, '_blank');
                        setFeedbackSent(prev => ({ ...prev, [booking.id]: true }));
                      }}
                      className="group relative inline-flex items-center px-5 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-amber-500 via-orange-400 to-orange-600 shadow-lg hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-all duration-200 font-serif overflow-hidden"
                      style={{ minWidth: 180 }}
                    >
                      <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 animate-pulse"></span>
                      <Send className="h-5 w-5 mr-2 animate-bounce text-amber-100 group-hover:text-white" />
                      <span className="z-10">Send Feedback</span>
                    </button>
                  ) : booking.status === 'completed' && feedbackSent[booking.id] ? (
                    <span className="text-green-600 text-xs font-serif">Feedback sent</span>
                  ) : null}
                </td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ServiceBookingsTable;