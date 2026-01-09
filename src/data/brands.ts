export interface Brand {
  id: string;
  slug: string;
  name: string;
  location: string;
  description: string;
  story: string;
  category: string;
  season: string;
  tags: string[];
  heroImage: string;
  collageImages: string[];
  collections: Collection[];
}

export interface Collection {
  id: string;
  slug: string;
  name: string;
  season: string;
  coverImage: string;
  description: string;
  products: Product[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  fabricDetails: string;
  description: string;
  sizes: string[];
}

// Hero slide data for homepage carousel
export const heroSlides = [
  {
    id: 1,
    brandSlug: 'asaii',
    brandName: 'Asaii',
    description: 'Asaii blends art with sustainability, crafting hand-painted, eco-conscious apparel.',
    category: 'Sustainable',
    season: 'Summer/Spring',
  },
  {
    id: 2,
    brandSlug: 'doodlage',
    brandName: 'Doodlage',
    description: 'Doodlage redefines sustainability by transforming discarded textiles into stylish, upcycled garments.',
    category: 'Sustainable',
    season: 'Summer/Spring',
  },
  {
    id: 3,
    brandSlug: 'margn',
    brandName: 'Margn',
    description: 'Margn builds its world at the intersection of craft and function.',
    category: 'Contemporary',
    season: 'Fall/Winter',
  },
  {
    id: 4,
    brandSlug: 'akhl',
    brandName: 'AKHL',
    description: 'AKHL is a visual innovator creating structured silhouettes inspired by post-modern architecture.',
    category: 'Avant-garde',
    season: 'Fall/Winter',
  },
  {
    id: 5,
    brandSlug: 'ituvana',
    brandName: 'Ituvana',
    description: 'Ituvana is a slow luxury label encouraging self-expression through free-flowing silhouettes.',
    category: 'Slow Luxury',
    season: 'Resortwear',
  },
];

export const brands: Brand[] = [
  {
    id: '1',
    slug: 'asaii',
    name: 'Asaii',
    location: 'India',
    description: 'Asaii blends art with sustainability, crafting hand-painted, eco-conscious apparel.',
    story: 'Asaii blends art with sustainability, crafting hand-painted, eco-conscious apparel. With timeless neutrals and mindful, small-batch production, each garment tells an enduring story of thoughtful creation and conscious style.',
    category: 'Sustainable',
    season: 'Summer/Spring',
    tags: ['Hand-painted', 'Eco-conscious', 'Small-batch', 'Timeless Neutrals'],
    heroImage: '/images/home/hero-doodlage.png',
    collageImages: [],
    collections: [],
  },
  {
    id: '2',
    slug: 'doodlage',
    name: 'Doodlage',
    location: 'New Delhi, India',
    description: 'Doodlage redefines sustainability by transforming discarded textiles into stylish, upcycled garments.',
    story: 'Doodlage redefines sustainability by transforming discarded textiles into stylish, upcycled garments. Rooted in circular design, the brand blends creativity with conscious fashion, proving that waste can be reimagined into timeless pieces.',
    category: 'Sustainable',
    season: 'Summer/Spring',
    tags: ['Upcycled', 'Circular Design', 'Conscious Fashion', 'Zero Waste'],
    heroImage: '/images/home/hero-doodlage.png',
    collageImages: [],
    collections: [],
  },
  {
    id: '3',
    slug: 'margn',
    name: 'Margn',
    location: 'India',
    description: 'Margn builds its world at the intersection of craft and function.',
    story: 'Margn builds its world at the intersection of craft and function, blending traditional techniques with modern, performance fabrics. Inspired by the need for protection, it explores how clothing connects us across cultures and time.',
    category: 'Contemporary',
    season: 'Fall/Winter',
    tags: ['Craft', 'Performance Fabrics', 'Traditional Techniques', 'Functional'],
    heroImage: '/images/home/hero-khara-kapas.png',
    collageImages: [],
    collections: [],
  },
  {
    id: '4',
    slug: 'akhl',
    name: 'AKHL',
    location: 'India',
    description: 'AKHL is a visual innovator creating structured silhouettes inspired by post-modern architecture.',
    story: 'AKHL is a visual innovator creating structured silhouettes inspired by post-modern architecture and installation art. Known for their gradient palettes and light-responsive surfaces, they focus on material exploration and new fabrication techniques.',
    category: 'Avant-garde',
    season: 'Fall/Winter',
    tags: ['Structured Silhouettes', 'Gradient Palettes', 'Material Exploration', 'Architectural'],
    heroImage: '/images/home/hero-naushad-ali.png',
    collageImages: [],
    collections: [],
  },
  {
    id: '5',
    slug: 'ituvana',
    name: 'Ituvana',
    location: 'India',
    description: 'Ituvana is a slow luxury label encouraging self-expression through free-flowing silhouettes.',
    story: "Ituvana—where 'the forest of bliss' meets conscious design—is a slow luxury label encouraging self-expression through free-flowing silhouettes, Indian-Indonesian roots, and timeless pieces crafted to evolve with the wearer.",
    category: 'Slow Luxury',
    season: 'Resortwear',
    tags: ['Slow Luxury', 'Free-flowing', 'Indian-Indonesian', 'Timeless'],
    heroImage: '/images/home/hero-ituvana.png',
    collageImages: [],
    collections: [],
  },
];

export const seasonOptions = ['Summer/Spring', 'Fall/Winter', 'Resortwear', 'Pre-Fall'];
export const categoryOptions = ['Dresses', 'Co-ord sets', 'Evening wear', 'Tops', 'Shirts', 'Pants', 'Outerwear', 'Accessories'];
