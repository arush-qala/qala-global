import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssortment } from '@/contexts/AssortmentContext';
import { AssortmentReview } from './AssortmentReview';

export const AssortmentTray = () => {
  const { products, isTrayOpen, setTrayOpen } = useAssortment();
  const location = useLocation();

  // Hide on homepage
  const isHomepage = location.pathname === '/';
  
  // Auto-open when products are added (handled in context now)
  // Reset tray state when navigating away
  useEffect(() => {
    if (products.length === 0) {
      setTrayOpen(false);
    }
  }, [products.length, setTrayOpen]);

  if (products.length === 0 || isHomepage) return null;

  return (
    <>
      {/* Simple Bottom Tray */}
      <AnimatePresence>
        {!isTrayOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
          >
            <motion.button
              onClick={() => setTrayOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-4 px-6 py-3 bg-foreground text-background 
                         border border-border/20 shadow-lg hover:bg-foreground/90 transition-colors"
            >
              {/* Thumbnail Stack */}
              <div className="flex -space-x-2">
                {products.slice(0, 3).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="w-8 h-8 rounded-full overflow-hidden border-2 border-background"
                    style={{ zIndex: 3 - index }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
                {products.length > 3 && (
                  <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center 
                                  border-2 border-background text-[10px] font-medium text-primary-foreground">
                    +{products.length - 3}
                  </div>
                )}
              </div>

              {/* Text */}
              <span className="text-luxury-xs tracking-widest">
                {products.length} {products.length === 1 ? 'STYLE' : 'STYLES'} SELECTED
              </span>

              {/* Arrow */}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
              </svg>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Mode */}
      <AssortmentReview 
        isOpen={isTrayOpen} 
        onClose={() => setTrayOpen(false)} 
      />
    </>
  );
};
