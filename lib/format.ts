import type { Listing } from "@/lib/types";

export function formatMoney(cents: number | null | undefined) {
  if (typeof cents !== "number") {
    return "Contact for price";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(cents / 100);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatListingTitle(
  listing: Pick<Listing, "set_name" | "name" | "card_number">
) {
  const parts = [listing.set_name, listing.name]
    .map((part) => part?.trim())
    .filter(Boolean);
  const cardNumber = listing.card_number?.trim();

  return cardNumber ? `${parts.join(" - ")} #${cardNumber}` : parts.join(" - ");
}

export function formatListingMeta(
  listing: Pick<Listing, "set_name" | "card_number" | "rarity" | "grade">,
  options: { includeGrade?: boolean } = {}
) {
  const setName = listing.set_name?.trim();
  const cardNumber = listing.card_number?.trim();
  const rarity = listing.rarity?.trim();
  const grade = listing.grade?.trim();
  const identity = [setName, cardNumber ? `#${cardNumber}` : null]
    .filter(Boolean)
    .join(" ");
  const parts = [
    identity,
    rarity,
    options.includeGrade && grade ? `Grade ${grade}` : null
  ].filter(Boolean);

  return parts.join(" | ");
}
