import {
  type ProductType,
  type ScentVariant,
  type DiscountTier,
  type CartBundle,
  type AddToCartRequest,
} from "@shared/schema";

const DISCOUNT_TIERS: DiscountTier[] = [
  { minItems: 2, discountPercent: 10 },
  { minItems: 3, discountPercent: 15 },
  { minItems: 4, discountPercent: 20 },
  { minItems: 5, discountPercent: 25 },
  { minItems: 6, discountPercent: 30 },
];

const SCENTS_CLASSIC = [
  "Vanilla Bliss",
  "Minted Cucumber",
  "Soft Powder",
  "Toasted Coconut",
  "Clean Tangerine",
  "Peony Rose",
  "Lavender Sage",
  "Fresh Alpine",
  "Unscented",
];

const SCENT_GRADIENTS: Record<string, [string, string]> = {
  "Vanilla Bliss": ["#FFF8E7", "#F5DEB3"],
  "Minted Cucumber": ["#E8F8F5", "#76D7C4"],
  "Soft Powder": ["#F8E8F0", "#D4A5C0"],
  "Toasted Coconut": ["#FDE68A", "#D97706"],
  "Clean Tangerine": ["#FFEDD5", "#FDBA74"],
  "Peony Rose": ["#FFE4E6", "#FDA4AF"],
  "Lavender Sage": ["#E8D5F5", "#C4B5FD"],
  "Fresh Alpine": ["#D1FAE5", "#6EE7B7"],
  "Unscented": ["#F3F4F6", "#D1D5DB"],
  "Fresh Spring": ["#ECFDF5", "#A7F3D0"],
  "Citrus Burst": ["#FEF9C3", "#FACC15"],
  "Ocean Breeze": ["#E0F2FE", "#7DD3FC"],
  "Jasmine Rose": ["#FCE7F3", "#F9A8D4"],
  "Warm Vanilla": ["#FEF3C7", "#FCD34D"],
  "Cotton Blossom": ["#F0FDF4", "#BBF7D0"],
  "Coconut Cream": ["#FFFBEB", "#FDE68A"],
  "Lemon Zest": ["#FEF9C3", "#FDE047"],
  "Eucalyptus Mint": ["#CCFBF1", "#2DD4BF"],
  "Spring Meadow": ["#F0FDF4", "#86EFAC"],
  "Wildflower": ["#FDF4FF", "#E879F9"],
};

function getGradient(name: string): [string, string] {
  return SCENT_GRADIENTS[name] || ["#F3F4F6", "#D1D5DB"];
}

let variantId = 1;

function makeVariants(
  productTypeId: number,
  scents: string[],
  unavailable: string[] = [],
  newScents: string[] = []
): ScentVariant[] {
  return scents.map((name) => ({
    id: variantId++,
    name,
    productTypeId,
    available: !unavailable.includes(name),
    gradientFrom: getGradient(name)[0],
    gradientTo: getGradient(name)[1],
    isNew: newScents.includes(name),
  }));
}

