import { ListingCard } from "@/components/ListingCard";
import { getPublishedListings } from "@/lib/supabase";
import type { ListingCategory } from "@/lib/types";

type ProductListingPageProps = {
  title: string;
  description: string;
  category: ListingCategory;
  keywords?: string[];
};

export async function ProductListingPage({
  title,
  description,
  category,
  keywords
}: ProductListingPageProps) {
  const listings = await getPublishedListings();
  const filteredListings = listings
    .filter((listing) => listing.category === category)
    .filter((listing) => {
      if (!keywords?.length) {
        return true;
      }

      const name = listing.name.toLowerCase();

      return keywords.some((keyword) => name.includes(keyword));
    });

  return (
    <main className="section">
      <div className="container">
        <div className="section-heading product-heading">
          <div>
            <h1>{title}</h1>
            <p className="lead">{description}</p>
          </div>
        </div>

        {filteredListings.length > 0 ? (
          <div className="listing-grid">
            {filteredListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="panel">
            <h2>No listings found</h2>
            <p>Check back soon. New Twin Unity drops are added regularly.</p>
          </div>
        )}
      </div>
    </main>
  );
}
