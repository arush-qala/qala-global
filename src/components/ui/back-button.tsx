import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onClick?: () => void;
  label?: string;
  className?: string;
}

/**
 * Standardized Back button component
 * Reference: /experience page Back button styling
 */
export const BackButton = ({ onClick, label = 'Back', className = '' }: BackButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 hover:text-gold transition-colors ${className}`}
    >
      <ArrowLeft className="w-4 h-4" />
      <span className="text-sm tracking-widest uppercase">{label}</span>
    </button>
  );
};

export default BackButton;
