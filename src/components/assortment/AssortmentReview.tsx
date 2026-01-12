import { useRef, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAssortment, AssortmentProduct } from '@/contexts/AssortmentContext';
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
  return <Reorder.Item value={product} id={product.id} className="flex-shrink-0 w-72 h-full cursor-grab active:cursor-grabbing group">
      <div className="relative h-full bg-background border border-border overflow-hidden">
        {/* Index Badge */}
        <div className="absolute top-4 left-4 z-10 w-8 h-8 bg-gold flex items-center justify-center">
          <span className="text-primary-foreground text-sm font-medium">{index + 1}</span>
        </div>

        {/* Remove Button (on hover) */}
        <button onClick={e => {
        e.stopPropagation();
        onRemove();
      }} className="absolute top-4 right-4 z-10 w-8 h-8 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground">
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
          <h3 className="font-serif text-lg leading-tight mb-2 line-clamp-2">
            {product.name}
          </h3>
          <span className="text-muted-foreground text-sm mb-2">
            {product.category || 'Apparel'}
          </span>
          <span className="text-gold font-medium mt-auto">
            ${product.price}
          </span>
        </div>
      </div>
    </Reorder.Item>;
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
  return <AnimatePresence>
      {isOpen && <motion.div initial={{
      y: '100%'
    }} animate={{
      y: 0
    }} exit={{
      y: '100%'
    }} transition={{
      type: 'spring',
      damping: 30,
      stiffness: 300
    }} className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border" style={{
      height: '80vh',
      maxHeight: '80vh'
    }}>
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-border">
            <div>
              <h2 className="font-serif text-2xl">Your Selection</h2>
              <p className="text-muted-foreground text-sm mt-1">
                Drag to reorder • {products.length} {products.length === 1 ? 'style' : 'styles'}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={handleContinue} className="btn-luxury-gold flex items-center gap-2">
                <span>Save & Proceed </span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="p-2 hover:text-gold transition-colors">
                <X className="w-6 h-6" strokeWidth={1} />
              </button>
            </div>
          </div>

          {/* Scrollable Product Cards */}
          <div ref={scrollContainerRef} className="h-[calc(100%-88px)] overflow-x-auto overflow-y-hidden px-8 py-6">
            {products.length > 0 ? <Reorder.Group axis="x" values={products} onReorder={reorderProducts} className="flex gap-6 h-full">
                {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} onRemove={() => removeProduct(product.id)} />)}
              </Reorder.Group> : <div className="h-full flex items-center justify-center">
                <p className="text-muted-foreground">No styles selected yet</p>
              </div>}
          </div>
        </motion.div>}
    </AnimatePresence>;
};