# Qala — Luxury B2B Fashion Sourcing Platform

Qala is a premium B2B sourcing platform connecting boutique buyers with independent designer fashion labels. The platform prioritizes a "luxury tech" aesthetic with high-end visuals and intuitive simplicity, designed for discerning buyers who value personal relationships and curated styling experiences.

---

## 🎯 Project Overview

**Target Users:** Boutique buyers (primarily women aged 40-60) seeking to source independent designer fashion for their retail stores.

**Core Value Proposition:** A curated, visual-first discovery experience that mirrors the intimacy of in-person showroom visits, enabling buyers to explore brands, build assortments, and place orders or schedule appointments.

---

## 🏗️ Technology Stack

- **Frontend:** React 18 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS with custom design tokens
- **Animations:** Framer Motion
- **Backend:** Lovable Cloud (Supabase)
- **UI Components:** shadcn/ui + Radix primitives

---

## 🎨 Design System

### Color Palette
| Token | Color | Usage |
|-------|-------|-------|
| Background | White/Ivory | Primary backgrounds |
| Sand | #F5F5F5 | Secondary backgrounds |
| Warm Grey | #E5E5E5 | Borders, dividers |
| Taupe | #666666 | Muted text |
| Charcoal | #2C2C2C | Primary text |
| Gold | #B8956A | Accent, CTAs, highlights |

### Typography
- **Headings:** Cormorant Garamond (serif, elegant)
- **Body:** Inter (sans-serif, readable)
- **Base size:** 12px for luxury aesthetic

---

## 📄 Pages & User Flows

### 1. Homepage (`/`)

**Purpose:** Brand introduction and entry point to discovery.

**Features:**
- Full-screen hero carousel with auto-advancing brand imagery (4s intervals, 0.8s crossfade)
- Statement overlay with category/season selectors
- Brand timeline navigation at bottom
- Full-screen luxury overlay selector for filtering options

**User Flow:**
1. User lands on homepage → sees rotating hero imagery
2. Clicks category or season → full-screen selector appears
3. Makes selection → navigates to Discover page with filters applied

---

### 2. Discover (`/discover`)

**Purpose:** Browse and explore the brand portfolio.

**Features:**
- Full-viewport experience (no vertical scrolling)
- Vertical scroll input switches between brands
- 6-image grid showcasing each brand's aesthetic
- Brand info panel with location, story, and tags
- Bottom tab navigation for direct brand selection
- "View Brand Store" and "More brands like this" CTAs

**User Flow:**
1. User scrolls vertically → brand switches
2. Views brand imagery and story
3. Clicks "View Brand Store" → navigates to brand storefront

**Note:** Assortment bar is hidden on this page.

---

### 3. Brand Storefront (`/brands/:slug`)

**Purpose:** Deep dive into a specific brand's identity and collections.

**Sections:**
1. **Hero Banner:** Full-width brand imagery with logo overlay
2. **Brand Story:** Mission, craftsmanship description
3. **Latest Collection:** Horizontal scrolling product preview
4. **The Process:** 3-column edge-to-edge layout showing craft/production
5. **Full-Width Media Break:** Video or image visual interlude
6. **Geotags:** Origin/artisan cluster information with icons
7. **More Collections:** Additional collection thumbnails

**Features:**
- Sticky top bar with back navigation
- Consistent horizontal margins (px-8 lg:px-16)
- Lookbook scroll integration

**User Flow:**
1. User explores brand narrative
2. Clicks on a collection → navigates to collection detail

---

### 4. Collection Detail (`/brands/:slug/collections/:collectionSlug`)

**Purpose:** Browse and select individual products from a collection.

**Features:**
- Collection hero with description and instruction banner
- Horizontal product rail with scroll interception
- Product cards with quick-add functionality
- Product Detail Overlay (Focus Mode):
  - 3-up layout with adjacent product previews
  - Vertical image stack (primary interaction)
  - Right panel with product details (appears on scroll)
  - "Select This Style" button with pulse animation
- Flying Thumbnail animation on selection
- Inline Assortment Bar for immediate feedback

**User Flow:**
1. User scrolls horizontally through products
2. Clicks product → Focus Mode overlay opens
3. Scrolls images → detail panel reveals
4. Clicks "Select This Style" → product added to assortment
5. Continues browsing or proceeds to Experience hub

---

### 5. Experience Hub (`/experience`)

**Purpose:** Choose how to engage with selected products.

**Features:**
- Selection count display
- Four experience options:
  1. **Order Sample Crate** — Physical sampling (up to 5 pieces)
  2. **Request Private Showcase** — White-glove trunk show service
  3. **Meet at a Tradeshow** — RSVP for booth appointments
  4. **Place B2B Order** — Bulk ordering with tiered pricing

**Layout:** 3-column grid for top options, full-width B2B order below

**User Flow:**
1. User reviews selection count
2. Chooses engagement method
3. Navigates to specific experience page

---

