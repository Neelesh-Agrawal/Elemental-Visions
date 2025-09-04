import React, { useState, useEffect } from 'react';
import { Search, Filter, Check, Clock, Calendar } from 'lucide-react';
import { Send } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface ServiceBookingItem {
  id: number;
  service_name: string;
  session_name: string;
  quantity: number;
  unit_price: number;
}

interface ServiceBooking {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'rejected';
  created_at: string;
  items: ServiceBookingItem[];
}

const FEEDBACK_FORM_LINK = 'https://forms.gle/your-feedback-form-link';
const API_BASE_URL = import.meta.env.VITE_API_URL ;

const ServiceBookingsTable: React.FC = () => {
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState<{ [id: number]: boolean }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusSelections, setStatusSelections] = useState<{ [id: number]: ServiceBooking['status'] }>({});
  const [updating, setUpdating] = useState<{ [id: number]: boolean }>({});
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const highlightOrderId = params.get('highlightOrderId');

  // Fetch service bookings from API
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/service-bookings/`);
      if (!response.ok) {
        throw new Error('Failed to fetch service bookings');
      }
      const data = await response.json();
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching service bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  // Update booking status
  const updateBookingStatus = async (bookingId: number, newStatus: ServiceBooking['status']) => {
    try {
      setUpdating(prev => ({ ...prev, [bookingId]: true }));
      
      let endpoint = '';
      switch (newStatus) {
        case 'paid':
          endpoint = `${API_BASE_URL}/service-bookings/${bookingId}/pay`;
          break;
        case 'pending':
          endpoint = `${API_BASE_URL}/service-bookings/${bookingId}/pending`;
          break;
        case 'rejected':
          endpoint = `${API_BASE_URL}/service-bookings/${bookingId}/reject`;
          break;
        default:
          throw new Error('Invalid status update');
      }

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update booking status');
      }

      const updatedBooking = await response.json();
      
      // Update local state
      setBookings(prev => 
        prev.map(booking => 
          booking.id === bookingId ? updatedBooking : booking
        )
      );
      
      setStatusSelections(prev => {
        const newSelections = { ...prev };
        delete newSelections[bookingId];
        return newSelections;
      });
      
      console.log(`Service booking ${newStatus} for booking ${bookingId} - User will be notified`);
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update booking status');
    } finally {
      setUpdating(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.phone.includes(searchTerm) ||
                         booking.id.toString().includes(searchTerm) ||
                         booking.items.some(item => 
                           item.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.session_name.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-purple-100 text-purple-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <Check className="h-4 w-4" />;
      case 'paid': case 'processing': case 'shipped': return <Calendar className="h-4 w-4" />;
      case 'rejected': return <span className="h-4 w-4 text-red-600">✕</span>;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatServiceInfo = (booking: ServiceBooking) => {
    if (booking.items.length === 0) return 'No services';
    if (booking.items.length === 1) {
      const item = booking.items[0];
      return `${item.service_name} - ${item.session_name}`;
    }
    return `${booking.items[0].service_name} + ${booking.items.length - 1} more`;
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg border border-amber-200 p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <span className="ml-2 text-amber-800">Loading service bookings...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg border border-red-200 p-6">
        <div className="text-red-800">
          <p className="font-semibold">Error loading service bookings:</p>
          <p>{error}</p>
          <button 
            onClick={fetchBookings}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg border border-amber-200">
      {/* Filters */}
      <div className="p-6 border-b border-amber-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5 z-10" />
            <input
              type="text"
              placeholder="Search by booking ID, name, email, phone, or service..."
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
              <option value="paid">Paid</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors duration-200"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-amber-100 to-orange-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Booking Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Service Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Update</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Feedback</th>
            </tr>
          </thead>
          <tbody className="bg-white/60 backdrop-blur-sm divide-y divide-amber-200">
            {filteredBookings.map((booking) => {
              const highlight = highlightOrderId && booking.id === Number(highlightOrderId);
              const isUpdating = updating[booking.id];
              return (
                <tr
                  key={booking.id}
                  id={highlight ? `highlight-row-${highlightOrderId}` : undefined}
                  className={`hover:bg-amber-50/80 transition-colors duration-200${highlight ? ' ring-2 ring-amber-500 bg-yellow-100/60' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-amber-900 font-serif">Booking #{booking.id}</div>
                      <div className="text-sm text-amber-700">{booking.customer_name}</div>
                      <div className="text-sm text-amber-600">{formatDate(booking.created_at)}</div>
                      <div className="text-sm font-medium text-amber-800">₹{booking.total_amount}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-amber-900 font-serif">
                      {formatServiceInfo(booking)}
                    </div>
                    {booking.items.length > 1 && (
                      <div className="text-xs text-amber-600 mt-1">
                        {booking.items.map((item, index) => (
                          <div key={index}>
                            {item.service_name} - {item.session_name} (x{item.quantity})
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-amber-700">{booking.email}</div>
                    <div className="text-sm text-amber-700">{booking.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span className="ml-1 capitalize">{booking.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={statusSelections[booking.id] ?? booking.status}
                      onChange={e => setStatusSelections(prev => ({ ...prev, [booking.id]: e.target.value as ServiceBooking['status'] }))}
                      className="border border-amber-300 rounded-lg px-2 py-1 text-sm font-serif bg-white/80"
                      disabled={isUpdating}
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        const newStatus = statusSelections[booking.id];
                        if (newStatus && newStatus !== booking.status) {
                          updateBookingStatus(booking.id, newStatus);
                        }
                      }}
                      disabled={
                        isUpdating ||
                        !statusSelections[booking.id] || 
                        statusSelections[booking.id] === booking.status
                      }
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white ${
                        statusSelections[booking.id] && statusSelections[booking.id] !== booking.status && !isUpdating
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' 
                          : 'bg-gray-300 cursor-not-allowed'
                      } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 font-serif`}
                    >
                      {isUpdating ? (
                        <>
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                          Updating...
                        </>
                      ) : (
                        <>✓ Update</>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {(booking.status === 'delivered' || booking.status === 'shipped') && !feedbackSent[booking.id] ? (
                      <button
                        onClick={() => {
                          const message = encodeURIComponent(
                            `Hi ${booking.customer_name},%0AThank you for booking ${formatServiceInfo(booking)} with us! We hope you had a wonderful experience.%0AWe would appreciate your feedback to help us improve our services. Please fill out this short form: ${FEEDBACK_FORM_LINK}`
                          );
                          window.open(`https://wa.me/${booking.phone.replace(/^\+/, '')}?text=${message}`, '_blank');
                          setFeedbackSent(prev => ({ ...prev, [booking.id]: true }));
                        }}
                        className="group relative inline-flex items-center px-5 py-2 rounded-full font-semibold text-white bg-gradient-to-r from-amber-500 via-orange-400 to-orange-600 shadow-lg hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-400 transition-all duration-200 font-serif overflow-hidden"
                        style={{ minWidth: 180 }}
                      >
                        <span className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300 animate-pulse"></span>
                        <Send className="h-5 w-5 mr-2 animate-bounce text-amber-100 group-hover:text-white" />
                        <span className="z-10">Send Feedback</span>
                      </button>
                    ) : (booking.status === 'delivered' || booking.status === 'shipped') && feedbackSent[booking.id] ? (
                      <span className="text-green-600 text-xs font-serif">Feedback sent</span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredBookings.length === 0 && !loading && (
          <div className="text-center py-8 text-amber-700">
            No service bookings found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceBookingsTable;