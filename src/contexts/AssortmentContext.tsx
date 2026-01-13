import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'qala-assortment';

export interface AssortmentProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  brandSlug: string;
  brandName: string;
  category?: string;
}

interface FlyingImageData {
  src: string;
  x: number;
  y: number;
}

interface AssortmentContextType {
  products: AssortmentProduct[];
  addProduct: (product: AssortmentProduct, buttonRect?: DOMRect) => void;
  removeProduct: (id: string) => void;
  reorderProducts: (newOrder: AssortmentProduct[]) => void;
  isInAssortment: (id: string) => boolean;
  clearAssortment: () => void;
  flyingImage: FlyingImageData | null;
  clearFlyingImage: () => void;
  lastCollectionUrl: string | null;
  setLastCollectionUrl: (url: string) => void;
  isTrayOpen: boolean;
  setTrayOpen: (open: boolean) => void;
}

const AssortmentContext = createContext<AssortmentContextType | undefined>(undefined);

export const useAssortment = () => {
  const context = useContext(AssortmentContext);
  if (!context) {
    throw new Error('useAssortment must be used within an AssortmentProvider');
  }
  return context;
};

// Load initial state from localStorage
const loadFromStorage = (): AssortmentProduct[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load assortment from localStorage:', error);
  }
  return [];
};

export const AssortmentProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<AssortmentProduct[]>(loadFromStorage);
  const [flyingImage, setFlyingImage] = useState<FlyingImageData | null>(null);
  const [lastCollectionUrl, setLastCollectionUrlState] = useState<string | null>(null);
  const [isTrayOpen, setIsTrayOpen] = useState(false);

  // Persist products to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
    } catch (error) {
      console.error('Failed to save assortment to localStorage:', error);
    }
  }, [products]);

  const addProduct = useCallback((product: AssortmentProduct, buttonRect?: DOMRect) => {
    setProducts(prev => {
      if (prev.some(p => p.id === product.id)) return prev;
      return [...prev, product];
    });
    
    if (buttonRect) {
      setFlyingImage({
        src: product.image,
        x: buttonRect.left + buttonRect.width / 2 - 32,
        y: buttonRect.top,
      });
    }
    
    // NOTE: Removed auto-open tray behavior for seamless browsing flow
    // Tray now only opens when user explicitly clicks on the bottom indicator
  }, []);

  const removeProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  const reorderProducts = useCallback((newOrder: AssortmentProduct[]) => {
    setProducts(newOrder);
  }, []);

  const isInAssortment = useCallback((id: string) => {
    return products.some(p => p.id === id);
  }, [products]);

  const clearAssortment = useCallback(() => {
    setProducts([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear assortment from localStorage:', error);
    }
  }, []);

  const clearFlyingImage = useCallback(() => {
    setFlyingImage(null);
  }, []);

  const setLastCollectionUrl = useCallback((url: string) => {
    setLastCollectionUrlState(url);
  }, []);

  const setTrayOpen = useCallback((open: boolean) => {
    setIsTrayOpen(open);
  }, []);

  return (
    <AssortmentContext.Provider value={{
      products,
      addProduct,
      removeProduct,
      reorderProducts,
      isInAssortment,
      clearAssortment,
      flyingImage,
      clearFlyingImage,
      lastCollectionUrl,
      setLastCollectionUrl,
      isTrayOpen,
      setTrayOpen,
    }}>
      {children}
    </AssortmentContext.Provider>
  );
};