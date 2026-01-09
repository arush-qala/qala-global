import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Heart, MessageCircle } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import { brands } from '@/data/brands';
import LookbookScroll from '@/components/brand/LookbookScroll';
import heroDoodlage from '@/assets/images/home/hero-doodlage.jpg';
import heroItuvana from '@/assets/images/home/hero-ituvana.jpg';
import heroKharaKapas from '@/assets/images/home/hero-khara-kapas.jpg';
import heroNaushadAli from '@/assets/images/home/hero-naushad-ali.jpg';
import heroCapisvirleo from '@/assets/images/home/hero-capisvirleo.jpg';

const heroImages: Record<string, string> = {
  'doodlage': heroDoodlage,
  'ituvana': heroItuvana,
  'khara-kapas': heroKharaKapas,
  'naushad-ali': heroNaushadAli,
  'capisvirleo': heroCapisvirleo,
  'asaii': heroDoodlage,
  'margn': heroKharaKapas,
  'akhl-studio': heroNaushadAli,
};

// Lookbook images for each brand from public folder
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

const BrandStorefront = () => {
  const { slug } = useParams<{ slug: string }>();
  const brand = brands.find(b => b.slug === slug);

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Brand not found</p>
      </div>
    );
  }

  const heroImage = heroImages[brand.slug] || heroDoodlage;

  // Mock collections data for "More Collections" section
  const moreCollections = [
    { name: 'Autumn Whispers', season: 'Fall Winter', image: (brandLookbookImages[slug || ''] || brandLookbookImages['asaii'])[0] },
    { name: 'Urban Nomad', season: 'Spring Summer', image: (brandLookbookImages[slug || ''] || brandLookbookImages['asaii'])[2] },
    { name: 'Minimalist Dreams', season: 'Trans Seasonal', image: (brandLookbookImages[slug || ''] || brandLookbookImages['asaii'])[4] },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <Link 
        to="/discover"
        className="fixed top-8 left-8 z-50 flex items-center gap-2 text-primary-foreground hover:text-gold transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-luxury-sm">Back</span>
      </Link>

      {/* Hero Section - Full Screen Image */}
      <section className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={brand.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-charcoal via-deep-charcoal/40 to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="absolute inset-0 flex items-end pb-24 px-8 lg:px-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="max-w-3xl"
          >
            <span className="text-gold text-luxury-label mb-4 block">
              {brand.location}
            </span>
            <h1 className="font-serif text-7xl lg:text-9xl font-light text-primary-foreground mb-6">
              {brand.name}
            </h1>
            <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8 max-w-xl">
              {brand.description}
            </p>
            
            {/* Feature Tags */}
            <div className="flex flex-wrap gap-3 mb-8">
              {brand.tags.map((tag) => (
                <span 
                  key={tag} 
                  className="px-4 py-2 border border-primary-foreground/30 text-primary-foreground text-luxury-xs"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Play Brand Film CTA */}
            <button className="group flex items-center gap-4 px-8 py-4 bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 hover:bg-primary-foreground/20 transition-all">
              <Play className="w-5 h-5 text-primary-foreground" fill="currentColor" />
              <span className="text-primary-foreground text-luxury-sm">Play Brand Film</span>
            </button>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="absolute top-8 right-8 flex gap-4">
          <button className="p-3 bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all">
            <Heart className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
          </button>
          <button className="p-3 bg-primary-foreground/10 backdrop-blur-sm hover:bg-primary-foreground/20 transition-all">
            <MessageCircle className="w-5 h-5 text-primary-foreground" strokeWidth={1.5} />
          </button>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-32 px-8 lg:px-16 bg-background">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl lg:text-5xl font-light mb-8"
          >
            The Story
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground text-lg leading-loose"
          >
            {brand.story}
          </motion.p>
        </div>
      </section>

      {/* Lookbook Horizontal Scroll */}
      <LookbookScroll images={brandLookbookImages[slug || ''] || brandLookbookImages['asaii']} slug={slug || ''} />

      {/* Visual Story - The Process */}
      <section className="py-32 px-8 lg:px-16 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
            <div className="lg:col-span-1">
              <h3 className="font-serif text-4xl font-light mb-6">The Process</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every piece is crafted with intention, honoring traditional techniques 
                while embracing sustainable innovation. From sourcing to stitching, 
                we ensure ethical practices at every step.
              </p>
            </div>
            <div className="lg:col-span-2 grid grid-cols-2 gap-4">
              {(brandLookbookImages[slug || ''] || brandLookbookImages['asaii']).slice(0, 4).map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="aspect-square overflow-hidden"
                >
                  <img
                    src={img}
                    alt={`Process ${index + 1}`}
                    className="w-full h-full object-cover img-luxury"
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Sustainability Tags */}
          <div className="flex flex-wrap justify-center gap-8">
            {[
              { icon: '♻️', label: 'Ethical Sourcing' },
              { icon: '🌿', label: 'Natural Dyes' },
              { icon: '👐', label: 'Handcrafted' },
              { icon: '🌍', label: 'Carbon Neutral' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-luxury-label">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* More Collections Section */}
      <section className="py-24 px-8 lg:px-16 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl lg:text-5xl font-light"
            >
              More Collections
            </motion.h2>
            <Link to={`/brands/${slug}/collections`} className="text-luxury-xs text-muted-foreground hover:text-gold transition-colors tracking-widest">
              VIEW ALL
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {moreCollections.map((collection, index) => (
              <motion.div
                key={collection.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="aspect-[3/4] overflow-hidden mb-4">
                  <img
                    src={collection.image}
                    alt={collection.name}
                    className="w-full h-full object-cover img-luxury group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <h3 className="font-serif text-2xl font-light mb-2 text-center">{collection.name}</h3>
                <p className="text-luxury-xs text-muted-foreground text-center tracking-widest">{collection.season.toUpperCase()}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BrandStorefront;
