import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, User } from 'lucide-react';

interface HeaderProps {
  variant?: 'default' | 'transparent' | 'minimal';
}

const Header = ({ variant = 'default' }: HeaderProps) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  
  const bgClass = variant === 'transparent' 
    ? 'bg-transparent' 
    : variant === 'minimal'
    ? 'bg-background'
    : 'bg-background/95 backdrop-blur-sm';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 ${bgClass}`}
    >
      <div className="flex items-center justify-between px-8 py-6">
        {/* Left Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            to="/discover" 
            className="text-luxury-sm text-foreground hover:text-accent transition-colors duration-300"
          >
            Discover
          </Link>
          <Link 
            to="/brands" 
            className="text-luxury-sm text-foreground hover:text-accent transition-colors duration-300"
          >
            Brands
          </Link>
        </nav>

        {/* Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <motion.h1 
            className="font-serif text-2xl tracking-[0.3em] font-light"
            whileHover={{ letterSpacing: '0.35em' }}
            transition={{ duration: 0.3 }}
          >
            QALA
          </motion.h1>
        </Link>

        {/* Right Navigation */}
        <div className="flex items-center gap-6">
          <button 
            className="p-2 hover:text-accent transition-colors duration-300"
            aria-label="Favorites"
          >
            <Heart className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button 
            className="p-2 hover:text-accent transition-colors duration-300"
            aria-label="Cart"
          >
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button 
            className="p-2 hover:text-accent transition-colors duration-300"
            aria-label="Account"
          >
            <User className="w-4 h-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
