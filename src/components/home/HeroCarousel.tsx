import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { heroSlides } from '@/data/brands';

import heroDoodlage from '@/assets/images/home/hero-doodlage.jpg';
import heroItuvana from '@/assets/images/home/hero-ituvana.jpg';
import heroKharaKapas from '@/assets/images/home/hero-khara-kapas.jpg';
import heroNaushadAli from '@/assets/images/home/hero-naushad-ali.jpg';
import heroCapisvirleo from '@/assets/images/home/hero-capisvirleo.jpg';

const heroImages: Record<string, string> = {
  'doodlage': heroDoodlage,
  'ituvana': heroItuvana,
  'khara-kapas': heroKharaKapas,
  'naushad-ali': heroNaushadAli,
  'capisvirleo': heroCapisvirleo,
};

interface HeroCarouselProps {
  onSlideChange: (index: number) => void;
  currentIndex: number;
}

const HeroCarousel = ({ onSlideChange, currentIndex }: HeroCarouselProps) => {
  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % heroSlides.length;
      onSlideChange(nextIndex);
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex, onSlideChange]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence mode="sync">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img
            src={heroImages[heroSlides[currentIndex].brandSlug]}
            alt={heroSlides[currentIndex].brandName}
            className="w-full h-full object-cover"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-background/20" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroCarousel;
