
import React from 'react';
import { CheckCircle2, Package, ArrowRight, X, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrderSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderId: string;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({ isOpen, onClose, orderId }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] max-w-md w-full p-8 shadow-2xl transform animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-50 rounded-full blur-3xl opacity-50"></div>
        
        <div className="flex justify-end relative z-10">
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center space-y-6 relative z-10">
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
            <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl shadow-green-100 border-4 border-white">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">Success!</h2>
            <p className="text-gray-500 px-4">
              Your order <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">#{orderId}</span> has been successfully placed.
            </p>
          </div>

          <div className="bg-gray-50 rounded-3xl p-5 flex items-center gap-4 text-left border border-gray-100">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center shrink-0">
              <Package className="w-7 h-7 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">Processing your order</p>
              <p className="text-xs text-gray-500 mt-1">We'll send you a tracking link as soon as your items ship.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 pt-4">
            <button 
              onClick={() => {
                onClose();
                navigate('/orders');
              }}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group shadow-lg shadow-indigo-100"
            >
              Track Order <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => {
                onClose();
                navigate('/');
              }}
              className="w-full py-4 text-gray-600 font-semibold hover:bg-gray-50 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" /> Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
