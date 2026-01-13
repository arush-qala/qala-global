import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Minus, Plus, Scissors } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAssortment } from "@/contexts/AssortmentContext";
import { Textarea } from "@/components/ui/textarea";

interface OrderItem {
  productId: string;
  quantities: Record<string, number>;
  notes: string;
}

const B2BOrder = () => {
  const navigate = useNavigate();
  const { products } = useAssortment();
  const sizes = ["XS", "S", "M", "L", "XL"];
  
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem>>(() => {
    const initial: Record<string, OrderItem> = {};
    products.forEach(p => {
      initial[p.id] = { productId: p.id, quantities: {}, notes: "" };
    });
    return initial;
  });

  const updateQuantity = (productId: string, size: string, delta: number) => {
    setOrderItems(prev => {
      const item = prev[productId] || { productId, quantities: {}, notes: "" };
      const current = item.quantities[size] || 0;
      const newQty = Math.max(0, current + delta);
      return {
        ...prev,
        [productId]: {
          ...item,
          quantities: { ...item.quantities, [size]: newQty }
        }
      };
    });
  };

  const setQuantity = (productId: string, size: string, value: number) => {
    setOrderItems(prev => {
      const item = prev[productId] || { productId, quantities: {}, notes: "" };
      return {
        ...prev,
        [productId]: {
          ...item,
          quantities: { ...item.quantities, [size]: Math.max(0, value) }
        }
      };
    });
  };

  const setNotes = (productId: string, notes: string) => {
    setOrderItems(prev => {
      const item = prev[productId] || { productId, quantities: {}, notes: "" };
      return {
        ...prev,
        [productId]: { ...item, notes }
      };
    });
  };

  const getProductTotal = (productId: string) => {
    const item = orderItems[productId];
    if (!item) return 0;
    return Object.values(item.quantities).reduce((sum, qty) => sum + qty, 0);
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
    if (units >= 200) return 0.2;
    if (units >= 100) return 0.15;
    if (units >= 50) return 0.1;
    return 0;
  };

  const totalUnits = getTotalUnits();
  const discount = getDiscount(totalUnits);
  const subtotal = getTotalValue();
  const discountAmount = subtotal * discount;
  const shipping = totalUnits > 0 ? 250 : 0;
  const tax = (subtotal - discountAmount) * 0.18; // 18% GST
  const finalTotal = subtotal - discountAmount + shipping + tax;

  // Get brand and collection name from first product
  const brandName = products[0]?.brandName || "Brand";
  const collectionName = "Curated Selection";

  const handleProceedToCheckout = () => {
    window.scrollTo(0, 0);
    navigate("/experience/b2b-order/checkout", {
      state: {
        orderItems,
        products,
        subtotal,
        discountAmount,
        discount,
        shipping,
        tax,
        finalTotal,
        totalUnits
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-8 py-6">
          <button 
            onClick={() => navigate("/experience")} 
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-widest uppercase">Back</span>
          </button>
          <div className="text-center">
            <span className="text-base tracking-widest text-muted-foreground">
              {brandName} · {collectionName}
            </span>
          </div>
          <div className="w-20" />
        </div>
      </div>

      <main className="pt-24 pb-32 px-8">
        <div className="max-w-7xl mx-auto flex gap-8">
          {/* Left: Product List */}
          <div className="flex-1 space-y-6">
            <h1 className="font-serif text-4xl lg:text-5xl mb-8">B2B Wholesale Order</h1>
            
            {products.map(product => {
              const productQty = orderItems[product.id]?.quantities || {};
              const productTotal = getProductTotal(product.id);
              const productValue = productTotal * product.price;
              
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-border p-6 bg-card"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-32 flex-shrink-0 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details + Size Grid */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-xs tracking-widest text-muted-foreground mb-1">
                            {product.brandName}
                          </p>
                          <h3 className="font-serif text-lg">{product.name}</h3>
                          <p className="text-gold text-base mt-1">${product.price} / unit</p>
                        </div>
                        
                        {/* Landed Price */}
                        <div className="text-right">
                          <p className="text-xs tracking-widest text-muted-foreground mb-1">Landed Price</p>
                          <p className="font-serif text-xl">${productValue.toLocaleString()}</p>
                          {productTotal > 0 && (
                            <p className="text-muted-foreground text-sm">{productTotal} units</p>
                          )}
                        </div>
                      </div>

                      {/* Size Grid */}
                      <div className="mb-4">
                        <p className="text-xs tracking-widest text-muted-foreground mb-3">Quantity by Size</p>
                        <div className="flex gap-3">
                          {sizes.map(size => {
                            const qty = productQty[size] || 0;
                            return (
                              <div key={size} className="flex-1 text-center">
                                <p className="text-sm text-muted-foreground mb-2">{size}</p>
                                <div className="flex items-center justify-center border border-border bg-background">
                                  <button
                                    onClick={() => updateQuantity(product.id, size, -1)}
                                    className="w-8 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    value={qty}
                                    onChange={(e) => setQuantity(product.id, size, parseInt(e.target.value) || 0)}
                                    className="w-12 h-10 text-center bg-transparent border-x border-border text-base font-serif"
                                  />
                                  <button
                                    onClick={() => updateQuantity(product.id, size, 1)}
                                    className="w-8 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Notes Field */}
                      <div>
                        <Textarea
                          placeholder="Jot down any customisation points..."
                          value={orderItems[product.id]?.notes || ""}
                          onChange={(e) => setNotes(product.id, e.target.value)}
                          className="resize-none h-16 text-base bg-muted/30 border-border"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0 space-y-6 sticky top-28 h-fit">
            {/* Customisation CTA Card */}
            <div className="border border-border bg-card p-6">
              <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Scissors className="w-8 h-8 text-gold" />
              </div>
              <h3 className="font-serif text-lg text-center mb-2">
                Need Customisations?
              </h3>
              <p className="text-muted-foreground text-base text-center mb-4 leading-relaxed">
                Customise sizing, silhouettes, or design changes to suit your clientele!
              </p>
              <button className="w-full btn-luxury-outline text-base py-3">
                Schedule Appointment with Designer
              </button>
            </div>

            {/* Billing Breakdown Card */}
            <div className="border border-border bg-card p-6">
              <h3 className="text-xs tracking-widest text-muted-foreground mb-4">ORDER SUMMARY</h3>
              
              <div className="space-y-3 text-base">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal ({totalUnits} units)</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-gold">
                    <span>Bulk Discount ({(discount * 100).toFixed(0)}%)</span>
                    <span>-${discountAmount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping > 0 ? `$${shipping}` : "—"}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (18% GST)</span>
                  <span>${tax.toLocaleString()}</span>
                </div>
                
                <div className="border-t border-border pt-3 mt-3">
                  <div className="flex justify-between font-serif text-lg">
                    <span>Total</span>
                    <span>${finalTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-deep-charcoal border-t border-gold/20"
      >
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div>
              <p className="text-muted-foreground text-sm mb-1">Total Units</p>
              <p className="text-primary-foreground font-serif text-lg">{totalUnits.toLocaleString()}</p>
            </div>
            {discount > 0 && (
              <div>
                <p className="text-muted-foreground text-sm mb-1">Bulk Discount</p>
                <p className="text-gold font-serif text-lg">{(discount * 100).toFixed(0)}% OFF</p>
              </div>
            )}
            <div>
              <p className="text-muted-foreground text-sm mb-1">Order Value</p>
              <p className="text-primary-foreground font-serif text-lg">${finalTotal.toLocaleString()}</p>
            </div>
          </div>

          <button 
            className="btn-luxury-gold"
            disabled={totalUnits === 0}
            onClick={handleProceedToCheckout}
          >
            Proceed to Checkout
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default B2BOrder;
