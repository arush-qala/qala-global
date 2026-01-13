import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { ArrowLeft, Plus, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { brands } from "@/data/brands";
import { useAssortment } from "@/contexts/AssortmentContext";
import CTAGuidance from "@/components/layout/CTAGuidance";

// Lookbook images for each brand (same as BrandStorefront)
const brandLookbookImages: Record<string, string[]> = {
  asaii: [
    "/images/discover/asaii/1.webp",
    "/images/discover/asaii/2.webp",
    "/images/discover/asaii/3.webp",
    "/images/discover/asaii/4.webp",
    "/images/discover/asaii/5.webp",
    "/images/discover/asaii/6.webp",
  ],
  doodlage: [
    "/images/discover/doodlage/1.jpg",
    "/images/discover/doodlage/2.webp",
    "/images/discover/doodlage/3.webp",
    "/images/discover/doodlage/4.webp",
    "/images/discover/doodlage/5.webp",
    "/images/discover/doodlage/6.webp",
  ],
  margn: [
    "/images/discover/margn/1.webp",
    "/images/discover/margn/2.webp",
    "/images/discover/margn/3.webp",
    "/images/discover/margn/4.webp",
    "/images/discover/margn/5.webp",
    "/images/discover/margn/6.webp",
  ],
  "akhl-studio": [
    "/images/discover/akhl-studio/1.webp",
    "/images/discover/akhl-studio/2.webp",
    "/images/discover/akhl-studio/3.webp",
    "/images/discover/akhl-studio/4.webp",
    "/images/discover/akhl-studio/5.webp",
    "/images/discover/akhl-studio/6.webp",
  ],
  ituvana: [
    "/images/discover/ituvana/1.webp",
    "/images/discover/ituvana/2.webp",
    "/images/discover/ituvana/3.webp",
    "/images/discover/ituvana/4.webp",
    "/images/discover/ituvana/5.webp",
    "/images/discover/ituvana/6.webp",
  ],
};

// Mock collection data per brand
const brandCollections: Record<string, { name: string; season: string; description: string }[]> = {
  asaii: [
    {
      name: "Human Rituals",
      season: "Spring Summer, Trans Seasonal",
      description: "A celebration of the everyday rituals that define our humanity.",
    },
    { name: "Autumn Whispers", season: "Fall Winter", description: "Quiet elegance for the cooler months." },
    { name: "Urban Nomad", season: "Spring Summer", description: "Contemporary pieces for the modern wanderer." },
  ],
  doodlage: [
    {
      name: "Human Rituals",
      season: "Spring Summer, Trans Seasonal",
      description: "Upcycled fashion that tells a story of renewal.",
    },
    {
      name: "Zero Waste",
      season: "Trans Seasonal",
      description: "Every scrap has a purpose, every piece has a story.",
    },
    { name: "Patchwork Dreams", season: "Fall Winter", description: "Handcrafted patchwork celebrating imperfection." },
  ],
  margn: [
    {
      name: "Human Rituals",
      season: "Spring Summer, Trans Seasonal",
      description: "Minimalist designs rooted in tradition.",
    },
    { name: "Silent Lines", season: "Fall Winter", description: "Structured silhouettes with a whisper of drama." },
    { name: "Canvas Stories", season: "Spring Summer", description: "Where art meets wearable expression." },
  ],
  "akhl-studio": [
    {
      name: "Human Rituals",
      season: "Spring Summer, Trans Seasonal",
      description: "Bold expressions of contemporary craft.",
    },
    { name: "Rebel Heritage", season: "Trans Seasonal", description: "Traditional techniques with a modern edge." },
    { name: "Night Bloom", season: "Fall Winter", description: "Dark florals and midnight textures." },
  ],
  ituvana: [
    {
      name: "Human Rituals",
      season: "Spring Summer, Trans Seasonal",
      description: "Natural fibres celebrating slow fashion.",
    },
    { name: "Earth Tones", season: "Trans Seasonal", description: "Colors borrowed from the earth itself." },
    { name: "Coastal Calm", season: "Spring Summer", description: "Breezy silhouettes inspired by the sea." },
  ],
};

// Mock products (using lookbook images as product images)
const getProducts = (brandSlug: string) => {
  const images = brandLookbookImages[brandSlug] || brandLookbookImages["asaii"];
  return images.map((image, index) => {
    // Generate multiple images for the product (using all available images rotated)
    const productImages = [image, images[(index + 1) % images.length], images[(index + 2) % images.length]];

    return {
      id: `${brandSlug}-${index + 1}`,
      name:
        [
          "Epidermis Crochet Applique Vest- Off White",
          "Handwoven Wrap Blouse",
          "Pleated Midi Skirt",
          "Embroidered Jacket",
          "Evening Gown",
          "Tailored Suit Set",
        ][index] || `Style ${index + 1}`,
      price: [485, 295, 320, 650, 890, 720][index] || 399,
      image,
      images: productImages,
      fabricDetails: "Woven",
      feelsLike: "Hand-crocheted applique, Patch pockets i...",
      sizes: ["XS", "S", "M", "L"],
      description:
        "Meticulously crafted with attention to architectural lines. This piece embodies the collection's ethos of structured fluidity. Designed for the modern wardrobe, offering versatility and timeless elegance.",
    };
  });
};

// Inline Assortment Bar Component - Shown inside product overlay
const InlineAssortmentBar = () => {
  const { products, setTrayOpen } = useAssortment();
  const [shouldPulse, setShouldPulse] = useState(false);
  const prevCountRef = useRef(products.length);
  
  // Detect when a new item is added and trigger pulse
  useEffect(() => {
    if (products.length > prevCountRef.current) {
      setShouldPulse(true);
      const timer = setTimeout(() => setShouldPulse(false), 600);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = products.length;
  }, [products.length]);
  
  if (products.length === 0) return null;
  
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[55]"
    >
      <motion.button
        onClick={() => setTrayOpen(true)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        animate={shouldPulse ? { 
          scale: [1, 1.08, 1],
          boxShadow: [
            '0 10px 40px rgba(184, 149, 106, 0.2)',
            '0 10px 50px rgba(184, 149, 106, 0.5)',
            '0 10px 40px rgba(184, 149, 106, 0.2)'
          ]
        } : {}}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex items-center gap-4 px-6 py-3 bg-foreground text-background 
                   border border-border/20 shadow-lg hover:bg-foreground/90 transition-colors"
      >
        {/* Thumbnail Stack */}
        <div className="flex -space-x-2">
          {products.slice(0, 3).map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.05, type: 'spring', stiffness: 400 }}
              className="w-8 h-8 rounded-full overflow-hidden border-2 border-background"
              style={{ zIndex: 3 - index }}
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>
          ))}
          {products.length > 3 && (
            <motion.div 
              key="overflow-badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-8 h-8 rounded-full bg-gold flex items-center justify-center 
                            border-2 border-background text-[10px] font-medium text-primary-foreground"
            >
              +{products.length - 3}
            </motion.div>
          )}
        </div>

        {/* Text with count badge */}
        <div className="flex items-center gap-2">
          <motion.span
            key={products.length}
            initial={{ scale: 1.3, color: 'hsl(var(--gold))' }}
            animate={{ scale: 1, color: 'inherit' }}
            transition={{ duration: 0.3 }}
            className="text-luxury-xs tracking-widest"
          >
            {products.length} {products.length === 1 ? 'STYLE' : 'STYLES'} SELECTED
          </motion.span>
        </div>

        {/* Arrow */}
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
        </svg>
      </motion.button>
    </motion.div>
  );
};

