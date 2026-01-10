import { useState, useRef, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { ArrowLeft, Plus, Check, X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { brands } from '@/data/brands';
import { useAssortment } from '@/contexts/AssortmentContext';
import { useCollection } from '@/hooks/useCollections';
import { useProductsByCollection, ProductWithDetails } from '@/hooks/useProducts';
import { useBrand } from '@/hooks/useBrands';

// Fallback lookbook images for each brand (used when no products in DB)
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
  'akhl_studio': [
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

// Helper to transform DB product to display format
interface DisplayProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  images: string[];
  fabricDetails: string;
  feelsLike: string;
  sizes: string[];
  description: string;
  careGuide?: string;
}

const transformProductsToDisplay = (dbProducts: ProductWithDetails[], brandSlug: string): DisplayProduct[] => {
  if (dbProducts.length === 0) {
    // Fallback to mock data if no products in DB
    const images = brandLookbookImages[brandSlug] || brandLookbookImages['asaii'];
    return images.map((image, index) => ({
      id: `${brandSlug}-${index + 1}`,
      name: ['Epidermis Crochet Applique Vest- Off White', 'Handwoven Wrap Blouse', 'Pleated Midi Skirt', 'Embroidered Jacket', 'Evening Gown', 'Tailored Suit Set'][index] || `Style ${index + 1}`,
      price: [485, 295, 320, 650, 890, 720][index] || 399,
      image,
      images: [image, images[(index + 1) % images.length], images[(index + 2) % images.length]],
      fabricDetails: 'Woven',
      feelsLike: 'Hand-crocheted applique, Patch pockets...',
      sizes: ['XS', 'S', 'M', 'L'],
      description: 'Meticulously crafted with attention to architectural lines. This piece embodies the collection\'s ethos of structured fluidity.',
    }));
  }

  return dbProducts.map((p) => {
    const mainImage = p.images[0]?.image_url || brandLookbookImages[brandSlug]?.[0] || '/images/discover/asaii/1.webp';
    const allImages = p.images.length > 0 
      ? p.images.map(img => img.image_url)
      : [mainImage];
    const price = p.variants[0]?.price || 0;

    return {
      id: p.id,
      name: p.title,
      price,
      image: mainImage,
      images: allImages,
      fabricDetails: p.fabric_type || 'Woven',
      feelsLike: p.description?.substring(0, 50) || 'Hand-crafted details...',
      sizes: ['XS', 'S', 'M', 'L'],
      description: p.description || p.product_story || 'Meticulously crafted with attention to detail.',
      careGuide: p.care_guide || undefined,
    };
  });
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
  product: DisplayProduct;
  products: DisplayProduct[];
  productIndex: number;
  brandSlug: string;
  brandName: string;
  onClose: () => void;
  onNavigate: (index: number) => void;
  onSelectStyle: (id: string, event: React.MouseEvent) => void;
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
            {/* Left Edge - Previous Product Peek (constant 7vw) */}
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

            {/* Middle Section - Fixed 86vw containing images + details panel */}
            <div className="w-[86vw] flex-shrink-0 sticky top-0 h-screen overflow-hidden">
              {/* Image Column - shifts left on scroll, contains vertical scrolling images */}
              <motion.div 
                style={{ x: imageX }} 
                className="absolute inset-0 flex justify-center pt-16"
              >
                <div className="max-w-[520px] w-full h-full overflow-y-auto hide-scrollbar">
                  {/* Display all product images vertically - scrolling through them reveals the right panel */}
                  {product.images.map((img, idx) => (
                    <div key={idx} className="relative mb-4 last:mb-0">
                      <img
                        src={img}
                        alt={`${product.name} - View ${idx + 1}`}
                        className="w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Right Panel - Reveals on scroll (positioned absolutely within middle section) */}
              <motion.aside
                style={{ opacity: panelOpacity, x: panelX }}
                className="w-[432px] absolute right-0 top-0 h-screen border-l border-border bg-background overflow-y-auto"
              >
                <div className="h-full flex flex-col px-10 py-12">
                  {/* Product Header */}
                  <div>
                    <span className="text-gold text-sm tracking-widest block mb-5">
                      {String(productIndex + 1).padStart(2, '0')} / {products.length}
                    </span>

                    <h2 className="font-serif text-3xl lg:text-4xl leading-tight mb-8">
                      {product.name}
                    </h2>

                    {/* Specs */}
                    <div className="space-y-4 mb-8">
                      <div className="flex">
                        <span className="text-muted-foreground text-sm w-28">FABRIC:</span>
                        <span className="text-base">{product.fabricDetails}</span>
                      </div>
                      <div className="flex">
                        <span className="text-muted-foreground text-sm w-28">FEELS LIKE:</span>
                        <span className="text-base">{product.feelsLike}</span>
                      </div>
                      <div className="flex">
                        <span className="text-muted-foreground text-sm w-28">SIZE GUIDE:</span>
                        <button
                          onClick={() => setShowSizeChart(true)}
                          className="text-base underline hover:text-gold transition-colors"
                        >
                          View Chart
                        </button>
                      </div>
                    </div>

                    {/* CTA */}
                    <button
                      onClick={(e) => onSelectStyle(product.id, e)}
                      className={`w-full py-5 flex items-center justify-center gap-2 transition-all mb-10 ${
                        isInAssortment
                          ? 'bg-gold text-primary-foreground'
                          : 'bg-gold/80 hover:bg-gold text-primary-foreground'
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
                    </button>
                  </div>

                  {/* Virtual Trial Video */}
                  <section className="mb-10">
                    <div className="aspect-video w-full bg-muted border border-border relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-muted-foreground text-base">You imagine it.</span>
                      </div>
                      <span className="absolute bottom-3 left-3 text-sm tracking-widest text-muted-foreground bg-background/80 px-2 py-1">
                        VIRTUAL TRIAL
                      </span>
                    </div>
                  </section>

                  {/* Tabbed info */}
                  <section className="mt-auto">
                    <div className="flex gap-5 mb-5 border-b border-border pb-4">
                      {tabs.map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`text-sm tracking-widest transition-colors ${
                            activeTab === tab
                              ? 'text-foreground'
                              : 'text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>

                    <p className="text-base text-muted-foreground leading-relaxed">
                      {tabContent[activeTab]}
                    </p>
                  </section>
                </div>
              </motion.aside>
            </div>

            {/* Right Edge - Next Product Peek (constant 7vw) */}
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
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  
  const { addProduct, removeProduct, isInAssortment, setLastCollectionUrl } = useAssortment();
  
  // Fetch data from database
  const { data: dbCollection, isLoading: collectionLoading } = useCollection(collectionSlug || '');
  const { data: dbProducts, isLoading: productsLoading } = useProductsByCollection(collectionSlug || '');
  const { data: dbBrand } = useBrand(slug || '');
  
  // Transform products to display format
  const products = useMemo(() => 
    transformProductsToDisplay(dbProducts || [], slug || 'asaii'),
    [dbProducts, slug]
  );
  
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
    };

    stickyElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => stickyElement.removeEventListener('wheel', handleWheel);
  }, []);
  
  // Fallback to static data if DB data not available
  const brand = dbBrand || brands.find(b => b.slug === slug);
  const selectedProduct = selectedProductIndex !== null ? products[selectedProductIndex] : null;

  // Get collection info from DB or use fallback
  const collection = dbCollection || {
    title: collectionSlug?.replace(/-/g, ' ').replace(/_/g, ' ') || 'Collection',
    description: 'Explore our curated collection of unique pieces.',
    seasonality: 'Trans Seasonal',
    tagline: '',
  };

  // Hero image is the first product image or fallback
  const heroImage = products[0]?.image || (brandLookbookImages[slug || ''] || brandLookbookImages['asaii'])[0];

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

  const handleSelectStyle = (productId: string, event: React.MouseEvent) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (isInAssortment(productId)) {
      removeProduct(productId);
    } else {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      addProduct({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        brandSlug: slug || 'asaii',
        brandName: brand?.name || 'Brand',
        category: 'Apparel',
      }, rect);
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
        <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
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
                    alt={collection.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              
              {/* Right: Collection Info */}
              <div className="w-1/2 h-full flex flex-col justify-center pr-16">
                <span className="text-gold text-luxury-xs tracking-widest mb-6">
                  {(collection.seasonality || 'TRANS SEASONAL').toUpperCase()}
                </span>
                <h1 className="font-serif text-5xl lg:text-7xl font-light leading-tight mb-8">
                  {collection.title}
                </h1>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-md mb-8">
                  {collection.description || collection.tagline}
                </p>
                
                {/* Call to action instruction */}
                <div className="bg-gold/10 border border-gold/30 p-6 mb-8 max-w-md">
                  <p className="text-foreground text-sm font-medium mb-2">
                    How to Select Styles
                  </p>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Click on any style to view it in detail. Scroll through the images to explore different angles, then add your favorites to your assortment.
                  </p>
                </div>
                
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
                className="flex-shrink-0 h-full cursor-pointer group relative"
                style={{ width: '33.333vw' }}
                onClick={() => setSelectedProductIndex(index)}
              >
                <div className="relative h-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Always visible overlay hint */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/60 via-transparent to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Product Info - always visible at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <span className="text-primary-foreground/60 text-luxury-xs block mb-2">
                      {String(index + 1).padStart(2, '0')} / {products.length}
                    </span>
                    <h3 className="font-serif text-xl text-primary-foreground">
                      {product.name}
                    </h3>
                    <p className="text-primary-foreground/80 text-sm mt-1">
                      ${product.price}
                    </p>
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
            brandSlug={slug || 'asaii'}
            brandName={brand?.name || 'Brand'}
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
