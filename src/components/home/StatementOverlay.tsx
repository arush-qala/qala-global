import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, X } from "lucide-react";
import { heroSlides } from "@/data/brands";

interface StatementOverlayProps {
  currentSlideIndex: number;
}

const categoryOptions = ["Dresses", "Tops", "Shirts", "Pants", "Jackets"];

const styleOptions = [
  "Spring/Summer",
  "Fall/Winter",
  "Occasion wear",
  "Casual wear",
  "Activewear",
  "Boho",
  "Minimalism",
  "Streetwear",
];

// Full-screen overlay selector component
const FullScreenSelector = ({
  isOpen,
  onClose,
  title,
  options,
  selectedValue,
  onSelect,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  options: string[];
  selectedValue: string;
  onSelect: (value: string) => void;
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-charcoal/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-background border border-border shadow-2xl max-w-md w-full mx-6 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:text-gold transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" strokeWidth={1} />
            </button>

            {/* Title */}
            <h3 className="font-serif text-2xl font-light text-center mb-8">{title}</h3>

            {/* Options grid */}
            <div className="grid grid-cols-2 gap-3">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    onSelect(option);
                    onClose();
                  }}
                  className={`px-4 py-4 text-base text-left border transition-all duration-200 ${
                    selectedValue === option
                      ? "border-gold bg-gold/10 text-gold"
                      : "border-border hover:border-gold/50 hover:bg-muted/50 text-foreground"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const StatementOverlay = ({ currentSlideIndex }: StatementOverlayProps) => {
  const navigate = useNavigate();
  const currentSlide = heroSlides[currentSlideIndex];

  const [selectedCategory, setSelectedCategory] = useState(categoryOptions[0]);
  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0]);
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [showStyleSelector, setShowStyleSelector] = useState(false);

  const handleFind = () => {
    navigate(`/discover?category=${encodeURIComponent(selectedCategory)}&style=${encodeURIComponent(selectedStyle)}`);
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
          <p className="font-serif text-xl md:text-2xl lg:text-3xl font-light text-foreground whitespace-nowrap flex items-center flex-wrap gap-x-2">
            I am looking for {/* Category Selector Trigger */}
            <button
              onClick={() => setShowCategorySelector(true)}
              className="inline-flex items-center gap-1 text-gold hover:text-gold/80 transition-colors underline underline-offset-4 decoration-1"
            >
              {selectedCategory}
              <ChevronDown className="w-4 h-4" />
            </button>{" "}
            in {/* Style Selector Trigger */}
            <button
              onClick={() => setShowStyleSelector(true)}
              className="inline-flex items-center gap-1 text-gold hover:text-gold/80 transition-colors underline underline-offset-4 decoration-1"
            >
              {selectedStyle}
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

      {/* Full-screen Category Selector */}
      <FullScreenSelector
        isOpen={showCategorySelector}
        onClose={() => setShowCategorySelector(false)}
        title="Select a Category"
        options={categoryOptions}
        selectedValue={selectedCategory}
        onSelect={setSelectedCategory}
      />

      {/* Full-screen Style Selector */}
      <FullScreenSelector
        isOpen={showStyleSelector}
        onClose={() => setShowStyleSelector(false)}
        title="Select a Style"
        options={styleOptions}
        selectedValue={selectedStyle}
        onSelect={setSelectedStyle}
      />
    </>
  );
};

export default StatementOverlay;
