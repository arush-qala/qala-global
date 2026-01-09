import { motion } from 'framer-motion';
import { ArrowLeft, Package, ShoppingCart, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAssortment } from '@/contexts/AssortmentContext';

// CTA Card Component
const CTACard = ({ 
  icon: Icon, 
  title, 
  description, 
  onClick,
}: { 
  icon: React.ElementType;
  title: string;
  description: string;
  onClick: () => void;
}) => (
  <motion.button
    onClick={onClick}
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className="text-left p-8 border border-border bg-background hover:border-gold/50 
               transition-all duration-300 group relative overflow-hidden"
  >
    {/* Background gradient on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 
                    group-hover:opacity-100 transition-opacity duration-500" />
    
    <div className="relative z-10">
      <div className="w-14 h-14 bg-gold/10 flex items-center justify-center mb-6 
                      group-hover:bg-gold/20 transition-colors duration-300">
        <Icon className="w-7 h-7 text-gold" />
      </div>
      <h3 className="font-serif text-2xl mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
      
      {/* Arrow indicator */}
      <div className="mt-6 flex items-center gap-2 text-gold opacity-0 group-hover:opacity-100 
                      translate-x-0 group-hover:translate-x-2 transition-all duration-300">
        <span className="text-luxury-xs tracking-widest">EXPLORE</span>
        <ArrowLeft className="w-4 h-4 rotate-180" />
      </div>
    </div>
  </motion.button>
);

const Experience = () => {
  const { products, lastCollectionUrl } = useAssortment();
  const navigate = useNavigate();

  const handleBack = () => {
    if (lastCollectionUrl) {
      navigate(lastCollectionUrl);
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-8 py-6">
          <button 
            onClick={handleBack}
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-luxury-sm tracking-widest uppercase">Back to Collection</span>
          </button>
          
          <span className="text-luxury-sm tracking-widest">
            {products.length} STYLES IN YOUR SELECTION
          </span>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-32 pb-16 px-8 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="font-serif text-4xl lg:text-5xl text-center mb-4">
            How Would You Like to Proceed?
          </h1>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-16">
            Your curated selection is ready. Choose how you'd like to experience these pieces.
          </p>

          {/* Selection Preview */}
          {products.length > 0 && (
            <div className="flex justify-center gap-2 mb-16">
              {products.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="w-16 h-16 border border-border overflow-hidden"
                >
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </motion.div>
              ))}
              {products.length > 8 && (
                <div className="w-16 h-16 border border-border flex items-center justify-center bg-muted">
                  <span className="text-muted-foreground text-sm">+{products.length - 8}</span>
                </div>
              )}
            </div>
          )}

          {/* CTA Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CTACard
              icon={Package}
              title="Order Sample Crate"
              description="Test fabric and quality before committing. Select up to 5 pieces for physical sampling at your boutique."
              onClick={() => navigate('/experience/sample-crate')}
            />
            <CTACard
              icon={ShoppingCart}
              title="Place B2B Order"
              description="Ready to stock? Enter quantities per size in our order matrix. Tiered bulk pricing applies."
              onClick={() => navigate('/experience/b2b-order')}
            />
            <CTACard
              icon={Calendar}
              title="Private Showcase"
              description="White-glove service. Our team brings the collection directly to your boutique for a trunk show experience."
              onClick={() => navigate('/experience/private-showcase')}
            />
            <CTACard
              icon={MapPin}
              title="Trade Show RSVP"
              description="Prefer to see in person? RSVP for our booth appointments at upcoming fashion weeks and trade events."
              onClick={() => navigate('/experience/trade-show')}
            />
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Experience;
