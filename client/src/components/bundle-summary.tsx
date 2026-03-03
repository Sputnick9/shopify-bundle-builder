import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  ShoppingCart,
  Tag,
  ChevronUp,
  Minus,
  Plus,
  Trash2,
  ArrowUp,
  Zap,
  Eye,
  Package,
} from "lucide-react";
import type { ProductType, CartItem, DiscountTier } from "@shared/schema";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";

function formatPrice(cents: number): string {
  return "$" + (cents / 100).toFixed(2);
}

interface CartItemResolved {
  variantId: number;
  variantName: string;
  productTypeName: string;
  price: number;
  quantity: number;
  gradientFrom: string;
  gradientTo: string;
}

interface StickyCartBarProps {
  cartItems: CartItem[];
  productTypes: ProductType[];
  discountTiers: DiscountTier[];
  onAddVariant: (variantId: number) => void;
  onRemoveVariant: (variantId: number) => void;
  onAddToCart: () => void;
  isSubmitting: boolean;
}

function resolveCartItems(
  cartItems: CartItem[],
  productTypes: ProductType[]
): CartItemResolved[] {
  return cartItems
    .map((ci) => {
      for (const pt of productTypes) {
        const v = pt.variants.find((sv) => sv.id === ci.variantId);
        if (v) {
          return {
            variantId: ci.variantId,
            variantName: v.name,
            productTypeName: pt.name,
            price: pt.price,
            quantity: ci.quantity,
            gradientFrom: v.gradientFrom,
            gradientTo: v.gradientTo,
          };
        }
      }
      return null;
    })
    .filter(Boolean) as CartItemResolved[];
}

function getDiscountForCount(
  itemCount: number,
  discountTiers: DiscountTier[]
): number {
  let d = 0;
  for (const t of discountTiers) {
    if (itemCount >= t.minItems) d = t.discountPercent;
  }
  return d;
}

function getNextTier(
  itemCount: number,
  discountTiers: DiscountTier[]
): DiscountTier | null {
  for (const t of discountTiers) {
    if (itemCount < t.minItems) return t;
  }
  return null;
}

function getMaxTier(discountTiers: DiscountTier[]): DiscountTier | null {
  if (discountTiers.length === 0) return null;
  return discountTiers[discountTiers.length - 1];
}

interface TierProgressBarProps {
  itemCount: number;
  discountTiers: DiscountTier[];
  discountPercent: number;
}

