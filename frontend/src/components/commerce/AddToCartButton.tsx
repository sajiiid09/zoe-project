"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { useCart } from "@/components/commerce/CartProvider";
import type { ProductCardModel } from "@/types/catalog";

export const AddToCartButton = ({ product }: { product: ProductCardModel & { source: "legacy" } }) => {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  return (
    <Button
      size="sm"
      className="add-cart-btn"
      onClick={() => {
        addItem(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
      }}
    >
      {added ? "Added" : "Add to cart"}
    </Button>
  );
};
