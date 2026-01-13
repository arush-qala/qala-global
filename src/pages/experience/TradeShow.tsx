import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Check, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAssortment } from '@/contexts/AssortmentContext';

interface TradeEvent {
  id: string;
  name: string;
  date: string;
  location: string;
  venue: string;
  booth: string;
  image: string;
  description: string;
}

const TradeShow = () => {
  const navigate = useNavigate();
  const { products } = useAssortment();
  const [selectedEvents, setSelectedEvents] = useState<Set<string>>(new Set());
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);

  const events: TradeEvent[] = [
    { 
      id: '1', 
      name: 'Paris Fashion Week', 
      date: 'February 24-28, 2026', 
      location: 'Paris, France', 
      venue: 'Palais de Tokyo',
      booth: 'Hall B, Stand 42',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
      description: 'Join us at the heart of fashion. Our collection will be showcased alongside the world\'s most prestigious designers.'
    },
    { 
      id: '2', 
      name: 'NYC Coterie', 
      date: 'March 12-14, 2026', 
      location: 'New York, USA', 
      venue: 'Javits Center',
      booth: 'Level 2, Booth 156',
      image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=800&q=80',
      description: 'The premier marketplace for contemporary fashion. Meet our team and explore the latest collection.'
    },
    { 
      id: '3', 
      name: 'Lakme Fashion Week', 
      date: 'April 5-9, 2026', 
      location: 'Mumbai, India', 
      venue: 'Jio World Convention Centre',
      booth: 'Main Hall, Stand 78',
      image: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
      description: 'Experience the fusion of traditional craftsmanship and contemporary design at India\'s premier fashion event.'
    },
    { 
      id: '4', 
      name: 'London Fashion Week', 
      date: 'May 18-22, 2026', 
      location: 'London, UK', 
      venue: 'Somerset House',
      booth: 'East Wing Gallery',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
      description: 'Celebrate British fashion excellence. Book an exclusive appointment at our Somerset House installation.'
    },
  ];

  const toggleEvent = (id: string) => {
    const newSelected = new Set(selectedEvents);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedEvents(newSelected);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b border-border">
        <div className="flex items-center justify-between px-8 py-6">
          <button 
            onClick={() => navigate('/experience')}
            className="flex items-center gap-2 hover:text-gold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-widest uppercase">Back</span>
          </button>
          <span className="text-base tracking-widest">TRADE SHOWS</span>
          <div className="w-20" />
        </div>
      </div>

      <main className="pt-28 pb-32">
        {/* Hero */}
        <div className="px-8 max-w-5xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl lg:text-6xl mb-4">Meet Us In Person</h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-lg">
              Experience our collections at the world's premier fashion events. 
              Book exclusive booth appointments for personalized consultations.
            </p>
          </motion.div>
        </div>

        {/* Events Grid */}
        <div className="px-8 max-w-6xl mx-auto">
          <div className="space-y-6">
            {events.map((event, index) => {
              const isSelected = selectedEvents.has(event.id);
              const isExpanded = expandedEvent === event.id;
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border transition-colors overflow-hidden ${
                    isSelected ? 'border-gold' : 'border-border'
                  }`}
                >
                  {/* Collapsed View */}
                  <div 
                    className="flex cursor-pointer"
                    onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                  >
                    <div className="w-64 h-48 flex-shrink-0 overflow-hidden">
                      <img 
                        src={event.image} 
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6 flex items-center justify-between">
                      <div>
                        <h3 className="font-serif text-2xl mb-2">{event.name}</h3>
                        <div className="flex items-center gap-4 text-muted-foreground text-base">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {event.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {event.location}
                          </span>
                        </div>
                        <p className="text-gold text-base mt-2">{event.booth}</p>
                      </div>
                      <ChevronRight className={`w-6 h-6 text-muted-foreground transition-transform ${
                        isExpanded ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>

                  {/* Expanded View */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-border"
                      >
                        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div>
                            <p className="text-muted-foreground mb-4 text-base">{event.description}</p>
                            <div className="space-y-2 text-base">
                              <p><span className="text-muted-foreground">Venue:</span> {event.venue}</p>
                              <p><span className="text-muted-foreground">Location:</span> {event.booth}</p>
                            </div>
                          </div>
                          
                          {/* Your Selection Preview */}
                          <div>
                            <p className="text-xs tracking-widest text-muted-foreground mb-3">PIECES YOU'RE INTERESTED IN</p>
                            <div className="flex gap-2 flex-wrap">
                              {products.slice(0, 4).map((product) => (
                                <div key={product.id} className="w-16 h-20 overflow-hidden">
                                  <img src={product.image} alt="" className="w-full h-full object-cover" />
                                </div>
                              ))}
                              {products.length > 4 && (
                                <div className="w-16 h-20 bg-muted flex items-center justify-center text-base">
                                  <span className="text-muted-foreground text-sm">+{products.length - 4}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="px-6 pb-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleEvent(event.id);
                            }}
                            className={`w-full py-4 text-sm tracking-widest transition-colors ${
                              isSelected
                                ? 'bg-gold text-primary-foreground'
                                : 'border border-border hover:border-gold'
                            }`}
                          >
                            {isSelected ? (
                              <span className="flex items-center justify-center gap-2">
                                <Check className="w-4 h-4" /> RSVP CONFIRMED
                              </span>
                            ) : (
                              'RSVP FOR THIS EVENT'
                            )}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Fixed Bottom Bar */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 bg-deep-charcoal border-t border-gold/20"
      >
        <div className="max-w-6xl mx-auto px-8 py-6 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground text-base mb-1">
              {selectedEvents.size} event{selectedEvents.size !== 1 ? 's' : ''} selected
            </p>
            <p className="text-muted-foreground text-sm">
              You'll receive confirmation emails for each event
            </p>
          </div>
          
          <button 
            className="btn-luxury-gold"
            disabled={selectedEvents.size === 0}
          >
            Confirm RSVPs
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TradeShow;
