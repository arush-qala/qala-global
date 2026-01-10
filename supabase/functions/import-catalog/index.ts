import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface BrandData {
  handle: string;
  name: string;
  description: string;
  brand_story: string;
  designer_name: string;
  about_designer: string;
  instagram_link: string;
  usp_tags: string;
  craftsmanship: string;
  quotation: string;
  featured_in: string;
  hero_image: string;
  banner_image: string;
  logo_image: string;
  designer_image: string;
  about_image: string;
  about_image_mobile: string;
  craftsmanship_creative: string;
  environmental_sustainability: string[];
  social_responsibility: string[];
  style: string[];
}

interface CollectionData {
  shopify_id: string;
  handle: string;
  title: string;
  brand_name: string;
  description: string;
  tagline: string;
  seasonality: string;
  primary_craft_l1: string;
  primary_craft_l2: string;
  category: string;
  artisan_cluster: string;
  environmental_sustainability: string[];
  lookbook_link: string;
  thumbnail_image: string;
  banner_image: string;
  is_brand_store: boolean;
  products_count: number;
  more_collections: string[];
}

interface ProductData {
  shopify_id: string;
  handle: string;
  title: string;
  description: string;
  brand_name: string;
  product_type: string;
  tags: string;
  status: string;
  url: string;
  care_guide: string;
  product_story: string;
  shipping: string;
  fabric_type: string;
  delivery_timelines: string;
  material: string;
  gender: string;
  gst: number;
  bulk_margin: string;
  sample_discount: number;
  images: string[];
  variants: { variant_id: string; price: number }[];
  collection_handles: string[];
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { type, data } = await req.json();

    if (type === "brands") {
      const brands = data as BrandData[];
      const { error } = await supabaseClient.from("brands").upsert(
        brands.map((b) => ({
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

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, count: brands.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "collections") {
      const collections = data as CollectionData[];
      
      // First, get all brands to map brand_name to brand_id
      const { data: brands } = await supabaseClient.from("brands").select("id, name");
      const brandMap = new Map(brands?.map((b) => [b.name.toLowerCase(), b.id]) || []);

      const { error } = await supabaseClient.from("collections").upsert(
        collections.map((c) => ({
          shopify_id: c.shopify_id,
          handle: c.handle,
          title: c.title,
          brand_id: brandMap.get(c.brand_name?.toLowerCase()) || null,
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

      if (error) throw error;
      return new Response(JSON.stringify({ success: true, count: collections.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "products") {
      const products = data as ProductData[];
      
      // Get existing collections for mapping
      const { data: collections } = await supabaseClient.from("collections").select("id, handle");
      const collectionMap = new Map(collections?.map((c) => [c.handle, c.id]) || []);

      for (const product of products) {
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
            console.error("Error inserting product:", insertError);
            continue;
          }
          productId = newProduct.id;
        }

        // Clear and re-add images
        await supabaseClient.from("product_images").delete().eq("product_id", productId);
        if (product.images.length > 0) {
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
        if (product.variants.length > 0) {
          await supabaseClient.from("product_variants").insert(
            product.variants.map((v) => ({
              product_id: productId,
              shopify_variant_id: v.variant_id,
              price: v.price,
            }))
          );
        }

        // Clear and re-add collection relationships
        await supabaseClient.from("product_collections").delete().eq("product_id", productId);
        const collectionIds = product.collection_handles
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
      }

      return new Response(JSON.stringify({ success: true, count: products.length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Invalid type" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Import error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
