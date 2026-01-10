import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  brand_name: string | null;
  product_type: string | null;
  tags: string | null;
  status: string;
  url: string | null;
  care_guide: string | null;
  product_story: string | null;
  shipping: string | null;
  fabric_type: string | null;
  delivery_timelines: string | null;
  material: string | null;
  gender: string | null;
  gst: number | null;
  bulk_margin: string | null;
  sample_discount: number | null;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  position: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  shopify_variant_id: string | null;
  price: number | null;
  size: string | null;
}

export interface ProductWithDetails extends Product {
  images: ProductImage[];
  variants: ProductVariant[];
}

export function useProducts() {
  return useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'Active')
        .order('title');
      
      if (error) throw error;
      return data as Product[];
    },
  });
}

export function useProductsByCollection(collectionHandle: string) {
  return useQuery({
    queryKey: ['products', 'collection', collectionHandle],
    queryFn: async () => {
      // First get the collection
      const { data: collection } = await supabase
        .from('collections')
        .select('id')
        .eq('handle', collectionHandle)
        .maybeSingle();
      
      if (!collection) return [];
      
      // Get products through the junction table
      const { data: productCollections, error: pcError } = await supabase
        .from('product_collections')
        .select('product_id')
        .eq('collection_id', collection.id);
      
      if (pcError) throw pcError;
      if (!productCollections?.length) return [];
      
      const productIds = productCollections.map(pc => pc.product_id);
      
      // Get full product details with images and variants
      const { data: products, error: prodError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds)
        .eq('status', 'Active')
        .order('title');
      
      if (prodError) throw prodError;
      
      // Get images for all products
      const { data: images } = await supabase
        .from('product_images')
        .select('*')
        .in('product_id', productIds)
        .order('position');
      
      // Get variants for all products
      const { data: variants } = await supabase
        .from('product_variants')
        .select('*')
        .in('product_id', productIds);
      
      // Combine products with their images and variants
      const productsWithDetails: ProductWithDetails[] = (products || []).map(product => ({
        ...product,
        images: (images || []).filter(img => img.product_id === product.id),
        variants: (variants || []).filter(v => v.product_id === product.id),
      }));
      
      return productsWithDetails;
    },
    enabled: !!collectionHandle,
  });
}

export function useProductsByBrand(brandName: string) {
  return useQuery({
    queryKey: ['products', 'brand', brandName],
    queryFn: async () => {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('brand_name', brandName)
        .eq('status', 'Active')
        .order('title');
      
      if (error) throw error;
      
      if (!products?.length) return [];
      
      const productIds = products.map(p => p.id);
      
      // Get images
      const { data: images } = await supabase
        .from('product_images')
        .select('*')
        .in('product_id', productIds)
        .order('position');
      
      // Get variants
      const { data: variants } = await supabase
        .from('product_variants')
        .select('*')
        .in('product_id', productIds);
      
      const productsWithDetails: ProductWithDetails[] = products.map(product => ({
        ...product,
        images: (images || []).filter(img => img.product_id === product.id),
        variants: (variants || []).filter(v => v.product_id === product.id),
      }));
      
      return productsWithDetails;
    },
    enabled: !!brandName,
  });
}

export function useProduct(handle: string) {
  return useQuery({
    queryKey: ['product', handle],
    queryFn: async () => {
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('handle', handle)
        .maybeSingle();
      
      if (error) throw error;
      if (!product) return null;
      
      // Get images
      const { data: images } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', product.id)
        .order('position');
      
      // Get variants
      const { data: variants } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', product.id);
      
      return {
        ...product,
        images: images || [],
        variants: variants || [],
      } as ProductWithDetails;
    },
    enabled: !!handle,
  });
}
