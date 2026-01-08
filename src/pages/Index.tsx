import { useState } from 'react';
import Header from '@/components/layout/Header';
import HeroCarousel from '@/components/home/HeroCarousel';
import StatementOverlay from '@/components/home/StatementOverlay';
import BrandTimeline from '@/components/home/BrandTimeline';

const Index = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Header variant="transparent" />
      
      {/* Hero Section */}
      <section className="relative h-screen">
        <HeroCarousel 
          currentIndex={currentSlideIndex}
          onSlideChange={setCurrentSlideIndex}
        />
        <StatementOverlay currentSlideIndex={currentSlideIndex} />
      </section>

      {/* Brand Timeline */}
      <BrandTimeline 
        currentIndex={currentSlideIndex}
        onIndexChange={setCurrentSlideIndex}
      />
    </div>
  );
};

export default Index;
