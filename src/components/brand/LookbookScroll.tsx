import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

interface LookbookScrollProps {
  images: string[];
  slug: string;
}

const LookbookScroll = ({ images, slug }: LookbookScrollProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerHeight, setContainerHeight] = useState(0);

  // Calculate the total scroll distance needed
  useEffect(() => {
    if (containerRef.current) {
      const scrollWidth = images.length * window.innerWidth;
      setContainerHeight(scrollWidth);
    }
  }, [images.length]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Transform vertical scroll to horizontal movement
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ['0%', `-${(images.length - 1) * 100}%`]
  );

  return (
    <section
      ref={containerRef}
      className="relative bg-sand"
      style={{ height: `${containerHeight}px` }}
    >
      {/* Sticky container that stays in viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-luxury-label text-center py-8"
        >
          Latest Collection
        </motion.h3>

        {/* Horizontal scroll container */}
        <div className="flex-1 relative overflow-hidden">
          <motion.div
            className="flex h-full absolute top-0 left-0"
            style={{ x }}
          >
            {images.map((img, index) => (
              <div
                key={index}
                className="w-screen h-full flex-shrink-0 flex items-center justify-center px-4 lg:px-16"
              >
                <div className="relative h-[70vh] max-h-[800px] aspect-[3/4] overflow-hidden group cursor-pointer">
                  <img
                    src={img}
                    alt={`Look ${index + 1}`}
                    className="w-full h-full object-cover img-luxury"
                  />
                  <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/40 transition-all duration-500 flex items-end p-6">
                    <span className="text-primary-foreground text-luxury-xs opacity-0 group-hover:opacity-100 transition-opacity">
                      Look {String(index + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Final slide with CTA */}
            <div className="w-screen h-full flex-shrink-0 flex items-center justify-center px-4 lg:px-16">
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
          </motion.div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, index) => (
            <ProgressDot
              key={index}
              index={index}
              total={images.length}
              scrollProgress={scrollYProgress}
            />
          ))}
          <ProgressDot
            index={images.length}
            total={images.length + 1}
            scrollProgress={scrollYProgress}
          />
        </div>

        {/* Scroll hint */}
        <motion.div
          className="absolute bottom-8 right-8 text-luxury-xs text-muted-foreground"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
        >
          Scroll to explore
        </motion.div>
      </div>
    </section>
  );
};

// Progress dot component
const ProgressDot = ({
  index,
  total,
  scrollProgress,
}: {
  index: number;
  total: number;
  scrollProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) => {
  const start = index / total;
  const end = (index + 1) / total;

  const opacity = useTransform(scrollProgress, [start, end], [0.3, 1]);
  const scale = useTransform(scrollProgress, [start, end], [1, 1.5]);

  return (
    <motion.div
      className="w-2 h-2 rounded-full bg-charcoal"
      style={{ opacity, scale }}
    />
  );
};

export default LookbookScroll;
