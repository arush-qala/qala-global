import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAssortment } from '@/contexts/AssortmentContext';

export const FlyingThumbnail = () => {
  const { flyingImage, clearFlyingImage } = useAssortment();

  useEffect(() => {
    if (flyingImage) {
      const timer = setTimeout(clearFlyingImage, 600);
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
      }}
      animate={{
        x: window.innerWidth / 2 - 24,
        y: window.innerHeight - 60,
        scale: 0.3,
        opacity: 0.8,
      }}
      transition={{
        duration: 0.5,
        ease: [0.32, 0.72, 0, 1],
      }}
      className="fixed z-[100] w-16 h-16 rounded overflow-hidden shadow-lg pointer-events-none"
    >
      <img src={flyingImage.src} alt="" className="w-full h-full object-cover" />
    </motion.div>
  );
};
