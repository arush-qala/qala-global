import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Collection {
  id: string;
  handle: string;
  title: string;
  brand_id: string | null;
  brand_name: string | null;
  description: string | null;
  tagline: string | null;
  seasonality: string | null;
  primary_craft_l1: string | null;
  primary_craft_l2: string | null;
  category: string | null;
  environmental_sustainability: string[] | null;
  lookbook_link: string | null;
  thumbnail_image: string | null;
  banner_image: string | null;
  is_brand_store: boolean;
  products_count: number;
  more_collections: string[] | null;
}

export function useCollections() {
  return useQuery({
    queryKey: ['collections'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('is_brand_store', false)
        .order('title');
      
      if (error) throw error;
      return data as Collection[];
    },
  });
}

export function useCollectionsByBrand(brandHandle: string) {
  return useQuery({
    queryKey: ['collections', 'brand', brandHandle],
    queryFn: async () => {
      // First get the brand
      const { data: brand } = await supabase
        .from('brands')
        .select('id, name')
        .eq('handle', brandHandle)
        .maybeSingle();
      
      if (!brand) return [];
      
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('brand_name', brand.name)
        .eq('is_brand_store', false)
        .order('title');
      
      if (error) throw error;
      return data as Collection[];
    },
    enabled: !!brandHandle,
  });
}

export function useCollection(handle: string) {
  return useQuery({
    queryKey: ['collection', handle],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('handle', handle)
        .maybeSingle();
      
      if (error) throw error;
      return data as Collection | null;
    },
    enabled: !!handle,
  });
}