const PRODUCT_TYPES: ProductType[] = [
  {
    id: 1,
    name: "Aluminum-Free Solid Stick",
    price: 1500,
    category: "Deodorant",
    gradientFrom: "#F0FDF4",
    gradientTo: "#BBF7D0",
    variants: makeVariants(1, SCENTS_CLASSIC),
  },
  {
    id: 2,
    name: "Clinical Strength Sweat Control Solid",
    price: 1500,
    category: "Deodorant",
    gradientFrom: "#EFF6FF",
    gradientTo: "#93C5FD",
    variants: makeVariants(
      2,
      ["Vanilla Bliss", "Fresh Spring", "Soft Powder"],
      [],
      ["Vanilla Bliss", "Fresh Spring"]
    ),
  },
  {
    id: 3,
    name: "Aluminum-Free Spray",
    price: 1500,
    category: "Deodorant",
    gradientFrom: "#F5F3FF",
    gradientTo: "#C4B5FD",
    variants: makeVariants(
      3,
      ["Vanilla Bliss", "Soft Powder", "Lavender Sage", "Unscented", "Clean Tangerine"],
      ["Unscented"],
      ["Vanilla Bliss"]
    ),
  },
  {
    id: 4,
    name: "Sweat Control Spray",
    price: 1500,
    category: "Deodorant",
    gradientFrom: "#ECFDF5",
    gradientTo: "#6EE7B7",
    variants: makeVariants(
      4,
      ["Vanilla Bliss", "Soft Powder", "Clean Tangerine"],
      [],
      ["Vanilla Bliss", "Soft Powder", "Clean Tangerine"]
    ),
  },
  {
    id: 5,
    name: "Aluminum-Free Cream Tube",
    price: 2000,
    category: "Deodorant",
    gradientFrom: "#FFF7ED",
    gradientTo: "#FDBA74",
    variants: makeVariants(5, SCENTS_CLASSIC),
  },
  {
    id: 6,
    name: "Sweat Control Tube",
    price: 2000,
    category: "Deodorant",
    gradientFrom: "#FDF2F8",
    gradientTo: "#F9A8D4",
    variants: makeVariants(
      6,
      ["Soft Powder", "Clean Tangerine", "Lavender Sage", "Unscented"],
      ["Soft Powder", "Lavender Sage"]
    ),
  },
  {
    id: 7,
    name: "Aluminum-Free Cream Stick",
    price: 1500,
    category: "Deodorant",
    gradientFrom: "#FFFBEB",
    gradientTo: "#FDE68A",
    variants: makeVariants(7, SCENTS_CLASSIC),
  },
  {
    id: 8,
    name: "Acidified Body Wash",
    price: 1500,
    category: "Wash",
    gradientFrom: "#E0F2FE",
    gradientTo: "#7DD3FC",
    variants: makeVariants(
      8,
      ["Vanilla Bliss", "Soft Powder", "Toasted Coconut", "Clean Tangerine", "Lavender Sage", "Fresh Alpine", "Unscented"],
    ),
  },
  {
    id: 9,
    name: "Moisturizing Body Wash",
    price: 1800,
    category: "Wash",
    gradientFrom: "#FCE7F3",
    gradientTo: "#F9A8D4",
    variants: makeVariants(
      9,
      ["Warm Vanilla", "Jasmine Rose", "Coconut Cream"],
      [],
      ["Warm Vanilla", "Jasmine Rose", "Coconut Cream"]
    ),
  },
  {
    id: 10,
    name: "Deodorant Wipes (24 ct)",
    price: 1000,
    category: "Wipes",
    gradientFrom: "#F0FDF4",
    gradientTo: "#86EFAC",
    variants: makeVariants(
      10,
      ["Soft Powder", "Toasted Coconut", "Clean Tangerine", "Lavender Sage", "Unscented"],
    ),
  },
  {
    id: 11,
    name: "Flushable Wipes (48 ct)",
    price: 800,
    category: "Wipes",
    gradientFrom: "#ECFDF5",
    gradientTo: "#A7F3D0",
    variants: makeVariants(
      11,
      ["Fresh Spring", "Unscented"],
      [],
      ["Fresh Spring"]
    ),
  },
  {
    id: 12,
    name: "Natural Soap Bar",
    price: 800,
    category: "Soap",
    gradientFrom: "#FFFBEB",
    gradientTo: "#FCD34D",
    variants: makeVariants(
      12,
      ["Lavender Sage", "Fresh Alpine", "Warm Vanilla", "Unscented"],
    ),
  },
  {
    id: 13,
    name: "Whipped Body Cream",
    price: 1800,
    category: "Body Cream",
    gradientFrom: "#FDF4FF",
    gradientTo: "#E879F9",
    variants: makeVariants(
      13,
      ["Vanilla Bliss", "Toasted Coconut", "Lavender Sage", "Unscented"],
    ),
  },
  {
    id: 14,
    name: "Brightening Body Cream",
    price: 2000,
    category: "Body Cream",
    gradientFrom: "#FEF3C7",
    gradientTo: "#F59E0B",
    variants: makeVariants(
      14,
      ["Vanilla Bliss", "Soft Powder"],
      [],
      ["Vanilla Bliss", "Soft Powder"]
    ),
  },
  {
    id: 15,
    name: "Laundry Booster",
    price: 2200,
    category: "Laundry",
    gradientFrom: "#EFF6FF",
    gradientTo: "#60A5FA",
    variants: makeVariants(
      15,
      ["Spring Meadow", "Unscented"],
    ),
  },
  {
    id: 16,
    name: "Shower Pouf",
    price: 600,
    category: "Wash",
    gradientFrom: "#F0F9FF",
    gradientTo: "#BAE6FD",
    variants: makeVariants(16, ["Shower Pouf"]),
  },
  {
    id: 17,
    name: "Stain Remover Stick",
    price: 900,
    category: "Laundry",
    gradientFrom: "#F0FDF4",
    gradientTo: "#86EFAC",
    variants: makeVariants(17, ["Stain Remover Stick"]),
  },
  {
    id: 18,
    name: "Deodorant Travel Mini",
    price: 500,
    category: "Deodorant",
    gradientFrom: "#FFF1F2",
    gradientTo: "#FECDD3",
    variants: makeVariants(18, ["Deodorant Travel Mini"]),
  },
  {
    id: 19,
    name: "Exfoliating Body Bar",
    price: 1000,
    category: "Soap",
    gradientFrom: "#FEF3C7",
    gradientTo: "#FDE68A",
    variants: makeVariants(19, ["Exfoliating Body Bar"]),
  },
];

