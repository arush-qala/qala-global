import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CTAGuidanceProps {
  message: string;
  className?: string;
  autoHideDelay?: number; // milliseconds, default 10000
}

const CTAGuidance = ({ message, className = '', autoHideDelay = 10000 }: CTAGuidanceProps) => {
  const [isVisible, setIsVisible] = useState(true);

  // Auto-hide after delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, autoHideDelay);

    return () => clearTimeout(timer);
  }, [autoHideDelay]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className={`fixed top-20 right-8 z-40 max-w-xs ${className}`}
        >
          <div className="px-4 py-3 bg-charcoal/95 backdrop-blur-md border border-foreground/10 shadow-lg">
            <p className="text-sm font-light text-primary-foreground/90 leading-relaxed tracking-wide drop-shadow-sm">
              {message}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CTAGuidance;
