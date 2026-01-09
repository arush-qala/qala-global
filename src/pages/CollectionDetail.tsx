import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Plus, Check, X } from 'lucide-react';
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
    name: ['Draped Asymmetric Dress', 'Handwoven Wrap Blouse', 'Pleated Midi Skirt', 'Embroidered Jacket', 'Evening Gown', 'Tailored Suit Set'][index] || `Style ${index + 1}`,
    price: [485, 295, 320, 650, 890, 720][index] || 399,
    image,
    fabricDetails: ['100% Organic Silk', 'Handwoven Cotton', 'Recycled Polyester', 'Silk Brocade', 'Mulberry Silk', 'Italian Wool Blend'][index] || 'Premium Fabric',
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'A thoughtfully crafted piece that embodies sustainable luxury and timeless design.',
  }));
};

const CollectionDetail = () => {
  const { slug, collectionSlug } = useParams<{ slug: string; collectionSlug: string }>();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [assortment, setAssortment] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const brand = brands.find(b => b.slug === slug);
  const products = getProducts(slug || 'asaii');
  const selectedProduct = products.find(p => p.id === selectedProductId);

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

  // Calculate the total width to scroll: hero section (100vw) + all products
  const totalProductsWidth = products.length * 33.333; // Each product is 33.333vw
  const heroInfoWidth = 50; // 50vw for the info section that scrolls away
  const totalScrollWidth = heroInfoWidth + totalProductsWidth;
  
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${totalScrollWidth - 100}%`]);

  const handleSelectStyle = (productId: string) => {
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
                onClick={() => setSelectedProductId(product.id)}
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
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background"
        >
          <button
            onClick={() => setSelectedProductId(null)}
            className="absolute top-8 right-8 p-2 hover:text-gold transition-colors"
          >
            <X className="w-6 h-6" strokeWidth={1} />
          </button>

          <div className="h-full flex">
            {/* Left - Image */}
            <div className="w-1/2 h-full p-8">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right - Details */}
            <div className="w-1/2 h-full p-16 flex flex-col justify-center">
              <span className="text-gold text-luxury-label mb-4">{brand.name}</span>
              <h2 className="font-serif text-4xl lg:text-5xl font-light mb-4">
                {selectedProduct.name}
              </h2>
              <p className="text-3xl font-light mb-8">${selectedProduct.price}</p>
              
              <div className="space-y-6 mb-12">
                <div>
                  <h4 className="text-luxury-label mb-2">Fabric</h4>
                  <p className="text-muted-foreground">{selectedProduct.fabricDetails}</p>
                </div>
                <div>
                  <h4 className="text-luxury-label mb-2">Description</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
                </div>
                <div>
                  <h4 className="text-luxury-label mb-2">Available Sizes</h4>
                  <div className="flex gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <span key={size} className="px-4 py-2 border border-border text-sm">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelectStyle(selectedProduct.id)}
                className={`btn-luxury-gold inline-flex items-center gap-3 justify-center ${
                  isInAssortment(selectedProduct.id) ? 'bg-deep-charcoal' : ''
                }`}
              >
                {isInAssortment(selectedProduct.id) ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Assortment
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Select This Style
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Assortment Tray */}
      {assortment.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
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
    </div>
  );
};

export default CollectionDetail;
