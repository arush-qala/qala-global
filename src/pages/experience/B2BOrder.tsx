import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAssortment } from '@/contexts/AssortmentContext';

const B2BOrder = () => {
  const navigate = useNavigate();
  const { products } = useAssortment();
  const [quantities, setQuantities] = useState<Record<string, Record<string, number>>>({});
  const [activeProduct, setActiveProduct] = useState<string | null>(products[0]?.id || null);
  const sizes = ['XS', 'S', 'M', 'L', 'XL'];

  const updateQuantity = (productId: string, size: string, delta: number) => {
    setQuantities(prev => {
      const productQty = prev[productId] || {};
      const current = productQty[size] || 0;
      const newQty = Math.max(0, current + delta);
      return {
        ...prev,
        [productId]: { ...productQty, [size]: newQty }
      };
    });
  };

  const setQuantity = (productId: string, size: string, value: number) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: { ...(prev[productId] || {}), [size]: Math.max(0, value) }
    }));
  };

  const getProductTotal = (productId: string) => {
    const productQty = quantities[productId] || {};
    return Object.values(productQty).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalUnits = () => {
    return products.reduce((sum, p) => sum + getProductTotal(p.id), 0);
  };

  const getTotalValue = () => {
    return products.reduce((sum, p) => sum + getProductTotal(p.id) * p.price, 0);
  };

  // Tiered pricing discount
  const getDiscount = (units: number) => {
    if (units >= 500) return 0.25;
    if (units >= 200) return 0.20;
    if (units >= 100) return 0.15;
    if (units >= 50) return 0.10;
    return 0;
  };

  const totalUnits = getTotalUnits();
  const discount = getDiscount(totalUnits);
  const subtotal = getTotalValue();
  const discountAmount = subtotal * discount;
  const finalTotal = subtotal - discountAmount;

  const activeProductData = products.find(p => p.id === activeProduct);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-8 py-6">
          <button 
            onClick={() => navigate('/experience')}
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-luxury-sm tracking-widest uppercase">Back</span>
          </button>
          <span className="text-luxury-sm tracking-widest">B2B WHOLESALE ORDER</span>
          <div className="w-20" />
        </div>
      </div>

      <main className="pt-28 pb-32 flex">
        {/* Left: Product Navigator */}
        <div className="w-80 flex-shrink-0 border-r border-border h-[calc(100vh-7rem)] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-luxury-xs text-muted-foreground mb-4">YOUR SELECTION</h2>
            <div className="space-y-3">
              {products.map((product) => {
                const qty = getProductTotal(product.id);
                return (
                  <button
                    key={product.id}
                    onClick={() => setActiveProduct(product.id)}
                    className={`w-full flex items-center gap-4 p-3 border transition-colors text-left ${
                      activeProduct === product.id 
                        ? 'border-gold bg-gold/5' 
                        : 'border-border hover:border-gold/30'
                    }`}
                  >
                    <div className="w-16 h-20 flex-shrink-0 overflow-hidden">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-luxury-xs text-muted-foreground mb-1">{product.brandName}</p>
                      <p className="font-serif text-sm truncate">{product.name}</p>
                      {qty > 0 && (
                        <p className="text-gold text-xs mt-1">{qty} units</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Order Matrix */}
        <div className="flex-1 overflow-y-auto h-[calc(100vh-7rem)]">
          {activeProductData ? (
            <div className="p-8">
              {/* Product Hero */}
              <div className="flex gap-8 mb-12">
                <div className="w-80 aspect-[3/4] flex-shrink-0 overflow-hidden">
                  <img 
                    src={activeProductData.image} 
                    alt={activeProductData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-luxury-xs text-muted-foreground mb-2">{activeProductData.brandName}</p>
                  <h1 className="font-serif text-3xl mb-2">{activeProductData.name}</h1>
                  <p className="text-gold text-xl mb-4">${activeProductData.price} / unit</p>
                  <p className="text-muted-foreground text-sm max-w-md">
                    Enter quantities per size below. Orders are processed in increments of 10 units.
                  </p>
                </div>
              </div>

              {/* Size Matrix */}
              <div className="mb-8">
                <h3 className="text-luxury-xs text-muted-foreground mb-4">QUANTITY BY SIZE</h3>
                <div className="grid grid-cols-5 gap-4">
                  {sizes.map(size => {
                    const qty = quantities[activeProductData.id]?.[size] || 0;
                    return (
                      <div key={size} className="text-center">
                        <p className="text-luxury-sm mb-3">{size}</p>
                        <div className="border border-border p-4">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <button
                              onClick={() => updateQuantity(activeProductData.id, size, -10)}
                              className="w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <input
                              type="number"
                              min="0"
                              step="10"
                              value={qty}
                              onChange={(e) => setQuantity(activeProductData.id, size, parseInt(e.target.value) || 0)}
                              className="w-20 text-center bg-background border border-border py-2 font-serif text-xl"
                            />
                            <button
                              onClick={() => updateQuantity(activeProductData.id, size, 10)}
                              className="w-8 h-8 flex items-center justify-center bg-muted hover:bg-muted/80 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-muted-foreground text-xs">
                            ${(qty * activeProductData.price).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Product Total */}
              <div className="border-t border-border pt-6">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Product Total</span>
                  <span className="font-serif text-xl">
                    {getProductTotal(activeProductData.id)} units · ${(getProductTotal(activeProductData.id) * activeProductData.price).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Select a product to configure quantities</p>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-deep-charcoal border-t border-gold/20"
      >
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div>
              <p className="text-muted-foreground text-xs mb-1">Total Units</p>
              <p className="text-primary-foreground font-serif text-xl">{totalUnits.toLocaleString()}</p>
            </div>
            {discount > 0 && (
              <div>
                <p className="text-muted-foreground text-xs mb-1">Bulk Discount</p>
                <p className="text-gold font-serif text-xl">{(discount * 100).toFixed(0)}% OFF</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground text-xs mb-1">Order Value</p>
              <p className="text-primary-foreground font-serif text-xl">${finalTotal.toLocaleString()}</p>
            </div>
          </div>
          
          <button 
            className="btn-luxury-gold"
            disabled={totalUnits === 0}
          >
            Request Quote
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default B2BOrder;
