import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RefreshCw } from 'lucide-react';
import Header from '@/components/layout/Header';
import CTAGuidance from '@/components/layout/CTAGuidance';
import { brands } from '@/data/brands';

const brandImages: Record<string, string[]> = {
  'asaii': ['/images/discover/asaii/1.webp', '/images/discover/asaii/2.webp', '/images/discover/asaii/3.webp', '/images/discover/asaii/4.webp', '/images/discover/asaii/5.webp', '/images/discover/asaii/6.webp'],
  'doodlage': ['/images/discover/doodlage/1.jpg', '/images/discover/doodlage/2.webp', '/images/discover/doodlage/3.webp', '/images/discover/doodlage/4.webp', '/images/discover/doodlage/5.webp', '/images/discover/doodlage/6.webp'],
  'margn': ['/images/discover/margn/1.webp', '/images/discover/margn/2.webp', '/images/discover/margn/3.webp', '/images/discover/margn/4.webp', '/images/discover/margn/5.webp', '/images/discover/margn/6.webp'],
  'akhl': ['/images/discover/akhl-studio/1.webp', '/images/discover/akhl-studio/2.webp', '/images/discover/akhl-studio/3.webp', '/images/discover/akhl-studio/4.webp', '/images/discover/akhl-studio/5.webp', '/images/discover/akhl-studio/6.webp'],
  'ituvana': ['/images/discover/ituvana/1.webp', '/images/discover/ituvana/2.webp', '/images/discover/ituvana/3.webp', '/images/discover/ituvana/4.webp', '/images/discover/ituvana/5.webp', '/images/discover/ituvana/6.webp'],
  'capisvirleo': ['/images/discover/capisvirleo/1.jpg', '/images/discover/capisvirleo/2.jpg', '/images/discover/capisvirleo/3.jpg', '/images/discover/capisvirleo/4.jpg', '/images/discover/capisvirleo/5.jpg', '/images/discover/capisvirleo/6.jpg'],
  'day-and-age': ['/images/discover/day-&-age/1.jpg', '/images/discover/day-&-age/2.jpg', '/images/discover/day-&-age/3.jpg', '/images/discover/day-&-age/4.jpg', '/images/discover/day-&-age/5.jpg', '/images/discover/day-&-age/6.jpg'],
  'guapa': ['/images/discover/guapa/1.jpg', '/images/discover/guapa/2.jpg', '/images/discover/guapa/3.jpg', '/images/discover/guapa/4.jpg', '/images/discover/guapa/5.webp', '/images/discover/guapa/6.webp'],
  'ka-sha': ['/images/discover/ka-sha/1.jpg', '/images/discover/ka-sha/2.jpg', '/images/discover/ka-sha/3.jpg', '/images/discover/ka-sha/4.jpg', '/images/discover/ka-sha/5.jpg', '/images/discover/ka-sha/6.jpg'],
  'khara-kapas': ['/images/discover/khara-kapas/1.jpg', '/images/discover/khara-kapas/2.jpg', '/images/discover/khara-kapas/3.jpg', '/images/discover/khara-kapas/4.webp', '/images/discover/khara-kapas/5.jpg', '/images/discover/khara-kapas/6.jpg'],
};

const Discover = () => {
  const [searchParams] = useSearchParams();
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollCooldownRef = useRef(false);

  const category = searchParams.get('category');
  const season = searchParams.get('season');

  const filteredBrands = useMemo(() => {
    let result = [...brands];
    if (category) {
      result = result.filter(b => b.category.toLowerCase().includes(category.toLowerCase()) || b.tags.some(t => t.toLowerCase().includes(category.toLowerCase())));
    }
    if (season) {
      result = result.filter(b => b.season.toLowerCase().includes(season.toLowerCase()));
    }
    return result.length > 0 ? result.slice(0, 10) : brands.slice(0, 10);
  }, [category, season]);

  const activeBrand = filteredBrands[activeBrandIndex];
  const images = brandImages[activeBrand?.slug] || brandImages['doodlage'];

  const handleRefresh = () => {
    setActiveBrandIndex(prev => (prev + 1) % filteredBrands.length);
  };

  // Vertical scroll hijacking - switch brands instead of scrolling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      if (scrollCooldownRef.current) return;

      // Debounce scroll to prevent rapid switching
      scrollCooldownRef.current = true;
      setTimeout(() => {
        scrollCooldownRef.current = false;
      }, 500);

      if (e.deltaY > 0) {
        // Scroll down - next brand
        setActiveBrandIndex(prev =>
          prev < filteredBrands.length - 1 ? prev + 1 : 0
        );
      } else if (e.deltaY < 0) {
        // Scroll up - previous brand
        setActiveBrandIndex(prev =>
          prev > 0 ? prev - 1 : filteredBrands.length - 1
        );
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }

    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
    };
  }, [filteredBrands.length]);

  return (
    <div ref={containerRef} className="h-screen overflow-hidden bg-background">
      <Header />
      <CTAGuidance message="Scroll to explore brands" />

      <main className="h-full pt-24 pb-20 flex flex-col">
        {/* Filter Indicator */}
        {(category || season) && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-8 py-3 bg-sand flex-shrink-0"
          >
            <p className="text-luxury-label text-center text-base">
              Showing brands for{' '}
              {season && <span className="text-gold">{season}</span>}
              {category && season && ' · '}
              {category && <span className="text-gold">{category}</span>}
            </p>
          </motion.div>
        )}

        {/* Main Content - Fills remaining space */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 min-h-0">
          {/* Left - Image Grid */}
          <div className="p-6 lg:p-10 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBrand?.slug}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-2 md:grid-cols-3 gap-2 h-full"
              >
                {images.map((img, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative aspect-[4/5] overflow-hidden group"
                  >
                    {/* Full color images - no grayscale */}
                    <img
                      src={img}
                      alt={`${activeBrand?.name} look ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-primary-foreground text-luxury-xs">
                        Look {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right - Brand Info */}
          <div className="p-6 lg:p-10 flex flex-col justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBrand?.slug}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
              >
                {/* Brand Location */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gold text-luxury-label mb-4 block text-base"
                >
                  {activeBrand?.location}
                </motion.span>

                <h1 className="font-serif text-5xl lg:text-6xl font-light mb-5">
                  {activeBrand?.name}
                </h1>

                <p className="text-muted-foreground leading-relaxed mb-6 max-w-md text-base">
                  {activeBrand?.story}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {activeBrand?.tags.map(tag => (
                    <span key={tag} className="tag-luxury">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to={`/brands/${activeBrand?.slug}`}
                    className="btn-luxury inline-flex items-center gap-3 justify-center"
                  >
                    View Brand Store
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={handleRefresh}
                    className="btn-luxury-outline inline-flex items-center gap-3 justify-center"
                  >
                    <RefreshCw className="w-4 h-4" />
                    More brands like this
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* Bottom Navigation - Label Switcher */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border">
        <div className="flex items-center justify-center gap-1 px-4 py-4">
          {filteredBrands.map((brand, index) => (
            <button
              key={brand.slug}
              onClick={() => setActiveBrandIndex(index)}
              className={`px-6 py-3 text-luxury-xs transition-all duration-300 relative ${index === activeBrandIndex ? 'text-foreground' : 'text-taupe hover:text-foreground'
                }`}
            >
              {brand.name}
              {index === activeBrandIndex && (
                <motion.div
                  layoutId="activeLabel"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Discover;
