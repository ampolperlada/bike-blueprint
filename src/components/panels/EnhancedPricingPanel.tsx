import { ShoppingCart, Clock, Package } from 'lucide-react';

interface EnhancedPricingPanelProps {
  totalPrice: number;
  selectedParts: Array<{
    category: string;
    categoryName: string;
    option: {
      id: string;
      name: string;
      price: number;
      description: string;
      availability: string;
    };
  }>;
  installTime: string;
  matchingPreset?: {
    id: string;
    name: string;
    description: string;
  } | null;
  onCheckout: () => void;
}

export function EnhancedPricingPanel({
  totalPrice,
  selectedParts,
  installTime,
  matchingPreset,
  onCheckout,
}: EnhancedPricingPanelProps) {
  return (
    <div className="pricing-panel-enhanced">
      {/* Preset Badge (if matches) */}
      {matchingPreset && (
        <div className="preset-badge">
          <Package size={16} />
          <div>
            <div className="preset-name">{matchingPreset.name}</div>
            <div className="preset-desc">{matchingPreset.description}</div>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      <div className="price-breakdown">
        <h3 className="section-title">BUILD SUMMARY</h3>
        
        {selectedParts.length === 0 ? (
          <div className="empty-state">
            <p>Stock configuration</p>
            <p className="text-sm text-gray-500">Select parts to customize</p>
          </div>
        ) : (
          <div className="parts-list">
            {selectedParts.map(({ categoryName, option }) => (
              <div key={categoryName} className="part-row">
                <div className="part-info">
                  <div className="part-name">{option.name}</div>
                  <div className="part-category">{categoryName}</div>
                </div>
                <div className="part-price">
                  ₱{option.price.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Total */}
        <div className="price-total">
          <div className="total-label">TOTAL</div>
          <div className="total-amount">₱{totalPrice.toLocaleString()}</div>
        </div>

        {/* Installation Time */}
        {selectedParts.length > 0 && (
          <div className="install-time">
            <Clock size={14} />
            <span>Installation: {installTime}</span>
          </div>
        )}
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={totalPrice === 0}
        className="checkout-button"
      >
        <ShoppingCart size={18} />
        <span>
          {totalPrice === 0 ? 'Select Parts to Continue' : 'Checkout & Buy'}
        </span>
      </button>

      {/* Payment Info */}
      {totalPrice > 0 && (
        <div className="payment-info">
          <p className="text-xs text-gray-400">
            Available payment: Cash, GCash, Bank Transfer
          </p>
          <p className="text-xs text-gray-400">
            Installation available in Metro Manila
          </p>
        </div>
      )}
    </div>
  );
}