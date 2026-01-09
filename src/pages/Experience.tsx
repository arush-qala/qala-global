import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Package, ShoppingCart, Calendar, MapPin, X, Minus, Plus, Check } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAssortment } from '@/contexts/AssortmentContext';

// CTA Card Component
const CTACard = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
  accentColor = 'gold'
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  accentColor?: string;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ y: -4 }}
    className="text-left p-8 border border-border bg-background hover:border-gold/50 transition-colors group"
  >
    <div className="w-12 h-12 bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold/20 transition-colors">
      <Icon className="w-6 h-6 text-gold" />
    </div>
    <h3 className="font-serif text-xl mb-3">{title}</h3>
    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
  </motion.button>
);

// Sample Crate Drawer
const SampleCrateDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { products } = useAssortment();
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else if (newSelected.size < 5) {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-background border-l border-border z-50 overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl">Sample Crate</h2>
                <button onClick={onClose} className="p-2 hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-muted-foreground text-sm mb-6">
                Select up to 5 items for physical sampling. Choose a size for each.
              </p>

              <div className="space-y-4 mb-8">
                {products.map((product) => (
                  <div 
                    key={product.id}
                    className={`p-4 border transition-colors ${
                      selectedItems.has(product.id) 
                        ? 'border-gold bg-gold/5' 
                        : 'border-border'
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="w-20 h-20 flex-shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-serif text-sm mb-1">{product.name}</h4>
                        <p className="text-muted-foreground text-xs mb-3">${product.price}</p>
                        
                        <div className="flex items-center gap-2">
                          <select
                            value={selectedSizes[product.id] || ''}
                            onChange={(e) => setSelectedSizes({...selectedSizes, [product.id]: e.target.value})}
                            className="text-xs bg-background border border-border px-2 py-1"
                          >
                            <option value="">Size</option>
                            {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                              <option key={size} value={size}>{size}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => toggleItem(product.id)}
                            disabled={!selectedItems.has(product.id) && selectedItems.size >= 5}
                            className={`text-xs px-3 py-1 transition-colors ${
                              selectedItems.has(product.id)
                                ? 'bg-gold text-primary-foreground'
                                : 'bg-muted hover:bg-muted/80'
                            } disabled:opacity-50`}
                          >
                            {selectedItems.has(product.id) ? 'Selected' : 'Add'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex justify-between mb-4">
                  <span className="text-muted-foreground">Items Selected</span>
                  <span>{selectedItems.size} / 5</span>
                </div>
                <button 
                  className="w-full btn-luxury-gold"
                  disabled={selectedItems.size === 0}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// B2B Order Matrix
const B2BOrderDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { products } = useAssortment();
  const [quantities, setQuantities] = useState<Record<string, Record<string, number>>>({});
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

  const getProductTotal = (productId: string) => {
    const productQty = quantities[productId] || {};
    return Object.values(productQty).reduce((sum, qty) => sum + qty, 0);
  };

  const grandTotal = products.reduce((sum, p) => sum + getProductTotal(p.id) * p.price, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-3xl bg-background border-l border-border z-50 overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl">B2B Order</h2>
                <button onClick={onClose} className="p-2 hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-muted-foreground text-sm mb-6">
                Enter quantities per size. Tiered bulk pricing applies.
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2">Product</th>
                      {sizes.map(size => (
                        <th key={size} className="text-center py-3 px-2 w-20">{size}</th>
                      ))}
                      <th className="text-right py-3 px-2">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-border/50">
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 flex-shrink-0">
                              <img src={product.image} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="font-medium text-xs line-clamp-1">{product.name}</p>
                              <p className="text-muted-foreground text-xs">${product.price}</p>
                            </div>
                          </div>
                        </td>
                        {sizes.map(size => (
                          <td key={size} className="py-4 px-2">
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => updateQuantity(product.id, size, -10)}
                                className="w-6 h-6 flex items-center justify-center bg-muted hover:bg-muted/80"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <input
                                type="number"
                                min="0"
                                value={(quantities[product.id]?.[size]) || 0}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value) || 0;
                                  setQuantities(prev => ({
                                    ...prev,
                                    [product.id]: { ...(prev[product.id] || {}), [size]: val }
                                  }));
                                }}
                                className="w-12 text-center bg-background border border-border text-xs py-1"
                              />
                              <button
                                onClick={() => updateQuantity(product.id, size, 10)}
                                className="w-6 h-6 flex items-center justify-center bg-muted hover:bg-muted/80"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        ))}
                        <td className="py-4 px-2 text-right font-medium">
                          {getProductTotal(product.id)} units
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-border pt-6 mt-6">
                <div className="flex justify-between mb-4">
                  <span className="text-muted-foreground">Estimated Total</span>
                  <span className="text-xl font-serif">${grandTotal.toLocaleString()}</span>
                </div>
                <p className="text-muted-foreground text-xs mb-4">
                  Final pricing will be confirmed based on order volume and delivery timeline.
                </p>
                <button className="w-full btn-luxury-gold">
                  Request Quote
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Private Showcase Form
const ShowcaseDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    boutiqueName: '',
    address: '',
    city: '',
    preferredDate1: '',
    preferredDate2: '',
    notes: ''
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-background border-l border-border z-50 overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl">Private Showcase</h2>
                <button onClick={onClose} className="p-2 hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-muted-foreground text-sm mb-6">
                Schedule a trunk show at your boutique. Our team will bring the collection to you.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-luxury-xs tracking-widest mb-2">BOUTIQUE NAME</label>
                  <input
                    type="text"
                    value={formData.boutiqueName}
                    onChange={(e) => setFormData({...formData, boutiqueName: e.target.value})}
                    className="w-full bg-background border border-border px-4 py-3 text-sm"
                    placeholder="Your boutique name"
                  />
                </div>
                
                <div>
                  <label className="block text-luxury-xs tracking-widest mb-2">ADDRESS</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full bg-background border border-border px-4 py-3 text-sm"
                    placeholder="Street address"
                  />
                </div>
                
                <div>
                  <label className="block text-luxury-xs tracking-widest mb-2">CITY</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full bg-background border border-border px-4 py-3 text-sm"
                    placeholder="City, State"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-luxury-xs tracking-widest mb-2">PREFERRED DATE 1</label>
                    <input
                      type="date"
                      value={formData.preferredDate1}
                      onChange={(e) => setFormData({...formData, preferredDate1: e.target.value})}
                      className="w-full bg-background border border-border px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-luxury-xs tracking-widest mb-2">PREFERRED DATE 2</label>
                    <input
                      type="date"
                      value={formData.preferredDate2}
                      onChange={(e) => setFormData({...formData, preferredDate2: e.target.value})}
                      className="w-full bg-background border border-border px-4 py-3 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-luxury-xs tracking-widest mb-2">ADDITIONAL NOTES</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    className="w-full bg-background border border-border px-4 py-3 text-sm resize-none"
                    placeholder="Any special requirements..."
                  />
                </div>
              </div>

              <div className="mt-8">
                <button className="w-full btn-luxury-gold">
                  Request Showcase
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Trade Show RSVP
const TradeShowDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());

  const events = [
    { id: '1', name: 'Paris Fashion Week', date: 'Feb 24-28, 2026', location: 'Paris, France', booth: 'Hall B, Stand 42' },
    { id: '2', name: 'NYC Coterie', date: 'Mar 12-14, 2026', location: 'New York, USA', booth: 'Level 2, Booth 156' },
    { id: '3', name: 'Lakme Fashion Week', date: 'Apr 5-9, 2026', location: 'Mumbai, India', booth: 'Main Hall, Stand 78' },
    { id: '4', name: 'London Fashion Week', date: 'May 18-22, 2026', location: 'London, UK', booth: 'Somerset House' },
  ];

  const toggleEvent = (id: string) => {
    const newSelected = new Set(selectedEvents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEvents(newSelected);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-background border-l border-border z-50 overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl">Trade Shows</h2>
                <button onClick={onClose} className="p-2 hover:text-gold">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-muted-foreground text-sm mb-6">
                View our brands at upcoming industry events. RSVP for booth appointments.
              </p>

              <div className="space-y-4">
                {events.map((event) => (
                  <div 
                    key={event.id}
                    className={`p-5 border transition-colors cursor-pointer ${
                      selectedEvents.has(event.id) 
                        ? 'border-gold bg-gold/5' 
                        : 'border-border hover:border-gold/30'
                    }`}
                    onClick={() => toggleEvent(event.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-serif text-lg mb-1">{event.name}</h4>
                        <p className="text-gold text-sm mb-2">{event.date}</p>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs">
                          <MapPin className="w-3 h-3" />
                          <span>{event.location}</span>
                        </div>
                        <p className="text-muted-foreground text-xs mt-1">{event.booth}</p>
                      </div>
                      <div className={`w-6 h-6 border flex items-center justify-center transition-colors ${
                        selectedEvents.has(event.id) 
                          ? 'bg-gold border-gold' 
                          : 'border-border'
                      }`}>
                        {selectedEvents.has(event.id) && (
                          <Check className="w-4 h-4 text-primary-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <button 
                  className="w-full btn-luxury-gold"
                  disabled={selectedEvents.size === 0}
                >
                  RSVP for {selectedEvents.size} Event{selectedEvents.size !== 1 ? 's' : ''}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Experience = () => {
  const { products } = useAssortment();
  const navigate = useNavigate();
  const [activeDrawer, setActiveDrawer] = useState<'sample' | 'b2b' | 'showcase' | 'tradeshow' | null>(null);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-8 py-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-luxury-sm tracking-widest uppercase">Back</span>
          </button>
          
          <span className="text-luxury-sm tracking-widest">
            {products.length} STYLES IN YOUR SELECTION
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-32 pb-16 px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-4xl lg:text-5xl text-center mb-4">
            How Would You Like to Proceed?
          </h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
            Your curated selection is ready. Choose how you'd like to experience these pieces.
          </p>

          {/* Selection Preview */}
          {products.length > 0 && (
            <div className="flex justify-center gap-2 mb-16">
              {products.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-16 h-16 border border-border overflow-hidden"
                >
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </motion.div>
              ))}
              {products.length > 8 && (
                <div className="w-16 h-16 border border-border flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground text-sm">+{products.length - 8}</span>
                </div>
              )}
            </div>
          )}

          {/* CTA Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CTACard
              icon={Package}
              title="Order Sample Crate"
              description="Test fabric and quality before committing. Select up to 5 pieces for physical sampling at your boutique."
              onClick={() => setActiveDrawer('sample')}
            />
            <CTACard
              icon={ShoppingCart}
              title="Place B2B Order"
              description="Ready to stock? Enter quantities per size in our order matrix. Tiered bulk pricing applies."
              onClick={() => setActiveDrawer('b2b')}
            />
            <CTACard
              icon={Calendar}
              title="Private Showcase"
              description="White-glove service. Our team brings the collection directly to your boutique for a trunk show experience."
              onClick={() => setActiveDrawer('showcase')}
            />
            <CTACard
              icon={MapPin}
              title="Trade Show RSVP"
              description="Prefer to see in person? RSVP for our booth appointments at upcoming fashion weeks and trade events."
              onClick={() => setActiveDrawer('tradeshow')}
            />
          </div>
        </motion.div>
      </main>

      {/* Drawers */}
      <SampleCrateDrawer isOpen={activeDrawer === 'sample'} onClose={() => setActiveDrawer(null)} />
      <B2BOrderDrawer isOpen={activeDrawer === 'b2b'} onClose={() => setActiveDrawer(null)} />
      <ShowcaseDrawer isOpen={activeDrawer === 'showcase'} onClose={() => setActiveDrawer(null)} />
      <TradeShowDrawer isOpen={activeDrawer === 'tradeshow'} onClose={() => setActiveDrawer(null)} />
    </div>
  );
};

export default Experience;
