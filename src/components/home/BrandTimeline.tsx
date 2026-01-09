import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ArrowRight } from 'lucide-react';
import { heroSlides } from '@/data/brands';
interface BrandTimelineProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
}
const BrandTimeline = ({
  currentIndex,
  onIndexChange
}: BrandTimelineProps) => {
  const currentSlide = heroSlides[currentIndex];
  return <div className="fixed bottom-0 left-0 right-0 z-20 glass border-t border-border">
      {/* Progress Line */}
      <div className="relative h-px bg-border">
        <motion.div className="absolute h-full bg-accent" initial={{
        width: '0%'
      }} animate={{
        width: `${(currentIndex + 1) / heroSlides.length * 100}%`
      }} transition={{
        duration: 0.3
      }} />
      </div>

      {/* Timeline Navigation */}
      

      {/* Brand Info Bar */}
      
    </div>;
};
export default BrandTimeline;