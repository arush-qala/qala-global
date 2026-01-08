import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowLeft, Plus, Check, X } from 'lucide-react';
import { brands } from '@/data/brands';

import brand1 from '@/assets/images/discover/brand-1.jpg';
import brand2 from '@/assets/images/discover/brand-2.jpg';
import brand3 from '@/assets/images/discover/brand-3.jpg';
import brand4 from '@/assets/images/discover/brand-4.jpg';
import brand5 from '@/assets/images/discover/brand-5.jpg';
import brand6 from '@/assets/images/discover/brand-6.jpg';

const products = [
  { 
    id: '1', 
    name: 'Draped Asymmetric Dress', 
    price: 485, 
    image: brand1, 
    fabricDetails: '100% Organic Silk',
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'An elegant draped dress featuring asymmetric hemline and sustainable silk fabric.'
  },
  { 
    id: '2', 
    name: 'Handwoven Wrap Blouse', 
    price: 295, 
    image: brand2, 
    fabricDetails: 'Handwoven Cotton',
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Minimalist wrap silhouette crafted from artisan handwoven cotton.'
  },
  { 
    id: '3', 
    name: 'Pleated Midi Skirt', 
    price: 320, 
    image: brand3, 
    fabricDetails: 'Recycled Polyester',
    sizes: ['XS', 'S', 'M', 'L'],
    description: 'Flowing pleated skirt made from post-consumer recycled materials.'
  },
  { 
    id: '4', 
    name: 'Embroidered Jacket', 
    price: 650, 
    image: brand4, 
    fabricDetails: 'Silk Brocade',
    sizes: ['S', 'M', 'L'],
    description: 'Statement jacket featuring hand-embroidered details and traditional brocade.'
  },
  { 
    id: '5', 
    name: 'Evening Gown', 
    price: 890, 
    image: brand5, 
    fabricDetails: 'Mulberry Silk',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Show-stopping evening gown in rich mulberry silk with dramatic silhouette.'
  },
  { 
    id: '6', 
    name: 'Tailored Suit Set', 
    price: 720, 
    image: brand6, 
    fabricDetails: 'Italian Wool Blend',
    sizes: ['S', 'M', 'L'],
    description: 'Contemporary tailored suit featuring pinstripe detail and relaxed fit.'
  },
];

const CollectionDetail = () => {
  const { slug, collectionSlug } = useParams<{ slug: string; collectionSlug: string }>();
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [assortment, setAssortment] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const brand = brands.find(b => b.slug === slug);
  const selectedProduct = products.find(p => p.id === selectedProductId);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-85%"]);

  const handleSelectStyle = (productId: string) => {
    if (assortment.includes(productId)) {
      setAssortment(assortment.filter(id => id !== productId));
    } else {
      setAssortment([...assortment, productId]);
    }
  };

  const isInAssortment = (productId: string) => assortment.includes(productId);

  if (!brand) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Brand not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
        <div className="flex items-center justify-between px-8 py-4">
          <Link 
            to={`/brands/${slug}`}
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-luxury-sm">Back to {brand.name}</span>
          </Link>
          
          <div className="text-center">
            <h1 className="font-serif text-lg">Spring Awakening</h1>
            <span className="text-luxury-label">Spring 2024</span>
          </div>
          
          <div className="w-32" />
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div ref={containerRef} className="h-[600vh]">
        <div className="sticky top-0 h-screen overflow-hidden pt-20">
          <motion.div 
            style={{ x }}
            className="flex h-full"
          >
            {/* Hero Slide */}
            <div className="flex-shrink-0 w-screen h-full flex">
              <div className="w-1/2 h-full p-8 lg:p-16 flex flex-col justify-center">
                <span className="text-gold text-luxury-label mb-4">{brand.name}</span>
                <h2 className="font-serif text-5xl lg:text-6xl font-light mb-6">
                  Spring Awakening
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                  A celebration of renewal through sustainable fashion. 
                  Each piece in this collection represents our commitment 
                  to ethical craftsmanship and timeless design.
                </p>
              </div>
              <div className="w-1/2 h-full">
                <img
                  src={brand1}
                  alt="Collection Hero"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Product Slides */}
            {products.map((product, index) => (
              <div 
                key={product.id}
                className="flex-shrink-0 w-[40vw] h-full border-r border-border cursor-pointer group"
                onClick={() => setSelectedProductId(product.id)}
              >
                <div className="relative h-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover img-luxury"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Product Info */}
                  <div className="absolute bottom-0 left-0 right-0 p-8">
                    <span className="text-primary-foreground/60 text-luxury-xs block mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Look {String(index + 1).padStart(2, '0')} / {products.length}
                    </span>
                    <h3 className="font-serif text-2xl text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                      {product.name}
                    </h3>
                    <p className="text-primary-foreground/80 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      ${product.price}
                    </p>
                  </div>

                  {/* In Assortment Badge */}
                  {isInAssortment(product.id) && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-gold flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Product Detail Overlay */}
      {selectedProduct && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-background"
        >
          <button
            onClick={() => setSelectedProductId(null)}
            className="absolute top-8 right-8 p-2 hover:text-gold transition-colors"
          >
            <X className="w-6 h-6" strokeWidth={1} />
          </button>

          <div className="h-full flex">
            {/* Left - Image */}
            <div className="w-1/2 h-full p-8">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right - Details */}
            <div className="w-1/2 h-full p-16 flex flex-col justify-center">
              <span className="text-gold text-luxury-label mb-4">{brand.name}</span>
              <h2 className="font-serif text-4xl lg:text-5xl font-light mb-4">
                {selectedProduct.name}
              </h2>
              <p className="text-3xl font-light mb-8">${selectedProduct.price}</p>
              
              <div className="space-y-6 mb-12">
                <div>
                  <h4 className="text-luxury-label mb-2">Fabric</h4>
                  <p className="text-muted-foreground">{selectedProduct.fabricDetails}</p>
                </div>
                <div>
                  <h4 className="text-luxury-label mb-2">Description</h4>
                  <p className="text-muted-foreground leading-relaxed">{selectedProduct.description}</p>
                </div>
                <div>
                  <h4 className="text-luxury-label mb-2">Available Sizes</h4>
                  <div className="flex gap-2">
                    {selectedProduct.sizes.map((size) => (
                      <span key={size} className="px-4 py-2 border border-border text-sm">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleSelectStyle(selectedProduct.id)}
                className={`btn-luxury-gold inline-flex items-center gap-3 justify-center ${
                  isInAssortment(selectedProduct.id) ? 'bg-charcoal' : ''
                }`}
              >
                {isInAssortment(selectedProduct.id) ? (
                  <>
                    <Check className="w-4 h-4" />
                    Added to Assortment
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Select This Style
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Assortment Tray */}
      {assortment.length > 0 && (
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-charcoal border-t border-gold/30"
        >
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center gap-4">
              <span className="text-primary-foreground text-luxury-sm">
                {assortment.length} styles selected
              </span>
              <div className="flex -space-x-3">
                {assortment.slice(0, 5).map((id) => {
                  const product = products.find(p => p.id === id);
                  return product ? (
                    <div key={id} className="w-12 h-12 border-2 border-charcoal overflow-hidden">
                      <img src={product.image} alt="" className="w-full h-full object-cover" />
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <button className="btn-luxury-gold">
              Proceed to Order
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default CollectionDetail;
