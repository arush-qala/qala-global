import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Leaf, Droplets, Hand, Globe } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import CTAGuidance from '@/components/layout/CTAGuidance';

import BackButton from '@/components/ui/back-button';
import TopBar from '@/components/layout/TopBar';
import { brands } from '@/data/brands';
import LookbookScroll from '@/components/brand/LookbookScroll';
import { useCollectionsByBrand } from '@/hooks/useCollections';
import { useBrand } from '@/hooks/useBrands';

// Hero banners from brand-media folder - can be images or videos
const heroBanners: Record<string, { src: string; type: 'image' | 'video' }> = {
  'akhl': { src: '/brand-media/AKHL/First Banner_AKHL.mp4', type: 'video' },
  'asaii': { src: '/brand-media/Asaii/First_Banner_Asaii.mp4', type: 'video' },
  'day-and-age': { src: '/brand-media/Day & Age/Q_BB_Day&Age.png', type: 'image' },
  'doodlage': { src: '/brand-media/Doodlage/First Banner_Doodlage.png', type: 'image' },
  'guapa': { src: '/brand-media/Guapa/First_banner_Guapa.png', type: 'image' },
  'ituvana': { src: '/brand-media/Ituvana/First Banner_Ituvana.mp4', type: 'video' },
  'khara-kapas': { src: '/brand-media/Khara kapas/First Banner_Khara kapas.png', type: 'image' },
  'margn': { src: '/brand-media/Margn/First Banner_Margn.png', type: 'image' },
  'capisvirleo': { src: '/brand-media/capisvirleo/Firstbanner_capisvirleo.png', type: 'image' },
  'ka-sha': { src: '/brand-media/ka sha/First_banner_Kasha.png', type: 'image' },
};

// Process section images (left and right of "The Process" text)
const processImages: Record<string, [string, string]> = {
  'akhl': ['/brand-media/AKHL/Process Image_1_AKHL.png', '/brand-media/AKHL/Process Image_2_AKHL..png'],
  'asaii': ['/brand-media/Asaii/Process Image_1_Asaii.png', '/brand-media/Asaii/Process Image_2_Asaii.png'],
  'day-and-age': ['/brand-media/Day & Age/Q_BTS_Day & Age.png', '/brand-media/Day & Age/Q_BTS_Day & Age (5).png'],
  'doodlage': ['/brand-media/Doodlage/Process _Image_1_Doodlage.png', '/brand-media/Doodlage/Process _Image_2_Doodlage.png'],
  'guapa': ['/brand-media/Guapa/Q_BTS_Guapa (2).png', '/brand-media/Guapa/Q_BTS_Guapa (3).png'],
  'ituvana': ['/brand-media/Ituvana/Process Image_1_Ituvana.png', '/brand-media/Ituvana/Process Image_2_Ituvana.png'],
  'khara-kapas': ['/brand-media/Khara kapas/Q_BTS_kharakapas (2).png', '/brand-media/Khara kapas/Q_BTS_kharakapas (3).png'],
  'margn': ['/brand-media/Margn/Process Image_1_Margn.png', '/brand-media/Margn/Process Image_2_Margn.png'],
  'capisvirleo': ['/brand-media/capisvirleo/Q_BTS_Capisvirleo.png', '/brand-media/capisvirleo/Q_BTS_Capisvirleo (2).png'],
  'ka-sha': ['/brand-media/ka sha/Q_BTS_Kasha.png', '/brand-media/ka sha/Q_BTS_Kasha (4).png'],
};

// Full-width process media (video or image shown below process section)
const fullWidthProcessMedia: Record<string, { src: string; type: 'image' | 'video' }> = {
  'akhl': { src: '/brand-media/AKHL/Full Width Process_AKHL.png', type: 'image' },
  'asaii': { src: '/brand-media/Asaii/Full Width Process_Asaii.png', type: 'image' },
  'day-and-age': { src: '/brand-media/Day & Age/Fullwidth_Process_dayandage.mp4', type: 'video' },
  'doodlage': { src: '/brand-media/Doodlage/Full Width Process_Doodlage.png', type: 'image' },
  'guapa': { src: '/brand-media/Guapa/Full widthProcess_video_Guapa.mp4', type: 'video' },
  'ituvana': { src: '/brand-media/Ituvana/Full Width Process_Ituvana.mp4', type: 'video' },
  'khara-kapas': { src: '/brand-media/Khara kapas/Full width Process_video_kharakapas.mp4', type: 'video' },
  'margn': { src: '/brand-media/Margn/Full Width Process_Margn.mp4', type: 'video' },
  'capisvirleo': { src: '/brand-media/capisvirleo/Process_video_capisvirleo.mp4', type: 'video' },
  'ka-sha': { src: '/brand-media/ka sha/Full width_Process_video_Kasha.mp4', type: 'video' },
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

  // Get brand-specific media with fallbacks
  const heroBanner = heroBanners[slug || ''] || { src: '/images/home/Q_BB_Doodlage.png', type: 'image' as const };
  const brandProcessImages = processImages[slug || ''] || ['/images/home/Q_BB_Doodlage.png', '/images/home/Q_BB_Doodlage.png'];
  const fullWidthMedia = fullWidthProcessMedia[slug || ''] || { src: '/videos/default.mp4', type: 'video' as const };

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
    <TopBar>
      <BackButton to="/discover" />
    </TopBar>

    {/* Hero Section - Full Screen Image/Video with Consistent Margins */}
    <section className="relative h-screen px-8 lg:px-16">
      <div className="h-full overflow-hidden rounded-none">
        {heroBanner.type === 'video' ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={heroBanner.src} type="video/mp4" />
          </video>
        ) : (
          <img src={heroBanner.src} alt={brandName} className="w-full h-full object-cover" />
        )}
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
          <img src={brandProcessImages[0]} alt="Process 1" className="w-full h-full object-cover" />
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
          <img src={brandProcessImages[1]} alt="Process 2" className="w-full h-full object-cover" />
        </div>
      </div>
    </section>

    {/* Full-Width Media Block - Edge to Edge (Intentional Contrast) */}
    <section className="relative w-full">
      <div className="aspect-video lg:aspect-[21/9] w-full overflow-hidden bg-charcoal">
        {fullWidthMedia.type === 'video' ? (
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={fullWidthMedia.src} type="video/mp4" />
          </video>
        ) : (
          <img src={fullWidthMedia.src} alt="Brand Process" className="w-full h-full object-cover" />
        )}
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