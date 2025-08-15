import React, { useState, useEffect } from 'react';
import { Search, Filter, Truck, Package } from 'lucide-react';
import { useParams } from 'react-router-dom';

interface OrderItem {
  id: number;
  orderId: number;
  name: string;
  crystal: string;
  crystalForm: string;
  address: string;
  shippingStatus: 'processing' | 'shipped' | 'delivered';
  quantity: number;
  price: number;
}

const OrderItemsTable: React.FC = () => {
  const [orderItems, setOrderItems] = useState<OrderItem[]>([
    { id: 1, orderId: 1, name: 'John Doe', crystal: 'Amethyst', crystalForm: 'Raw', address: '123 Main St, New York, NY', shippingStatus: 'processing', quantity: 2, price: 149.99 },
    { id: 2, orderId: 1, name: 'John Doe', crystal: 'Rose Quartz', crystalForm: 'Tumbled', address: '123 Main St, New York, NY', shippingStatus: 'shipped', quantity: 1, price: 89.99 },
    { id: 3, orderId: 2, name: 'Jane Smith', crystal: 'Clear Quartz', crystalForm: 'Point', address: '456 Oak Ave, Los Angeles, CA', shippingStatus: 'delivered', quantity: 3, price: 199.99 },
    { id: 4, orderId: 3, name: 'Mike Johnson', crystal: 'Citrine', crystalForm: 'Sphere', address: '789 Pine Rd, Chicago, IL', shippingStatus: 'processing', quantity: 1, price: 299.99 },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusSelections, setStatusSelections] = useState<{ [id: number]: OrderItem['shippingStatus'] }>({});
  const { highlightOrderId } = useParams<{ highlightOrderId?: string }>();

  useEffect(() => {
    // Optionally scroll to the highlighted row
    if (highlightOrderId) {
      const el = document.getElementById(`highlight-row-${highlightOrderId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightOrderId]);

  const filteredItems = orderItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.crystal.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.crystalForm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.orderId.toString().includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || item.shippingStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const updateShippingStatus = (itemId: number) => {
    const newStatus = statusSelections[itemId];
    if (!newStatus) return;
    setOrderItems(orderItems.map(item => 
      item.id === itemId ? { ...item, shippingStatus: newStatus } : item
    ));
    setStatusSelections(prev => ({ ...prev, [itemId]: undefined }));
    // Here you would typically send a notification to the user
    console.log(`Shipping status updated to ${newStatus} for item ${itemId} - User will be notified`);
  };

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

  return (
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl shadow-lg border border-amber-200">
      {/* Filters */}
      <div className="p-6 border-b border-amber-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-amber-600 h-5 w-5 z-10" />
            <input
              type="text"
              placeholder="Search by order ID, name, crystal..."
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
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-amber-100 to-orange-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Order Info</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Crystal Details</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Shipping Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Action</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider font-serif">Update</th>
            </tr>
          </thead>
          <tbody className="bg-white/60 backdrop-blur-sm divide-y divide-amber-200">
            {filteredItems.map((item) => {
              const highlight = highlightOrderId && item.orderId === Number(highlightOrderId);
              return (
                <tr
                  key={item.id}
                  id={highlight ? `highlight-row-${highlightOrderId}` : undefined}
                  className={`hover:bg-amber-50/80 transition-colors duration-200${highlight ? ' ring-2 ring-amber-500 bg-yellow-100/60' : ''}`}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-amber-900 font-serif">Order #{item.orderId}</div>
                      <div className="text-sm text-amber-700">{item.name}</div>
                      <div className="text-sm text-amber-600">Qty: {item.quantity}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-amber-900 font-serif">{item.crystal}</div>
                      <div className="text-sm text-amber-700">{item.crystalForm}</div>
                      <div className="text-sm font-medium text-amber-900 font-serif">${item.price}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-amber-900 max-w-xs truncate">{item.address}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.shippingStatus)}`}>
                      {getStatusIcon(item.shippingStatus)}
                      <span className="ml-1">{item.shippingStatus}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={statusSelections[item.id] ?? item.shippingStatus}
                      onChange={e => setStatusSelections(prev => ({ ...prev, [item.id]: e.target.value as OrderItem['shippingStatus'] }))}
                      className="border border-amber-300 rounded-lg px-2 py-1 text-sm font-serif bg-white/80"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => updateShippingStatus(item.id)}
                      disabled={
                        !statusSelections[item.id] || statusSelections[item.id] === item.shippingStatus
                      }
                      className={`inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white ${statusSelections[item.id] && statusSelections[item.id] !== item.shippingStatus ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' : 'bg-gray-300 cursor-not-allowed'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 font-serif`}
                    >
                      ✓ Update
                    </button>
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

export default OrderItemsTable;