import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

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
}

const AssortmentContext = createContext<AssortmentContextType | undefined>(undefined);

export const useAssortment = () => {
  const context = useContext(AssortmentContext);
  if (!context) {
    throw new Error('useAssortment must be used within an AssortmentProvider');
  }
  return context;
};

export const AssortmentProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<AssortmentProduct[]>([]);
  const [flyingImage, setFlyingImage] = useState<FlyingImageData | null>(null);

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
  }, []);

  const clearFlyingImage = useCallback(() => {
    setFlyingImage(null);
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
    }}>
      {children}
    </AssortmentContext.Provider>
  );
};
