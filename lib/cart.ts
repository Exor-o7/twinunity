export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price_cents: number | null;
  image_url: string | null;
  quantity: number;
};

export const CART_STORAGE_KEY = "twin-unity-cart";
export const CART_UPDATED_EVENT = "twin-unity-cart-updated";

export function readCartItems() {
  if (typeof window === "undefined") {
    return [];
  }

  const value = window.localStorage.getItem(CART_STORAGE_KEY);

  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
}

export function writeCartItems(items: CartItem[]) {
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function addCartItem(item: Omit<CartItem, "quantity">) {
  const items = readCartItems();
  const existingItem = items.find((cartItem) => cartItem.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1;
    writeCartItems(items);
    return existingItem.quantity;
  }

  writeCartItems([...items, { ...item, quantity: 1 }]);
  return 1;
}

export function removeCartItem(id: string) {
  writeCartItems(readCartItems().filter((item) => item.id !== id));
}

export function clearCartItems() {
  writeCartItems([]);
}

export function getCartItemCount() {
  return readCartItems().reduce((total, item) => total + item.quantity, 0);
}

function isCartItem(item: unknown): item is CartItem {
  if (!item || typeof item !== "object") {
    return false;
  }

  const cartItem = item as Partial<CartItem>;

  return (
    typeof cartItem.id === "string" &&
    typeof cartItem.slug === "string" &&
    typeof cartItem.name === "string" &&
    typeof cartItem.quantity === "number"
  );
}
