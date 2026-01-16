import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BackButtonProps {
  to?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
  variant?: 'default' | 'floating';
}

/**
 * Standardized Back button component
 * Reference: /experience page Back button styling
 * 
 * Variants:
 * - default: Simple text button for standard pages
 * - floating: Glassmorphism pill for overlay on imagery (brand storefronts, etc.)
 */
export const BackButton = ({ 
  to, 
  onClick, 
  label = 'Back', 
  className = '',
  variant = 'default'
}: BackButtonProps) => {
  const baseStyles = "flex items-center gap-2 transition-all duration-300";
  
  const variantStyles = {
    default: "hover:text-gold",
    floating: "px-4 py-2 rounded-full bg-charcoal/60 backdrop-blur-md border border-white/10 text-primary-foreground hover:bg-charcoal/80 hover:border-white/20 shadow-lg"
  };

  const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${className}`;

  const content = (
    <>
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm tracking-widest uppercase">{label}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={combinedClassName}>
        {content}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClassName}>
      {content}
    </button>
  );
};

export default BackButton;
