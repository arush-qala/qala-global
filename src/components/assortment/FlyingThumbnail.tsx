import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAssortment } from '@/contexts/AssortmentContext';

export const FlyingThumbnail = () => {
  const { flyingImage, clearFlyingImage } = useAssortment();

  useEffect(() => {
    if (flyingImage) {
      const timer = setTimeout(clearFlyingImage, 800);
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
        x: window.innerWidth / 2 - 24,
        y: window.innerHeight - 80,
        scale: 0.4,
        opacity: 0.9,
        rotate: [0, -5, 5, 0],
      }}
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1], // Custom easeOutExpo-like curve
        rotate: {
          duration: 0.4,
          ease: 'easeOut',
        },
      }}
      className="fixed z-[100] pointer-events-none"
    >
      {/* Main thumbnail */}
      <motion.div 
        className="w-16 h-16 rounded-xl overflow-hidden border-2 border-gold/50"
        style={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 10px 20px rgba(184,149,106,0.2)',
        }}
        animate={{
          boxShadow: [
            '0 20px 40px rgba(0,0,0,0.4), 0 10px 20px rgba(184,149,106,0.2)',
            '0 10px 20px rgba(0,0,0,0.3), 0 5px 10px rgba(184,149,106,0.3)',
          ],
        }}
        transition={{ duration: 0.7 }}
      >
        <img 
          src={flyingImage.src} 
          alt="" 
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Trailing particles */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0.6,
            scale: 0.3,
            x: 0,
            y: 0,
          }}
          animate={{
            opacity: 0,
            scale: 0,
            x: -20 * (i + 1),
            y: -10 * (i + 1),
          }}
          transition={{
            duration: 0.5,
            delay: 0.1 * i,
            ease: 'easeOut',
          }}
          className="absolute top-1/2 left-1/2 w-2 h-2 rounded-full bg-gold"
          style={{ transform: 'translate(-50%, -50%)' }}
        />
      ))}
    </motion.div>
  );
};
