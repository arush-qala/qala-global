import { useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAssortment, AssortmentProduct } from '@/contexts/AssortmentContext';

// Helper to derive specific category from product name or fallback
const deriveCategory = (product: AssortmentProduct): string => {
  const name = product.name.toLowerCase();
  
  // Check product's category first if it's specific
  if (product.category && product.category !== 'Apparel') {
    return product.category;
  }
  
  // Keyword-based fallback mapping
  if (name.includes('dress') || name.includes('gown') || name.includes('frock')) return 'Dress';
  if (name.includes('jacket') || name.includes('blazer') || name.includes('coat')) return 'Jacket';
  if (name.includes('pant') || name.includes('trouser') || name.includes('jean')) return 'Pants';
  if (name.includes('top') || name.includes('blouse') || name.includes('shirt') || name.includes('tee')) return 'Top';
  if (name.includes('skirt')) return 'Skirt';
  if (name.includes('kurta') || name.includes('kurti')) return 'Kurta';
  if (name.includes('saree') || name.includes('sari')) return 'Saree';
  if (name.includes('suit') || name.includes('co-ord') || name.includes('coord')) return 'Set';
  if (name.includes('jumpsuit') || name.includes('romper')) return 'Jumpsuit';
  if (name.includes('cardigan') || name.includes('sweater') || name.includes('pullover')) return 'Knitwear';
  if (name.includes('scarf') || name.includes('stole') || name.includes('dupatta')) return 'Accessory';
  
  return product.category || 'Apparel';
};

interface AssortmentReviewProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProductCard = ({
  product,
  index,
  onRemove
}: {
  product: AssortmentProduct;
  index: number;
  onRemove: () => void;
}) => {
  const category = deriveCategory(product);
  
  return (
    <Reorder.Item value={product} id={product.id} className="flex-shrink-0 w-72 h-full cursor-grab active:cursor-grabbing group">
      <div className="relative h-full bg-background border border-border overflow-hidden">
        {/* Index Badge */}
        <div className="absolute top-4 left-4 z-10 w-8 h-8 bg-gold flex items-center justify-center">
          <span className="text-primary-foreground text-sm font-medium">{index + 1}</span>
        </div>

        {/* Remove Button (on hover) */}
        <button 
          onClick={e => {
            e.stopPropagation();
            onRemove();
          }} 
          className="absolute top-4 right-4 z-10 w-8 h-8 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product Image */}
        <div className="h-[55%] overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" draggable={false} />
        </div>

        {/* Product Details */}
        <div className="p-4 h-[45%] flex flex-col">
          <span className="text-muted-foreground text-luxury-xs tracking-widest mb-2">
            {product.brandName?.toUpperCase() || 'BRAND'}
          </span>
          <h3 className="font-serif text-lg leading-tight mb-1 line-clamp-2">
            {product.name}
          </h3>
          <span className="text-muted-foreground text-sm mb-2">
            {category}
          </span>
          <span className="text-gold font-medium mt-auto">
            ${product.price}
          </span>
        </div>
      </div>
    </Reorder.Item>
  );
};
export const AssortmentReview = ({
  isOpen,
  onClose
}: AssortmentReviewProps) => {
  const {
    products,
    reorderProducts,
    removeProduct
  } = useAssortment();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Convert vertical scroll to horizontal
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };
    container.addEventListener('wheel', handleWheel, {
      passive: false
    });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [isOpen]);
  const handleContinue = () => {
    onClose();
    navigate('/experience');
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40"
          />
          
          {/* Centered Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          >
            <div 
              className="bg-background border border-border w-full max-w-6xl h-[80vh] max-h-[700px] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-8 py-6 border-b border-border flex-shrink-0">
                <div>
                  <h2 className="font-serif text-2xl">Your Selection</h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Drag to reorder • {products.length} {products.length === 1 ? 'style' : 'styles'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={handleContinue} className="btn-luxury-gold flex items-center gap-2">
                    <span>Save & Proceed</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button onClick={onClose} className="p-2 hover:text-gold transition-colors">
                    <X className="w-6 h-6" strokeWidth={1} />
                  </button>
                </div>
              </div>

              {/* Scrollable Product Cards */}
              <div 
                ref={scrollContainerRef} 
                className="flex-1 overflow-x-auto overflow-y-hidden px-8 py-6"
              >
                {products.length > 0 ? (
                  <Reorder.Group 
                    axis="x" 
                    values={products} 
                    onReorder={reorderProducts} 
                    className="flex gap-6 h-full"
                  >
                    {products.map((product, index) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        index={index} 
                        onRemove={() => removeProduct(product.id)} 
                      />
                    ))}
                  </Reorder.Group>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-muted-foreground">No styles selected yet</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};