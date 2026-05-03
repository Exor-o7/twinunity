import type { Listing, ListingSealedType } from "@/lib/types";

const sealedTypeLabels: Record<ListingSealedType, string> = {
  booster_pack: "Booster Pack",
  booster_bundle: "Booster Bundle",
  elite_trainer_box: "Elite Trainer Box"
};

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
  listing: Pick<
    Listing,
    "set_name" | "card_number" | "rarity" | "sealed_type" | "grade"
  >,
  options: { includeGrade?: boolean } = {}
) {
  const setName = listing.set_name?.trim();
  const cardNumber = listing.card_number?.trim();
  const rarity = listing.rarity?.trim();
  const sealedType = formatSealedType(listing.sealed_type);
  const grade = listing.grade?.trim();
  const identity = [setName, cardNumber ? `#${cardNumber}` : null]
    .filter(Boolean)
    .join(" ");
  const parts = [
    identity,
    rarity,
    sealedType,
    options.includeGrade && grade ? `Grade ${grade}` : null
  ].filter(Boolean);

  return parts.join(" | ");
}

export function formatSealedType(sealedType: ListingSealedType | null | undefined) {
  return sealedType ? sealedTypeLabels[sealedType] : null;
}
