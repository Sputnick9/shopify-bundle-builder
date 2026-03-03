import { z } from "zod";

export interface ScentVariant {
  id: number;
  name: string;
  productTypeId: number;
  available: boolean;
  gradientFrom: string;
  gradientTo: string;
  isNew?: boolean;
}

export interface ProductType {
  id: number;
  name: string;
  price: number;
  category: string;
  gradientFrom: string;
  gradientTo: string;
  variants: ScentVariant[];
}

export interface DiscountTier {
  minItems: number;
  discountPercent: number;
}

export interface CartItem {
  variantId: number;
  quantity: number;
}

export interface CartBundle {
  items: Array<{
    variant: ScentVariant;
    productType: ProductType;
    quantity: number;
  }>;
  itemCount: number;
  subtotal: number;
  discountPercent: number;
  discount: number;
  total: number;
}

export const addToCartSchema = z.object({
  items: z.array(
    z.object({
      variantId: z.number(),
      quantity: z.number().min(1),
    })
  ).min(1),
});

export type AddToCartRequest = z.infer<typeof addToCartSchema>;