function TierProgressBar({ itemCount, discountTiers, discountPercent }: TierProgressBarProps) {
  const maxTier = getMaxTier(discountTiers);
  if (!maxTier || discountTiers.length === 0) return null;

  const maxItems = maxTier.minItems;
  const progress = Math.min((itemCount / maxItems) * 100, 100);
  const nextTier = getNextTier(itemCount, discountTiers);
  const isMaxed = !nextTier;

  return (
    <div className="px-4 py-2 bg-gradient-to-r from-primary/5 to-primary/10 border-t border-primary/10" data-testid="discount-progress-bar">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-primary" />
            {itemCount === 0 ? (
              <span className="text-xs font-medium text-muted-foreground">
                Add items to start saving!
              </span>
            ) : isMaxed ? (
              <span className="text-xs font-semibold text-primary">
                Max discount unlocked! {discountPercent}% off
              </span>
            ) : (
              <span className="text-xs font-medium text-muted-foreground">
                Add {nextTier!.minItems - itemCount} more for{" "}
                <span className="text-primary font-semibold">{nextTier!.discountPercent}% off</span>
              </span>
            )}
          </div>
          {discountPercent > 0 && (
            <Badge variant="default" className="text-[10px] px-1.5 py-0 h-4">
              {discountPercent}% off
            </Badge>
          )}
        </div>

        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0 bg-primary rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
          {discountTiers.map((tier) => {
            const pos = (tier.minItems / maxItems) * 100;
            return (
              <div
                key={tier.minItems}
                className="absolute top-0 bottom-0 w-px bg-background/60"
                style={{ left: `${pos}%` }}
              />
            );
          })}
        </div>

        <div className="flex justify-between mt-1">
          {discountTiers.map((tier) => {
            const reached = itemCount >= tier.minItems;
            return (
              <span
                key={tier.minItems}
                className={cn(
                  "text-[9px] sm:text-[10px] font-medium transition-colors",
                  reached ? "text-primary" : "text-muted-foreground/60"
                )}
              >
                {tier.minItems}+ = {tier.discountPercent}%
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function StickyCartBar({
  cartItems,
  productTypes,
  discountTiers,
  onAddVariant,
  onRemoveVariant,
  onAddToCart,
  isSubmitting,
}: StickyCartBarProps) {
  const [showSheet, setShowSheet] = useState(false);

  const sortedTiers = useMemo(
    () => [...discountTiers].sort((a, b) => a.minItems - b.minItems),
    [discountTiers]
  );
  const resolved = resolveCartItems(cartItems, productTypes);
  const itemCount = cartItems.reduce((sum, ci) => sum + ci.quantity, 0);
  const subtotal = resolved.reduce((sum, r) => sum + r.price * r.quantity, 0);
  const discountPercent = getDiscountForCount(itemCount, sortedTiers);
  const discount = Math.round(subtotal * (discountPercent / 100));
  const total = subtotal - discount;
  const nextTier = getNextTier(itemCount, sortedTiers);
  const isEmpty = itemCount === 0;

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <TierProgressBar
          itemCount={itemCount}
          discountTiers={sortedTiers}
          discountPercent={discountPercent}
        />
        <div className="bg-card border-t border-border shadow-lg">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                data-testid="button-view-bundle"
                onClick={() => { if (!isEmpty) setShowSheet(true); }}
                className={cn(
                  "flex items-center gap-3 flex-1 min-w-0 text-left",
                  isEmpty && "cursor-default"
                )}
              >
                <div className="relative">
                  <ShoppingCart className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary text-primary-foreground text-[10px] rounded-full flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {isEmpty ? (
                    <span className="text-sm text-muted-foreground">
                      Your bundle is empty
                    </span>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-lg" data-testid="text-total">
                          {formatPrice(total)}
                        </span>
                        {discount > 0 && (
                          <span className="text-sm text-muted-foreground line-through">
                            {formatPrice(subtotal)}
                          </span>
                        )}
                      </div>
                      {discount > 0 && (
                        <p className="text-xs text-primary font-medium flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          You Save {formatPrice(discount)} ({discountPercent}% off)
                        </p>
                      )}
                    </>
                  )}
                </div>

                {!isEmpty && (
                  <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                )}
              </button>

              <Button
                data-testid="button-view-bundle-btn"
                onClick={() => { if (!isEmpty) setShowSheet(true); }}
                disabled={isEmpty}
                className="flex-shrink-0 gap-2"
                size="lg"
              >
                <Eye className="w-4 h-4" />
                View Bundle
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={showSheet} onOpenChange={setShowSheet}>
        <SheetContent side="bottom" className="max-h-[80vh]">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center justify-between gap-2">
              <span>Your Bundle ({itemCount} items)</span>
              {discountPercent > 0 && (
                <Badge>{discountPercent}% off</Badge>
              )}
            </SheetTitle>
            <SheetDescription>
              Review and manage items in your bundle
            </SheetDescription>
          </SheetHeader>

          {resolved.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <Package className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No items in your bundle yet.</p>
              <p className="text-xs mt-1">Browse the products above to get started!</p>
            </div>
          ) : (
            <>
              <div className="overflow-y-auto max-h-[50vh] space-y-3 pb-4">
                {resolved.map((item) => (
                  <div
                    key={item.variantId}
                    data-testid={`cart-item-${item.variantId}`}
                    className="flex items-center gap-3 py-2"
                  >
                    <div
                      className="w-12 h-12 rounded-md flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})`,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {item.variantName}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.productTypeName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => onRemoveVariant(item.variantId)}
                        data-testid={`button-sheet-remove-${item.variantId}`}
                      >
                        {item.quantity === 1 ? (
                          <Trash2 className="w-3 h-3" />
                        ) : (
                          <Minus className="w-3 h-3" />
                        )}
                      </Button>
                      <span className="w-6 text-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        className="h-7 w-7"
                        onClick={() => onAddVariant(item.variantId)}
                        data-testid={`button-sheet-add-${item.variantId}`}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <span className="text-sm font-semibold w-14 text-right flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="pt-4 space-y-2">
                <div className="flex items-center justify-between gap-2 text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-primary flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      Bundle Savings ({discountPercent}%)
                    </span>
                    <span className="text-primary font-medium">
                      -{formatPrice(discount)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex items-center justify-between gap-2 font-bold text-lg pt-1">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                {nextTier && (
                  <p className="text-xs text-center text-primary pt-1 flex items-center justify-center gap-1">
                    <ArrowUp className="w-3 h-3" />
                    Add {nextTier.minItems - itemCount} more item
                    {nextTier.minItems - itemCount !== 1 ? "s" : ""} to unlock{" "}
                    {nextTier.discountPercent}% off!
                  </p>
                )}

                <Button
                  data-testid="button-add-to-cart-sheet"
                  className="w-full gap-2"
                  size="lg"
                  disabled={isSubmitting || itemCount === 0}
                  onClick={() => {
                    onAddToCart();
                    setShowSheet(false);
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isSubmitting
                    ? "Adding..."
                    : `Add to Cart - ${formatPrice(total)}`}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
