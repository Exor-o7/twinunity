import { ListingCard } from "@/components/ListingCard";
import { getPublishedListings } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const NEW_ARRIVAL_DAYS = 7;

export default async function NewArrivalsPage() {
  const listings = await getPublishedListings();
  // New Arrivals is intentionally time-based; older products remain on category pages.
  // eslint-disable-next-line react-hooks/purity
  const cutoff = Date.now() - NEW_ARRIVAL_DAYS * 24 * 60 * 60 * 1000;
  const newArrivals = listings.filter(
    (listing) => new Date(listing.created_at).getTime() >= cutoff
  );

  return (
    <main className="section">
      <div className="container">
        <div className="section-heading product-heading">
          <div>
            <h1>New Arrivals</h1>
            <p className="lead">
              Browse Twin Unity listings added within the last 7 days.
            </p>
          </div>
        </div>

        {newArrivals.length > 0 ? (
          <div className="listing-grid">
            {newArrivals.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="panel">
            <h2>No new arrivals yet</h2>
            <p>Check back soon. New Twin Unity drops are added regularly.</p>
          </div>
        )}
      </div>
    </main>
  );
}
