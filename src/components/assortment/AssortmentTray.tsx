import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssortment } from '@/contexts/AssortmentContext';
import { AssortmentReview } from './AssortmentReview';

export const AssortmentTray = () => {
  const { products } = useAssortment();
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (products.length === 0) return null;

  // Calculate magnification effect for dock-like behavior
  const getMagnification = (index: number) => {
    if (hoveredIndex === null) return 1;
    const distance = Math.abs(index - hoveredIndex);
    if (distance === 0) return 1.4;
    if (distance === 1) return 1.2;
    if (distance === 2) return 1.1;
    return 1;
  };

  return (
    <>
      {/* macOS Dock-style Tray */}
      <AnimatePresence>
        {!isReviewOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            {/* Dock Container */}
            <motion.div 
              className="relative flex items-end gap-1 px-4 py-3 rounded-2xl 
                         bg-deep-charcoal/90 backdrop-blur-xl border border-gold/20
                         shadow-[0_8px_32px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.1)]"
            >
              {/* Product Thumbnails */}
              <div className="flex items-end gap-1">
                {products.slice(0, 8).map((product, index) => {
                  const scale = getMagnification(index);
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ 
                        scale: scale,
                        opacity: 1,
                        y: scale > 1 ? -(scale - 1) * 20 : 0
                      }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ 
                        type: 'spring',
                        damping: 20,
                        stiffness: 300,
                        delay: index * 0.03
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className="relative cursor-pointer"
                      style={{ originY: 1 }}
                    >
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gold/30 shadow-lg">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      {/* Tooltip on hover */}
                      <AnimatePresence>
                        {hoveredIndex === index && (
                          <motion.div
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 5 }}
                            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 
                                       px-2 py-1 bg-charcoal text-primary-foreground text-[10px] 
                                       whitespace-nowrap rounded shadow-lg"
                          >
                            {product.name}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
                
                {/* Overflow indicator */}
                {products.length > 8 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-12 h-12 rounded-lg bg-gold/20 flex items-center justify-center
                               border border-gold/30"
                  >
                    <span className="text-primary-foreground text-xs font-medium">
                      +{products.length - 8}
                    </span>
                  </motion.div>
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-10 bg-gold/20 mx-2" />

              {/* Review Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsReviewOpen(true)}
                className="w-12 h-12 rounded-lg bg-gold flex items-center justify-center
                           shadow-lg hover:brightness-110 transition-all"
              >
                <span className="text-primary-foreground text-xs font-bold">
                  {products.length}
                </span>
              </motion.button>

              {/* Reflection effect */}
              <div className="absolute inset-x-4 -bottom-3 h-3 bg-gradient-to-b from-deep-charcoal/20 to-transparent 
                              rounded-b-2xl blur-sm opacity-50" />
            </motion.div>

            {/* Label */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-center text-[10px] text-muted-foreground tracking-widest uppercase mt-2"
            >
              {products.length} {products.length === 1 ? 'Style' : 'Styles'} Selected
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Mode */}
      <AssortmentReview 
        isOpen={isReviewOpen} 
        onClose={() => setIsReviewOpen(false)} 
      />
    </>
  );
};
