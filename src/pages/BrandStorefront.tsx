import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Leaf, Droplets, Hand, Globe } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import CTAGuidance from '@/components/layout/CTAGuidance';

import BackButton from '@/components/ui/back-button';
import { brands } from '@/data/brands';
import LookbookScroll from '@/components/brand/LookbookScroll';
import { useCollectionsByBrand } from '@/hooks/useCollections';
import { useBrand } from '@/hooks/useBrands';

// Hero images from GitHub repo - using public folder paths
const heroImages: Record<string, string> = {
  'doodlage': '/images/home/Q_BB_Doodlage.png',
  'ituvana': '/images/home/Q_BB_Ituvana.png',
  'khara-kapas': '/images/home/Q_BB_Khara_Kapas.png',
  'naushad-ali': '/images/home/Q_BB_NaushadAli.png',
  'capisvirleo': '/images/home/Q_BB_Capisvirleo.png',
  'asaii': '/images/home/Q_BB_Doodlage.png',
  'margn': '/images/home/Q_BB_Khara_Kapas.png',
  'akhl-studio': '/images/home/Q_BB_NaushadAli.png',
  'akhl_studio': '/images/home/Q_BB_NaushadAli.png'
};

// Lookbook images for each brand - using real lookbook pages for Doodlage and Margn
const brandLookbookImages: Record<string, string[]> = {
  'asaii': ['/images/discover/asaii/1.webp', '/images/discover/asaii/2.webp', '/images/discover/asaii/3.webp', '/images/discover/asaii/4.webp', '/images/discover/asaii/5.webp', '/images/discover/asaii/6.webp'],
  'doodlage': ['/lookbooks/doodlage/page-01.jpg', '/lookbooks/doodlage/page-02.jpg', '/lookbooks/doodlage/page-03.jpg', '/lookbooks/doodlage/page-04.jpg', '/lookbooks/doodlage/page-05.jpg', '/lookbooks/doodlage/page-06.jpg', '/lookbooks/doodlage/page-07.jpg', '/lookbooks/doodlage/page-08.jpg'],
  'margn': ['/lookbooks/margn/page-01.jpg', '/lookbooks/margn/page-02.jpg', '/lookbooks/margn/page-03.jpg', '/lookbooks/margn/page-04.jpg', '/lookbooks/margn/page-05.jpg', '/lookbooks/margn/page-06.jpg', '/lookbooks/margn/page-07.jpg', '/lookbooks/margn/page-08.jpg'],
  'akhl-studio': ['/images/discover/akhl-studio/1.webp', '/images/discover/akhl-studio/2.webp', '/images/discover/akhl-studio/3.webp', '/images/discover/akhl-studio/4.webp', '/images/discover/akhl-studio/5.webp', '/images/discover/akhl-studio/6.webp'],
  'akhl_studio': ['/images/discover/akhl-studio/1.webp', '/images/discover/akhl-studio/2.webp', '/images/discover/akhl-studio/3.webp', '/images/discover/akhl-studio/4.webp', '/images/discover/akhl-studio/5.webp', '/images/discover/akhl-studio/6.webp'],
  'ituvana': ['/images/discover/ituvana/1.webp', '/images/discover/ituvana/2.webp', '/images/discover/ituvana/3.webp', '/images/discover/ituvana/4.webp', '/images/discover/ituvana/5.webp', '/images/discover/ituvana/6.webp']
};
const BrandStorefront = () => {
  const {
    slug
  } = useParams<{
    slug: string;
  }>();
  const location = useLocation();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Fetch data from database
  const {
    data: dbCollections,
    isLoading: collectionsLoading
  } = useCollectionsByBrand(slug || '');
  const {
    data: dbBrand
  } = useBrand(slug || '');

  // Fallback to static data
  const staticBrand = brands.find(b => b.slug === slug);

  // Unified brand data
  const brandName = dbBrand?.name || staticBrand?.name || 'Brand';
  const brandDescription = dbBrand?.description || staticBrand?.description || '';
  const brandStory = dbBrand?.brand_story || staticBrand?.story || '';
  const brandLocation = staticBrand?.location || 'India';
  if (!dbBrand && !staticBrand) {
    return <div className="min-h-screen flex items-center justify-center">
        <p>Brand not found</p>
      </div>;
  }
  const heroImage = heroImages[slug || ''] || '/images/home/Q_BB_Doodlage.png';

  // Use DB collections or fallback mock data
  const moreCollections = dbCollections && dbCollections.length > 0 ? dbCollections.slice(0, 3).map(c => ({
    name: c.title,
    handle: c.handle,
    season: c.seasonality || 'Trans Seasonal',
    image: c.thumbnail_image || (brandLookbookImages[slug || ''] || brandLookbookImages['asaii'])[0]
  })) : [{
    name: 'Autumn Whispers',
    handle: 'autumn-whispers',
    season: 'Fall Winter',
    image: (brandLookbookImages[slug || ''] || brandLookbookImages['asaii'])[0]
  }, {
    name: 'Urban Nomad',
    handle: 'urban-nomad',
    season: 'Spring Summer',
    image: (brandLookbookImages[slug || ''] || brandLookbookImages['asaii'])[2]
  }, {
    name: 'Minimalist Dreams',
    handle: 'minimalist-dreams',
    season: 'Trans Seasonal',
    image: (brandLookbookImages[slug || ''] || brandLookbookImages['asaii'])[4]
  }];
  return <div className="min-h-screen bg-background">
      {/* CTA Guidance */}
      <CTAGuidance message="Scroll to explore the brand's story → Browse featured looks and collections" />

      {/* Top Bar - Sticky, always visible */}
      <div className="sticky top-0 z-50 w-full h-14 bg-background flex items-center px-8 lg:px-16 border-b border-border">
        <BackButton to="/discover" />
      </div>

      {/* Hero Section - Full Screen Image with Consistent Margins */}
      <section className="relative h-screen px-8 lg:px-16">
        <div className="h-full overflow-hidden rounded-none">
          <img src={heroImage} alt={brandName} className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Brand Name & Description - Below Hero */}
      <section className="py-16 px-8 lg:px-16 bg-background">
        <motion.div initial={{
        opacity: 0,
        y: 40
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }} className="max-w-6xl mx-auto text-center">
          <span className="text-gold text-luxury-label mb-4 block">
            {brandLocation}
          </span>
          <h1 className="font-serif text-5xl lg:text-7xl font-light mb-6">
            {brandName}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl mx-auto">
            {brandDescription}
          </p>
        </motion.div>
      </section>

      {/* Latest Collection Section */}
      <section className="pt-24 pb-0 px-8 lg:px-16 bg-sand">
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="font-serif text-4xl lg:text-5xl font-light"
        >
          Latest Collection
        </motion.h2>
      </section>

      {/* Lookbook Horizontal Scroll */}
      <LookbookScroll images={brandLookbookImages[slug || ''] || brandLookbookImages['asaii']} slug={slug || ''} />

      {/* Visual Story - The Process (3 Column Layout) */}
      <section className="py-32 px-8 lg:px-16 bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-center">
          {/* Left Image */}
          <div className="aspect-[3/4] overflow-hidden">
            <img src={(brandLookbookImages[slug || ''] || brandLookbookImages['asaii'])[0]} alt="Process 1" className="w-full h-full object-cover" />
          </div>

          {/* Center Text */}
          <div className="px-12 py-12 lg:py-0 text-center">
            <h3 className="font-serif text-4xl font-light mb-6">The Process</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every piece is crafted with intention, honoring traditional techniques
              while embracing sustainable innovation. From sourcing to stitching,
              we ensure ethical practices at every step.
            </p>
          </div>

          {/* Right Image */}
          <div className="aspect-[3/4] overflow-hidden">
            <img src={(brandLookbookImages[slug || ''] || brandLookbookImages['asaii'])[1]} alt="Process 2" className="w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* Full-Width Media Block - Edge to Edge (Intentional Contrast) */}
      <section className="relative w-full">
        <div className="aspect-video lg:aspect-[21/9] w-full overflow-hidden bg-charcoal">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
            poster={(brandLookbookImages[slug || ''] || brandLookbookImages['asaii'])[2]}
          >
            <source src="/videos/default.mp4" type="video/mp4" />
          </video>
          {/* Play button overlay for when video doesn't autoplay */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-20 h-20 rounded-full border-2 border-primary-foreground/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary-foreground border-b-8 border-b-transparent ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Geotags Section - With Consistent Margins */}
      <section className="py-24 px-8 lg:px-16 bg-background">
        <div className="flex flex-wrap justify-center gap-16">
          {[{
            icon: Leaf,
            label: 'Ethical Sourcing'
          }, {
            icon: Droplets,
            label: 'Natural Dyes'
          }, {
            icon: Hand,
            label: 'Handcrafted'
          }, {
            icon: Globe,
            label: 'Carbon Neutral'
          }].map(item => (
            <div key={item.label} className="flex flex-col items-center gap-3">
              <item.icon className="w-10 h-10 text-foreground stroke-1" />
              <span className="text-luxury-label text-center">{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* More Collections Section - Full Width */}
      <section className="py-24 px-8 lg:px-16 bg-background">
        <div className="mb-12">
          <motion.h2 initial={{
          opacity: 0,
          y: 20
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true
        }} className="font-serif text-4xl lg:text-5xl font-light">
            More Collections
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {moreCollections.map((collection, index) => <Link key={collection.handle || collection.name} to={`/brands/${slug}/collections/${collection.handle || collection.name.toLowerCase().replace(/\s+/g, '-')}`}>
              <motion.div initial={{
            opacity: 0,
            y: 20
          }} whileInView={{
            opacity: 1,
            y: 0
          }} viewport={{
            once: true
          }} transition={{
            delay: index * 0.1
          }} className="group cursor-pointer">
                <div className="aspect-[3/4] overflow-hidden mb-4">
                  <img src={collection.image} alt={collection.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-light mb-2">{collection.name}</h3>
                  <p className="text-luxury-xs text-muted-foreground tracking-widest">{collection.season.toUpperCase()}</p>
                </div>
              </motion.div>
            </Link>)}
        </div>
      </section>

      <Footer />
    </div>;
};
export default BrandStorefront;