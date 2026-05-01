import Link from "next/link";
import type { Listing } from "@/lib/types";
import { formatMoney } from "@/lib/format";

type ListingCardProps = {
  listing: Listing;
};

export function ListingCard({ listing }: ListingCardProps) {
  const primaryImage = listing.image_urls[0];

  return (
    <Link className="listing-card" href={`/listings/${listing.slug}`}>
      <div className="listing-image">
        {primaryImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={primaryImage} alt={listing.name} />
        ) : (
          <span>Twin Unity</span>
        )}
      </div>
      <div className="listing-card-body">
        <h3>{listing.name}</h3>
        <p className="price">{formatMoney(listing.price_cents)}</p>
      </div>
    </Link>
  );
}
