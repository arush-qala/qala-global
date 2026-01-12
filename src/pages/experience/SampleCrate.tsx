import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, X, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAssortment, AssortmentProduct } from '@/contexts/AssortmentContext';

// Size data with measurements
const SIZE_DATA = [
  { size: '28', waistIn: '28', inseamIn: '30', waistCm: '71', inseamCm: '76' },
  { size: '30', waistIn: '30', inseamIn: '31', waistCm: '76', inseamCm: '79' },
  { size: '32', waistIn: '32', inseamIn: '32', waistCm: '81', inseamCm: '81' },
  { size: '34', waistIn: '34', inseamIn: '32', waistCm: '86', inseamCm: '81' },
  { size: '36', waistIn: '36', inseamIn: '33', waistCm: '91', inseamCm: '84' },
];

// Letter sizes with bust/waist/hip measurements
const LETTER_SIZE_DATA = [
  { size: 'XS', bustIn: '32', waistIn: '24', hipIn: '34', bustCm: '81', waistCm: '61', hipCm: '86' },
  { size: 'S', bustIn: '34', waistIn: '26', hipIn: '36', bustCm: '86', waistCm: '66', hipCm: '91' },
  { size: 'M', bustIn: '36', waistIn: '28', hipIn: '38', bustCm: '91', waistCm: '71', hipCm: '97' },
  { size: 'L', bustIn: '38', waistIn: '30', hipIn: '40', bustCm: '97', waistCm: '76', hipCm: '102' },
  { size: 'XL', bustIn: '40', waistIn: '32', hipIn: '42', bustCm: '102', waistCm: '81', hipCm: '107' },
];

interface SelectedItemWithSize {
  product: AssortmentProduct;
  size: string;
}

interface SizeSelectionModalProps {
  product: AssortmentProduct;
  onConfirm: (size: string) => void;
  onClose: () => void;
}