### 6. Sample Crate (`/experience/sample-crate`)

**Purpose:** Select sizes for physical product samples.

**Features:**
- Product grid with size selection modals
- Table-style size interface (XS-XL) with measurements
- Unit toggle (inches/cm)
- Mandatory size selection before adding
- Dynamic bottom bar showing selection progress
- Size badge on selected product images

**User Flow:**
1. User clicks product image or "Add" button
2. Size selection modal appears
3. Selects size → product marked as selected
4. Proceeds to checkout when ready

---

### 7. Sample Crate Checkout (`/experience/sample-crate/checkout`)

**Purpose:** Complete sample order with shipping details.

**Features:**
- Order summary with selected items
- Shipping form with Zod validation
- Success state confirmation

---

### 8. B2B Order (`/experience/b2b-order`)

**Purpose:** Place bulk orders with quantity selection per size.

**Features:**
- Inline quantity selection grid (XS-XL) per product
- Customization notes field
- Sticky right sidebar with:
  - Designer Appointment CTA
  - Billing breakdown with duties
  - Tiered bulk pricing display

**User Flow:**
1. User enters quantities per size for each product
2. Reviews order summary and pricing
3. Proceeds to checkout

---

### 9. B2B Order Checkout (`/experience/b2b-order/checkout`)

**Purpose:** Complete bulk order submission.

**Features:**
- Full order review
- Shipping form with validation
- Order confirmation

---

### 10. Private Showcase (`/experience/private-showcase`)

**Purpose:** Schedule a private trunk show at buyer's boutique.

**Features:**
- Appointment request form
- Brand representative coordination
- White-glove service description

---

### 11. Trade Show (`/experience/trade-show`)

**Purpose:** RSVP for brand booth appointments at fashion events.

**Features:**
- Upcoming event listings
- "Brands Present" section with attending brand tags
- RSVP functionality

---

## 🛒 Assortment System

The global assortment system tracks product selections across the platform.

**Components:**
- **AssortmentContext:** Global state management for selections
- **AssortmentTray:** Bottom bar showing selection count (hidden on homepage, discover, sample crate, B2B order pages)
- **FlyingThumbnail:** Animation when adding products
- **InlineAssortmentBar:** Immediate feedback within product overlays

**Features:**
- Horizontal drag-and-drop reordering
- Persistent selection across navigation
- "Save & Proceed" triggers scroll-to-top reset
- Last collection URL preservation for "Back" navigation

---

## 🧭 Navigation Patterns

### Keyboard Navigation
- **ArrowLeft/ArrowRight:** Product/brand switching
- **Escape:** Close overlays

### Scroll Behaviors
- Vertical scroll hijacking on Discover page (switches brands)
- Horizontal scroll for product rails
- Scroll progress indicator with visual bar and counter

### Top Bar
- Shared `TopBar` component across experience pages
- Sticky positioning with solid background
- Consistent styling: `py-6`, `border-b border-border`
- `BackButton` component for navigation

---

## 📁 Project Structure

```
src/
├── components/
│   ├── assortment/        # Assortment tray, flying thumbnail
│   ├── brand/             # Lookbook scroll, brand-specific
│   ├── home/              # Hero carousel, statement overlay, timeline
│   ├── layout/            # Header, Footer, TopBar, CTAGuidance
│   └── ui/                # shadcn/ui components
├── contexts/
│   └── AssortmentContext  # Global selection state
├── data/
│   └── brands.ts          # Static brand data
├── hooks/
│   ├── useBrands.ts       # Brand data fetching
│   ├── useCollections.ts  # Collection data fetching
│   └── useProducts.ts     # Product data fetching
├── pages/
│   ├── Index.tsx          # Homepage
│   ├── Discover.tsx       # Brand discovery
│   ├── BrandStorefront.tsx
│   ├── CollectionDetail.tsx
│   ├── Experience.tsx     # Experience hub
│   └── experience/        # Sub-experiences (sample crate, B2B, etc.)
├── integrations/
│   └── supabase/          # Database client and types
└── lib/
    └── utils.ts           # Utility functions
```

---

## 🗄️ Database Schema

### Tables
- **brands:** Brand profiles, stories, imagery, sustainability info
- **collections:** Collection metadata, lookbooks, seasonality
- **products:** Product details, pricing, sizing, materials
- **product_images:** Product image gallery
- **product_variants:** Size/price variants
- **product_collections:** Many-to-many product-collection relationships

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or bun

### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables
Environment variables are auto-configured via Lovable Cloud integration.

---

## 📱 Responsive Design

The platform is optimized for:
- Desktop (primary experience)
- Tablet (adapted layouts)
- Mobile (simplified navigation, touch-optimized)

---

## 🔗 External Resources

- **Lovable Project:** [Edit in Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID)
- **Live Site:** [qala-global.lovable.app](https://qala-global.lovable.app)

---

## 📄 License

Proprietary — All rights reserved.
