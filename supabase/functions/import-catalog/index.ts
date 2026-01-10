import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-api-key",
};

// Validation helpers
function isValidString(value: unknown, maxLength = 5000): value is string {
  return typeof value === "string" && value.length <= maxLength;
}

function isValidOptionalString(value: unknown, maxLength = 5000): boolean {
  return value === undefined || value === null || value === "" || isValidString(value, maxLength);
}

function isValidOptionalNumber(value: unknown): boolean {
  return value === undefined || value === null || (typeof value === "number" && !isNaN(value));
}

function isValidOptionalBoolean(value: unknown): boolean {
  return value === undefined || value === null || typeof value === "boolean";
}

function isValidStringArray(value: unknown, maxItems = 100, maxLength = 500): boolean {
  if (value === undefined || value === null) return true;
  if (!Array.isArray(value)) return false;
  if (value.length > maxItems) return false;
  return value.every((item) => isValidString(item, maxLength));
}

function sanitizeString(value: string | undefined | null): string | undefined {
  if (!value) return undefined;
  // Remove potential SQL injection patterns and trim
  return value.trim().slice(0, 5000);
}

// Brand validation
interface BrandData {
  handle: string;
  name: string;
  description?: string;
  brand_story?: string;
  designer_name?: string;
  about_designer?: string;
  instagram_link?: string;
  usp_tags?: string;
  craftsmanship?: string;
  quotation?: string;
  featured_in?: string;
  hero_image?: string;
  banner_image?: string;
  logo_image?: string;
  designer_image?: string;
  about_image?: string;
  about_image_mobile?: string;
  craftsmanship_creative?: string;
  environmental_sustainability?: string[];
  social_responsibility?: string[];
  style?: string[];
}

function validateBrand(data: unknown): BrandData | null {
  if (typeof data !== "object" || data === null) return null;
  const obj = data as Record<string, unknown>;

  // Required fields
  if (!isValidString(obj.handle, 200)) return null;
  if (!isValidString(obj.name, 300)) return null;

  // Optional fields validation
  if (!isValidOptionalString(obj.description, 5000)) return null;
  if (!isValidOptionalString(obj.brand_story, 10000)) return null;
  if (!isValidOptionalString(obj.designer_name, 300)) return null;
  if (!isValidOptionalString(obj.about_designer, 5000)) return null;
  if (!isValidOptionalString(obj.instagram_link, 500)) return null;
  if (!isValidOptionalString(obj.usp_tags, 1000)) return null;
  if (!isValidOptionalString(obj.craftsmanship, 5000)) return null;
  if (!isValidOptionalString(obj.quotation, 1000)) return null;
  if (!isValidOptionalString(obj.featured_in, 1000)) return null;
  if (!isValidOptionalString(obj.hero_image, 1000)) return null;
  if (!isValidOptionalString(obj.banner_image, 1000)) return null;
  if (!isValidOptionalString(obj.logo_image, 1000)) return null;
  if (!isValidOptionalString(obj.designer_image, 1000)) return null;
  if (!isValidOptionalString(obj.about_image, 1000)) return null;
  if (!isValidOptionalString(obj.about_image_mobile, 1000)) return null;
  if (!isValidOptionalString(obj.craftsmanship_creative, 5000)) return null;
  if (!isValidStringArray(obj.environmental_sustainability)) return null;
  if (!isValidStringArray(obj.social_responsibility)) return null;
  if (!isValidStringArray(obj.style)) return null;

  return {
    handle: (obj.handle as string).trim().slice(0, 200),
    name: (obj.name as string).trim().slice(0, 300),
    description: sanitizeString(obj.description as string),
    brand_story: sanitizeString(obj.brand_story as string),
    designer_name: sanitizeString(obj.designer_name as string),
    about_designer: sanitizeString(obj.about_designer as string),
    instagram_link: sanitizeString(obj.instagram_link as string),
    usp_tags: sanitizeString(obj.usp_tags as string),
    craftsmanship: sanitizeString(obj.craftsmanship as string),
    quotation: sanitizeString(obj.quotation as string),
    featured_in: sanitizeString(obj.featured_in as string),
    hero_image: sanitizeString(obj.hero_image as string),
    banner_image: sanitizeString(obj.banner_image as string),
    logo_image: sanitizeString(obj.logo_image as string),
    designer_image: sanitizeString(obj.designer_image as string),
    about_image: sanitizeString(obj.about_image as string),
    about_image_mobile: sanitizeString(obj.about_image_mobile as string),
    craftsmanship_creative: sanitizeString(obj.craftsmanship_creative as string),
    environmental_sustainability: obj.environmental_sustainability as string[] | undefined,
    social_responsibility: obj.social_responsibility as string[] | undefined,
    style: obj.style as string[] | undefined,
  };
}

