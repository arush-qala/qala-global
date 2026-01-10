-- Add unique constraint on products handle
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_handle_unique ON public.products(handle);