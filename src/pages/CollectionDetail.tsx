import { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
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
  const detailScrollRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: detailScrollRef,
    offset: ["start start", "end end"]
  });

  // Parallax effect: shift images from -6.5vw to -31.5vw as user scrolls
  const imageX = useTransform(scrollYProgress, [0, 1], ['-6.5vw', '-31.5vw']);

  const prevProduct = productIndex > 0 ? products[productIndex - 1] : null;
  const nextProduct = productIndex < products.length - 1 ? products[productIndex + 1] : null;

  const tabs = ['DETAILS', 'WASH & CARE', 'BULK PRICE', 'SHIPPING'];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background overflow-hidden"
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-8 right-8 z-50 p-2 hover:text-gold transition-colors"
      >
        <X className="w-6 h-6" strokeWidth={1} />
      </button>

      {/* Scrollable container for parallax */}
      <div ref={detailScrollRef} className="h-full overflow-y-auto">
        <div className="min-h-[200vh]">
          <div className="sticky top-0 h-screen">
            {/* 3-Column Grid Layout */}
            <div className="h-full flex">
              {/* Left Column - Previous Product Preview (14vw) */}
              <div 
                className="w-[14vw] h-full flex-shrink-0 cursor-pointer relative overflow-hidden"
                onClick={() => prevProduct && onNavigate(productIndex - 1)}
              >
                {prevProduct && (
                  <div className="absolute inset-0 opacity-40 hover:opacity-60 transition-opacity">
                    <img
                      src={prevProduct.image}
                      alt={prevProduct.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <ChevronLeft className="w-8 h-8 text-foreground" />
                    </div>
                  </div>
                )}
              </div>

              {/* Center Column - Product Images with Parallax */}
              <motion.div 
                style={{ x: imageX }}
                className="flex-1 h-full overflow-y-auto py-8 px-4"
              >
                <div className="space-y-4 max-w-[500px] mx-auto">
                  {product.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${product.name} - View ${idx + 1}`}
                      className="w-full object-cover"
                    />
                  ))}
                </div>
              </motion.div>

              {/* Right Column - Fixed Product Info Panel (~400px) */}
              <div className="w-[400px] h-full flex-shrink-0 bg-background flex flex-col justify-start pt-16 px-8 overflow-y-auto">
                {/* Product Title */}
                <h2 className="font-serif text-2xl lg:text-3xl font-light leading-tight mb-6">
                  {product.name}
                </h2>

                {/* Specifications */}
                <div className="space-y-3 mb-6 text-sm">
                  <div className="flex">
                    <span className="text-muted-foreground w-24 uppercase tracking-wider text-xs">Fabric:</span>
                    <span>{product.fabricDetails}</span>
                  </div>
                  <div className="flex">
                    <span className="text-muted-foreground w-24 uppercase tracking-wider text-xs">Feels Like:</span>
                    <span className="text-muted-foreground">{product.feelsLike}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-muted-foreground w-24 uppercase tracking-wider text-xs">Size Guide:</span>
                    <button className="underline text-foreground hover:text-gold transition-colors">View Chart</button>
                  </div>
                </div>

                {/* Select This Style Button */}
                <button
                  onClick={() => onSelectStyle(product.id)}
                  className={`w-full py-4 px-6 text-sm uppercase tracking-widest transition-colors mb-8 ${
                    isInAssortment 
                      ? 'bg-deep-charcoal text-primary-foreground' 
                      : 'bg-gold text-primary-foreground hover:bg-gold/90'
                  }`}
                >
                  {isInAssortment ? 'Added to Assortment' : 'Select This Style'}
                </button>

                {/* Virtual Trial Box */}
                <div className="bg-muted aspect-video mb-8 flex items-center justify-center relative">
                  <span className="text-primary-foreground text-center">Curiosity looks good on you.</span>
                  <span className="absolute bottom-2 left-2 text-xs text-primary-foreground/60 uppercase tracking-wider">Virtual Trial</span>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-border mb-4">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-2 text-xs tracking-wider transition-colors ${
                        activeTab === tab 
                          ? 'text-foreground border-b border-foreground' 
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="text-sm text-muted-foreground leading-relaxed">
                  {activeTab === 'DETAILS' && (
                    <p>{product.description}</p>
                  )}
                  {activeTab === 'WASH & CARE' && (
                    <p>Dry clean only. Store in a cool, dry place. Avoid direct sunlight.</p>
                  )}
                  {activeTab === 'BULK PRICE' && (
                    <p>Contact us for bulk pricing on orders of 10+ pieces.</p>
                  )}
                  {activeTab === 'SHIPPING' && (
                    <p>Ships within 2-3 weeks. International shipping available.</p>
                  )}
                </div>
              </div>

              {/* Right Edge - Next Product Preview (hidden, for symmetry) */}
              {nextProduct && (
                <div 
                  className="w-[14vw] h-full flex-shrink-0 cursor-pointer relative overflow-hidden"
                  onClick={() => onNavigate(productIndex + 1)}
                >
                  <div className="absolute inset-0 opacity-40 hover:opacity-60 transition-opacity">
                    <img
                      src={nextProduct.image}
                      alt={nextProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
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
  const containerRef = useRef<HTMLDivElement>(null);
  
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

  // Calculate scroll bounds:
  // - Start: 0% (hero visible on left)
  // - End: when last product is fully visible (not scrolled past)
  // Hero takes 100vw, each product takes 33.333vw
  // Total content width = 100vw (hero) + products.length * 33.333vw
  // End scroll should show last 100vw of content
  const productWidth = 33.333;
  const heroWidth = 100;
  const totalContentWidth = heroWidth + (products.length * productWidth);
  // We want to stop when the last product is fully visible
  // That means the rightmost edge of the last product aligns with the right edge of viewport
  const maxScrollPercent = ((totalContentWidth - 100) / totalContentWidth) * 100;
  
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${maxScrollPercent}%`]);

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
        <div className="flex items-center px-8 py-6">
          <Link 
            to={`/brands/${slug}`}
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-luxury-sm tracking-widest uppercase">Back to Brand</span>
          </Link>
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
