"use client";

import { useState } from "react";
import { addCartItem } from "@/lib/cart";

type AddToCartButtonProps = {
  item: {
    id: string;
    slug: string;
    name: string;
    price_cents: number | null;
    image_url: string | null;
    available_quantity: number;
  };
  quantity?: number;
  disabled?: boolean;
};

export function AddToCartButton({
  item,
  quantity = 1,
  disabled
}: AddToCartButtonProps) {
  const [message, setMessage] = useState<string | null>(null);

  function addToCart() {
    const result = addCartItem(item, quantity);

    if (result.capped && result.availableQuantity !== undefined) {
      setMessage(
        result.addedQuantity > 0
          ? `We only have ${result.availableQuantity}, so we added ${result.addedQuantity} to your cart.`
          : `We only have ${result.availableQuantity}, and that amount is already in your cart.`
      );
      return;
    }

    setMessage(
      result.quantity > result.addedQuantity
        ? `Added ${result.addedQuantity} more (${result.quantity} in cart).`
        : `Added ${result.addedQuantity} to cart.`
    );
  }

  return (
    <>
      <button
        className="btn secondary"
        disabled={disabled}
        type="button"
        onClick={addToCart}
      >
        Add to Cart
      </button>
      {message ? <p className="status-message">{message}</p> : null}
    </>
  );
}
