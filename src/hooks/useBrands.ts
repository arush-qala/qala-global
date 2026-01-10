import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Brand {
  id: string;
  handle: string;
  name: string;
  description: string | null;
  brand_story: string | null;
  designer_name: string | null;
  about_designer: string | null;
  instagram_link: string | null;
  usp_tags: string | null;
  craftsmanship: string | null;
  quotation: string | null;
  featured_in: string | null;
  hero_image: string | null;
  banner_image: string | null;
  logo_image: string | null;
  designer_image: string | null;
  about_image: string | null;
  about_image_mobile: string | null;
  craftsmanship_creative: string | null;
  environmental_sustainability: string[] | null;
  social_responsibility: string[] | null;
  style: string[] | null;
  special_badges: string[] | null;
}

export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Brand[];
    },
  });
}

export function useBrand(handle: string) {
  return useQuery({
    queryKey: ['brand', handle],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('handle', handle)
        .maybeSingle();
      
      if (error) throw error;
      return data as Brand | null;
    },
    enabled: !!handle,
  });
}
