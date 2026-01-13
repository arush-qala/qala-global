import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LookbookScrollProps {
  images: string[];
  slug: string;
}

const LookbookScroll = ({
  images,
  slug
}: LookbookScrollProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const [endSpacerPx, setEndSpacerPx] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);
  const [containerHeight, setContainerHeight] = useState('100vh');

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

  // Compute container height based on scroll width (for scroll hijacking)
  const computeContainerHeight = useCallback(() => {
    if (!scrollRef.current) return;
    
    const maxScrollLeft = scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
    // Container height = viewport height + horizontal scroll range
    // This creates a scrollable "runway" that maps to horizontal scroll
    const totalHeight = window.innerHeight + maxScrollLeft;
    setContainerHeight(`${totalHeight}px`);
    
    console.log('[LookbookScroll] Container height computed:', {
      maxScrollLeft,
      totalHeight
    });
  }, []);

  useEffect(() => {
    // Initial computation
    const timer = setTimeout(() => {
      computeEndSpacer();
      // Delay container height calc to ensure endSpacer is set
      setTimeout(computeContainerHeight, 50);
    }, 100);
    
    const handleResize = () => {
      computeEndSpacer();
      setTimeout(computeContainerHeight, 50);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, [computeEndSpacer, computeContainerHeight]);

  // Re-compute when images change
  useEffect(() => {
    computeEndSpacer();
    setTimeout(computeContainerHeight, 50);
  }, [images.length, computeEndSpacer, computeContainerHeight]);

  // Scroll hijacking: Convert vertical scroll to horizontal scroll
  useEffect(() => {
    const section = sectionRef.current;
    const scrollContainer = scrollRef.current;
    if (!section || !scrollContainer) return;

    const handleScroll = () => {
      const rect = section.getBoundingClientRect();
      const stickyContainer = section.querySelector('[data-sticky-container]') as HTMLElement;
      
      if (!stickyContainer) return;
      
      const maxScrollLeft = scrollContainer.scrollWidth - scrollContainer.clientWidth;
      
      // Calculate how much we've scrolled past the section top
      // rect.top is negative when we've scrolled past the top
      const scrolledPast = Math.max(0, -rect.top);
      
      // Map vertical scroll to horizontal scroll
      const horizontalScroll = Math.min(scrolledPast, maxScrollLeft);
      scrollContainer.scrollLeft = horizontalScroll;
      
      // Update progress
      if (maxScrollLeft > 0) {
        const progress = horizontalScroll / maxScrollLeft;
        setScrollProgress(progress);
        setHasReachedEnd(progress >= 0.98);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [containerHeight]);

  // Prevent manual horizontal scroll (it's now driven by vertical scroll)
  useEffect(() => {
    const scrollElement = scrollRef.current;
    if (!scrollElement) return;
    
    const handleWheel = (e: WheelEvent) => {
      // Prevent horizontal wheel scroll - vertical scroll drives everything
      if (Math.abs(e.deltaX) > 0) {
        e.preventDefault();
      }
    };
    
    scrollElement.addEventListener('wheel', handleWheel, { passive: false });
    return () => scrollElement.removeEventListener('wheel', handleWheel);
  }, []);

  const totalSlides = images.length + 1; // images + CTA

  return (
    <section 
      ref={sectionRef} 
      className="relative bg-sand"
      style={{ height: containerHeight }}
    >
      {/* Sticky container - pinned to viewport during scroll hijack */}
      <div 
        data-sticky-container
        className="sticky top-0 h-screen flex flex-col"
      >
        {/* Header - Matches "More Collections" heading style exactly */}
        <motion.h2
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-left py-8 text-3xl font-serif font-normal tracking-tight flex-shrink-0 px-8 lg:px-16"
        >
          Latest Collection
        </motion.h2>

        {/* Horizontal scroll container - scroll driven by vertical scroll */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-hidden"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`
            [data-sticky-container] [class*="overflow-hidden"]::-webkit-scrollbar {
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
        <div className="flex justify-center py-6 flex-shrink-0">
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
      </div>
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
