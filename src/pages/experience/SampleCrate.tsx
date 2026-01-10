import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAssortment } from '@/contexts/AssortmentContext';
const SampleCrate = () => {
  const navigate = useNavigate();
  const {
    products
  } = useAssortment();
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
  const selectedProducts = products.filter(p => selectedItems.has(p.id));
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-8 py-6">
          <button onClick={() => navigate('/experience')} className="flex items-center gap-2 hover:text-gold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-luxury-sm tracking-widest uppercase text-base">Back</span>
          </button>
          <span className="text-luxury-sm tracking-widest text-base">SAMPLE CRATE</span>
          <div className="w-20" />
        </div>
      </div>

      <main className="pt-28 pb-32">
        {/* Hero */}
        <div className="px-8 max-w-7xl mx-auto mb-16">
          <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="text-center">
            <h1 className="font-serif text-4xl lg:text-5xl mb-4">Curate Your Sample Crate</h1>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Select up to 5 pieces to experience in person. Feel the fabrics, assess the quality, 
              and make informed buying decisions.
            </p>
          </motion.div>
        </div>

        {/* Selection Grid */}
        <div className="px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => {
            const isSelected = selectedItems.has(product.id);
            const isDisabled = !isSelected && selectedItems.size >= 5;
            return <motion.div key={product.id} initial={{
              opacity: 0,
              y: 20
            }} animate={{
              opacity: 1,
              y: 0
            }} transition={{
              delay: index * 0.05
            }} className={`group relative ${isDisabled ? 'opacity-50' : ''}`}>
                  {/* Product Image */}
                  <div className={`aspect-[3/4] mb-4 overflow-hidden cursor-pointer border-2 transition-colors ${isSelected ? 'border-gold' : 'border-transparent'}`} onClick={() => !isDisabled && toggleItem(product.id)}>
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    
                    {/* Selection Indicator */}
                    <div className={`absolute top-4 right-4 w-8 h-8 border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-gold border-gold' : 'bg-background/80 border-border backdrop-blur-sm'}`}>
                      {isSelected && <Check className="w-5 h-5 text-primary-foreground" />}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-luxury-xs text-muted-foreground mb-1">{product.brandName}</p>
                      <h3 className="font-serif text-lg mb-1">{product.name}</h3>
                      <p className="text-gold">${product.price}</p>
                    </div>
                    
                    {isSelected && <select value={selectedSizes[product.id] || ''} onChange={e => setSelectedSizes({
                  ...selectedSizes,
                  [product.id]: e.target.value
                })} className="bg-background border border-border px-3 py-2 text-sm" onClick={e => e.stopPropagation()}>
                        <option value="">Size</option>
                        {['XS', 'S', 'M', 'L', 'XL'].map(size => <option key={size} value={size}>{size}</option>)}
                      </select>}
                  </div>
                </motion.div>;
          })}
          </div>
        </div>

        {/* Empty State */}
        {products.length === 0 && <div className="text-center py-20">
            <p className="text-muted-foreground">No products in your selection yet.</p>
            <button onClick={() => navigate('/discover')} className="btn-luxury-outline mt-4">
              Browse Brands
            </button>
          </div>}
      </main>

      {/* Fixed Bottom Bar */}
      <motion.div initial={{
      y: 100
    }} animate={{
      y: 0
    }} className="fixed bottom-0 left-0 right-0 bg-deep-charcoal border-t border-gold/20">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground text-luxury-sm mb-1">
              {selectedItems.size} of 5 pieces selected
            </p>
            <p className="text-muted-foreground text-xs">
              {selectedProducts.map(p => p.name).join(', ') || 'No items selected'}
            </p>
          </div>
          
          <button className="btn-luxury-gold" disabled={selectedItems.size === 0} onClick={() => {
          const checkoutProducts = selectedProducts.map(p => ({
            ...p,
            size: selectedSizes[p.id] || 'M'
          }));
          navigate('/experience/sample-crate/checkout', {
            state: {
              selectedProducts: checkoutProducts
            }
          });
        }}>
            Proceed to Checkout
          </button>
        </div>
      </motion.div>
    </div>;
};
export default SampleCrate;