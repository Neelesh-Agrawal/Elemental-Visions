import { useState, useEffect } from 'react';
import { Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: number;
  user_name: string;
  email: string;
  phone: string;
  paymentStatus: 'pending' | 'paid' | 'rejected' | 'processing' | 'shipped' | 'delivered';
  amount: number;
  date: string;
  paidFor: 'Order Items' | 'Service Booking';
  type: string;
}

const OrdersTable: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  useEffect(() => {
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiUrl}/orders/?limit=1000`, {
        credentials: 'include',
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();

      // Transform API response into your frontend `Order` shape
      const mappedOrders: Order[] = data.map((o: any) => ({
        id: o.id,
        user_name: o.customer_name,
        email: o.email,
        phone: o.phone,
        paymentStatus: o.status as Order['paymentStatus'],
        amount: o.total_amount,
        date: new Date(o.created_at).toLocaleDateString(),
        paidFor: 'Order Items', // assuming all are order items for now
        type: o.items.map((item: any) => `${item.crystal} (${item.form})`).join(', ')
      }));

      setOrders(mappedOrders);
    } catch (error) {
      setError('Failed to load orders');
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, []);


  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusSelections, setStatusSelections] = useState<{ [id: number]: Order['paymentStatus'] }>({});
  const navigate = useNavigate();

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || order.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Sort completed orders to the bottom
    if (a.paymentStatus === 'paid' && b.paymentStatus !== 'paid') return 1;
    if (b.paymentStatus === 'paid' && a.paymentStatus !== 'paid') return -1;
    return 0;
  });

   const updatePaymentStatus = async (orderId: number) => {
    const newStatus = statusSelections[orderId];
    if (!newStatus) return;
    
    try {
      let endpoint = '';
      // Map frontend status to backend endpoints
      if (newStatus === 'paid') {
        endpoint = `${apiUrl}/orders/${orderId}/pay`;
      } else if (newStatus === 'rejected') {
        endpoint = `${apiUrl}/orders/${orderId}/reject`;
      } else if (newStatus === 'pending') {
        endpoint = `${apiUrl}/orders/${orderId}/pending`;
      }
      
      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to update payment status');
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, paymentStatus: newStatus } : order
      ));
      setStatusSelections(prev => {
        const { [orderId]: _, ...rest } = prev;
        return rest;
      });
      
    } catch (error) {
      console.error('Error updating payment status:', error);
      // Show error to user
    }
  };

  const deleteOrder = async (orderId: number) => {
    if (!confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/orders/${orderId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to delete order');
      
      // Remove from local state
      setOrders(orders.filter(order => order.id !== orderId));
      
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-indigo-100 text-indigo-800';
      case 'delivered': return 'bg-emerald-100 text-emerald-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
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
              placeholder="Search by name, email, or phone..."
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
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-amber-100 to-orange-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Order Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Paid For</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Update</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Delete</th>
            </tr>
          </thead>
          <tbody className="bg-white/60 backdrop-blur-sm divide-y divide-amber-200">
            {filteredOrders.map((order) => (
              <tr
                key={order.id}
                className="hover:bg-amber-50/80 transition-colors duration-200 cursor-pointer"
                onDoubleClick={() => {
                  if (order.paidFor === 'Order Items') {
                    navigate(`/order-items/${order.id}`);
                  } else if (order.paidFor === 'Service Booking') {
                    navigate(`/service-bookings?highlightOrderId=${order.id}`);
                  }
                }}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-amber-900 font-serif">#{order.id}</div>
                    <div className="text-sm text-amber-700">{order.user_name}</div>
                    <div className="text-sm text-amber-600">{order.date}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm text-amber-900">{order.email}</div>
                    <div className="text-sm text-amber-700">{order.phone}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-amber-900 font-serif">₹{order.amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-amber-900 font-serif">{order.paidFor} <span className="text-amber-700">({order.type})</span></div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                    {order.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <select
                    value={statusSelections[order.id] ?? order.paymentStatus}
                    onChange={e => setStatusSelections(prev => ({ ...prev, [order.id]: e.target.value as Order['paymentStatus'] }))}
                    className="border border-amber-300 rounded-lg px-2 py-1 text-sm font-serif bg-white/80"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => updatePaymentStatus(order.id)}
                    disabled={
                      !statusSelections[order.id] || statusSelections[order.id] === order.paymentStatus
                    }
                    className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white ${statusSelections[order.id] && statusSelections[order.id] !== order.paymentStatus ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' : 'bg-gray-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 font-serif`}
                  >
                    ✓ Update
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => deleteOrder(order.id)}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 font-serif"
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersTable;
