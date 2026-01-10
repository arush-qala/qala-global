// Utility to parse CSV and prepare data for import
// This file processes the CSV data from Shopify export

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

// Parse JSON-like array strings from CSV
function parseArrayField(value: string): string[] {
  if (!value) return [];
  try {
    // Try parsing as JSON array first
    if (value.startsWith('[')) {
      return JSON.parse(value.replace(/\"/g, '\"'));
    }
    // Otherwise split by comma
    return value.split(',').map(s => s.trim()).filter(Boolean);
  } catch {
    return value.split(',').map(s => s.trim()).filter(Boolean);
  }
}

// Extract brands from collections CSV (brand-store template suffix entries)
export function extractBrandsFromCollections(csvRows: string[][]): BrandData[] {
  const brands: BrandData[] = [];
  const headers = csvRows[0];
  
  const getIndex = (name: string) => headers.findIndex(h => h.includes(name));
  
  for (let i = 1; i < csvRows.length; i++) {
    const row = csvRows[i];
    const templateSuffix = row[getIndex('Template Suffix')] || '';
    
    // Only process brand-store entries
    if (templateSuffix === 'brand-store') {
      const brandName = row[getIndex('custom.brand_name')] || row[getIndex('Title')] || '';
      
      brands.push({
        handle: row[getIndex('Handle')] || '',
        name: brandName,
        description: row[getIndex('custom.collection_description')] || '',
        brand_story: row[getIndex('custom.brand_story')] || '',
        designer_name: row[getIndex('custom.designer_name')] || '',
        about_designer: row[getIndex('custom.about_designer')] || '',
        instagram_link: row[getIndex('custom.brand_instagram_link')] || '',
        usp_tags: row[getIndex('custom.brand_usp_tags')] || '',
        craftsmanship: row[getIndex('custom.craftsmanship')] || '',
        quotation: row[getIndex('custom.quotation')] || '',
        featured_in: row[getIndex('custom.featured_in_tags')] || '',
        hero_image: row[getIndex('Image Src')] || '',
        banner_image: row[getIndex('custom.banner_collateral')] || '',
        logo_image: row[getIndex('custom.brand_logo')] || '',
        designer_image: row[getIndex('custom.brand_designer_image')] || '',
        about_image: row[getIndex('custom.about_brand_image')] || '',
        about_image_mobile: row[getIndex('custom.about_brand_image_mobile')] || '',
        craftsmanship_creative: row[getIndex('custom.brand_craftsmanship_creative')] || '',
        environmental_sustainability: parseArrayField(row[getIndex('custom.environmental_sustainability')] || ''),
        social_responsibility: parseArrayField(row[getIndex('custom.social_responsibility')] || ''),
        style: parseArrayField(row[getIndex('custom.style')] || ''),
      });
    }
  }
  
  return brands;
}

// Extract collections from CSV
export function extractCollections(csvRows: string[][]): CollectionData[] {
  const collections: CollectionData[] = [];
  const headers = csvRows[0];
  
  const getIndex = (name: string) => headers.findIndex(h => h.includes(name));
  
  for (let i = 1; i < csvRows.length; i++) {
    const row = csvRows[i];
    const templateSuffix = row[getIndex('Template Suffix')] || '';
    
    // Skip brand-store and brand-assembly entries - we want collection entries only
    if (templateSuffix !== 'brand-store' && templateSuffix !== 'brand-assembly-page') {
      const moreCollections: string[] = [];
      const mc1 = row[getIndex('custom.more_collections_1')] || '';
      const mc2 = row[getIndex('custom.more_collections_2')] || '';
      const mc3 = row[getIndex('custom.more_collections_3')] || '';
      if (mc1) moreCollections.push(mc1);
      if (mc2) moreCollections.push(mc2);
      if (mc3) moreCollections.push(mc3);
      
      collections.push({
        shopify_id: row[getIndex('ID')] || '',
        handle: row[getIndex('Handle')] || '',
        title: row[getIndex('Title')] || '',
        brand_name: row[getIndex('custom.brand_name')] || '',
        description: row[getIndex('custom.collection_description')] || '',
        tagline: row[getIndex('custom.collection_tagline')] || '',
        seasonality: row[getIndex('custom.seasonality')] || '',
        primary_craft_l1: row[getIndex('custom.primary_craft_l1')] || '',
        primary_craft_l2: row[getIndex('custom.primary_craft_l2')] || '',
        category: row[getIndex('custom.category')] || '',
        artisan_cluster: row[getIndex('custom.artisan_cluster')] || '',
        environmental_sustainability: parseArrayField(row[getIndex('custom.environmental_sustainability')] || ''),
        lookbook_link: row[getIndex('custom.lookbook_link')] || '',
        thumbnail_image: row[getIndex('custom.thumbnail_collateral')] || row[getIndex('Image Src')] || '',
        banner_image: row[getIndex('custom.banner_collateral')] || '',
        is_brand_store: templateSuffix === 'brand-store',
        products_count: parseInt(row[getIndex('Products Count')] || '0', 10),
        more_collections: moreCollections,
      });
    }
  }
  
  return collections;
}

// Extract products from CSV - group by handle to consolidate variants and images
export function extractProducts(csvRows: string[][]): ProductData[] {
  const headers = csvRows[0];
  const getIndex = (name: string) => headers.findIndex(h => h === name || h.includes(name));
  
  const productMap = new Map<string, ProductData>();
  
  for (let i = 1; i < csvRows.length; i++) {
    const row = csvRows[i];
    const handle = row[getIndex('Handle')] || '';
    if (!handle) continue;
    
    const imageUrl = row[getIndex('Image Src')] || '';
    const variantId = row[getIndex('Variant ID')] || '';
    const variantPrice = parseFloat(row[getIndex('Variant Price (INR)')] || '0');
    
    if (productMap.has(handle)) {
      // Add image and variant to existing product
      const existing = productMap.get(handle)!;
      if (imageUrl && !existing.images.includes(imageUrl)) {
        existing.images.push(imageUrl);
      }
      if (variantId && !existing.variants.find(v => v.variant_id === variantId)) {
        existing.variants.push({ variant_id: variantId, price: variantPrice });
      }
    } else {
      // Create new product entry
      const collectionHandles: string[] = [];
      const tags = row[getIndex('Tags')] || '';
      // Tags contain collection assignments
      if (tags) {
        tags.split(',').forEach(tag => {
          const t = tag.trim().toLowerCase().replace(/\s+/g, '_');
          if (t) collectionHandles.push(t);
        });
      }
      
      productMap.set(handle, {
        shopify_id: row[getIndex('ID')] || '',
        handle,
        title: row[getIndex('Title')] || '',
        description: row[getIndex('Body HTML')] || '',
        brand_name: row[getIndex('Brand- Vendor')] || row[getIndex('Vendor')] || '',
        product_type: row[getIndex('Type')] || '',
        tags: tags,
        status: row[getIndex('Status')] || 'Active',
        url: row[getIndex('URL')] || '',
        care_guide: row[getIndex('descriptors.care_guide')] || row[getIndex('descriptocare_guide')] || '',
        product_story: row[getIndex('custom.product_story')] || '',
        shipping: row[getIndex('custom.shipping')] || '',
        fabric_type: row[getIndex('custom.fabric_type')] || '',
        delivery_timelines: row[getIndex('custom.delivery_timelines')] || '',
        material: row[getIndex('custom.materialnew')] || '',
        gender: row[getIndex('custom.gender')] || '',
        gst: parseInt(row[getIndex('custom.gst')] || '0', 10),
        bulk_margin: row[getIndex('custom.bulk_margin')] || '',
        sample_discount: parseFloat(row[getIndex('custom.sample_discount')] || '0'),
        images: imageUrl ? [imageUrl] : [],
        variants: variantId ? [{ variant_id: variantId, price: variantPrice }] : [],
        collection_handles: collectionHandles,
      });
    }
  }
  
  return Array.from(productMap.values());
}

// Parse CSV string to 2D array
export function parseCSV(csvString: string): string[][] {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = '';
  let insideQuotes = false;
  
  for (let i = 0; i < csvString.length; i++) {
    const char = csvString[i];
    const nextChar = csvString[i + 1];
    
    if (char === '\"') {
      if (insideQuotes && nextChar === '\"') {
        currentCell += '\"';
        i++; // Skip next quote
      } else {
        insideQuotes = !insideQuotes;
      }
    } else if (char === ',' && !insideQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !insideQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // Skip \n after \r
      }
      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell);
        rows.push(currentRow);
        currentRow = [];
        currentCell = '';
      }
    } else {
      currentCell += char;
    }
  }
  
  // Handle last row
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }
  
  return rows;
}
