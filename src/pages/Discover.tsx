import { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, RefreshCw } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CTAGuidance from '@/components/layout/CTAGuidance';
import { brands } from '@/data/brands';
const brandImages: Record<string, string[]> = {
  'asaii': ['/images/discover/asaii/1.webp', '/images/discover/asaii/2.webp', '/images/discover/asaii/3.webp', '/images/discover/asaii/4.webp', '/images/discover/asaii/5.webp', '/images/discover/asaii/6.webp'],
  'doodlage': ['/images/discover/doodlage/1.jpg', '/images/discover/doodlage/2.webp', '/images/discover/doodlage/3.webp', '/images/discover/doodlage/4.webp', '/images/discover/doodlage/5.webp', '/images/discover/doodlage/6.webp'],
  'margn': ['/images/discover/margn/1.webp', '/images/discover/margn/2.webp', '/images/discover/margn/3.webp', '/images/discover/margn/4.webp', '/images/discover/margn/5.webp', '/images/discover/margn/6.webp'],
  'akhl': ['/images/discover/akhl-studio/1.webp', '/images/discover/akhl-studio/2.webp', '/images/discover/akhl-studio/3.webp', '/images/discover/akhl-studio/4.webp', '/images/discover/akhl-studio/5.webp', '/images/discover/akhl-studio/6.webp'],
  'ituvana': ['/images/discover/ituvana/1.webp', '/images/discover/ituvana/2.webp', '/images/discover/ituvana/3.webp', '/images/discover/ituvana/4.webp', '/images/discover/ituvana/5.webp', '/images/discover/ituvana/6.webp']
};
const Discover = () => {
  const [searchParams] = useSearchParams();
  const [activeBrandIndex, setActiveBrandIndex] = useState(0);
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
    return result.length > 0 ? result.slice(0, 5) : brands.slice(0, 5);
  }, [category, season]);
  const activeBrand = filteredBrands[activeBrandIndex];
  const images = brandImages[activeBrand?.slug] || brandImages['doodlage'];
  const handleRefresh = () => {
    setActiveBrandIndex(prev => (prev + 1) % filteredBrands.length);
  };
  return <div className="min-h-screen bg-background">
      <Header />
      <CTAGuidance message="Explore brands below → Select a brand to visit their store or discover similar options" />
      
      <main className="pt-24 pb-32">
        {/* Filter Indicator */}
        {(category || season) && <motion.div initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} className="px-8 py-4 bg-sand">
            <p className="text-luxury-label text-center text-base">
              Showing brands for{' '}
              {season && <span className="text-gold">{season}</span>}
              {category && season && ' · '}
              {category && <span className="text-gold">{category}</span>}
            </p>
          </motion.div>}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
          {/* Left - Image Grid */}
          <div className="p-8 lg:p-12">
            <AnimatePresence mode="wait">
              <motion.div key={activeBrand?.slug} initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }} transition={{
              duration: 0.5
            }} className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {images.map((img, index) => <motion.div key={index} initial={{
                opacity: 0,
                y: 20
              }} animate={{
                opacity: 1,
                y: 0
              }} transition={{
                delay: index * 0.1
              }} className="relative aspect-[4/5] overflow-hidden group">
                    <img src={img} alt={`${activeBrand?.name} look ${index + 1}`} className="w-full h-full object-cover img-luxury" />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-charcoal/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <span className="text-primary-foreground text-luxury-xs">
                        Look {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>
                  </motion.div>)}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right - Brand Info */}
          <div className="p-8 lg:p-12 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div key={activeBrand?.slug} initial={{
              opacity: 0,
              x: 20
            }} animate={{
              opacity: 1,
              x: 0
            }} exit={{
              opacity: 0,
              x: -20
            }} transition={{
              duration: 0.5
            }}>
                {/* Brand Name */}
                <motion.span initial={{
                opacity: 0
              }} animate={{
                opacity: 1
              }} transition={{
                delay: 0.2
              }} className="text-gold text-luxury-label mb-4 block text-base">
                  {activeBrand?.location}
                </motion.span>
                
                <h1 className="font-serif text-6xl lg:text-7xl font-light mb-6">
                  {activeBrand?.name}
                </h1>

                <p className="text-muted-foreground leading-relaxed mb-8 max-w-md text-lg">
                  {activeBrand?.story}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-12">
                  {activeBrand?.tags.map(tag => <span key={tag} className="tag-luxury">
                      {tag}
                    </span>)}
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={`/brands/${activeBrand?.slug}`} className="btn-luxury inline-flex items-center gap-3 justify-center">
                    Browse Collection
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  
                  <button onClick={handleRefresh} className="btn-luxury-outline inline-flex items-center gap-3 justify-center">
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
          {filteredBrands.map((brand, index) => <button key={brand.slug} onClick={() => setActiveBrandIndex(index)} className={`px-6 py-3 text-luxury-xs transition-all duration-300 relative ${index === activeBrandIndex ? 'text-foreground' : 'text-taupe hover:text-foreground'}`}>
              {brand.name}
              {index === activeBrandIndex && <motion.div layoutId="activeLabel" className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
            </button>)}
        </div>
      </div>

      <Footer />
    </div>;
};
export default Discover;