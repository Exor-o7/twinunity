"use client";

import { useState } from "react";
import { AddToCartButton } from "@/components/AddToCartButton";
import { CheckoutButton } from "@/components/CheckoutButton";

type PurchaseActionsProps = {
  listingId: string;
  item: {
    id: string;
    slug: string;
    name: string;
    price_cents: number | null;
    image_url: string | null;
    available_quantity: number;
  };
};

export function PurchaseActions({ listingId, item }: PurchaseActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [activeStep, setActiveStep] = useState<"decrease" | "increase" | null>(
    null
  );
  const availableQuantity = Math.max(1, item.available_quantity);

  function updateQuantity(nextQuantity: number) {
    setQuantity(Math.min(Math.max(1, nextQuantity), availableQuantity));
  }

  return (
    <div className="purchase-controls">
      <label>
        Quantity
        <span className="quantity-stepper">
          <button
            aria-label="Decrease quantity"
            className={
              activeStep === "decrease" && quantity > 1 ? "is-active" : ""
            }
            disabled={quantity <= 1}
            type="button"
            onBlur={() => setActiveStep(null)}
            onFocus={() => setActiveStep("decrease")}
            onMouseEnter={() => setActiveStep("decrease")}
            onMouseLeave={() => setActiveStep(null)}
            onClick={() => updateQuantity(quantity - 1)}
          >
            -
          </button>
          <input
            max={item.available_quantity}
            min="1"
            type="number"
            value={quantity}
            onChange={(event) => updateQuantity(Number(event.target.value))}
          />
          <button
            aria-label="Increase quantity"
            className={
              activeStep === "increase" && quantity < availableQuantity
                ? "is-active"
                : ""
            }
            disabled={quantity >= availableQuantity}
            type="button"
            onBlur={() => setActiveStep(null)}
            onFocus={() => setActiveStep("increase")}
            onMouseEnter={() => setActiveStep("increase")}
            onMouseLeave={() => setActiveStep(null)}
            onClick={() => updateQuantity(quantity + 1)}
          >
            +
          </button>
        </span>
      </label>
      <CheckoutButton listingId={listingId} quantity={quantity} />
      <AddToCartButton item={item} quantity={quantity} />
    </div>
  );
}
