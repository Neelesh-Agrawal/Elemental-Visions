import React, { useState, useEffect } from 'react';
import { Search, Filter, Truck, Package } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface OrderItem {
  id: number;
  order_id: number;
  crystal: string;
  form: string;
  quantity: number;
  unit_price: number;
}

interface Order {
  id: number;
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  total_amount: number;
  status: 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'rejected';
  created_at: string;
  items: OrderItem[];
}

interface FlattenedOrderItem extends OrderItem {
  customer_name: string;
  email: string;
  phone: string;
  address: string;
  order_status: Order['status'];
  created_at: string;
  shippingStatus: 'processing' | 'shipped' | 'delivered';
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const OrderItemsTable: React.FC = () => {
  const [orderItems, setOrderItems] = useState<FlattenedOrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusSelections, setStatusSelections] = useState<{ [itemId: string]: FlattenedOrderItem['shippingStatus'] }>({});
  const [updating, setUpdating] = useState<{ [itemId: string]: boolean }>({});
  const { highlightOrderId } = useParams<{ highlightOrderId?: string }>();

  // Fetch orders and flatten items
  const fetchOrderItems = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/orders/?limit=1000`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const orders: Order[] = await response.json();
      
      // Flatten order items with order information
      const flattenedItems: FlattenedOrderItem[] = [];
      orders.forEach(order => {
        order.items.forEach(item => {
          flattenedItems.push({
            ...item,
            order_id: order.id, // Explicitly set the order ID
            customer_name: order.customer_name,
            email: order.email,
            phone: order.phone,
            address: order.address,
            order_status: order.status,
            created_at: order.created_at,
            // Map order status to shipping status
            shippingStatus: mapOrderStatusToShippingStatus(order.status)
          });
        });
      });
      
      setOrderItems(flattenedItems);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching order items:', err);
    } finally {
      setLoading(false);
    }
  };

  // Map order status to shipping status
  const mapOrderStatusToShippingStatus = (orderStatus: Order['status']): FlattenedOrderItem['shippingStatus'] => {
    switch (orderStatus) {
      case 'shipped':
        return 'shipped';
      case 'delivered':
        return 'delivered';
      case 'paid':
      case 'processing':
      default:
        return 'processing';
    }
  };

  // Map shipping status back to order status
  const mapShippingStatusToOrderStatus = (shippingStatus: FlattenedOrderItem['shippingStatus']): Order['status'] => {
    switch (shippingStatus) {
      case 'shipped':
        return 'shipped';
      case 'delivered':
        return 'delivered';
      case 'processing':
      default:
        return 'processing';
    }
  };

  // Update shipping status
  const updateShippingStatus = async (item: FlattenedOrderItem) => {
    const newShippingStatus = statusSelections[`${item.order_id}-${item.id}`];
    if (!newShippingStatus) return;

    const itemKey = `${item.order_id}-${item.id}`;
    
    try {
      setUpdating(prev => ({ ...prev, [itemKey]: true }));
      
      const newOrderStatus = mapShippingStatusToOrderStatus(newShippingStatus);
      
      let endpoint = '';

      switch (newOrderStatus) {
        case 'processing':
          endpoint = `${API_BASE_URL}/orders/${item.order_id}/processing`;
          break;
        case 'shipped':
          endpoint = `${API_BASE_URL}/orders/${item.order_id}/ship?status=shipped`;
          break;
        case 'delivered':
          endpoint = `${API_BASE_URL}/orders/${item.order_id}/ship?status=delivered`;
          break;
        default:
          throw new Error('Invalid shipping status');
      }

      console.log('🚚 Updating shipping status:', {
        orderId: item.order_id,
        itemId: item.id,
        newStatus: newShippingStatus,
        newOrderStatus: newOrderStatus,
        endpoint: endpoint
      });

      const response = await fetch(endpoint, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        console.error('API Error Response:', response.status, errorText);
        throw new Error(`Failed to update shipping status: ${response.status} - ${errorText}`);
      }

      // Update local state
      setOrderItems(prev =>
        prev.map(orderItem =>
          orderItem.order_id === item.order_id && orderItem.id === item.id
            ? { ...orderItem, shippingStatus: newShippingStatus, order_status: newOrderStatus }
            : orderItem
        )
      );

      setStatusSelections(prev => {
        const newSelections = { ...prev };
        delete newSelections[itemKey];
        return newSelections;
      });
      
      console.log(`Shipping status updated to ${newShippingStatus} for item ${item.id} in order ${item.order_id} - User will be notified`);
    } catch (err) {
      console.error('Error updating shipping status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update shipping status');
    } finally {
      setUpdating(prev => ({ ...prev, [itemKey]: false }));
    }
  };

  const deleteOrderItem = async (orderId: number, itemId: number) => {
    if (!confirm('Are you sure you want to delete this order item? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/items/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (!response.ok) throw new Error('Failed to delete order item');
      
      // Remove from local state
      setOrderItems(orderItems.filter(item => !(item.order_id === orderId && item.id === itemId)));
      
    } catch (error) {
      console.error('Error deleting order item:', error);
      alert('Failed to delete order item. Please try again.');
    }
  };

  useEffect(() => {
    fetchOrderItems();
  }, []);

  useEffect(() => {
    // Optionally scroll to the highlighted row
    if (highlightOrderId) {
      const el = document.getElementById(`highlight-row-${highlightOrderId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightOrderId, orderItems]);

  const filteredItems = orderItems.filter(item => {
    const matchesSearch = item.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.crystal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.form.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.order_id.toString().includes(searchTerm) ||
                         item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || item.shippingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    // Sort delivered items to the bottom
    if (a.shippingStatus === 'delivered' && b.shippingStatus !== 'delivered') return 1;
    if (b.shippingStatus === 'delivered' && a.shippingStatus !== 'delivered') return -1;
    return 0;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      default: return <Package className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg border border-amber-200 p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
          <span className="ml-2 text-amber-800">Loading order items...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl shadow-lg border border-red-200 p-6">
        <div className="text-red-800">
          <p className="font-semibold">Error loading order items:</p>
          <p>{error}</p>
          <button 
            onClick={fetchOrderItems}
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
              placeholder="Search by order ID, name, crystal, email, or phone..."
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
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
          <button
            onClick={fetchOrderItems}
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
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Order Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Crystal Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Customer Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Shipping Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Update</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Delete</th>
            </tr>
          </thead>
          <tbody className="bg-white/60 backdrop-blur-sm divide-y divide-amber-200">
            {filteredItems.map((item) => {
              const highlight = highlightOrderId && item.order_id === Number(highlightOrderId);
              const itemKey = `${item.order_id}-${item.id}`;
              const isUpdating = updating[itemKey];
              return (
                <tr
                  key={itemKey}
                  id={highlight ? `highlight-row-${highlightOrderId}` : undefined}
                  className={`hover:bg-amber-50/80 transition-colors duration-200${highlight ? ' ring-2 ring-amber-500 bg-yellow-100/60' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-amber-900 font-serif">Order #{item.order_id}</div>
                      <div className="text-sm text-amber-700">Item #{item.id}</div>
                      <div className="text-sm text-amber-600">Qty: {item.quantity}</div>
                      <div className="text-sm text-amber-600">{formatDate(item.created_at)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-amber-900 font-serif">{item.crystal}</div>
                      <div className="text-sm text-amber-700">{item.form}</div>
                      <div className="text-sm font-medium text-amber-900 font-serif">₹{item.unit_price}</div>
                      <div className="text-sm text-amber-600">Total: ₹{(item.unit_price * item.quantity).toFixed(2)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-amber-900 font-serif">{item.customer_name}</div>
                      <div className="text-sm text-amber-700">{item.email}</div>
                      <div className="text-sm text-amber-700">{item.phone}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-amber-900 max-w-xs truncate" title={item.address}>
                      {item.address}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.shippingStatus)}`}>
                      {getStatusIcon(item.shippingStatus)}
                      <span className="ml-1 capitalize">{item.shippingStatus}</span>
                    </span>
                    <div className="text-xs text-amber-600 mt-1">
                      Order: {item.order_status}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={statusSelections[itemKey] ?? item.shippingStatus}
                      onChange={e => setStatusSelections(prev => ({ ...prev, [itemKey]: e.target.value as FlattenedOrderItem['shippingStatus'] }))}
                      className="border border-amber-300 rounded-lg px-2 py-1 text-sm font-serif bg-white/80"
                      disabled={isUpdating}
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => updateShippingStatus(item)}
                      disabled={
                        isUpdating ||
                        !statusSelections[itemKey] || 
                        statusSelections[itemKey] === item.shippingStatus
                      }
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white ${
                        statusSelections[itemKey] && statusSelections[itemKey] !== item.shippingStatus && !isUpdating
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
                    <button
                      onClick={() => deleteOrderItem(item.order_id, item.id)}
                      className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 font-serif"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredItems.length === 0 && !loading && (
          <div className="text-center py-8 text-amber-700">
            No order items found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderItemsTable;
