import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LookbookScrollProps {
  images: string[];
  slug: string;
}

const LookbookScroll = ({
  images,
  slug
}: LookbookScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [endSpacerPx, setEndSpacerPx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  // Compute end spacer to center CTA at scroll end
  const computeEndSpacer = useCallback(() => {
    if (!scrollRef.current || !ctaRef.current) return;
    
    const scrollWidth = scrollRef.current.clientWidth;
    const ctaWidth = ctaRef.current.clientWidth;
    const spacer = Math.max(0, (scrollWidth / 2) - (ctaWidth / 2));
    
    setEndSpacerPx(spacer);
    
    // Debug logging
    const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    console.log('[LookbookScroll] Debug:', {
      'scrollRef.clientWidth': scrollWidth,
      'ctaRef.clientWidth': ctaWidth,
      'endSpacerPx': spacer,
      'maxScrollLeft': maxScrollLeft
    });
  }, []);

  useEffect(() => {
    // Initial computation
    const timer = setTimeout(computeEndSpacer, 100);
    
    window.addEventListener('resize', computeEndSpacer);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', computeEndSpacer);
    };
  }, [computeEndSpacer]);

  // Re-compute when images change
  useEffect(() => {
    computeEndSpacer();
  }, [images.length, computeEndSpacer]);

  // Track scroll progress for indicators
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;

    const handleScroll = () => {
      const maxScroll = scrollElement.scrollWidth - scrollElement.clientWidth;
      if (maxScroll > 0) {
        const progress = scrollElement.scrollLeft / maxScroll;
        setScrollProgress(progress);
        setHasReachedEnd(progress >= 0.98);
      }
    };

    scrollElement.addEventListener('scroll', handleScroll, { passive: true });
    return () => scrollElement.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent horizontal scroll from triggering browser back
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    
    const handleWheel = (e: WheelEvent) => {
      // If horizontal scroll detected, prevent default to avoid browser back
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();
        scrollElement.scrollLeft += e.deltaX;
      }
    };
    
    scrollElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => scrollElement.removeEventListener('wheel', handleWheel);
  }, []);

  const totalSlides = images.length + 1; // images + CTA

  return (
    <section ref={containerRef} className="relative bg-sand">
      {/* Header */}
      <motion.h3
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-luxury-label text-center py-6 text-2xl"
      >
        FEATURED LOOKBOOK
      </motion.h3>

      {/* Horizontal scroll container - actual overflow scroll */}
      <div
        ref={scrollRef}
        className="h-[60vh] overflow-x-auto overflow-y-hidden scroll-smooth"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`
          div[class*="overflow-x-auto"]::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        <div className="flex h-full" style={{ paddingRight: 0 }}>
          {/* Image slides */}
          {images.map((img, index) => (
            <div
              key={index}
              className="h-full flex-shrink-0 relative group cursor-pointer"
              style={{
                width: `${100 / 3}vw`,
                scrollSnapAlign: 'start',
              }}
            >
              <img
                src={img}
                alt={`Look ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-all duration-500 flex items-end p-6">
                <span className="text-primary-foreground text-luxury-xs opacity-0 group-hover:opacity-100 transition-opacity">
                  Look {String(index + 1).padStart(2, '0')}
                </span>
              </div>
            </div>
          ))}

          {/* CTA slide */}
          <div
            ref={ctaRef}
            className="h-full flex-shrink-0 flex items-center justify-center px-4 lg:px-16"
            style={{
              width: '100vw',
              scrollSnapAlign: 'center',
            }}
          >
            <div className="text-center">
              <h4 className="font-serif text-3xl lg:text-4xl font-light mb-8">
                Explore the Full Collection
              </h4>
              <Link
                to={`/brands/${slug}/collections/spring-24`}
                className="btn-luxury inline-flex items-center gap-3"
              >
                View Full Collection
              </Link>
            </div>
          </div>

          {/* Computed end spacer - ensures CTA centers exactly at scroll end */}
          <div
            aria-hidden="true"
            style={{
              width: endSpacerPx,
              flexShrink: 0,
              flexGrow: 0,
            }}
          />
        </div>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center py-6">
        <div className="flex items-center gap-2">
          {images.map((_, index) => (
            <ProgressDotSimple
              key={index}
              index={index}
              total={totalSlides}
              progress={scrollProgress}
            />
          ))}
          <ProgressDotSimple
            index={images.length}
            total={totalSlides}
            progress={scrollProgress}
          />
        </div>
      </div>

      {/* Scroll hint - hide when reached end */}
      <motion.div
        className="absolute bottom-6 right-8 text-luxury-xs text-muted-foreground"
        animate={{ opacity: hasReachedEnd ? 0 : 1 }}
      >
        Scroll to explore
      </motion.div>
    </section>
  );
};

// Simple progress dot component for actual scroll-based progress
const ProgressDotSimple = ({
  index,
  total,
  progress
}: {
  index: number;
  total: number;
  progress: number;
}) => {
  const start = index / total;
  const end = (index + 1) / total;
  
  // Calculate opacity and scale based on progress
  const isActive = progress >= start && progress < end;
  const isPast = progress >= end;
  const opacity = isActive ? 1 : isPast ? 0.6 : 0.3;
  const scale = isActive ? 1.5 : 1;

  return (
    <div
      className="w-2 h-2 rounded-full bg-charcoal transition-all duration-300"
      style={{
        opacity,
        transform: `scale(${scale})`,
      }}
    />
  );
};

export default LookbookScroll;