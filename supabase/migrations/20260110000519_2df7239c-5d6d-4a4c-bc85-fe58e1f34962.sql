-- Create brands table for brand-level information
CREATE TABLE public.brands (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  handle TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  brand_story TEXT,
  designer_name TEXT,
  about_designer TEXT,
  instagram_link TEXT,
  usp_tags TEXT,
  craftsmanship TEXT,
  quotation TEXT,
  featured_in TEXT,
  hero_image TEXT,
  banner_image TEXT,
  logo_image TEXT,
  designer_image TEXT,
  about_image TEXT,
  about_image_mobile TEXT,
  craftsmanship_creative TEXT,
  environmental_sustainability TEXT[],
  social_responsibility TEXT[],
  style TEXT[],
  special_badges TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collections table
CREATE TABLE public.collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shopify_id TEXT,
  handle TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
  brand_name TEXT,
  description TEXT,
  tagline TEXT,
  seasonality TEXT,
  primary_craft_l1 TEXT,
  primary_craft_l2 TEXT,
  category TEXT,
  artisan_cluster TEXT,
  environmental_sustainability TEXT[],
  lookbook_link TEXT,
  thumbnail_image TEXT,
  banner_image TEXT,
  is_brand_store BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  products_count INTEGER DEFAULT 0,
  more_collections TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  shopify_id TEXT,
  handle TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  brand_name TEXT,
  product_type TEXT,
  tags TEXT,
  status TEXT DEFAULT 'Active',
  url TEXT,
  care_guide TEXT,
  product_story TEXT,
  shipping TEXT,
  size_chart_image TEXT,
  fabric_type TEXT,
  delivery_timelines TEXT,
  material TEXT,
  gender TEXT,
  qala_category TEXT[],
  occasion TEXT[],
  craft TEXT[],
  gst INTEGER,
  bulk_margin TEXT,
  sample_discount DECIMAL,
  bulk_discount_5_24 DECIMAL,
  bulk_discount_25_49 DECIMAL,
  bulk_discount_50_99 DECIMAL,
  bulk_discount_100_plus DECIMAL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product images table (multiple images per product)
CREATE TABLE public.product_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product variants table (sizes and prices)
CREATE TABLE public.product_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  shopify_variant_id TEXT,
  price DECIMAL(10, 2),
  size TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create product-collection relationship table (many-to-many)
CREATE TABLE public.product_collections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES public.collections(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(product_id, collection_id)
);

-- Create indexes for performance
CREATE INDEX idx_products_brand_name ON public.products(brand_name);
CREATE INDEX idx_products_handle ON public.products(handle);
CREATE INDEX idx_collections_brand_id ON public.collections(brand_id);
CREATE INDEX idx_collections_handle ON public.collections(handle);
CREATE INDEX idx_product_images_product_id ON public.product_images(product_id);
CREATE INDEX idx_product_variants_product_id ON public.product_variants(product_id);
CREATE INDEX idx_product_collections_product_id ON public.product_collections(product_id);
CREATE INDEX idx_product_collections_collection_id ON public.product_collections(collection_id);

-- Enable RLS on all tables
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_collections ENABLE ROW LEVEL SECURITY;

-- Create public read policies (catalog data is public)
CREATE POLICY "Anyone can view brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Anyone can view collections" ON public.collections FOR SELECT USING (true);
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Anyone can view product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Anyone can view product variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Anyone can view product collections" ON public.product_collections FOR SELECT USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Add triggers for updated_at
CREATE TRIGGER handle_brands_updated_at
  BEFORE UPDATE ON public.brands
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_collections_updated_at
  BEFORE UPDATE ON public.collections
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();