export interface IStorage {
  getProductTypes(): Promise<ProductType[]>;
  getProductTypesByCategory(category: string): Promise<ProductType[]>;
  getCategories(): Promise<string[]>;
  getDiscountTiers(): Promise<DiscountTier[]>;
  getDiscountForCount(itemCount: number): number;
  createCartBundle(data: AddToCartRequest): Promise<CartBundle>;
}

export class MemStorage implements IStorage {
  async getProductTypes(): Promise<ProductType[]> {
    return PRODUCT_TYPES;
  }

  async getProductTypesByCategory(category: string): Promise<ProductType[]> {
    return PRODUCT_TYPES.filter((p) => p.category === category);
  }

  async getCategories(): Promise<string[]> {
    const cats = new Set(PRODUCT_TYPES.map((p) => p.category));
    return Array.from(cats);
  }

  async getDiscountTiers(): Promise<DiscountTier[]> {
    return DISCOUNT_TIERS;
  }

  getDiscountForCount(itemCount: number): number {
    let discount = 0;
    for (const tier of DISCOUNT_TIERS) {
      if (itemCount >= tier.minItems) {
        discount = tier.discountPercent;
      }
    }
    return discount;
  }

  async createCartBundle(data: AddToCartRequest): Promise<CartBundle> {
    const bundleItems: CartBundle["items"] = [];
    let totalItemCount = 0;

    for (const item of data.items) {
      let foundVariant: ScentVariant | undefined;
      let foundType: ProductType | undefined;

      for (const pt of PRODUCT_TYPES) {
        const v = pt.variants.find((sv) => sv.id === item.variantId);
        if (v) {
          foundVariant = v;
          foundType = pt;
          break;
        }
      }

      if (!foundVariant || !foundType) {
        throw new Error(`Variant ${item.variantId} not found`);
      }
      if (!foundVariant.available) {
        throw new Error(`${foundVariant.name} (${foundType.name}) is out of stock`);
      }

      bundleItems.push({
        variant: foundVariant,
        productType: foundType,
        quantity: item.quantity,
      });
      totalItemCount += item.quantity;
    }

    const subtotal = bundleItems.reduce(
      (sum, bi) => sum + bi.productType.price * bi.quantity,
      0
    );
    const discountPercent = this.getDiscountForCount(totalItemCount);
    const discount = Math.round(subtotal * (discountPercent / 100));
    const total = subtotal - discount;

    return {
      items: bundleItems,
      itemCount: totalItemCount,
      subtotal,
      discountPercent,
      discount,
      total,
    };
  }
}

export const storage = new MemStorage();
