import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Package, ShoppingCart, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAssortment } from '@/contexts/AssortmentContext';

// CTA Card Component
// Experience Card Component with hover reveal
const CTACard = ({
  icon: Icon,
  title,
  description,
  onClick,
  isFullWidth = false
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
  isFullWidth?: boolean;
}) => (
  <motion.button 
    onClick={onClick} 
    whileHover={{ y: -8, scale: 1.02 }} 
    whileTap={{ scale: 0.98 }} 
    className={`text-left p-8 border border-border bg-background hover:border-gold/50 
                transition-all duration-300 group relative overflow-hidden ${isFullWidth ? 'w-full' : ''}`}
  >
    {/* Background gradient on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
      <div className="w-14 h-14 bg-gold/10 flex items-center justify-center mb-6 
                      group-hover:bg-gold/20 transition-colors duration-300">
        <Icon className="w-7 h-7 text-gold" />
      </div>
      <h3 className="font-serif mb-3 text-4xl">{title}</h3>
      
      {/* Description with hover reveal */}
      <p className="text-muted-foreground leading-relaxed text-base 
                    opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 
                    transition-all duration-300 ease-out
                    md:opacity-0 md:translate-y-2 
                    max-md:opacity-100 max-md:translate-y-0">
        {description}
      </p>
    </div>
  </motion.button>
);
const Experience = () => {
  const {
    products,
    lastCollectionUrl
  } = useAssortment();
  const navigate = useNavigate();

  // Always scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleBack = () => {
    if (lastCollectionUrl) {
      navigate(lastCollectionUrl);
    } else {
      navigate(-1);
    }
  };
  return <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-8 py-6">
          <button onClick={handleBack} className="flex items-center gap-2 hover:text-gold transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-luxury-sm tracking-widest uppercase text-base">Back to Collection</span>
          </button>
          
          <span className="text-luxury-sm tracking-widest text-base">
            {products.length} STYLES IN YOUR SELECTION
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-32 pb-16 px-8 max-w-6xl mx-auto">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.6
      }}>
          <h1 className="font-serif text-4xl text-center mb-4 lg:text-6xl">How Would You Like to Experience This Brand?</h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16 text-lg">
            Your curated selection is ready. Choose how you'd like to experience these pieces.
          </p>

          {/* Selection Preview */}
          {products.length > 0 && <div className="flex justify-center gap-2 mb-16">
              {products.slice(0, 8).map((product, index) => (
                <div key={product.id || index} className="w-16 h-16 border border-border bg-muted" />
              ))}
              {products.length > 8 && <div className="w-16 h-16 border border-border flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground text-sm">+{products.length - 8}</span>
                </div>}
            </div>}

          {/* Top 3 Experience Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CTACard 
              icon={Package} 
              title="Order Sample Crate" 
              description="Test fabric and quality before committing. Select up to 5 pieces for physical sampling at your boutique." 
              onClick={() => navigate('/experience/sample-crate')} 
            />
            <CTACard 
              icon={Calendar} 
              title="Request Private Showcase" 
              description="White-glove service. Our team brings the collection directly to your boutique for a trunk show experience." 
              onClick={() => navigate('/experience/private-showcase')} 
            />
            <CTACard 
              icon={MapPin} 
              title="Meet at a Tradeshow" 
              description="Prefer to see in person? RSVP for our booth appointments at upcoming fashion weeks and trade events." 
              onClick={() => navigate('/experience/trade-show')} 
            />
          </div>

          {/* B2B Order - Full Width Below */}
          <div className="mt-6">
            <CTACard 
              icon={ShoppingCart} 
              title="Place B2B Order" 
              description="Ready to stock? Enter quantities per size in our order matrix. Tiered bulk pricing applies." 
              onClick={() => navigate('/experience/b2b-order')} 
              isFullWidth={true}
            />
          </div>
        </motion.div>
      </main>
    </div>;
};
export default Experience;