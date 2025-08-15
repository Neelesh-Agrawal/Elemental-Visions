import React from 'react';
import { LogOut, Menu, X, Package, ShoppingCart, Calendar } from 'lucide-react';
import OrdersTable from './OrdersTable';
import OrderItemsTable from './OrderItemsTable';
import ServiceBookingsTable from './ServiceBookingsTable';
import { useNavigate, NavLink, Routes, Route, useLocation } from 'react-router-dom';

interface DashboardProps {
  onLogout: () => void;
}

const tabs = [
  { id: 'orders', name: 'Orders', icon: ShoppingCart, path: '/orders' },
  { id: 'order-items', name: 'Order Items', icon: Package, path: '/order-items' },
  { id: 'service-bookings', name: 'Service Bookings', icon: Calendar, path: '/service-bookings' },
];

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="flex h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gradient-to-b from-amber-900 to-orange-900 shadow-2xl transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-amber-800 to-orange-800 border-b border-amber-700">
          <h1 className="text-xl font-bold text-amber-100 font-serif">Elemental Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-amber-100 hover:text-amber-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="mt-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                className={({ isActive }) =>
                  `w-full flex items-center px-6 py-3 text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-100/20 to-orange-100/20 text-amber-100 border-r-4 border-amber-400 backdrop-blur-sm'
                      : 'text-amber-200 hover:bg-amber-800/30 hover:text-amber-100'
                  }`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-5 w-5 mr-3" />
                {tab.name}
              </NavLink>
            );
          })}
        </nav>
        <div className="absolute bottom-0 w-full p-6">
          <button
            onClick={onLogout}
            className="w-full flex items-center px-4 py-2 text-amber-200 hover:text-amber-100 hover:bg-amber-800/30 rounded-lg transition-all duration-200 font-serif"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Logout
          </button>
        </div>
      </div>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <header className="bg-gradient-to-r from-amber-100 to-orange-100 shadow-lg border-b border-amber-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-amber-700 hover:text-amber-900"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h2 className="ml-4 lg:ml-0 text-2xl font-semibold text-amber-900 capitalize font-serif">
                {tabs.find(tab => location.pathname.startsWith(tab.path))?.name || 'Orders'}
              </h2>
            </div>
          </div>
        </header>
        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <Routes>
            <Route path="/orders" element={<OrdersTable />} />
            <Route path="/order-items/:highlightOrderId?" element={<OrderItemsTable />} />
            <Route path="/service-bookings" element={<ServiceBookingsTable />} />
            <Route path="*" element={<OrdersTable />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;