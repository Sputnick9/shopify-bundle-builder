import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  Droplets,
  Waves,
  Sparkles,
  Flower2,
  Shirt,
  Bath,
} from "lucide-react";
import type { ProductType, ScentVariant, CartItem } from "@shared/schema";
import { motion, AnimatePresence } from "framer-motion";

const categoryIcons: Record<string, typeof Droplets> = {
  Deodorant: Droplets,
  Wash: Waves,
  Wipes: Sparkles,
  Soap: Bath,
  "Body Cream": Flower2,
  Laundry: Shirt,
};

function formatPrice(cents: number): string {
  return "$" + (cents / 100).toFixed(0);
}

export function isDirectAddProduct(productType: ProductType): boolean {
  const variants = productType.variants || [];
  return variants.length <= 1;
}

interface ProductTypeCardProps {
  productType: ProductType;
  isExpanded: boolean;
  onToggleExpand: () => void;
  cartItems: CartItem[];
  onAddVariant: (variantId: number) => void;
  onRemoveVariant: (variantId: number) => void;
}

export function ProductTypeCard({
  productType,
  isExpanded,
  onToggleExpand,
  cartItems,
  onAddVariant,
  onRemoveVariant,
}: ProductTypeCardProps) {
  const Icon = categoryIcons[productType.category] || Droplets;
  const variants = productType.variants || [];
  const availableCount = variants.filter((v) => v.available).length;
  const isDirect = isDirectAddProduct(productType);
  const directVariant = isDirect ? variants[0] : null;

  const itemsInCart = (cartItems || [])
    .filter((ci) => variants.some((v) => v.id === ci.variantId))
    .reduce((sum, ci) => sum + ci.quantity, 0);

  const directQty = directVariant
    ? (cartItems || []).find((ci) => ci.variantId === directVariant.id)?.quantity || 0
    : 0;

  return (
    <Card
      data-testid={`product-type-card-${productType.id}`}
      className={cn(
        "transition-all duration-300",
        !isDirect && "cursor-pointer",
        isExpanded && !isDirect && "ring-2 ring-primary border-primary"
      )}
    >
      {isDirect ? (
        <CardContent className="p-3 sm:p-4 flex flex-col items-center gap-2">
          <div
            className="w-full aspect-square rounded-lg flex-shrink-0 flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${productType.gradientFrom}, ${productType.gradientTo})`,
            }}
          >
            <Icon
              className="w-10 h-10 sm:w-12 sm:h-12"
              style={{ color: productType.gradientTo, filter: "brightness(0.5)" }}
            />
          </div>

          <div className="w-full text-center">
            <h3 className="font-semibold text-xs sm:text-sm leading-tight line-clamp-2 min-h-[2rem]">
              {productType.name}
            </h3>
            <p className="text-sm sm:text-base font-bold mt-0.5">
              {formatPrice(productType.price)}
            </p>
          </div>

          {directVariant && directVariant.available ? (
            directQty > 0 ? (
              <div className="flex items-center gap-1 w-full justify-center">
                <Button
                  data-testid={`button-remove-variant-${directVariant.id}`}
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => onRemoveVariant(directVariant.id)}
                >
                  <Minus className="w-3.5 h-3.5" />
                </Button>
                <span
                  className="w-8 text-center text-sm font-semibold"
                  data-testid={`text-quantity-${directVariant.id}`}
                >
                  {directQty}
                </span>
                <Button
                  data-testid={`button-add-variant-${directVariant.id}`}
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => onAddVariant(directVariant.id)}
                >
                  <Plus className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : (
              <Button
                data-testid={`button-add-variant-${directVariant.id}`}
                size="sm"
                className="w-full"
                onClick={() => onAddVariant(directVariant.id)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add
              </Button>
            )
          ) : (
            <Button size="sm" variant="secondary" className="w-full" disabled>
              Sold Out
            </Button>
          )}
        </CardContent>
      ) : (
        <button
          data-testid={`button-expand-${productType.id}`}
          className="w-full text-left"
          onClick={onToggleExpand}
          aria-expanded={isExpanded}
        >
          <CardContent className="p-3 sm:p-4 flex flex-col items-center gap-2">
            <div
              className="w-full aspect-square rounded-lg flex-shrink-0 flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${productType.gradientFrom}, ${productType.gradientTo})`,
              }}
            >
              <Icon
                className="w-10 h-10 sm:w-12 sm:h-12"
                style={{ color: productType.gradientTo, filter: "brightness(0.5)" }}
              />
            </div>

            <div className="w-full text-center">
              <h3 className="font-semibold text-xs sm:text-sm leading-tight line-clamp-2 min-h-[2rem]">
                {productType.name}
              </h3>
              <p className="text-sm sm:text-base font-bold mt-0.5">
                {formatPrice(productType.price)}
              </p>
              <div className="flex items-center justify-center gap-1 mt-1 flex-wrap">
                <span className="text-[10px] sm:text-xs text-muted-foreground">
                  {availableCount} scents
                </span>
                {itemsInCart > 0 && (
                  <Badge variant="default" className="text-[10px] px-1.5 py-0">
                    {itemsInCart} added
                  </Badge>
                )}
              </div>
            </div>

            <div className="text-muted-foreground">
              {isExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </CardContent>
        </button>
      )}
    </Card>
  );
}