const SizeSelectionModal = ({ product, onConfirm, onClose }: SizeSelectionModalProps) => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [unit, setUnit] = useState<'in' | 'cm'>('in');

  // Determine which size chart to use based on product type
  const useLetterSizes = true; // For this apparel platform, use letter sizes
  const sizeData = useLetterSizes ? LETTER_SIZE_DATA : SIZE_DATA;

  const handleConfirm = () => {
    if (selectedSize) {
      onConfirm(selectedSize);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-deep-charcoal/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="bg-background border border-border w-full max-w-lg mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div>
            <p className="text-muted-foreground text-xs tracking-widest uppercase mb-1">
              Select Size
            </p>
            <h3 className="font-serif text-xl">{product.name}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:text-gold transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Unit Toggle */}
        <div className="flex justify-end px-6 pt-4">
          <div className="flex items-center gap-1 border border-border">
            <button
              onClick={() => setUnit('in')}
              className={`px-3 py-1.5 text-xs tracking-widest transition-colors ${
                unit === 'in' 
                  ? 'bg-foreground text-background' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              IN
            </button>
            <button
              onClick={() => setUnit('cm')}
              className={`px-3 py-1.5 text-xs tracking-widest transition-colors ${
                unit === 'cm' 
                  ? 'bg-foreground text-background' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              CM
            </button>
          </div>
        </div>

        {/* Size Table */}
        <div className="px-6 py-4">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="w-12 py-3"></th>
                <th className="py-3 text-left text-xs tracking-widest text-muted-foreground font-normal">
                  SIZE
                </th>
                {useLetterSizes ? (
                  <>
                    <th className="py-3 text-left text-xs tracking-widest text-muted-foreground font-normal">
                      BUST
                    </th>
                    <th className="py-3 text-left text-xs tracking-widest text-muted-foreground font-normal">
                      WAIST
                    </th>
                    <th className="py-3 text-left text-xs tracking-widest text-muted-foreground font-normal">
                      HIP
                    </th>
                  </>
                ) : (
                  <>
                    <th className="py-3 text-left text-xs tracking-widest text-muted-foreground font-normal">
                      TO FIT WAIST
                    </th>
                    <th className="py-3 text-left text-xs tracking-widest text-muted-foreground font-normal">
                      INSEAM LENGTH
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {useLetterSizes ? (
                LETTER_SIZE_DATA.map((row) => (
                  <tr
                    key={row.size}
                    onClick={() => setSelectedSize(row.size)}
                    className={`border-b border-border/50 cursor-pointer transition-colors ${
                      selectedSize === row.size
                        ? 'bg-gold/10'
                        : 'hover:bg-muted/30'
                    }`}
                  >
                    <td className="py-4 pl-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedSize === row.size
                            ? 'border-gold bg-gold'
                            : 'border-border'
                        }`}
                      >
                        {selectedSize === row.size && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-primary-foreground"
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-4 font-medium">{row.size}</td>
                    <td className="py-4 text-muted-foreground">
                      {unit === 'in' ? row.bustIn : row.bustCm}"
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {unit === 'in' ? row.waistIn : row.waistCm}"
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {unit === 'in' ? row.hipIn : row.hipCm}"
                    </td>
                  </tr>
                ))
              ) : (
                SIZE_DATA.map((row) => (
                  <tr
                    key={row.size}
                    onClick={() => setSelectedSize(row.size)}
                    className={`border-b border-border/50 cursor-pointer transition-colors ${
                      selectedSize === row.size
                        ? 'bg-gold/10'
                        : 'hover:bg-muted/30'
                    }`}
                  >
                    <td className="py-4 pl-2">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          selectedSize === row.size
                            ? 'border-gold bg-gold'
                            : 'border-border'
                        }`}
                      >
                        {selectedSize === row.size && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-2 h-2 rounded-full bg-primary-foreground"
                          />
                        )}
                      </div>
                    </td>
                    <td className="py-4 font-medium">{row.size}</td>
                    <td className="py-4 text-muted-foreground">
                      {unit === 'in' ? row.waistIn : row.waistCm}"
                    </td>
                    <td className="py-4 text-muted-foreground">
                      {unit === 'in' ? row.inseamIn : row.inseamCm}"
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-border flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-sm tracking-widest transition-colors"
          >
            CANCEL
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedSize}
            className={`px-8 py-3 text-sm tracking-widest transition-all ${
              selectedSize
                ? 'bg-gold text-primary-foreground hover:bg-gold/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            ADD TO CRATE
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SampleCrate = () => {
  const navigate = useNavigate();
  const { products } = useAssortment();
  
  // Local state for selected items with sizes
  const [selectedItems, setSelectedItems] = useState<SelectedItemWithSize[]>([]);
  
  // Modal state
  const [productForSizing, setProductForSizing] = useState<AssortmentProduct | null>(null);

  const isItemSelected = useCallback((id: string) => {
    return selectedItems.some((item) => item.product.id === id);
  }, [selectedItems]);

  const handleAddClick = (product: AssortmentProduct) => {
    if (selectedItems.length >= 5) return;
    if (isItemSelected(product.id)) {
      // Remove if already selected
      setSelectedItems((prev) => prev.filter((item) => item.product.id !== product.id));
    } else {
      // Open size selection modal
      setProductForSizing(product);
    }
  };

  const handleSizeConfirm = (size: string) => {
    if (!productForSizing) return;
    
    setSelectedItems((prev) => [
      ...prev,
      { product: productForSizing, size }
    ]);
    setProductForSizing(null);
  };

  const handleRemoveItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.product.id !== id));
  };

  const handleProceedToCheckout = () => {
    const checkoutProducts = selectedItems.map((item) => ({
      ...item.product,
      size: item.size,
    }));
    navigate('/experience/sample-crate/checkout', {
      state: { selectedProducts: checkoutProducts },
    });
  };

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
            <span className="text-sm tracking-widest uppercase">Back</span>
          </button>
          <span className="text-luxury-sm tracking-widest text-base">SAMPLE CRATE</span>
          <div className="w-20" />
        </div>
      </div>

      <main className="pt-28 pb-40">
        {/* Hero */}
        <div className="px-8 max-w-7xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl mb-4 lg:text-6xl">Curate Your Sample Crate</h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Select up to 5 pieces to experience in person. Feel the fabrics, assess the quality,
              and make informed buying decisions.
            </p>
          </motion.div>
        </div>

        {/* Selection Grid */}
        <div className="px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => {
              const isSelected = isItemSelected(product.id);
              const selectedItem = selectedItems.find((item) => item.product.id === product.id);
              const isDisabled = !isSelected && selectedItems.length >= 5;

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group relative ${isDisabled ? 'opacity-50' : ''}`}
                >
                  {/* Product Image */}
                  <div
                    className={`aspect-[3/4] mb-4 overflow-hidden border-2 transition-colors relative ${
                      isSelected ? 'border-gold' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Selection Badge */}
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-4 right-4 bg-gold text-primary-foreground px-3 py-1.5 text-xs tracking-widest flex items-center gap-2"
                      >
                        <Check className="w-4 h-4" />
                        SIZE {selectedItem?.size}
                      </motion.div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-luxury-xs text-muted-foreground mb-1">{product.brandName}</p>
                      <h3 className="font-serif text-lg mb-1 truncate">{product.name}</h3>
                      <p className="text-gold">${product.price}</p>
                    </div>

                    {/* Add/Remove Button */}
                    <button
                      onClick={() => handleAddClick(product)}
                      disabled={isDisabled}
                      className={`flex-shrink-0 px-4 py-2 text-xs tracking-widest transition-all ${
                        isSelected
                          ? 'bg-transparent border border-border text-foreground hover:border-gold hover:text-gold'
                          : isDisabled
                          ? 'bg-muted text-muted-foreground cursor-not-allowed'
                          : 'bg-foreground text-background hover:bg-gold'
                      }`}
                    >
                      {isSelected ? 'REMOVE' : 'ADD'}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No products in your selection yet.</p>
            <button onClick={() => navigate('/discover')} className="btn-luxury-outline mt-4">
              Browse Brands
            </button>
          </div>
        )}
      </main>

      {/* Fixed Bottom Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-deep-charcoal border-t border-gold/20"
      >
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground text-sm mb-1">
              {selectedItems.length} of {products.length} pieces selected
            </p>
            <p className="text-primary-foreground/60 text-xs truncate max-w-md">
              {selectedItems.map((item) => `${item.product.name} (${item.size})`).join(', ') ||
                'No items selected'}
            </p>
          </div>

          <button
            onClick={handleProceedToCheckout}
            disabled={selectedItems.length === 0}
            className={`px-8 py-3 text-sm tracking-widest transition-all ${
              selectedItems.length > 0
                ? 'bg-gold text-primary-foreground hover:bg-gold/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed'
            }`}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
      </motion.div>

      {/* Size Selection Modal */}
      <AnimatePresence>
        {productForSizing && (
          <SizeSelectionModal
            product={productForSizing}
            onConfirm={handleSizeConfirm}
            onClose={() => setProductForSizing(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SampleCrate;
