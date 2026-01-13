import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssortment } from '@/contexts/AssortmentContext';
import { AssortmentReview } from './AssortmentReview';

export const AssortmentTray = () => {
  const { products, isTrayOpen, setTrayOpen } = useAssortment();
  const location = useLocation();
  const prevCountRef = useRef(products.length);
  const [shouldPulse, setShouldPulse] = useState(false);

  // Hide on homepage and sample-crate page (has its own selection flow)
  const isHomepage = location.pathname === '/';
  const isSampleCratePage = location.pathname.startsWith('/experience/sample-crate');
  
  // Detect when a new item is added and trigger pulse animation
  useEffect(() => {
    if (products.length > prevCountRef.current) {
      // New item added - trigger pulse
      setShouldPulse(true);
      const timer = setTimeout(() => setShouldPulse(false), 600);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = products.length;
  }, [products.length]);

  // Reset tray state when navigating away or when empty
  useEffect(() => {
    if (products.length === 0) {
      setTrayOpen(false);
    }
  }, [products.length, setTrayOpen]);

  if (products.length === 0 || isHomepage || isSampleCratePage) return null;

  return (
    <>
      {/* Simple Bottom Tray - with pulse animation on add */}
      <AnimatePresence>
        {!isTrayOpen && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 inset-x-0 z-40 flex justify-center pointer-events-none"
          >
            <motion.button
              onClick={() => setTrayOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              animate={shouldPulse ? { 
                scale: [1, 1.08, 1],
                boxShadow: [
                  '0 10px 40px rgba(184, 149, 106, 0.2)',
                  '0 10px 50px rgba(184, 149, 106, 0.5)',
                  '0 10px 40px rgba(184, 149, 106, 0.2)'
                ]
              } : {}}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex items-center gap-4 px-6 py-3 bg-foreground text-background 
                         border border-border/20 shadow-lg hover:bg-foreground/90 transition-colors
                         pointer-events-auto"
            >
              {/* Thumbnail Stack with entrance animation */}
              <div className="flex -space-x-2">
                {products.slice(0, 3).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.05, type: 'spring', stiffness: 400 }}
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
                  <motion.div 
                    key="overflow-badge"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 rounded-full bg-gold flex items-center justify-center 
                                  border-2 border-background text-[10px] font-medium text-primary-foreground"
                  >
                    +{products.length - 3}
                  </motion.div>
                )}
              </div>

              {/* Text with count badge */}
              <div className="flex items-center gap-2">
                <motion.span
                  key={products.length}
                  initial={{ scale: 1.3, color: 'hsl(var(--gold))' }}
                  animate={{ scale: 1, color: 'inherit' }}
                  transition={{ duration: 0.3 }}
                  className="text-luxury-xs tracking-widest"
                >
                  {products.length} {products.length === 1 ? 'STYLE' : 'STYLES'} SELECTED
                </motion.span>
              </div>

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
