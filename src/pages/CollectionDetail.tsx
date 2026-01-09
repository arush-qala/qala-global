import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { ArrowLeft, Plus, Check, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { brands } from '@/data/brands';

// Lookbook images for each brand (same as BrandStorefront)
const brandLookbookImages: Record<string, string[]> = {
  'asaii': [
    '/images/discover/asaii/1.webp',
    '/images/discover/asaii/2.webp',
    '/images/discover/asaii/3.webp',
    '/images/discover/asaii/4.webp',
    '/images/discover/asaii/5.webp',
    '/images/discover/asaii/6.webp',
  ],
  'doodlage': [
    '/images/discover/doodlage/1.jpg',
    '/images/discover/doodlage/2.webp',
    '/images/discover/doodlage/3.webp',
    '/images/discover/doodlage/4.webp',
    '/images/discover/doodlage/5.webp',
    '/images/discover/doodlage/6.webp',
  ],
  'margn': [
    '/images/discover/margn/1.webp',
    '/images/discover/margn/2.webp',
    '/images/discover/margn/3.webp',
    '/images/discover/margn/4.webp',
    '/images/discover/margn/5.webp',
    '/images/discover/margn/6.webp',
  ],
  'akhl-studio': [
    '/images/discover/akhl-studio/1.webp',
    '/images/discover/akhl-studio/2.webp',
    '/images/discover/akhl-studio/3.webp',
    '/images/discover/akhl-studio/4.webp',
    '/images/discover/akhl-studio/5.webp',
    '/images/discover/akhl-studio/6.webp',
  ],
  'ituvana': [
    '/images/discover/ituvana/1.webp',
    '/images/discover/ituvana/2.webp',
    '/images/discover/ituvana/3.webp',
    '/images/discover/ituvana/4.webp',
    '/images/discover/ituvana/5.webp',
    '/images/discover/ituvana/6.webp',
  ],
};

// Mock collection data per brand
const brandCollections: Record<string, { name: string; season: string; description: string }[]> = {
  'asaii': [
    { name: 'Human Rituals', season: 'Spring Summer, Trans Seasonal', description: 'A celebration of the everyday rituals that define our humanity.' },
    { name: 'Autumn Whispers', season: 'Fall Winter', description: 'Quiet elegance for the cooler months.' },
    { name: 'Urban Nomad', season: 'Spring Summer', description: 'Contemporary pieces for the modern wanderer.' },
  ],
  'doodlage': [
    { name: 'Human Rituals', season: 'Spring Summer, Trans Seasonal', description: 'Upcycled fashion that tells a story of renewal.' },
    { name: 'Zero Waste', season: 'Trans Seasonal', description: 'Every scrap has a purpose, every piece has a story.' },
    { name: 'Patchwork Dreams', season: 'Fall Winter', description: 'Handcrafted patchwork celebrating imperfection.' },
  ],
  'margn': [
    { name: 'Human Rituals', season: 'Spring Summer, Trans Seasonal', description: 'Minimalist designs rooted in tradition.' },
    { name: 'Silent Lines', season: 'Fall Winter', description: 'Structured silhouettes with a whisper of drama.' },
    { name: 'Canvas Stories', season: 'Spring Summer', description: 'Where art meets wearable expression.' },
  ],
  'akhl-studio': [
    { name: 'Human Rituals', season: 'Spring Summer, Trans Seasonal', description: 'Bold expressions of contemporary craft.' },
    { name: 'Rebel Heritage', season: 'Trans Seasonal', description: 'Traditional techniques with a modern edge.' },
    { name: 'Night Bloom', season: 'Fall Winter', description: 'Dark florals and midnight textures.' },
  ],
  'ituvana': [
    { name: 'Human Rituals', season: 'Spring Summer, Trans Seasonal', description: 'Natural fibres celebrating slow fashion.' },
    { name: 'Earth Tones', season: 'Trans Seasonal', description: 'Colors borrowed from the earth itself.' },
    { name: 'Coastal Calm', season: 'Spring Summer', description: 'Breezy silhouettes inspired by the sea.' },
  ],
};

// Mock products (using lookbook images as product images)
const getProducts = (brandSlug: string) => {
  const images = brandLookbookImages[brandSlug] || brandLookbookImages['asaii'];
  return images.map((image, index) => ({
    id: `${brandSlug}-${index + 1}`,
    name: ['Epidermis Crochet Applique Vest- Off White', 'Handwoven Wrap Blouse', 'Pleated Midi Skirt', 'Embroidered Jacket', 'Evening Gown', 'Tailored Suit Set'][index] || `Style ${index + 1}`,
    price: [485, 295, 320, 650, 890, 720][index] || 399,
    image,
    images: [image, image, image], // Multiple images for detail view
    fabricDetails: 'Woven',
    feelsLike: 'Hand-crocheted applique, Patch pockets i...',
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Meticulously crafted with attention to architectural lines. This piece embodies the collection\'s ethos of structured fluidity. Designed for the modern wardrobe, offering versatility and timeless elegance.',
  }));
};

// Product Detail Overlay Component
const ProductDetailOverlay = ({
  product,
  products,
  productIndex,
  onClose,
  onNavigate,
  onSelectStyle,
  isInAssortment,
}: {
  product: ReturnType<typeof getProducts>[0];
  products: ReturnType<typeof getProducts>;
  productIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onSelectStyle: (id: string) => void;
  isInAssortment: boolean;
}) => {
  const [activeTab, setActiveTab] = useState('DETAILS');
  const overlayRef = useRef<HTMLDivElement>(null);

  // Ensure the overlay always opens at the top "cover" state
  useEffect(() => {
    overlayRef.current?.scrollTo({ top: 0 });
  }, [product.id]);

  const { scrollYProgress } = useScroll({
    container: overlayRef,
  });

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && productIndex > 0) {
        onNavigate(productIndex - 1);
      } else if (e.key === 'ArrowRight' && productIndex < products.length - 1) {
        onNavigate(productIndex + 1);
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [productIndex, products.length, onNavigate, onClose]);

  // Parallax: the image stack glides left as the right panel "unpacks"
  const imageX = useTransform(scrollYProgress, [0, 0.15, 0.4], ['0vw', '0vw', '-18vw']);

  // Right panel reveal: completely hidden at start, slides in on scroll
  const panelOpacity = useTransform(scrollYProgress, [0, 0.12, 0.25], [0, 0, 1]);
  const panelX = useTransform(scrollYProgress, [0, 0.12, 0.25], ['100%', '100%', '0%']);

  const prevProduct = productIndex > 0 ? products[productIndex - 1] : null;
  const nextProduct = productIndex < products.length - 1 ? products[productIndex + 1] : null;

  const tabs = ['DETAILS', 'WASH & CARE', 'BULK PRICE', 'SHIPPING'];

  const tabContent: Record<string, string> = {
    DETAILS: product.description,
    'WASH & CARE': 'Dry clean recommended. If washing at home, use cold water and a gentle cycle. Avoid tumble drying to preserve structure and surface texture.',
    'BULK PRICE': 'Bulk pricing available on request. Share your required quantities and delivery timeline to receive tiered pricing and production lead times.',
    SHIPPING: 'Ships worldwide. Standard dispatch within 7–10 business days (made-to-order timelines may vary). Duties and taxes may apply based on destination.',
  };

  const [showSizeChart, setShowSizeChart] = useState(false);

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
                    {['XS', 'S', 'M', 'L', 'XL'].map((size, i) => (
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
            {/* Left Edge - Previous Product Peek (constant) */}
            <div
              className="w-[7vw] sticky top-0 h-screen flex-shrink-0 cursor-pointer relative overflow-hidden"
              onClick={() => prevProduct && onNavigate(productIndex - 1)}
            >
              {prevProduct ? (
                <div className="absolute inset-0 grayscale opacity-40 hover:opacity-60 transition-opacity">
                  <img
                    src={prevProduct.image}
                    alt={prevProduct.name}
                    className="w-full h-full object-cover object-right"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="h-full bg-muted/20" />
              )}
            </div>

            {/* Center Column - Image Stack (centered on open, shifts left on scroll) */}
            <div className="flex-1 flex justify-center">
              <div className="pt-16 pb-[60vh] px-4">
                <motion.div style={{ x: imageX }} className="max-w-[520px] space-y-6">
                  {product.images.map((img, idx) => (
                    <div
                      key={idx}
                      className={idx === 0 ? 'h-[88vh]' : 'h-[80vh]'}
                    >
                      <img
                        src={img}
                        alt={`${product.name} - View ${idx + 1}`}
                        className="w-full h-full object-cover"
                        loading={idx === 0 ? 'eager' : 'lazy'}
                      />
                    </div>
                  ))}
                </motion.div>
              </div>
            </div>

            {/* Right Panel - Reveals on scroll */}
            <motion.aside
              style={{ opacity: panelOpacity, x: panelX }}
              className="w-[400px] sticky top-0 h-screen flex-shrink-0 border-l border-border bg-background"
            >
              <div className="h-full flex flex-col px-8 py-10 overflow-y-auto">
                {/* Product Header */}
                <div>
                  <span className="text-gold text-luxury-xs tracking-widest block mb-4">
                    {String(productIndex + 1).padStart(2, '0')} / {products.length}
                  </span>

                  <h2 className="font-serif text-2xl lg:text-3xl leading-tight mb-6">
                    {product.name}
                  </h2>

                  {/* Specs */}
                  <div className="space-y-3 mb-6">
                    <div className="flex">
                      <span className="text-muted-foreground text-luxury-xs w-24">FABRIC:</span>
                      <span className="text-sm">{product.fabricDetails}</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground text-luxury-xs w-24">FEELS LIKE:</span>
                      <span className="text-sm">{product.feelsLike}</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground text-luxury-xs w-24">SIZE GUIDE:</span>
                      <button
                        onClick={() => setShowSizeChart(true)}
                        className="text-sm underline hover:text-gold transition-colors"
                      >
                        View Chart
                      </button>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => onSelectStyle(product.id)}
                    className={`w-full py-4 flex items-center justify-center gap-2 transition-all mb-8 ${
                      isInAssortment
                        ? 'bg-gold text-primary-foreground'
                        : 'bg-gold/80 hover:bg-gold text-primary-foreground'
                    }`}
                  >
                    {isInAssortment ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span className="text-luxury-sm tracking-widest">SELECTED</span>
                      </>
                    ) : (
                      <span className="text-luxury-sm tracking-widest">SELECT THIS STYLE</span>
                    )}
                  </button>
                </div>

                {/* Virtual Trial Video */}
                <section className="mb-8">
                  <div className="aspect-video w-full bg-muted border border-border relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-muted-foreground text-sm">You imagine it.</span>
                    </div>
                    <span className="absolute bottom-3 left-3 text-luxury-xs tracking-widest text-muted-foreground bg-background/80 px-2 py-1">
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
                        className={`text-luxury-xs tracking-widest transition-colors ${
                          activeTab === tab
                            ? 'text-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tabContent[activeTab]}
                  </p>
                </section>
              </div>
            </motion.aside>

            {/* Right Edge - Next Product Peek (constant) */}
            <div
              className="w-[7vw] sticky top-0 h-screen flex-shrink-0 cursor-pointer relative overflow-hidden"
              onClick={() => nextProduct && onNavigate(productIndex + 1)}
            >
              {nextProduct ? (
                <div className="absolute inset-0 grayscale opacity-40 hover:opacity-60 transition-opacity">
                  <img
                    src={nextProduct.image}
                    alt={nextProduct.name}
                    className="w-full h-full object-cover object-left"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="h-full bg-muted/20" />
              )}
            </div>
          </div>
        </div>
      </div>
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
        ease: [0.32, 0.72, 0, 1] 
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
  const [assortment, setAssortment] = useState<string[]>([]);
  const [flyingImage, setFlyingImage] = useState<{ src: string; x: number; y: number } | null>(null);
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Scroll to top on page load to ensure hero is visible
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug, collectionSlug]);
  
  const brand = brands.find(b => b.slug === slug);
  const products = getProducts(slug || 'asaii');
  const selectedProduct = selectedProductIndex !== null ? products[selectedProductIndex] : null;

  // Get collection info based on slug or default to first
  const collections = brandCollections[slug || 'asaii'] || brandCollections['asaii'];
  const collection = collections.find(c => 
    c.name.toLowerCase().replace(/\s+/g, '-') === collectionSlug
  ) || collections[0];

  // Hero image is the first lookbook image
  const heroImage = (brandLookbookImages[slug || ''] || brandLookbookImages['asaii'])[0];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Track scroll progress to update product counter
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const productIdx = Math.min(Math.floor(latest * products.length), products.length - 1);
    setCurrentProductIndex(productIdx);
  });

  // Calculate scroll bounds:
  // Hero takes 100vw, each product takes 33.333vw
  // Total content width = 100vw (hero) + products.length * 33.333vw
  // We need to scroll until the last product's right edge aligns with viewport right edge
  const productWidthVW = 33.333;
  const heroWidthVW = 100;
  const totalContentWidthVW = heroWidthVW + (products.length * productWidthVW);
  
  // Max scroll distance = total content width - viewport width (100vw)
  // This gives us how much we need to translate left in vw units
  const maxScrollVW = totalContentWidthVW - 100;
  
  // Use vw units directly for the transform
  const x = useTransform(scrollYProgress, [0, 1], ['0vw', `-${maxScrollVW}vw`]);

  const handleSelectStyle = (productId: string, event?: React.MouseEvent) => {
    const product = products.find(p => p.id === productId);
    
    if (!assortment.includes(productId) && product && event) {
      // Trigger flying animation
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setFlyingImage({
        src: product.image,
        x: rect.left + rect.width / 2 - 32,
        y: rect.top,
      });
    }
    
    if (assortment.includes(productId)) {
      setAssortment(assortment.filter(id => id !== productId));
    } else {
      setAssortment([...assortment, productId]);
    }
  };

  const isInAssortment = (productId: string) => assortment.includes(productId);

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Brand not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm">
        <div className="flex items-center justify-between px-8 py-6">
          <Link 
            to={`/brands/${slug}`}
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-luxury-sm tracking-widest uppercase">Back to Brand</span>
          </Link>
          
          {/* Scroll Progress Indicator */}
          <div className="flex items-center gap-4">
            <div className="w-32 h-px bg-border relative overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gold"
                style={{ width: useTransform(scrollYProgress, [0, 1], ['0%', '100%']) }}
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
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div 
            style={{ x }}
            className="flex h-full pt-20"
          >
            {/* Hero Slide - Collection Thumbnail + Info */}
            <div className="flex-shrink-0 w-screen h-full flex">
              {/* Left: Collection Thumbnail */}
              <div className="w-1/2 h-full p-8 flex items-center justify-center">
                <div className="w-full max-w-[500px] h-[85%]">
                  <img
                    src={heroImage}
                    alt={collection.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Right: Collection Info */}
              <div className="w-1/2 h-full flex flex-col justify-center pr-16">
                <span className="text-gold text-luxury-xs tracking-widest mb-6">
                  {collection.season.toUpperCase()}
                </span>
                <h1 className="font-serif text-5xl lg:text-7xl font-light leading-tight mb-8">
                  {collection.name}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-8">
                  {collection.description}
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-luxury-sm tracking-widest uppercase">Scroll to Explore</span>
                  <div className="w-12 h-px bg-foreground" />
                </div>
              </div>
            </div>

            {/* Product Rail */}
            {products.map((product, index) => (
              <div 
                key={product.id}
                className="flex-shrink-0 h-full cursor-pointer group"
                style={{ width: '33.333vw' }}
                onClick={() => setSelectedProductIndex(index)}
              >
                <div className="relative h-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Product Info on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="text-primary-foreground/60 text-luxury-xs block mb-2">
                      {String(index + 1).padStart(2, '0')} / {products.length}
                    </span>
                    <h3 className="font-serif text-xl text-primary-foreground">
                      {product.name}
                    </h3>
                    <p className="text-primary-foreground/80 text-sm mt-1">
                      ${product.price}
                    </p>
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
            onClose={() => setSelectedProductIndex(null)}
            onNavigate={(index) => setSelectedProductIndex(index)}
            onSelectStyle={(id) => handleSelectStyle(id)}
            isInAssortment={isInAssortment(selectedProduct.id)}
          />
        )}
      </AnimatePresence>

      {/* Flying Image Animation */}
      <AnimatePresence>
        {flyingImage && (
          <FlyingImage
            imageSrc={flyingImage.src}
            startPosition={{ x: flyingImage.x, y: flyingImage.y }}
            onComplete={() => setFlyingImage(null)}
          />
        )}
      </AnimatePresence>

      {/* Assortment Tray */}
      <AnimatePresence>
        {assortment.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-40 bg-deep-charcoal border-t border-gold/30"
          >
            <div className="flex items-center justify-between px-8 py-4">
              <div className="flex items-center gap-4">
                <span className="text-primary-foreground text-luxury-sm">
                  {assortment.length} styles selected
                </span>
                <div className="flex -space-x-3">
                  {assortment.slice(0, 5).map((id) => {
                    const product = products.find(p => p.id === id);
                    return product ? (
                      <div key={id} className="w-12 h-12 border-2 border-deep-charcoal overflow-hidden">
                        <img src={product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
              <button className="btn-luxury-gold">
                Proceed to Order
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectionDetail;
