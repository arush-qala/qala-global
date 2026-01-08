import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { heroSlides } from '@/data/brands';

interface BrandTimelineProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

const BrandTimeline = ({ currentIndex, onIndexChange }: BrandTimelineProps) => {
  const currentSlide = heroSlides[currentIndex];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 glass border-t border-border">
      {/* Progress Line */}
      <div className="relative h-px bg-border">
        <motion.div
          className="absolute h-full bg-accent"
          initial={{ width: '0%' }}
          animate={{ width: `${((currentIndex + 1) / heroSlides.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Timeline Navigation */}
      <div className="flex items-center justify-center gap-8 py-4 px-8">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.id}
            onClick={() => onIndexChange(index)}
            className={`relative w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-accent scale-125' 
                : 'bg-border hover:bg-muted-foreground'
            }`}
          >
            <span className="sr-only">Brand {index + 1}</span>
          </button>
        ))}
      </div>

      {/* Brand Info Bar */}
      <div className="flex items-center justify-between px-8 py-6 border-t border-border">
        <div className="flex items-center gap-8">
          <motion.h3 
            key={currentSlide.brandSlug}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-serif text-2xl font-light"
          >
            {currentSlide.brandName}
          </motion.h3>
          <motion.span 
            key={`season-${currentSlide.brandSlug}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-luxury-label"
          >
            {currentSlide.season}
          </motion.span>
        </div>

        <div className="flex items-center gap-6">
          <button 
            className="p-2 hover:text-accent transition-colors"
            aria-label="Like brand"
          >
            <Heart className="w-5 h-5" strokeWidth={1.5} />
          </button>
          
          <Link 
            to={`/brands/${currentSlide.brandSlug}`}
            className="btn-luxury-outline flex items-center gap-3"
          >
            Visit Brand Store
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrandTimeline;
