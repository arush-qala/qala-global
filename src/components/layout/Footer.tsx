import { Link } from 'react-router-dom';
import { Instagram, Facebook, Globe } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-deep-charcoal text-primary-foreground py-16 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <h3 className="font-serif text-2xl tracking-[0.2em] mb-4">QALA</h3>
            <p className="text-sm text-primary-foreground/60 leading-relaxed">
              Next Generation Luxury Sourcing Platform for boutique buyers worldwide.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-luxury-sm mb-6 text-gold">Platform</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/discover" className="text-sm text-primary-foreground/60 hover:text-gold transition-colors">
                  Discover Brands
                </Link>
              </li>
              <li>
                <Link to="/tradeshows" className="text-sm text-primary-foreground/60 hover:text-gold transition-colors">
                  Tradeshows
                </Link>
              </li>
              <li>
                <Link to="/showcases" className="text-sm text-primary-foreground/60 hover:text-gold transition-colors">
                  Private Showcases
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-luxury-sm mb-6 text-gold">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-sm text-primary-foreground/60 hover:text-gold transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-primary-foreground/60 hover:text-gold transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-sm text-primary-foreground/60 hover:text-gold transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-luxury-sm mb-6 text-gold">Connect</h4>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/qala.global/" 
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-primary-foreground/20 hover:border-gold hover:text-gold transition-all"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a 
                href="#" 
                className="p-2 border border-primary-foreground/20 hover:border-gold hover:text-gold transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" strokeWidth={1.5} />
              </a>
              <a 
                href="#" 
                className="p-2 border border-primary-foreground/20 hover:border-gold hover:text-gold transition-all"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-2xs text-primary-foreground/40">
            © 2024 Qala. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-2xs text-primary-foreground/40 hover:text-gold transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-2xs text-primary-foreground/40 hover:text-gold transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
