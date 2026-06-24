import type { Listing } from "@/lib/types";

type LiveOpeningListing = Pick<Listing, "category" | "sealed_type">;

export function requiresLiveOpening(listing: LiveOpeningListing) {
  return (
    listing.category === "sealed" &&
    ["booster_pack", "booster_bundle"].includes(listing.sealed_type ?? "")
  );
}

export function cleanLiveOpeningName(value: string | null | undefined) {
  return value?.trim().replace(/\s+/g, " ").slice(0, 80) ?? "";
}
