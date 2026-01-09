import { useRef, useEffect, useState } from 'react';
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
  const stickyRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);
  const [hasReachedEnd, setHasReachedEnd] = useState(false);

  // Calculate the total scroll distance needed
  // Each image is 1/3 viewport width, CTA slide is 1 viewport width
  // We want the CTA to be centered when scroll ends
  useEffect(() => {
    if (containerRef.current) {
      // Total content: images (each 33.33vw) + CTA (100vw)
      // We need enough scroll distance to reveal all images + center the CTA
      const imagesWidth = images.length * (window.innerWidth / 3);
      // Add viewport height for scroll distance
      setContainerHeight(imagesWidth + window.innerHeight * 0.5);
    }
  }, [images.length]);

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
    stickyElement.addEventListener('wheel', handleWheel, {
      passive: false
    });
    return () => stickyElement.removeEventListener('wheel', handleWheel);
  }, []);
  const {
    scrollYProgress
  } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Track when we've reached the end
  useMotionValueEvent(scrollYProgress, "change", latest => {
    setHasReachedEnd(latest >= 0.98);
  });

  // Calculate max scroll: images take (n * 33.33vw), CTA takes 100vw
  // We want to stop when CTA is centered (shifted by 50vw from right edge)
  const totalImagesWidth = images.length * (100 / 3);
  // Stop when CTA button is centered - don't scroll past that point
  const maxScroll = totalImagesWidth;
  const x = useTransform(scrollYProgress, [0, 1], ['0%', `-${maxScroll}%`]);
  return <section ref={containerRef} className="relative bg-sand" style={{
    height: `${containerHeight}px`
  }}>
      {/* Sticky container - reduced height (70vh instead of 100vh) */}
      <div ref={stickyRef} className="sticky top-0 h-[70vh] overflow-hidden flex flex-col">
        {/* Header */}
        <motion.h3 initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true
      }} className="text-luxury-label text-center py-6 text-2xl">
          FEATURED LOOKBOOK 
        </motion.h3>

        {/* Horizontal scroll container */}
        <div className="flex-1 relative overflow-hidden">
          <motion.div className="flex h-full absolute top-0 left-0" style={{
          x
        }}>
            {images.map((img, index) => <div key={index} className="h-full flex-shrink-0 relative group cursor-pointer" style={{
            width: `${100 / 3}vw`
          }}>
                <img src={img} alt={`Look ${index + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-all duration-500 flex items-end p-6">
                  <span className="text-primary-foreground text-luxury-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    Look {String(index + 1).padStart(2, '0')}
                  </span>
                </div>
              </div>)}
            
            {/* Final slide with CTA */}
            <div className="w-screen h-full flex-shrink-0 flex items-center justify-center px-4 lg:px-16">
              <div className="text-center">
                <h4 className="font-serif text-3xl lg:text-4xl font-light mb-8">
                  Explore the Full Collection
                </h4>
                <Link to={`/brands/${slug}/collections/spring-24`} className="btn-luxury inline-flex items-center gap-3">
                  View Full Collection
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, index) => <ProgressDot key={index} index={index} total={images.length} scrollProgress={scrollYProgress} />)}
          <ProgressDot index={images.length} total={images.length + 1} scrollProgress={scrollYProgress} />
        </div>

        {/* Scroll hint - hide when reached end */}
        <motion.div className="absolute bottom-6 right-8 text-luxury-xs text-muted-foreground" animate={{
        opacity: hasReachedEnd ? 0 : 1
      }}>
          Scroll to explore
        </motion.div>
      </div>
    </section>;
};

// Progress dot component
const ProgressDot = ({
  index,
  total,
  scrollProgress
}: {
  index: number;
  total: number;
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) => {
  const start = index / total;
  const end = (index + 1) / total;
  const opacity = useTransform(scrollProgress, [start, end], [0.3, 1]);
  const scale = useTransform(scrollProgress, [start, end], [1, 1.5]);
  return <motion.div className="w-2 h-2 rounded-full bg-charcoal" style={{
    opacity,
    scale
  }} />;
};
export default LookbookScroll;