import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAssortment } from '@/contexts/AssortmentContext';
import { Check } from 'lucide-react';

export const FlyingThumbnail = () => {
  const { flyingImage, clearFlyingImage } = useAssortment();

  useEffect(() => {
    if (flyingImage) {
      const timer = setTimeout(clearFlyingImage, 700);
      return () => clearTimeout(timer);
    }
  }, [flyingImage, clearFlyingImage]);

  if (!flyingImage) return null;

  return (
    <motion.div
      initial={{
        x: flyingImage.x,
        y: flyingImage.y,
        scale: 1,
        opacity: 1,
        rotate: 0,
      }}
      animate={{
        x: window.innerWidth / 2 - 32,
        y: window.innerHeight - 60,
        scale: 0.5,
        opacity: 0,
        rotate: [0, -3, 3, 0],
      }}
      transition={{
        duration: 0.6,
        ease: [0.32, 0.72, 0, 1], // Custom easeOut curve for natural arc feel
        rotate: {
          duration: 0.35,
          ease: 'easeOut',
        },
        opacity: {
          delay: 0.4,
          duration: 0.2,
        }
      }}
      className="fixed z-[100] pointer-events-none"
    >
      {/* Main thumbnail with checkmark overlay */}
      <motion.div 
        className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-gold"
        style={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 10px 20px rgba(184,149,106,0.3)',
        }}
        animate={{
          boxShadow: [
            '0 20px 40px rgba(0,0,0,0.4), 0 10px 20px rgba(184,149,106,0.3)',
            '0 5px 15px rgba(0,0,0,0.2), 0 3px 8px rgba(184,149,106,0.2)',
          ],
        }}
        transition={{ duration: 0.6 }}
      >
        <img 
          src={flyingImage.src} 
          alt="" 
          className="w-full h-full object-cover"
        />
        
        {/* Success checkmark overlay */}
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.15, duration: 0.25, ease: 'backOut' }}
          className="absolute inset-0 bg-gold/80 flex items-center justify-center"
        >
          <Check className="w-6 h-6 text-primary-foreground" strokeWidth={3} />
        </motion.div>
      </motion.div>

      {/* Trailing particle trail */}
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0.7,
            scale: 0.4,
            x: 8,
            y: 8,
          }}
          animate={{
            opacity: 0,
            scale: 0,
            x: -15 * (i + 1),
            y: -8 * (i + 1),
          }}
          transition={{
            duration: 0.45,
            delay: 0.08 * i,
            ease: 'easeOut',
          }}
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gold"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      ))}
    </motion.div>
  );
};