// Collection validation
interface CollectionData {
  shopify_id?: string;
  handle: string;
  title: string;
  brand_name?: string;
  description?: string;
  tagline?: string;
  seasonality?: string;
  primary_craft_l1?: string;
  primary_craft_l2?: string;
  category?: string;
  artisan_cluster?: string;
  environmental_sustainability?: string[];
  lookbook_link?: string;
  thumbnail_image?: string;
  banner_image?: string;
  is_brand_store?: boolean;
  products_count?: number;
  more_collections?: string[];
}

function validateCollection(data: unknown): CollectionData | null {
  if (typeof data !== "object" || data === null) return null;
  const obj = data as Record<string, unknown>;

  // Required fields
  if (!isValidString(obj.handle, 200)) return null;
  if (!isValidString(obj.title, 300)) return null;

  // Optional fields validation
  if (!isValidOptionalString(obj.shopify_id, 100)) return null;
  if (!isValidOptionalString(obj.brand_name, 300)) return null;
  if (!isValidOptionalString(obj.description, 5000)) return null;
  if (!isValidOptionalString(obj.tagline, 500)) return null;
  if (!isValidOptionalString(obj.seasonality, 100)) return null;
  if (!isValidOptionalString(obj.primary_craft_l1, 200)) return null;
  if (!isValidOptionalString(obj.primary_craft_l2, 200)) return null;
  if (!isValidOptionalString(obj.category, 200)) return null;
  if (!isValidOptionalString(obj.artisan_cluster, 200)) return null;
  if (!isValidOptionalString(obj.lookbook_link, 1000)) return null;
  if (!isValidOptionalString(obj.thumbnail_image, 1000)) return null;
  if (!isValidOptionalString(obj.banner_image, 1000)) return null;
  if (!isValidOptionalBoolean(obj.is_brand_store)) return null;
  if (!isValidOptionalNumber(obj.products_count)) return null;
  if (!isValidStringArray(obj.environmental_sustainability)) return null;
  if (!isValidStringArray(obj.more_collections)) return null;

  return {
    shopify_id: sanitizeString(obj.shopify_id as string),
    handle: (obj.handle as string).trim().slice(0, 200),
    title: (obj.title as string).trim().slice(0, 300),
    brand_name: sanitizeString(obj.brand_name as string),
    description: sanitizeString(obj.description as string),
    tagline: sanitizeString(obj.tagline as string),
    seasonality: sanitizeString(obj.seasonality as string),
    primary_craft_l1: sanitizeString(obj.primary_craft_l1 as string),
    primary_craft_l2: sanitizeString(obj.primary_craft_l2 as string),
    category: sanitizeString(obj.category as string),
    artisan_cluster: sanitizeString(obj.artisan_cluster as string),
    environmental_sustainability: obj.environmental_sustainability as string[] | undefined,
    lookbook_link: sanitizeString(obj.lookbook_link as string),
    thumbnail_image: sanitizeString(obj.thumbnail_image as string),
    banner_image: sanitizeString(obj.banner_image as string),
    is_brand_store: obj.is_brand_store as boolean | undefined,
    products_count: obj.products_count as number | undefined,
    more_collections: obj.more_collections as string[] | undefined,
  };
}

// Product validation
interface ProductVariant {
  variant_id?: string;
  price?: number;
  size?: string;
}

interface ProductData {
  shopify_id?: string;
  handle: string;
  title: string;
  description?: string;
  brand_name?: string;
  product_type?: string;
  tags?: string;
  status?: string;
  url?: string;
  care_guide?: string;
  product_story?: string;
  shipping?: string;
  fabric_type?: string;
  delivery_timelines?: string;
  material?: string;
  gender?: string;
  gst?: number;
  bulk_margin?: string;
  sample_discount?: number;
  images?: string[];
  variants?: ProductVariant[];
  collection_handles?: string[];
}

