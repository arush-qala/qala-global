import { motion } from 'framer-motion';

interface CTAGuidanceProps {
  message: string;
  className?: string;
}

const CTAGuidance = ({ message, className = '' }: CTAGuidanceProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-20 right-8 z-40 max-w-xs ${className}`}
    >
      <div className="px-4 py-3 bg-charcoal/95 backdrop-blur-md border border-foreground/10 shadow-lg">
        <p className="text-sm font-light text-primary-foreground/90 leading-relaxed tracking-wide drop-shadow-sm">
          {message}
        </p>
      </div>
    </motion.div>
  );
};

export default CTAGuidance;
