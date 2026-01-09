import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import { heroSlides, seasonOptions, categoryOptions } from '@/data/brands';

interface StatementOverlayProps {
  currentSlideIndex: number;
}

const StatementOverlay = ({ currentSlideIndex }: StatementOverlayProps) => {
  const navigate = useNavigate();
  const currentSlide = heroSlides[currentSlideIndex];
  
  const [selectedSeason, setSelectedSeason] = useState(currentSlide.season);
  const [selectedCategory, setSelectedCategory] = useState(currentSlide.category);
  const [showSeasonModal, setShowSeasonModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const handleFind = () => {
    navigate(`/discover?category=${encodeURIComponent(selectedCategory)}&season=${encodeURIComponent(selectedSeason)}`);
  };

  return (
    <>
      <motion.div 
        className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="flex items-center justify-center gap-4 pointer-events-auto bg-background/80 backdrop-blur-sm py-6 px-12 w-full max-w-6xl">
          <p className="font-serif text-xl md:text-2xl lg:text-3xl font-light text-foreground whitespace-nowrap">
            My Boutique is{' '}
            <button
              onClick={() => setShowSeasonModal(true)}
              className="inline-flex items-center gap-1 text-gold hover:text-gold/80 transition-colors underline underline-offset-4 decoration-1"
            >
              {selectedSeason}
              <ChevronDown className="w-4 h-4" />
            </button>
            {' '}& I want to source for{' '}
            <button
              onClick={() => setShowCategoryModal(true)}
              className="inline-flex items-center gap-1 text-gold hover:text-gold/80 transition-colors underline underline-offset-4 decoration-1"
            >
              {selectedCategory}
              <ChevronDown className="w-4 h-4" />
            </button>
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

      {/* Season Modal */}
      <AnimatePresence>
        {showSeasonModal && (
          <SelectionModal
            title="Select Season"
            options={seasonOptions}
            selected={selectedSeason}
            onSelect={(option) => {
              setSelectedSeason(option);
              setShowSeasonModal(false);
            }}
            onClose={() => setShowSeasonModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <SelectionModal
            title="Select Category"
            options={categoryOptions}
            selected={selectedCategory}
            onSelect={(option) => {
              setSelectedCategory(option);
              setShowCategoryModal(false);
            }}
            onClose={() => setShowCategoryModal(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

interface SelectionModalProps {
  title: string;
  options: string[];
  selected: string;
  onSelect: (option: string) => void;
  onClose: () => void;
}

const SelectionModal = ({ title, options, selected, onSelect, onClose }: SelectionModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background flex items-center justify-center"
    >
      <button
        onClick={onClose}
        className="absolute top-8 right-8 p-2 hover:text-accent transition-colors"
      >
        <X className="w-6 h-6" strokeWidth={1} />
      </button>

      <div className="text-center">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-serif text-2xl mb-12 text-taupe"
        >
          {title}
        </motion.h2>
        
        <div className="flex flex-col gap-4">
          {options.map((option, index) => (
            <motion.button
              key={option}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelect(option)}
              className={`font-serif text-4xl md:text-6xl font-light transition-all duration-300 hover:text-accent ${
                selected === option ? 'text-accent' : 'text-foreground'
              }`}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default StatementOverlay;
