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
  };
  disabled?: boolean;
};

export function AddToCartButton({ item, disabled }: AddToCartButtonProps) {
  const [message, setMessage] = useState<string | null>(null);

  function addToCart() {
    const quantity = addCartItem(item);

    setMessage(quantity > 1 ? `Added again (${quantity} in cart).` : "Added to cart.");
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
