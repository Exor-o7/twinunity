import Link from "next/link";
import { formatListingMeta, formatListingTitle, formatMoney } from "@/lib/format";
import type { Listing } from "@/lib/types";

type ListingGalleryProps = {
  listings: Listing[];
  title?: string;
};

export function ListingGallery({ listings, title = "Gallery" }: ListingGalleryProps) {
  if (listings.length === 0) {
    return null;
  }

  return (
    <section className="gallery-section" aria-labelledby="listing-gallery-title">
      <div className="section-heading">
        <div>
          <h2 id="listing-gallery-title">{title}</h2>
        </div>
      </div>
      <div className="gallery-grid">
        {listings.map((listing, index) => {
          const primaryImage = listing.image_urls[0];
          const listingTitle = formatListingTitle(listing);
          const listingMeta = formatListingMeta(listing, { includeGrade: true });

          return (
            <Link
              className={index === 0 ? "gallery-item featured" : "gallery-item"}
              href={`/listings/${listing.slug}`}
              key={listing.id}
            >
              {primaryImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={primaryImage} alt={listingTitle} />
              ) : (
                <span className="gallery-placeholder">Twin Unity</span>
              )}
              <span className="gallery-overlay">
                <strong>{listing.name}</strong>
                {listingMeta ? <span>{listingMeta}</span> : null}
                <small>{formatMoney(listing.price_cents)}</small>
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
