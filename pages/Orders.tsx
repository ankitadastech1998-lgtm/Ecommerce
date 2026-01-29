
import React from 'react';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export const Orders: React.FC = () => {
  const { orders } = useAppContext();

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900">No orders yet</h2>
        <p className="text-gray-500 mt-2">Your purchase history will appear here.</p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Processing': return <Clock className="text-amber-500 w-5 h-5" />;
      case 'Shipped': return <Truck className="text-blue-500 w-5 h-5" />;
      case 'Delivered': return <CheckCircle className="text-green-500 w-5 h-5" />;
      default: return <Package className="text-gray-500 w-5 h-5" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4 bg-gray-50/50">
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Order ID</p>
                <p className="font-mono font-semibold text-gray-900">#{order.id}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Date</p>
                <p className="text-sm font-medium">{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">Total Amount</p>
                <p className="text-lg font-bold text-indigo-600">${order.total.toFixed(2)}</p>
              </div>
              <div className="px-3 py-1 bg-white border border-gray-200 rounded-full flex items-center gap-2">
                {getStatusIcon(order.status)}
                <span className="text-sm font-bold">{order.status}</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
              <div className="pt-4 border-t border-gray-50 mt-4">
                <p className="text-xs text-gray-400">Shipping to:</p>
                <p className="text-sm text-gray-600">{order.address.street}, {order.address.city}, {order.address.state} {order.address.zipCode}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
