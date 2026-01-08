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
    brandSlug: 'doodlage',
    brandName: 'Doodlage',
    description: 'Upcycled factory waste into short limited edition collections.',
    category: 'Sustainable',
    season: 'Summer/Spring',
  },
  {
    id: 2,
    brandSlug: 'ituvana',
    brandName: 'Ituvana',
    description: 'Minimalist silhouettes crafted from handwoven textiles.',
    category: 'Minimalist',
    season: 'Resortwear',
  },
  {
    id: 3,
    brandSlug: 'khara-kapas',
    brandName: 'Khara Kapas',
    description: 'Pure mulmul cotton designs for the modern bohemian.',
    category: 'Cotton',
    season: 'Summer/Spring',
  },
  {
    id: 4,
    brandSlug: 'naushad-ali',
    brandName: 'Naushad Ali',
    description: 'Contemporary design meeting traditional craftsmanship.',
    category: 'Contemporary',
    season: 'Fall/Winter',
  },
  {
    id: 5,
    brandSlug: 'capisvirleo',
    brandName: 'Capisvirleo',
    description: 'Luxury aesthetics tailored for the bold.',
    category: 'Luxury',
    season: 'Evening Wear',
  },
];

export const brands: Brand[] = [
  {
    id: '1',
    slug: 'doodlage',
    name: 'Doodlage',
    location: 'New Delhi, India',
    description: 'Upcycled factory waste into short limited edition collections.',
    story: 'Founded in 2012, Doodlage is a pioneering sustainable fashion label that transforms discarded factory waste into limited edition luxury pieces. Each collection tells a unique story of environmental consciousness and artisanal craftsmanship.',
    category: 'Sustainable',
    season: 'Summer/Spring',
    tags: ['Ethical', 'Upcycled', 'Limited Edition', 'Sustainable'],
    heroImage: '/images/home/hero-doodlage.jpg',
    collageImages: [],
    collections: [
      {
        id: 'c1',
        slug: 'spring-24',
        name: 'Spring Awakening',
        season: 'Spring 2024',
        coverImage: '',
        description: 'A celebration of renewal through sustainable fashion.',
        products: [],
      },
    ],
  },
  {
    id: '2',
    slug: 'ituvana',
    name: 'Ituvana',
    location: 'Mumbai, India',
    description: 'Minimalist silhouettes crafted from handwoven textiles.',
    story: 'Ituvana believes in the power of simplicity. Our handwoven textiles are sourced from master weavers across India, transformed into timeless pieces that transcend seasons and trends.',
    category: 'Minimalist',
    season: 'Resortwear',
    tags: ['Handwoven', 'Minimalist', 'Pure Cotton', 'Artisanal'],
    heroImage: '/images/home/hero-ituvana.jpg',
    collageImages: [],
    collections: [],
  },
  {
    id: '3',
    slug: 'khara-kapas',
    name: 'Khara Kapas',
    location: 'Jaipur, India',
    description: 'Pure mulmul cotton designs for the modern bohemian.',
    story: 'Khara Kapas celebrates the beauty of pure cotton in its most refined form. Our mulmul fabrics are handspun and naturally dyed, creating pieces that feel like a gentle embrace.',
    category: 'Cotton',
    season: 'Summer/Spring',
    tags: ['Pure Cotton', 'Hand Dyeing', 'Bohemian', 'Natural'],
    heroImage: '/images/home/hero-khara-kapas.jpg',
    collageImages: [],
    collections: [],
  },
  {
    id: '4',
    slug: 'naushad-ali',
    name: 'Naushad Ali',
    location: 'Lucknow, India',
    description: 'Contemporary design meeting traditional craftsmanship.',
    story: 'Naushad Ali bridges the gap between heritage craftsmanship and contemporary design. Each piece showcases intricate embroidery techniques passed down through generations of master artisans.',
    category: 'Contemporary',
    season: 'Fall/Winter',
    tags: ['Embroidery', 'Heritage', 'Contemporary', 'Artisanal'],
    heroImage: '/images/home/hero-naushad-ali.jpg',
    collageImages: [],
    collections: [],
  },
  {
    id: '5',
    slug: 'capisvirleo',
    name: 'Capisvirleo',
    location: 'Milan, Italy',
    description: 'Luxury aesthetics tailored for the bold.',
    story: 'Capisvirleo is for those who dare to stand out. Our evening wear collection combines Italian tailoring excellence with bold, statement-making designs.',
    category: 'Luxury',
    season: 'Evening Wear',
    tags: ['Luxury', 'Evening Wear', 'Bold', 'Italian Tailoring'],
    heroImage: '/images/home/hero-capisvirleo.jpg',
    collageImages: [],
    collections: [],
  },
];

export const seasonOptions = ['Summer/Spring', 'Fall/Winter', 'Resortwear', 'Pre-Fall'];
export const categoryOptions = ['Dresses', 'Co-ord sets', 'Evening wear', 'Tops', 'Shirts', 'Pants', 'Outerwear', 'Accessories'];
