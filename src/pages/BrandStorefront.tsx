import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, Leaf, Droplets, Hand, Globe } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import CTAGuidance from '@/components/layout/CTAGuidance';
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

      {/* Back Button */}
      <Link to="/discover" className="fixed top-8 left-8 z-50 flex items-center gap-2 text-primary-foreground hover:text-gold transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm tracking-widest uppercase">Back</span>
      </Link>

      {/* Hero Section - Full Screen Image (No Text) */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
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
      }} className="max-w-4xl mx-auto text-center">
          <span className="text-gold text-luxury-label mb-4 block">
            {brandLocation}
          </span>
          <h1 className="font-serif text-5xl lg:text-7xl font-light mb-6">
            {brandName}
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
            {brandDescription}
          </p>
        </motion.div>
      </section>

      {/* Brand Story Section */}
      

      {/* Lookbook Horizontal Scroll */}
      <LookbookScroll images={brandLookbookImages[slug || ''] || brandLookbookImages['asaii']} slug={slug || ''} />

      {/* Visual Story - The Process (3 Column Layout) */}
      <section className="py-32 bg-background">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 items-center">
          {/* Left Image - Edge to Edge */}
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

          {/* Right Image - Edge to Edge */}
          <div className="aspect-[3/4] overflow-hidden">
            <img src={(brandLookbookImages[slug || ''] || brandLookbookImages['asaii'])[1]} alt="Process 2" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* Geotags - Monochrome Icons with Labels Below */}
        <div className="flex flex-wrap justify-center gap-16 mt-16 px-8">
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
        }].map(item => <div key={item.label} className="flex flex-col items-center gap-3">
              <item.icon className="w-10 h-10 text-foreground stroke-1" />
              <span className="text-luxury-label text-center">{item.label}</span>
            </div>)}
        </div>
      </section>

      {/* More Collections Section - Full Width */}
      <section className="py-24 bg-background">
        <div className="px-8 lg:px-16 mb-12">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
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
                <div className="px-6">
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