// Product Detail Overlay Component
const ProductDetailOverlay = ({
  product,
  products,
  productIndex,
  brandSlug,
  brandName,
  onClose,
  onNavigate,
  onSelectStyle,
  isInAssortment,
}: {
  product: ReturnType<typeof getProducts>[0];
  products: ReturnType<typeof getProducts>;
  productIndex: number;
  brandSlug: string;
  brandName: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onSelectStyle: (id: string, event: React.MouseEvent) => void;
  isInAssortment: boolean;
}) => {
  const [activeTab, setActiveTab] = useState("DETAILS");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const overlayRef = useRef<HTMLDivElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  
  // State-based panel visibility - triggered on first scroll
  const [rightPanelVisible, setRightPanelVisible] = useState(false);
  const hasScrolledRef = useRef(false);
  
  // Button animation state for selection feedback
  const [justSelected, setJustSelected] = useState(false);

  // Reset state when product changes
  useEffect(() => {
    overlayRef.current?.scrollTo({ top: 0 });
    imageContainerRef.current?.scrollTo({ top: 0 });
    setCurrentImageIndex(0);
    setRightPanelVisible(false);
    hasScrolledRef.current = false;
    setJustSelected(false);
  }, [product.id]);

  // Listen for ANY scroll on image container to reveal right panel
  useEffect(() => {
    const imageContainer = imageContainerRef.current;
    if (!imageContainer) return;

    const handleScroll = () => {
      if (!hasScrolledRef.current && imageContainer.scrollTop > 0) {
        hasScrolledRef.current = true;
        setRightPanelVisible(true);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // Trigger on any vertical wheel movement
      if (!hasScrolledRef.current && Math.abs(e.deltaY) > 0) {
        hasScrolledRef.current = true;
        setRightPanelVisible(true);
      }
    };
    
    // Touch support for mobile
    const handleTouchMove = () => {
      if (!hasScrolledRef.current && imageContainer.scrollTop > 0) {
        hasScrolledRef.current = true;
        setRightPanelVisible(true);
      }
    };

    imageContainer.addEventListener('scroll', handleScroll, { passive: true });
    imageContainer.addEventListener('wheel', handleWheel, { passive: true });
    imageContainer.addEventListener('touchmove', handleTouchMove, { passive: true });
    
    return () => {
      imageContainer.removeEventListener('scroll', handleScroll);
      imageContainer.removeEventListener('wheel', handleWheel);
      imageContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, [product.id]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && productIndex > 0) {
        onNavigate(productIndex - 1);
      } else if (e.key === "ArrowRight" && productIndex < products.length - 1) {
        onNavigate(productIndex + 1);
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [productIndex, products.length, onNavigate, onClose]);

  const prevProduct = productIndex > 0 ? products[productIndex - 1] : null;
  const nextProduct = productIndex < products.length - 1 ? products[productIndex + 1] : null;

  const tabs = ["DETAILS", "WASH & CARE", "BULK PRICE", "SHIPPING"];

  const tabContent: Record<string, string> = {
    DETAILS: product.description,
    "WASH & CARE":
      "Dry clean recommended. If washing at home, use cold water and a gentle cycle. Avoid tumble drying to preserve structure and surface texture.",
    "BULK PRICE":
      "Bulk pricing available on request. Share your required quantities and delivery timeline to receive tiered pricing and production lead times.",
    SHIPPING:
      "Ships worldwide. Standard dispatch within 7–10 business days (made-to-order timelines may vary). Duties and taxes may apply based on destination.",
  };

  const [showSizeChart, setShowSizeChart] = useState(false);
  
  const handleSelectWithFeedback = (e: React.MouseEvent) => {
    if (!isInAssortment) {
      setJustSelected(true);
      setTimeout(() => setJustSelected(false), 1000);
    }
    onSelectStyle(product.id, e);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 z-50 p-2 hover:text-gold transition-colors"
        aria-label="Close"
      >
        <X className="w-6 h-6" strokeWidth={1} />
      </button>

      {/* Navigation Arrows - Visible when prev/next exist */}
      {prevProduct && (
        <button
          onClick={() => onNavigate(productIndex - 1)}
          className="absolute left-[7vw] top-1/2 -translate-y-1/2 z-50 p-3 bg-background/80 backdrop-blur-sm border border-border/30 hover:bg-background hover:border-gold transition-all group"
          aria-label="Previous product"
        >
          <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors" strokeWidth={1.5} />
        </button>
      )}
      {nextProduct && (
        <button
          onClick={() => onNavigate(productIndex + 1)}
          className="absolute right-[7vw] top-1/2 -translate-y-1/2 z-50 p-3 bg-background/80 backdrop-blur-sm border border-border/30 hover:bg-background hover:border-gold transition-all group"
          aria-label="Next product"
        >
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-gold transition-colors" strokeWidth={1.5} />
        </button>
      )}

      {/* Size Chart Overlay */}
      <AnimatePresence>
        {showSizeChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-background/90 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setShowSizeChart(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-background border border-border p-8 max-w-2xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-serif text-xl">Size Guide</h3>
                <button onClick={() => setShowSizeChart(false)} className="p-1 hover:text-gold">
                  <X className="w-5 h-5" strokeWidth={1} />
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-2 text-muted-foreground font-normal">SIZE</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-normal">CHEST (in)</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-normal">WAIST (in)</th>
                      <th className="text-left py-3 px-2 text-muted-foreground font-normal">LENGTH (in)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["XS", "S", "M", "L", "XL"].map((size, i) => (
                      <tr key={size} className="border-b border-border/50">
                        <td className="py-3 px-2">{size}</td>
                        <td className="py-3 px-2">{36 + i * 2}</td>
                        <td className="py-3 px-2">{30 + i * 2}</td>
                        <td className="py-3 px-2">{27 + i}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Single scroll container */}
      <div ref={overlayRef} className="h-full overflow-y-auto overscroll-contain">
        <div className="min-h-[200vh]">
          <div className="flex min-h-[200vh]">
            {/* Left Edge - Previous Product Peek (larger 12vw for better clickability) */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-[12vw] sticky top-0 h-screen flex-shrink-0 cursor-pointer relative overflow-hidden"
              onClick={() => prevProduct && onNavigate(productIndex - 1)}
            >
              {prevProduct ? (
                <div className="absolute inset-0 grayscale opacity-50 hover:opacity-70 hover:grayscale-0 transition-all duration-300">
                  <img
                    src={prevProduct.image}
                    alt={prevProduct.name}
                    className="w-full h-full object-cover object-right"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-background/20" />
                </div>
              ) : (
                <div className="h-full bg-muted/20" />
              )}
            </motion.div>

            {/* Middle Section - Fixed 76vw containing images + details panel */}
            <div className="w-[76vw] flex-shrink-0 sticky top-0 h-screen overflow-hidden">
              {/* Image Column - shifts left when panel reveals */}
              <motion.div 
                ref={imageContainerRef}
                animate={{ x: rightPanelVisible ? "-18vw" : "0vw" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 flex justify-center pt-16 overflow-y-auto hide-scrollbar"
              >
                <div className="max-w-[520px] w-full flex flex-col pb-16">
                  {/* Multi-Image Vertical Stack */}
                  {(() => {
                    // Fallback: if only 1 image, duplicate to show 3 images
                    const displayImages = product.images.length === 1 
                      ? [product.images[0], product.images[0], product.images[0]]
                      : product.images;
                    
                    return displayImages.map((img, idx) => (
                      <div key={idx} className={idx > 0 ? "mt-6" : ""}>
                        <img
                          src={img}
                          alt={`${product.name} - View ${idx + 1}`}
                          className="w-full aspect-[3/4] object-cover"
                        />
                      </div>
                    ));
                  })()}
                </div>
              </motion.div>

              {/* Right Panel - Reveals on first scroll */}
              <motion.aside
                initial={{ opacity: 0, x: "100%" }}
                animate={{ 
                  opacity: rightPanelVisible ? 1 : 0, 
                  x: rightPanelVisible ? "0%" : "100%" 
                }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="w-[432px] absolute right-0 top-0 h-screen border-l border-border bg-background overflow-y-auto"
              >
                <div className="h-full flex flex-col px-10 py-12">
                  {/* Product Header */}
                  <div>
                    <span className="text-gold text-sm tracking-widest block mb-4">
                      {String(productIndex + 1).padStart(2, "0")} / {products.length}
                    </span>

                    <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-6">{product.name}</h2>

                    {/* Specs - Tighter spacing */}
                    <div className="space-y-2 mb-6">
                      <div className="flex">
                        <span className="text-muted-foreground text-sm w-24">FABRIC:</span>
                        <span className="text-base">{product.fabricDetails}</span>
                      </div>
                      <div className="flex">
                        <span className="text-muted-foreground text-sm w-24">FEELS LIKE:</span>
                        <span className="text-base">{product.feelsLike}</span>
                      </div>
                      <div className="flex">
                        <span className="text-muted-foreground text-sm w-24">SIZE GUIDE:</span>
                        <button
                          onClick={() => setShowSizeChart(true)}
                          className="text-base underline hover:text-gold transition-colors"
                        >
                          View Chart
                        </button>
                      </div>
                    </div>

                    {/* CTA with feedback animation */}
                    <motion.button
                      onClick={handleSelectWithFeedback}
                      animate={justSelected ? { scale: [1, 1.05, 1] } : {}}
                      transition={{ duration: 0.3 }}
                      className={`w-full py-5 flex items-center justify-center gap-2 transition-all mb-8 ${
                        isInAssortment
                          ? "bg-gold text-primary-foreground"
                          : "bg-gold/80 hover:bg-gold text-primary-foreground"
                      }`}
                    >
                      {isInAssortment ? (
                        <>
                          <Check className="w-5 h-5" />
                          <span className="text-sm tracking-widest">SELECTED</span>
                        </>
                      ) : (
                        <span className="text-sm tracking-widest">SELECT THIS STYLE</span>
                      )}
                    </motion.button>
                  </div>

                  {/* Virtual Trial Video - Default placeholder */}
                  <section className="mb-8">
                    <div className="aspect-video w-full bg-muted border border-border relative overflow-hidden">
                      <video 
                        className="w-full h-full object-cover"
                        autoPlay 
                        muted 
                        loop 
                        playsInline
                        poster="/images/discover/asaii/1.webp"
                      >
                        <source src="/videos/default.mp4" type="video/mp4" />
                        {/* Fallback if video not available */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-muted-foreground text-base">You imagine it.</span>
                        </div>
                      </video>
                      <span className="absolute bottom-3 left-3 text-sm tracking-widest text-primary-foreground bg-deep-charcoal/80 px-2 py-1">
                        VIRTUAL TRIAL
                      </span>
                    </div>
                  </section>

                  {/* Tabbed info */}
                  <section className="mt-auto">
                    <div className="flex gap-4 mb-4 border-b border-border pb-3">
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`text-sm tracking-widest transition-colors ${
                            activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <p className="text-base text-muted-foreground leading-relaxed">{tabContent[activeTab]}</p>
                  </section>
                </div>
              </motion.aside>
            </div>

            {/* Right Edge - Next Product Peek (larger 12vw for better clickability) */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="w-[12vw] sticky top-0 h-screen flex-shrink-0 cursor-pointer relative overflow-hidden"
              onClick={() => nextProduct && onNavigate(productIndex + 1)}
            >
              {nextProduct ? (
                <div className="absolute inset-0 grayscale opacity-50 hover:opacity-70 hover:grayscale-0 transition-all duration-300">
                  <img
                    src={nextProduct.image}
                    alt={nextProduct.name}
                    className="w-full h-full object-cover object-left"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-background/20" />
                </div>
              ) : (
                <div className="h-full bg-muted/20" />
              )}
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Inline Assortment Bar - Visible in product overlay */}
      <InlineAssortmentBar />
    </motion.div>
  );
};

// Flying Image Animation Component
const FlyingImage = ({
  imageSrc,
  startPosition,
  onComplete,
}: {
  imageSrc: string;
  startPosition: { x: number; y: number };
  onComplete: () => void;
}) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{
        x: startPosition.x,
        y: startPosition.y,
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
      <img src={imageSrc} alt="" className="w-full h-full object-cover" />
    </motion.div>
  );
};

const CollectionDetail = () => {
  const { slug, collectionSlug } = useParams<{ slug: string; collectionSlug: string }>();
  const [selectedProductIndex, setSelectedProductIndex] = useState<number | null>(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [showCTAGuidance, setShowCTAGuidance] = useState(false);
  const hasShownGuidanceRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);

  const { addProduct, removeProduct, isInAssortment, setLastCollectionUrl } = useAssortment();

  // Scroll to top on page load and store collection URL for back navigation
  useEffect(() => {
    window.scrollTo(0, 0);
    setLastCollectionUrl(window.location.pathname);
  }, [slug, collectionSlug, setLastCollectionUrl]);

  // Prevent horizontal scroll from triggering browser back
  useEffect(() => {
    const stickyElement = stickyRef.current;
    if (!stickyElement) return;

    const handleWheel = (e: WheelEvent) => {
      // If horizontal scroll detected, prevent default to avoid browser back
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
      }
      
      // Show CTA guidance on first horizontal movement (scroll started)
      if (!hasShownGuidanceRef.current && Math.abs(e.deltaX) > 0) {
        hasShownGuidanceRef.current = true;
        setShowCTAGuidance(true);
      }
    };

    stickyElement.addEventListener("wheel", handleWheel, { passive: false });
    return () => stickyElement.removeEventListener("wheel", handleWheel);
  }, []);

  const brand = brands.find((b) => b.slug === slug);
  const products = getProducts(slug || "asaii");
  const selectedProduct = selectedProductIndex !== null ? products[selectedProductIndex] : null;

  // Get collection info based on slug or default to first
  const collections = brandCollections[slug || "asaii"] || brandCollections["asaii"];
  const collection =
    collections.find((c) => c.name.toLowerCase().replace(/\s+/g, "-") === collectionSlug) || collections[0];

  // Hero image is the first lookbook image
  const heroImage = (brandLookbookImages[slug || ""] || brandLookbookImages["asaii"])[0];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Track scroll progress to update product counter and show CTA guidance
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const productIdx = Math.min(Math.floor(latest * products.length), products.length - 1);
    setCurrentProductIndex(productIdx);
    
    // Show CTA guidance when user starts scrolling (any non-zero progress)
    if (!hasShownGuidanceRef.current && latest > 0) {
      hasShownGuidanceRef.current = true;
      setShowCTAGuidance(true);
    }
  });

  // Calculate scroll bounds:
  // Hero takes 100vw, each product takes 33.333vw
  // Total content width = 100vw (hero) + products.length * 33.333vw
  // We need to scroll until the last product's right edge aligns with viewport right edge
  const productWidthVW = 33.333;
  const heroWidthVW = 100;
  const totalContentWidthVW = heroWidthVW + products.length * productWidthVW;

  // Max scroll distance = total content width - viewport width (100vw)
  // This gives us how much we need to translate left in vw units
  const maxScrollVW = totalContentWidthVW - 100;

  // Use vw units directly for the transform
  const x = useTransform(scrollYProgress, [0, 1], ["0vw", `-${maxScrollVW}vw`]);

  const handleSelectStyle = (productId: string, event: React.MouseEvent) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    if (isInAssortment(productId)) {
      removeProduct(productId);
    } else {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      addProduct(
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          brandSlug: slug || "asaii",
          brandName: brand?.name || "Brand",
          category: "Apparel",
        },
        rect,
      );
    }
  };

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Brand not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* CTA Guidance - Only show after horizontal exploration begins */}
      {showCTAGuidance && (
        <CTAGuidance message="Click to view product and add to your assortment" />
      )}

      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-8 py-6">
          <Link to={`/brands/${slug}`} className="flex items-center gap-2 hover:text-gold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-widest uppercase">Back to Brand</span>
          </Link>

          {/* Scroll Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="w-32 h-px bg-border relative overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gold"
                style={{ width: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
              />
            </div>
            <span className="text-luxury-xs text-muted-foreground min-w-[40px]">
              {currentProductIndex + 1} / {products.length}
            </span>
          </div>
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div ref={containerRef} style={{ height: `${(products.length + 2) * 100}vh` }}>
        <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
          <motion.div style={{ x }} className="flex h-full pt-20">
            {/* Hero Slide - Collection Thumbnail + Info */}
            <div className="flex-shrink-0 w-screen h-full flex">
              {/* Left: Collection Thumbnail */}
              <div className="w-1/2 h-full p-8 flex items-center justify-center">
                <div className="w-full max-w-[500px] h-[85%]">
                  <img src={heroImage} alt={collection.name} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Right: Collection Info */}
              <div className="w-1/2 h-full flex flex-col justify-center pr-16">
                <span className="text-gold text-luxury-xs tracking-widest mb-6">{collection.season.toUpperCase()}</span>
                <h1 className="font-serif text-5xl lg:text-7xl font-light leading-tight mb-8">{collection.name}</h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-8">{collection.description}</p>
                <div className="flex items-center gap-3">
                  <span className="text-luxury-sm tracking-widest uppercase">Scroll to Explore</span>
                  <div className="w-12 h-px bg-foreground" />
                </div>
                <p className="text-muted-foreground text-sm mt-4">
                  Click on any style to view details and add to your assortment
                </p>
              </div>
            </div>

            {/* Product Rail - No price, just number + name */}
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 h-full cursor-pointer group relative"
                style={{ width: "33.333vw" }}
                onClick={() => setSelectedProductIndex(index)}
              >
                <div className="relative h-full">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />

                  {/* Always visible overlay hint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/60 via-transparent to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300" />

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Product Info - number + name only (no price) */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-primary-foreground/60 text-luxury-xs block mb-2">
                      {String(index + 1).padStart(2, "0")} / {products.length}
                    </span>
                    <h3 className="font-serif text-xl text-primary-foreground">{product.name}</h3>
                    <span className="text-primary-foreground/50 text-xs mt-2 block group-hover:text-primary-foreground transition-colors">
                      Click to view details
                    </span>
                  </div>

                  {/* In Assortment Badge */}
                  {isInAssortment(product.id) && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gold flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Product Detail Overlay */}
      <AnimatePresence>
        {selectedProduct && selectedProductIndex !== null && (
          <ProductDetailOverlay
            product={selectedProduct}
            products={products}
            productIndex={selectedProductIndex}
            brandSlug={slug || "asaii"}
            brandName={brand?.name || "Brand"}
            onClose={() => setSelectedProductIndex(null)}
            onNavigate={(index) => setSelectedProductIndex(index)}
            onSelectStyle={handleSelectStyle}
            isInAssortment={isInAssortment(selectedProduct.id)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionDetail;
