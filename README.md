# Shopify Bundle Builder — Dawn Theme Section

A native Shopify Dawn 15.2.0 theme section that lets customers build product bundles with progressive volume discounts. Built entirely with **Liquid**, **vanilla CSS**, and **vanilla JavaScript** — no React, no Node, no build tools.

## Files

| File | Destination in Dawn Theme |
|------|--------------------------|
| `sections/bundle-builder.liquid` | `sections/` |
| `assets/bundle-builder.css` | `assets/` |
| `assets/bundle-builder.js` | `assets/` |

## Installation

1. Download the three files above
2. In your Shopify admin, go to **Online Store → Themes → Edit code**
3. Upload `bundle-builder.css` and `bundle-builder.js` to the **Assets** folder
4. Create a new file `bundle-builder.liquid` in the **Sections** folder and paste the contents
5. Go to **Online Store → Themes → Customize**
6. Add the **Bundle Builder** section to any page template

## Features

- **Product grid** with expandable scent/variant panels (accordion row)
- **Direct-add cards** for single-variant products (Add / +/- controls inline)
- **Progressive discount tiers** (configurable via theme editor, e.g. 2+ = 10%, 3+ = 15%, up to 6+ = 30%)
- **Sticky cart bar** with live item count, total, savings display, and tier progress bar
- **Bottom drawer** to review bundle, adjust quantities, and add to cart
- **Category tabs** with smooth-scroll navigation
- **Responsive grid**: 4 columns desktop, 3 tablet, 2 mobile
- **Shopify AJAX Cart API** integration (`/cart/add.js`)
- **Theme editor schema** with full settings for hero text, review count, discount tiers, and category blocks with collection pickers

## Theme Editor Configuration

### Section Settings
- **Hero**: heading lines, description, review count, max savings badge toggle
- **Discount Tiers 1-5**: each tier has a minimum item count and discount percentage

### Category Blocks
Add one block per product category. Each block has:
- **Category Title**: displayed as tab label and section header
- **Collection**: Shopify collection picker — products from this collection appear in the category
- **Icon SVG** (optional): paste an SVG string for the category tab icon

## How It Works

1. The **Liquid template** renders the hero, tab bar shell, category grid shell, and sticky cart bar shell
2. Product/variant data from Shopify collections is serialized into a `<script type="application/json">` block
3. The **vanilla JavaScript** reads that JSON, dynamically builds the product cards, handles expand/collapse, manages local cart state, and renders the sticky bar + drawer
4. When the customer clicks **Add to Cart**, the JS posts to Shopify's `/cart/add.js` endpoint
5. A `bundle-builder:cart-add` custom event is dispatched so other theme scripts (e.g. cart drawer) can react

## Product Setup in Shopify

- Each **product** in your collection represents a product type (e.g. "Aluminum-Free Solid Stick")
- Each **variant** on that product represents a scent/option (e.g. "Vanilla Bliss", "Lavender Sage")
- Optional **metafields** (namespace: `custom`):
  - `gradient_from` / `gradient_to` on products and variants — hex color for gradient backgrounds
  - `is_new` on variants — boolean, shows a "New!" badge

## Discount Implementation

The section displays discount tiers visually. To apply actual discounts at checkout, pair with:
- **Shopify Scripts** (Plus plans)
- **Shopify Functions** (discount app)
- **Automatic discounts** configured in Shopify admin

## Browser Support

Tested on all modern browsers. Uses `fetch`, `closest()`, `CustomEvent`, CSS Grid, and `aspect-ratio` — all widely supported.

## License

MIT
