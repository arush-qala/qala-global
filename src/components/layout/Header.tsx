import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, User } from 'lucide-react';
interface HeaderProps {
  variant?: 'default' | 'transparent' | 'minimal';
}
const Header = ({
  variant = 'default'
}: HeaderProps) => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const bgClass = variant === 'transparent' ? 'bg-transparent' : variant === 'minimal' ? 'bg-background' : 'bg-background/95 backdrop-blur-sm';
  return <motion.header initial={{
    opacity: 0,
    y: -20
  }} animate={{
    opacity: 1,
    y: 0
  }} transition={{
    duration: 0.6,
    ease: [0.4, 0, 0.2, 1]
  }} className={`fixed top-0 left-0 right-0 z-50 ${bgClass}`}>
      <div className="flex items-center justify-between px-8 py-6">
        {/* Left Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          
          
        </nav>

        {/* Logo */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <motion.h1 whileHover={{
          letterSpacing: '0.35em'
        }} transition={{
          duration: 0.3
        }} className="font-serif tracking-[0.3em] font-light text-4xl">
            QALA
          </motion.h1>
        </Link>

        {/* Right Navigation */}
        
      </div>
    </motion.header>;
};
export default Header;