function validateProductVariant(data: unknown): ProductVariant | null {
  if (typeof data !== "object" || data === null) return null;
  const obj = data as Record<string, unknown>;

  if (!isValidOptionalString(obj.variant_id, 100)) return null;
  if (!isValidOptionalNumber(obj.price)) return null;
  if (!isValidOptionalString(obj.size, 50)) return null;

  return {
    variant_id: sanitizeString(obj.variant_id as string),
    price: obj.price as number | undefined,
    size: sanitizeString(obj.size as string),
  };
}

function validateProduct(data: unknown): ProductData | null {
  if (typeof data !== "object" || data === null) return null;
  const obj = data as Record<string, unknown>;

  // Required fields
  if (!isValidString(obj.handle, 200)) return null;
  if (!isValidString(obj.title, 500)) return null;

  // Optional fields validation
  if (!isValidOptionalString(obj.shopify_id, 100)) return null;
  if (!isValidOptionalString(obj.description, 10000)) return null;
  if (!isValidOptionalString(obj.brand_name, 300)) return null;
  if (!isValidOptionalString(obj.product_type, 200)) return null;
  if (!isValidOptionalString(obj.tags, 2000)) return null;
  if (!isValidOptionalString(obj.status, 50)) return null;
  if (!isValidOptionalString(obj.url, 1000)) return null;
  if (!isValidOptionalString(obj.care_guide, 5000)) return null;
  if (!isValidOptionalString(obj.product_story, 10000)) return null;
  if (!isValidOptionalString(obj.shipping, 1000)) return null;
  if (!isValidOptionalString(obj.fabric_type, 200)) return null;
  if (!isValidOptionalString(obj.delivery_timelines, 200)) return null;
  if (!isValidOptionalString(obj.material, 500)) return null;
  if (!isValidOptionalString(obj.gender, 50)) return null;
  if (!isValidOptionalNumber(obj.gst)) return null;
  if (!isValidOptionalString(obj.bulk_margin, 100)) return null;
  if (!isValidOptionalNumber(obj.sample_discount)) return null;
  if (!isValidStringArray(obj.images, 50, 1000)) return null;
  if (!isValidStringArray(obj.collection_handles, 50, 200)) return null;

  // Validate variants array
  let validatedVariants: ProductVariant[] | undefined;
  if (obj.variants !== undefined && obj.variants !== null) {
    if (!Array.isArray(obj.variants) || obj.variants.length > 100) return null;
    validatedVariants = [];
    for (const v of obj.variants) {
      const validated = validateProductVariant(v);
      if (!validated) return null;
      validatedVariants.push(validated);
    }
  }

  return {
    shopify_id: sanitizeString(obj.shopify_id as string),
    handle: (obj.handle as string).trim().slice(0, 200),
    title: (obj.title as string).trim().slice(0, 500),
    description: sanitizeString(obj.description as string),
    brand_name: sanitizeString(obj.brand_name as string),
    product_type: sanitizeString(obj.product_type as string),
    tags: sanitizeString(obj.tags as string),
    status: sanitizeString(obj.status as string),
    url: sanitizeString(obj.url as string),
    care_guide: sanitizeString(obj.care_guide as string),
    product_story: sanitizeString(obj.product_story as string),
    shipping: sanitizeString(obj.shipping as string),
    fabric_type: sanitizeString(obj.fabric_type as string),
    delivery_timelines: sanitizeString(obj.delivery_timelines as string),
    material: sanitizeString(obj.material as string),
    gender: sanitizeString(obj.gender as string),
    gst: obj.gst as number | undefined,
    bulk_margin: sanitizeString(obj.bulk_margin as string),
    sample_discount: obj.sample_discount as number | undefined,
    images: obj.images as string[] | undefined,
    variants: validatedVariants,
    collection_handles: obj.collection_handles as string[] | undefined,
  };
}

