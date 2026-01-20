import { ReactNode } from 'react';

interface TopBarProps {
  children: ReactNode;
  rightContent?: ReactNode;
}

/**
 * Shared TopBar component for consistent styling across pages
 * Used on: /experience, /brands/:brandId, /brands/:brandId/collections/:collectionId
 */
const TopBar = ({ children, rightContent }: TopBarProps) => {
  return (
    <div className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <div className="flex items-center justify-between px-8 py-6">
        {children}
        {rightContent && <div>{rightContent}</div>}
      </div>
    </div>
  );
};

export default TopBar;
