import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAssortment } from '@/contexts/AssortmentContext';

const PrivateShowcase = () => {
  const navigate = useNavigate();
  const { products } = useAssortment();
  const [formData, setFormData] = useState({
    boutiqueName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    preferredDate1: '',
    preferredDate2: '',
    preferredTime: '',
    notes: ''
  });

  const timeSlots = [
    '9:00 AM - 11:00 AM',
    '11:00 AM - 1:00 PM',
    '2:00 PM - 4:00 PM',
    '4:00 PM - 6:00 PM'
  ];

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
          <span className="text-sm tracking-widest">PRIVATE SHOWCASE</span>
          <div className="w-20" />
        </div>
      </div>

      <main className="pt-28 pb-32">
        <div className="max-w-6xl mx-auto px-8">
          {/* Hero Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
            {/* Left: Selected Products Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <h2 className="text-luxury-xs text-muted-foreground mb-6">YOUR CURATED SELECTION</h2>
              <div className="grid grid-cols-3 gap-2">
                {products.slice(0, 6).map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="aspect-[3/4] overflow-hidden"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
              </div>
              {products.length > 6 && (
                <p className="text-muted-foreground text-sm mt-4 text-center">
                  +{products.length - 6} more pieces in your selection
                </p>
              )}
              
            </motion.div>

            {/* Right: Booking Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h1 className="font-serif text-4xl lg:text-5xl mb-4">Schedule Your Showcase</h1>
              <p className="text-muted-foreground mb-8 leading-relaxed text-lg">
                Our brand representative will bring your curated selection directly to your boutique. 
                Experience the fabrics, discuss styling opportunities, and place orders with 
                personalized guidance.
              </p>

              <div className="space-y-6">
                {/* Boutique Info */}
                <div>
                  <h3 className="text-luxury-xs text-muted-foreground mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> BOUTIQUE INFORMATION
                  </h3>
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={formData.boutiqueName}
                      onChange={(e) => setFormData({...formData, boutiqueName: e.target.value})}
                      placeholder="Boutique Name"
                      className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={formData.contactName}
                        onChange={(e) => setFormData({...formData, contactName: e.target.value})}
                        placeholder="Contact Name"
                        className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
                      />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="Email"
                        className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
                      />
                    </div>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="Phone Number"
                      className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      placeholder="Street Address"
                      className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                    <div className="grid grid-cols-3 gap-4">
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        placeholder="City"
                        className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
                      />
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) => setFormData({...formData, state: e.target.value})}
                        placeholder="State"
                        className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
                      />
                      <input
                        type="text"
                        value={formData.zipCode}
                        onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                        placeholder="ZIP"
                        className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Scheduling */}
                <div>
                  <h3 className="text-luxury-xs text-muted-foreground mb-4 flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> PREFERRED DATES
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">First Choice</label>
                      <input
                        type="date"
                        value={formData.preferredDate1}
                        onChange={(e) => setFormData({...formData, preferredDate1: e.target.value})}
                        className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-2 block">Second Choice</label>
                      <input
                        type="date"
                        value={formData.preferredDate2}
                        onChange={(e) => setFormData({...formData, preferredDate2: e.target.value})}
                        className="w-full bg-background border border-border px-4 py-3 text-sm focus:border-gold focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Time Preference */}
                <div>
                  <h3 className="text-luxury-xs text-muted-foreground mb-4 flex items-center gap-2">
                    <Clock className="w-4 h-4" /> PREFERRED TIME
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        onClick={() => setFormData({...formData, preferredTime: slot})}
                        className={`p-3 border text-sm transition-colors ${
                          formData.preferredTime === slot
                            ? 'border-gold bg-gold/5 text-gold'
                            : 'border-border hover:border-gold/30'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-luxury-xs text-muted-foreground mb-2 block">ADDITIONAL NOTES</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    rows={3}
                    placeholder="Any special requirements or preferences..."
                    className="w-full bg-background border border-border px-4 py-3 text-sm resize-none focus:border-gold focus:outline-none"
                  />
                </div>
              </div>
            </motion.div>
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
            <p className="text-primary-foreground text-sm mb-1">
              {products.length} pieces in your selection
            </p>
            <p className="text-muted-foreground text-xs">
              Our team will confirm availability within 24 hours
            </p>
          </div>
          
          <button className="btn-luxury-gold">
            Request Showcase
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivateShowcase;
