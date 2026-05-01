"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CheckoutButton } from "@/components/CheckoutButton";
import { formatMoney } from "@/lib/format";
import {
  CART_UPDATED_EVENT,
  type CartItem,
  clearCartItems,
  readCartItems,
  removeCartItem,
  writeCartItems
} from "@/lib/cart";

export function CartView() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    function syncCart() {
      setItems(readCartItems());
    }

    syncCart();
    window.addEventListener(CART_UPDATED_EVENT, syncCart);
    window.addEventListener("storage", syncCart);

    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, syncCart);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  const total = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + (item.price_cents ?? 0) * item.quantity,
        0
      ),
    [items]
  );

  function updateQuantity(id: string, quantity: number) {
    const nextItems = items
      .map((item) => (item.id === id ? { ...item, quantity } : item))
      .filter((item) => item.quantity > 0);

    setItems(nextItems);
    writeCartItems(nextItems);
  }

  function removeItem(id: string) {
    removeCartItem(id);
    setItems(readCartItems());
  }

  function clearCart() {
    clearCartItems();
    setItems([]);
  }

  if (items.length === 0) {
    return (
      <div className="panel cart-panel">
        <h1>Your Cart</h1>
        <p>Your cart is empty. Add a product to save it here.</p>
        <div className="actions">
          <Link className="btn primary" href="/new-arrivals">
            Browse New Arrivals
          </Link>
          <Link className="btn secondary" href="/single-cards">
            Shop Single Cards
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-layout">
      <section className="cart-items" aria-label="Cart items">
        {items.map((item) => (
          <article className="cart-item" key={item.id}>
            <Link className="cart-item-image" href={`/listings/${item.slug}`}>
              {item.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image_url} alt={item.name} />
              ) : (
                <span>Twin Unity</span>
              )}
            </Link>
            <div className="cart-item-details">
              <Link href={`/listings/${item.slug}`}>
                <h2>{item.name}</h2>
              </Link>
              <p className="price">{formatMoney(item.price_cents)}</p>
              <label>
                Quantity
                <input
                  min="1"
                  type="number"
                  value={item.quantity}
                  onChange={(event) =>
                    updateQuantity(item.id, Number(event.target.value))
                  }
                />
              </label>
            </div>
            <div className="cart-item-actions">
              <CheckoutButton listingId={item.id} />
              <button
                className="btn ghost"
                type="button"
                onClick={() => removeItem(item.id)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}
      </section>

      <aside className="panel cart-summary">
        <h2>Cart Summary</h2>
        <p>
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
        <p className="price">{formatMoney(total)}</p>
        <p className="status-message">
          Checkout is currently completed one item at a time.
        </p>
        <button className="btn secondary" type="button" onClick={clearCart}>
          Clear Cart
        </button>
      </aside>
    </div>
  );
}
