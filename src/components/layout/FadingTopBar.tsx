import { useState, useEffect, ReactNode } from 'react';

interface FadingTopBarProps {
  children: ReactNode;
  className?: string;
  fadeStartPx?: number;
  fadeEndPx?: number;
}

/**
 * A top bar that fades out as user scrolls down and fades back in when scrolling to top.
 * Used on pages where a Back button would otherwise awkwardly overlay imagery.
 */
const FadingTopBar = ({ 
  children, 
  className = '',
  fadeStartPx = 50,
  fadeEndPx = 200
}: FadingTopBarProps) => {
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      if (scrollY <= fadeStartPx) {
        setOpacity(1);
      } else if (scrollY >= fadeEndPx) {
        setOpacity(0);
      } else {
        // Linear interpolation between fadeStart and fadeEnd
        const progress = (scrollY - fadeStartPx) / (fadeEndPx - fadeStartPx);
        setOpacity(1 - progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fadeStartPx, fadeEndPx]);

  return (
    <div 
      className={`fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-8 lg:px-16 transition-opacity duration-300 ${className}`}
      style={{ 
        opacity,
        pointerEvents: opacity === 0 ? 'none' : 'auto'
      }}
    >
      {children}
    </div>
  );
};

export default FadingTopBar;
