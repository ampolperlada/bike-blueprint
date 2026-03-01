'use client';

import { useState } from 'react';
import { X, ShoppingCart, MapPin, MessageCircle } from 'lucide-react';
import { Part } from '@/types/parts';

interface ShoppingCartProps {
  selectedParts: Part[];
  totalPrice: number;
  buildName: string;
  onClose: () => void;
  onCheckout: (shopId?: string) => void;
}

const PARTNER_SHOPS = [
  {
    id: 'shop1',
    name: 'CustomRide Manila',
    location: 'Quezon City',
    distance: '2.3 km',
    rating: 4.8,
    phone: '+639171234567',
    messenger: 'customridemnl'
  },
  {
    id: 'shop2',
    name: 'MotoPH Customs',
    location: 'Makati City',
    distance: '5.1 km',
    rating: 4.9,
    phone: '+639189876543',
    messenger: 'motophcustoms'
  },
  {
    id: 'shop3',
    name: 'SpeedFreak Garage',
    location: 'Pasig City',
    distance: '3.7 km',
    rating: 4.7,
    phone: '+639123456789',
    messenger: 'speedfreakgarage'
  }
];

export function ShoppingCart({ 
  selectedParts, 
  totalPrice, 
  buildName,
  onClose,
  onCheckout 
}: ShoppingCartProps) {
  const [selectedShop, setSelectedShop] = useState<string | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shop' | 'contact'>('cart');

  const handleWhatsAppCheckout = () => {
    const shop = PARTNER_SHOPS.find(s => s.id === selectedShop);
    const message = `Hi! I want to customize my NMAX:\n\nBuild Name: ${buildName}\n\nParts:\n${selectedParts.map(p => `- ${p.name} (${p.brand}): ₱${p.price.toLocaleString()}`).join('\n')}\n\nTotal: ₱${totalPrice.toLocaleString()}\n\nFrom: MotoPH Studio`;
    
    const encodedMessage = encodeURIComponent(message);
    const phone = shop?.phone.replace(/\+/g, '');
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank');
  };

  const handleMessengerCheckout = () => {
    const shop = PARTNER_SHOPS.find(s => s.id === selectedShop);
    window.open(`https://m.me/${shop?.messenger}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
        {/* Header */}
        <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold">Your Build</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        {checkoutStep === 'cart' && (
          <div className="p-6 space-y-4">
            <div className="bg-gradient-to-r from-orange-600/20 to-red-600/20 border border-orange-700 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-1">{buildName}</h3>
              <p className="text-sm text-gray-400">NMAX 155 Custom Build</p>
            </div>

            {selectedParts.map((part) => (
              <div key={part.id} className="bg-gray-800 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">{part.name}</p>
                    <p className="text-sm text-orange-400">{part.brand} • {part.model}</p>
                    <p className="text-xs text-gray-500 mt-1">{part.description}</p>
                  </div>
                  <p className="font-bold text-orange-400">₱{part.price.toLocaleString()}</p>
                </div>
                
                {/* Performance */}
                {(part.performance.acceleration !== 0 || 
                  part.performance.handling !== 0 || 
                  part.performance.weight !== 0) && (
                  <div className="flex gap-3 text-xs mt-2 pt-2 border-t border-gray-700">
                    {part.performance.acceleration !== 0 && (
                      <span className="text-green-400">⚡ +{part.performance.acceleration}</span>
                    )}
                    {part.performance.handling !== 0 && (
                      <span className="text-green-400">🛞 +{part.performance.handling}</span>
                    )}
                    {part.performance.weight !== 0 && (
                      <span className="text-green-400">⚖ {part.performance.weight}kg</span>
                    )}
                  </div>
                )}

                <p className="text-xs text-gray-500 mt-2">Install time: {part.installTime}</p>
              </div>
            ))}

            {/* Total */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="font-bold text-lg">TOTAL BUILD COST</span>
                <span className="text-3xl font-bold">₱{totalPrice.toLocaleString()}</span>
              </div>
              <p className="text-sm text-white/80 mt-2">
                + Installation by certified mechanics
              </p>
            </div>

            <button
              onClick={() => setCheckoutStep('shop')}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-bold text-lg transition-all"
            >
              Choose Shop & Checkout →
            </button>
          </div>
        )}

        {/* Shop Selection */}
        {checkoutStep === 'shop' && (
          <div className="p-6 space-y-4">
            <button
              onClick={() => setCheckoutStep('cart')}
              className="text-orange-400 hover:text-orange-300 text-sm mb-4"
            >
              ← Back to cart
            </button>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                <h3 className="font-bold">Select Installation Shop</h3>
              </div>
              <p className="text-sm text-gray-400">Choose a certified partner near you</p>
            </div>

            {PARTNER_SHOPS.map((shop) => (
              <div
                key={shop.id}
                onClick={() => setSelectedShop(shop.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                  selectedShop === shop.id
                    ? 'border-orange-500 bg-orange-600/20'
                    : 'border-gray-700 bg-gray-800 hover:border-gray-600'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-bold">{shop.name}</h4>
                    <p className="text-sm text-gray-400">{shop.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 text-sm">⭐ {shop.rating}</p>
                    <p className="text-xs text-gray-500">{shop.distance} away</p>
                  </div>
                </div>
                {selectedShop === shop.id && (
                  <p className="text-xs text-green-400 mt-2">✓ Selected</p>
                )}
              </div>
            ))}

            <button
              onClick={() => setCheckoutStep('contact')}
              disabled={!selectedShop}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-bold text-lg transition-all"
            >
              Continue to Contact →
            </button>
          </div>
        )}

        {/* Contact Method */}
        {checkoutStep === 'contact' && (
          <div className="p-6 space-y-4">
            <button
              onClick={() => setCheckoutStep('shop')}
              className="text-orange-400 hover:text-orange-300 text-sm mb-4"
            >
              ← Back to shop selection
            </button>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-4">
              <h3 className="font-bold mb-1">Contact Shop</h3>
              <p className="text-sm text-gray-400">
                Choose how you want to send your build details
              </p>
            </div>

            <button
              onClick={handleWhatsAppCheckout}
              className="w-full p-6 bg-green-600 hover:bg-green-700 rounded-lg transition-all group"
            >
              <div className="flex items-center justify-center gap-3">
                <MessageCircle className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-bold text-lg">Send via WhatsApp</p>
                  <p className="text-sm text-white/80">
                    {PARTNER_SHOPS.find(s => s.id === selectedShop)?.phone}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={handleMessengerCheckout}
              className="w-full p-6 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all group"
            >
              <div className="flex items-center justify-center gap-3">
                <MessageCircle className="w-6 h-6" />
                <div className="text-left">
                  <p className="font-bold text-lg">Send via Messenger</p>
                  <p className="text-sm text-white/80">
                    {PARTNER_SHOPS.find(s => s.id === selectedShop)?.messenger}
                  </p>
                </div>
              </div>
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Your build details will be sent directly to the shop
            </p>
          </div>
        )}
      </div>
    </div>
  );
}