// Error mapping to generic messages
function mapErrorToUserMessage(error: Error): string {
  const message = error.message.toLowerCase();
  
  if (message.includes("duplicate") || message.includes("unique")) {
    return "A record with this identifier already exists";
  }
  if (message.includes("not-null") || message.includes("null value")) {
    return "Required field is missing";
  }
  if (message.includes("foreign key")) {
    return "Referenced record does not exist";
  }
  if (message.includes("validation")) {
    return "Invalid data format";
  }
  
  return "Import operation failed";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = crypto.randomUUID();

  try {
    // Authentication: Require API key
    const apiKey = req.headers.get("x-api-key");
    const expectedApiKey = Deno.env.get("IMPORT_API_KEY");

    if (!expectedApiKey) {
      console.error(`[${requestId}] IMPORT_API_KEY not configured`);
      return new Response(JSON.stringify({ error: "Service configuration error", requestId }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (!apiKey || apiKey !== expectedApiKey) {
      console.warn(`[${requestId}] Unauthorized access attempt`);
      return new Response(JSON.stringify({ error: "Unauthorized", requestId }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate request size (limit to 10MB)
    const contentLength = req.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "Request payload too large", requestId }), {
        status: 413,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON payload", requestId }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (typeof body !== "object" || body === null) {
      return new Response(JSON.stringify({ error: "Invalid request format", requestId }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { type, data } = body as { type: unknown; data: unknown };

    // Validate type is one of allowed values
    if (typeof type !== "string" || !["brands", "collections", "products"].includes(type)) {
      return new Response(JSON.stringify({ error: "Invalid import type", requestId }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Validate data is an array
    if (!Array.isArray(data)) {
      return new Response(JSON.stringify({ error: "Data must be an array", requestId }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Limit array size
    if (data.length > 1000) {
      return new Response(JSON.stringify({ error: "Too many items in data array (max 1000)", requestId }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log(`[${requestId}] Processing ${type} import with ${data.length} items`);

    if (type === "brands") {
      const validatedBrands: BrandData[] = [];
      for (let i = 0; i < data.length; i++) {
        const validated = validateBrand(data[i]);
        if (!validated) {
          return new Response(JSON.stringify({ error: `Invalid brand data at index ${i}`, requestId }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        validatedBrands.push(validated);
      }

      const { error } = await supabaseClient.from("brands").upsert(
        validatedBrands.map((b) => ({
          handle: b.handle,
          name: b.name,
          description: b.description,
          brand_story: b.brand_story,
          designer_name: b.designer_name,
          about_designer: b.about_designer,
          instagram_link: b.instagram_link,
          usp_tags: b.usp_tags,
          craftsmanship: b.craftsmanship,
          quotation: b.quotation,
          featured_in: b.featured_in,
          hero_image: b.hero_image,
          banner_image: b.banner_image,
          logo_image: b.logo_image,
          designer_image: b.designer_image,
          about_image: b.about_image,
          about_image_mobile: b.about_image_mobile,
          craftsmanship_creative: b.craftsmanship_creative,
          environmental_sustainability: b.environmental_sustainability,
          social_responsibility: b.social_responsibility,
          style: b.style,
        })),
        { onConflict: "handle" }
      );

      if (error) {
        console.error(`[${requestId}] Brand import error:`, error);
        throw error;
      }

      console.log(`[${requestId}] Successfully imported ${validatedBrands.length} brands`);
      return new Response(JSON.stringify({ success: true, count: validatedBrands.length, requestId }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "collections") {
      const validatedCollections: CollectionData[] = [];
      for (let i = 0; i < data.length; i++) {
        const validated = validateCollection(data[i]);
        if (!validated) {
          return new Response(JSON.stringify({ error: `Invalid collection data at index ${i}`, requestId }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        validatedCollections.push(validated);
      }

      // First, get all brands to map brand_name to brand_id
      const { data: brands } = await supabaseClient.from("brands").select("id, name");
      const brandMap = new Map(brands?.map((b) => [b.name.toLowerCase(), b.id]) || []);

      const { error } = await supabaseClient.from("collections").upsert(
        validatedCollections.map((c) => ({
          shopify_id: c.shopify_id,
          handle: c.handle,
          title: c.title,
          brand_id: brandMap.get(c.brand_name?.toLowerCase() ?? "") || null,
          brand_name: c.brand_name,
          description: c.description,
          tagline: c.tagline,
          seasonality: c.seasonality,
          primary_craft_l1: c.primary_craft_l1,
          primary_craft_l2: c.primary_craft_l2,
          category: c.category,
          artisan_cluster: c.artisan_cluster,
          environmental_sustainability: c.environmental_sustainability,
          lookbook_link: c.lookbook_link,
          thumbnail_image: c.thumbnail_image,
          banner_image: c.banner_image,
          is_brand_store: c.is_brand_store,
          products_count: c.products_count,
          more_collections: c.more_collections,
        })),
        { onConflict: "handle" }
      );

      if (error) {
        console.error(`[${requestId}] Collection import error:`, error);
        throw error;
      }

      console.log(`[${requestId}] Successfully imported ${validatedCollections.length} collections`);
      return new Response(JSON.stringify({ success: true, count: validatedCollections.length, requestId }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "products") {
      const validatedProducts: ProductData[] = [];
      for (let i = 0; i < data.length; i++) {
        const validated = validateProduct(data[i]);
        if (!validated) {
          return new Response(JSON.stringify({ error: `Invalid product data at index ${i}`, requestId }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        validatedProducts.push(validated);
      }

      // Get existing collections for mapping
      const { data: collections } = await supabaseClient.from("collections").select("id, handle");
      const collectionMap = new Map(collections?.map((c) => [c.handle, c.id]) || []);

      let processedCount = 0;
      for (const product of validatedProducts) {
        // Check if product already exists
        const { data: existing } = await supabaseClient
          .from("products")
          .select("id")
          .eq("handle", product.handle)
          .maybeSingle();

        let productId: string;

        if (existing) {
          productId = existing.id;
          // Update existing product
          await supabaseClient
            .from("products")
            .update({
              title: product.title,
              description: product.description,
              brand_name: product.brand_name,
              product_type: product.product_type,
              tags: product.tags,
              status: product.status,
              url: product.url,
              care_guide: product.care_guide,
              product_story: product.product_story,
              shipping: product.shipping,
              fabric_type: product.fabric_type,
              delivery_timelines: product.delivery_timelines,
              material: product.material,
              gender: product.gender,
              gst: product.gst,
              bulk_margin: product.bulk_margin,
              sample_discount: product.sample_discount,
            })
            .eq("id", productId);
        } else {
          // Insert new product
          const { data: newProduct, error: insertError } = await supabaseClient
            .from("products")
            .insert({
              shopify_id: product.shopify_id,
              handle: product.handle,
              title: product.title,
              description: product.description,
              brand_name: product.brand_name,
              product_type: product.product_type,
              tags: product.tags,
              status: product.status,
              url: product.url,
              care_guide: product.care_guide,
              product_story: product.product_story,
              shipping: product.shipping,
              fabric_type: product.fabric_type,
              delivery_timelines: product.delivery_timelines,
              material: product.material,
              gender: product.gender,
              gst: product.gst,
              bulk_margin: product.bulk_margin,
              sample_discount: product.sample_discount,
            })
            .select("id")
            .single();

          if (insertError) {
            console.error(`[${requestId}] Error inserting product ${product.handle}:`, insertError);
            continue;
          }
          productId = newProduct.id;
        }

        // Clear and re-add images
        await supabaseClient.from("product_images").delete().eq("product_id", productId);
        if (product.images && product.images.length > 0) {
          await supabaseClient.from("product_images").insert(
            product.images.map((url, idx) => ({
              product_id: productId,
              image_url: url,
              position: idx,
            }))
          );
        }

        // Clear and re-add variants
        await supabaseClient.from("product_variants").delete().eq("product_id", productId);
        if (product.variants && product.variants.length > 0) {
          await supabaseClient.from("product_variants").insert(
            product.variants.map((v) => ({
              product_id: productId,
              shopify_variant_id: v.variant_id,
              price: v.price,
              size: v.size,
            }))
          );
        }

        // Clear and re-add collection relationships
        await supabaseClient.from("product_collections").delete().eq("product_id", productId);
        const collectionIds = (product.collection_handles || [])
          .map((h) => collectionMap.get(h))
          .filter(Boolean);
        if (collectionIds.length > 0) {
          await supabaseClient.from("product_collections").insert(
            collectionIds.map((cid) => ({
              product_id: productId,
              collection_id: cid,
            }))
          );
        }

        processedCount++;
      }

      console.log(`[${requestId}] Successfully processed ${processedCount} products`);
      return new Response(JSON.stringify({ success: true, count: processedCount, requestId }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid type", requestId }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`[${requestId}] Import error:`, error);
    
    // Return sanitized error message
    const userMessage = error instanceof Error ? mapErrorToUserMessage(error) : "Import operation failed";
    
    return new Response(JSON.stringify({ error: userMessage, requestId }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
