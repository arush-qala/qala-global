import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { heroSlides } from '@/data/brands';

interface StatementOverlayProps {
  currentSlideIndex: number;
}

const categoryOptions = ['Dresses', 'Co-ord sets', 'Evening wear', 'Tops', 'Shirts', 'Pants', 'Outerwear', 'Accessories'];
const seasonOptions = ['Summer/Spring', 'Fall/Winter', 'Resortwear', 'Pre-Fall'];

const StatementOverlay = ({ currentSlideIndex }: StatementOverlayProps) => {
  const navigate = useNavigate();
  const currentSlide = heroSlides[currentSlideIndex];
  
  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
  const [selectedSeason, setSelectedSeason] = useState(currentSlide.season);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSeasonDropdown, setShowSeasonDropdown] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const seasonRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (seasonRef.current && !seasonRef.current.contains(event.target as Node)) {
        setShowSeasonDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFind = () => {
    navigate(`/discover?category=${encodeURIComponent(selectedCategory)}&season=${encodeURIComponent(selectedSeason)}`);
  };

  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="flex items-center justify-center gap-4 pointer-events-auto bg-background/80 backdrop-blur-sm py-6 px-12 w-full max-w-6xl">
        <p className="font-serif text-xl md:text-2xl lg:text-3xl font-light text-foreground whitespace-nowrap flex items-center flex-wrap gap-x-2">
          My boutique is looking for{' '}
          
          {/* Category Dropdown */}
          <span ref={categoryRef} className="relative inline-block">
            <button
              onClick={() => {
                setShowCategoryDropdown(!showCategoryDropdown);
                setShowSeasonDropdown(false);
              }}
              className="inline-flex items-center gap-1 text-gold hover:text-gold/80 transition-colors underline underline-offset-4 decoration-1"
            >
              {selectedCategory}
              <ChevronDown className={`w-4 h-4 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showCategoryDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 bg-background border border-border shadow-lg z-50 min-w-[180px]"
                >
                  {categoryOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedCategory(option);
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-base hover:bg-muted transition-colors ${
                        selectedCategory === option ? 'text-gold bg-muted/50' : 'text-foreground'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </span>
          
          {' '}and I want to source for{' '}
          
          {/* Season Dropdown */}
          <span ref={seasonRef} className="relative inline-block">
            <button
              onClick={() => {
                setShowSeasonDropdown(!showSeasonDropdown);
                setShowCategoryDropdown(false);
              }}
              className="inline-flex items-center gap-1 text-gold hover:text-gold/80 transition-colors underline underline-offset-4 decoration-1"
            >
              {selectedSeason}
              <ChevronDown className={`w-4 h-4 transition-transform ${showSeasonDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showSeasonDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 mt-2 bg-background border border-border shadow-lg z-50 min-w-[160px]"
                >
                  {seasonOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setSelectedSeason(option);
                        setShowSeasonDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 text-base hover:bg-muted transition-colors ${
                        selectedSeason === option ? 'text-gold bg-muted/50' : 'text-foreground'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </span>
        </p>

        <motion.button
          onClick={handleFind}
          className="btn-luxury ml-6"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Find
        </motion.button>
      </div>
    </motion.div>
  );
};

export default StatementOverlay;
