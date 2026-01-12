import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Package } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AssortmentProduct } from "@/contexts/AssortmentContext";
import { z } from "zod";

interface OrderItem {
  productId: string;
  quantities: Record<string, number>;
  notes: string;
}

interface CheckoutState {
  orderItems: Record<string, OrderItem>;
  products: AssortmentProduct[];
  subtotal: number;
  discountAmount: number;
  discount: number;
  shipping: number;
  tax: number;
  finalTotal: number;
  totalUnits: number;
}

const checkoutSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  contactName: z.string().min(1, "Contact name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  notes: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const B2BOrderCheckout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as CheckoutState | null;

  const [formData, setFormData] = useState<CheckoutFormData>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    notes: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">No order data found.</p>
          <button
            onClick={() => navigate("/experience/b2b-order")}
            className="btn-luxury-outline"
          >
            Return to Order
          </button>
        </div>
      </div>
    );
  }

  const { orderItems, products, subtotal, discountAmount, discount, shipping, tax, finalTotal, totalUnits } = state;

  const sizes = ["XS", "S", "M", "L", "XL"];

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handleSubmit = () => {
    try {
      checkoutSchema.parse(formData);
      setIsSubmitted(true);
      window.scrollTo(0, 0);
    } catch (err) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        err.errors.forEach(e => {
          if (e.path[0]) {
            newErrors[e.path[0] as string] = e.message;
          }
        });
        setErrors(newErrors);
      }
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md mx-auto p-8"
        >
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-gold" />
          </div>
          <h1 className="font-serif text-3xl mb-4">Order Submitted</h1>
          <p className="text-muted-foreground mb-2">
            Thank you for your wholesale order!
          </p>
          <p className="text-muted-foreground mb-8 text-sm">
            Our team will review your order and contact you within 24-48 hours with a formal quote and next steps.
          </p>
          <p className="font-serif text-xl text-gold mb-8">
            Order Total: ${finalTotal.toLocaleString()}
          </p>
          <button
            onClick={() => navigate("/")}
            className="btn-luxury-gold"
          >
            Return to Home
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-8 py-6">
          <button
            onClick={() => navigate("/experience/b2b-order")}
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-luxury-sm tracking-widest uppercase text-sm">Back to Order</span>
          </button>
          <span className="text-luxury-sm tracking-widest text-sm">CHECKOUT</span>
          <div className="w-28" />
        </div>
      </div>

      <main className="pt-28 pb-12 px-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="font-serif text-3xl mb-8">Review & Checkout</h1>

          <div className="flex gap-8">
            {/* Left: Order Summary */}
            <div className="flex-1">
              <div className="border border-border bg-card p-6 mb-6">
                <h2 className="text-luxury-xs text-muted-foreground mb-4">ORDER ITEMS</h2>
                
                <div className="space-y-4">
                  {products.map(product => {
                    const item = orderItems[product.id];
                    const productUnits = item ? Object.values(item.quantities).reduce((s, q) => s + q, 0) : 0;
                    
                    if (productUnits === 0) return null;

                    return (
                      <div key={product.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                        <div className="w-16 h-20 flex-shrink-0 overflow-hidden">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-luxury-xs text-muted-foreground">{product.brandName}</p>
                          <p className="font-serif">{product.name}</p>
                          <div className="flex gap-2 mt-2 flex-wrap">
                            {sizes.map(size => {
                              const qty = item?.quantities[size] || 0;
                              if (qty === 0) return null;
                              return (
                                <span key={size} className="text-xs bg-muted px-2 py-1">
                                  {size}: {qty}
                                </span>
                              );
                            })}
                          </div>
                          {item?.notes && (
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-serif">${(productUnits * product.price).toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">{productUnits} units</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Form */}
              <div className="border border-border bg-card p-6">
                <h2 className="text-luxury-xs text-muted-foreground mb-6">SHIPPING & CONTACT INFORMATION</h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      className={errors.companyName ? "border-destructive" : ""}
                    />
                    {errors.companyName && <p className="text-destructive text-xs mt-1">{errors.companyName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      className={errors.contactName ? "border-destructive" : ""}
                    />
                    {errors.contactName && <p className="text-destructive text-xs mt-1">{errors.contactName}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="address">Shipping Address *</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={`resize-none h-20 ${errors.address ? "border-destructive" : ""}`}
                    />
                    {errors.address && <p className="text-destructive text-xs mt-1">{errors.address}</p>}
                  </div>

                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      className={errors.city ? "border-destructive" : ""}
                    />
                    {errors.city && <p className="text-destructive text-xs mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <Label htmlFor="state">State / Province *</Label>
                    <Input
                      id="state"
                      value={formData.state}
                      onChange={(e) => handleInputChange("state", e.target.value)}
                      className={errors.state ? "border-destructive" : ""}
                    />
                    {errors.state && <p className="text-destructive text-xs mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange("postalCode", e.target.value)}
                      className={errors.postalCode ? "border-destructive" : ""}
                    />
                    {errors.postalCode && <p className="text-destructive text-xs mt-1">{errors.postalCode}</p>}
                  </div>

                  <div>
                    <Label htmlFor="country">Country *</Label>
                    <Input
                      id="country"
                      value={formData.country}
                      onChange={(e) => handleInputChange("country", e.target.value)}
                      className={errors.country ? "border-destructive" : ""}
                    />
                    {errors.country && <p className="text-destructive text-xs mt-1">{errors.country}</p>}
                  </div>

                  <div className="col-span-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any special instructions or requirements..."
                      className="resize-none h-20"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Billing Summary */}
            <div className="w-80 flex-shrink-0">
              <div className="border border-border bg-card p-6 sticky top-28">
                <div className="flex items-center gap-3 mb-6">
                  <Package className="w-5 h-5 text-gold" />
                  <h2 className="text-luxury-xs text-muted-foreground">ORDER TOTAL</h2>
                </div>

                <div className="space-y-3 text-sm">
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
                    <span>${shipping}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax (18% GST)</span>
                    <span>${tax.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-border pt-3 mt-3">
                    <div className="flex justify-between font-serif text-xl">
                      <span>Total</span>
                      <span>${finalTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full btn-luxury-gold mt-6"
                >
                  Place Order
                </button>

                <p className="text-xs text-muted-foreground text-center mt-4">
                  By placing this order, you agree to our terms and conditions for wholesale purchases.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default B2BOrderCheckout;
