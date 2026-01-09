import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssortment } from '@/contexts/AssortmentContext';
import { AssortmentReview } from './AssortmentReview';

export const AssortmentTray = () => {
  const { products } = useAssortment();
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  if (products.length === 0) return null;

  return (
    <>
      {/* Collapsed Tray */}
      <AnimatePresence>
        {!isReviewOpen && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-deep-charcoal border-t border-gold/30"
          >
            <div 
              className="flex items-center justify-between px-8 py-4 cursor-pointer"
              onClick={() => setIsReviewOpen(true)}
            >
              <div className="flex items-center gap-4">
                <span className="text-primary-foreground text-luxury-sm tracking-widest">
                  {products.length} {products.length === 1 ? 'STYLE' : 'STYLES'} SELECTED
                </span>
                <div className="flex -space-x-3">
                  {products.slice(0, 5).map((product) => (
                    <motion.div 
                      key={product.id} 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-12 h-12 border-2 border-deep-charcoal overflow-hidden"
                    >
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </motion.div>
                  ))}
                  {products.length > 5 && (
                    <div className="w-12 h-12 border-2 border-deep-charcoal bg-gold/20 flex items-center justify-center">
                      <span className="text-primary-foreground text-sm">+{products.length - 5}</span>
                    </div>
                  )}
                </div>
              </div>
              <button className="btn-luxury-gold">
                Review Selection
              </button>
            </div>
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
