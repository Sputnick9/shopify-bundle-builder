# Shopify Bundle Builder Tool

## Overview
A Shopify-inspired bundle builder web application modeled after the Lume Deodorant bundle builder. Customers can browse product types, expand to see scent variants, add items to their bundle, and receive progressive discounts.

## Architecture
- **Frontend**: React with TypeScript, TailwindCSS, shadcn/ui components, Framer Motion animations
- **Backend**: Express.js with in-memory storage (sample product data)
- **Routing**: wouter for client-side routing
- **State Management**: TanStack React Query for server state, React useState for UI state

## Key Features
- **Progressive Discounts**: 2+ items = 10%, 3+ = 15%, 4+ = 20%, 5+ = 25%, 6+ = 30%
- **Product Types with Scent Variants**: Expandable accordion-style cards in 4-column grid (3 on tablet, 2 on mobile); accordion panel drops below the current row spanning full width
- **All Products on One Page**: Products grouped by category sections (Deodorant, Wash, Wipes, Soap, Body Cream, Laundry) on a single scrollable page
- **Category Anchor Navigation**: Category tabs act as anchor links that smooth-scroll to the corresponding section
- **Quantity Controls**: +/- buttons for each scent variant
- **Sticky Bottom Cart Bar with Progress Bar**: Shows live totals, savings, item count; includes an animated progress bar showing discount tier milestones and current progress
- **Out-of-Stock Handling**: Disabled variants with "Sold Out" label
- **New Product Badges**: "New!" badge on recently added variants
- **AJAX Cart**: Add bundle without page reload, with success toast notifications

## File Structure
```
shared/schema.ts                    - TypeScript types (ProductType, ScentVariant, CartItem, DiscountTier)
server/storage.ts                   - In-memory storage with 15 product types, ~70+ scent variants
server/routes.ts                    - API endpoints
client/src/App.tsx                  - Router setup
client/src/pages/
  bundle-builder.tsx                - Main page: hero, category tabs, product list, cart bar
client/src/components/
  product-type-card.tsx             - Expandable product type card with scent variant horizontal scroll
  bundle-summary.tsx                - Sticky bottom cart bar + sheet with item list and pricing
```

## API Endpoints
- `GET /api/products` - Returns all product types with their scent variants
- `GET /api/categories` - Returns list of product categories
- `GET /api/discount-tiers` - Returns discount tier configurations
- `POST /api/cart/bundle` - Adds bundle to cart (validates variants, applies progressive discount)

## Theme
- Primary color: Teal (162 hue)
- Font: Plus Jakarta Sans
- Design: Clean e-commerce aesthetic matching Lume Deodorant's bundle builder pattern