interface ExpandedVariantsPanelProps {
  productType: ProductType;
  cartItems: CartItem[];
  onAddVariant: (variantId: number) => void;
  onRemoveVariant: (variantId: number) => void;
}

export function ExpandedVariantsPanel({
  productType,
  cartItems,
  onAddVariant,
  onRemoveVariant,
}: ExpandedVariantsPanelProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="overflow-hidden col-span-full"
    >
      <Card className="ring-2 ring-primary border-primary">
        <CardContent className="p-4">
          <p className="text-sm font-medium text-muted-foreground mb-3">
            Choose scents for{" "}
            <span className="text-foreground font-semibold">{productType.name}</span>
          </p>
          <ScrollArea className="w-full">
            <div className="flex gap-3 pb-2">
              {(productType.variants || []).map((variant) => {
                const cartItem = (cartItems || []).find(
                  (ci) => ci.variantId === variant.id
                );
                const qty = cartItem?.quantity || 0;

                return (
                  <ScentVariantCard
                    key={variant.id}
                    variant={variant}
                    price={productType.price}
                    quantity={qty}
                    onAdd={() => onAddVariant(variant.id)}
                    onRemove={() => onRemoveVariant(variant.id)}
                  />
                );
              })}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface ScentVariantCardProps {
  variant: ScentVariant;
  price: number;
  quantity: number;
  onAdd: () => void;
  onRemove: () => void;
}

function ScentVariantCard({
  variant,
  price,
  quantity,
  onAdd,
  onRemove,
}: ScentVariantCardProps) {
  const isAdded = quantity > 0;

  return (
    <div
      data-testid={`scent-variant-${variant.id}`}
      className={cn(
        "flex-shrink-0 w-[140px] sm:w-[160px] rounded-lg border transition-all duration-200",
        isAdded && "ring-2 ring-primary border-primary",
        !variant.available && "opacity-50"
      )}
    >
      <div className="relative">
        <div
          className="h-[120px] sm:h-[140px] rounded-t-lg flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${variant.gradientFrom}, ${variant.gradientTo})`,
          }}
        >
          {variant.isNew && (
            <Badge
              variant="default"
              className="absolute top-2 left-2 text-[10px] px-1.5 py-0"
            >
              New!
            </Badge>
          )}

          {!variant.available && (
            <div className="absolute inset-0 bg-background/60 rounded-t-lg flex items-center justify-center">
              <Badge variant="secondary" className="text-xs">
                Out of Stock
              </Badge>
            </div>
          )}

          {isAdded && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-xs font-bold"
            >
              {quantity}
            </motion.div>
          )}
        </div>
      </div>

      <div className="p-3 space-y-2">
        <h4 className="font-medium text-sm leading-tight truncate">{variant.name}</h4>
        <p className="text-sm font-semibold">{formatPrice(price)}</p>

        {variant.available ? (
          isAdded ? (
            <div className="flex items-center gap-1">
              <Button
                data-testid={`button-remove-variant-${variant.id}`}
                size="icon"
                variant="outline"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <span
                className="flex-1 text-center text-sm font-semibold"
                data-testid={`text-quantity-${variant.id}`}
              >
                {quantity}
              </span>
              <Button
                data-testid={`button-add-variant-${variant.id}`}
                size="icon"
                variant="outline"
                className="h-7 w-7"
                onClick={(e) => {
                  e.stopPropagation();
                  onAdd();
                }}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <Button
              data-testid={`button-add-variant-${variant.id}`}
              size="sm"
              variant="outline"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                onAdd();
              }}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          )
        ) : (
          <Button size="sm" variant="secondary" className="w-full" disabled>
            Sold Out
          </Button>
        )}
      </div>
    </div>
  );
}
