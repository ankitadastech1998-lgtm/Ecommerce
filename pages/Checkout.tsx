
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Banknote, QrCode, CheckCircle2, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { Address, PaymentMethod } from '../types';
import { getAddressFromCoords } from '../services/geminiService';
import { playSuccessSound } from '../utils/audio';
import { OrderSuccessModal } from '../components/OrderSuccessModal';

export const Checkout: React.FC = () => {
  const { cart, createOrder, user } = useAppContext();
  const navigate = useNavigate();
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState('');
  const [address, setAddress] = useState<Address>({
    street: '', city: '', state: '', zipCode: '', country: ''
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(PaymentMethod.UPI);

  useEffect(() => {
    if (!user) navigate('/login');
    // Ensure we don't redirect away from the success screen if the cart is cleared
    if (cart.length === 0 && !showSuccessModal) navigate('/');
  }, [user, cart, navigate, showSuccessModal]);

  const handleAutoLocation = () => {
    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const addr = await getAddressFromCoords(pos.coords.latitude, pos.coords.longitude);
        if (addr) setAddress(addr);
        setLoadingLocation(false);
      },
      (err) => {
        alert("Could not get location. Please enter manually.");
        setLoadingLocation(false);
      }
    );
  };

  const handlePlaceOrder = () => {
    if (!address.street || !address.city) {
      alert("Please provide an address");
      return;
    }
    setIsProcessing(true);
    
    // Simulate order processing and payment verification
    setTimeout(() => {
      const orderId = `ORD-${Math.random().toString(36).toUpperCase().substr(2, 6)}`;
      createOrder(paymentMethod, address);
      
      setPlacedOrderId(orderId);
      setIsProcessing(false);
      setShowSuccessModal(true);
      
      // Trigger the sound notification
      playSuccessSound();
    }, 2000);
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0) + 15;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-8">
          {/* Shipping Section */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MapPin className="text-indigo-600 w-5 h-5" /> Shipping Address
              </h3>
              <button 
                onClick={handleAutoLocation}
                disabled={loadingLocation}
                className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors flex items-center gap-1"
              >
                {loadingLocation ? <Loader2 className="w-3 h-3 animate-spin" /> : null}
                Auto-locate
              </button>
            </div>
            
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Street Address"
                value={address.street}
                onChange={e => setAddress({...address, street: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="City"
                  value={address.city}
                  onChange={e => setAddress({...address, city: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
                <input
                  type="text"
                  placeholder="Zip Code"
                  value={address.zipCode}
                  onChange={e => setAddress({...address, zipCode: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Payment Section */}
          <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold flex items-center gap-2 mb-6">
              <CreditCard className="text-indigo-600 w-5 h-5" /> Payment Method
            </h3>
            <div className="space-y-3">
              {[
                { id: PaymentMethod.UPI, icon: QrCode, label: 'UPI (Paytm/GPay)' },
                { id: PaymentMethod.CARD, icon: CreditCard, label: 'Credit / Debit Card' },
                { id: PaymentMethod.COD, icon: Banknote, label: 'Cash on Delivery' },
              ].map(method => (
                <button
                  key={method.id}
                  onClick={() => setPaymentMethod(method.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    paymentMethod === method.id 
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700' 
                    : 'border-gray-200 hover:border-indigo-200'
                  }`}
                >
                  <method.icon className="w-6 h-6" />
                  <span className="font-semibold">{method.label}</span>
                  {paymentMethod === method.id && <CheckCircle2 className="w-5 h-5 ml-auto text-indigo-600" />}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-lg sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Summary</h3>
            <div className="space-y-4 max-h-60 overflow-y-auto pr-2 no-scrollbar mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 truncate mr-4">{item.quantity}x {item.name}</span>
                  <span className="font-medium text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-gray-100 space-y-2 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>$15.00</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900">
                <span>Grand Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <button 
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="w-full py-4 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> 
                  Processing...
                </>
              ) : (
                `Pay & Place Order`
              )}
            </button>
          </div>
        </div>
      </div>

      <OrderSuccessModal 
        isOpen={showSuccessModal} 
        onClose={() => setShowSuccessModal(false)} 
        orderId={placedOrderId} 
      />
    </div>
  );
};
