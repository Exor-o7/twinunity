import { ListingCard } from "@/components/ListingCard";
import { getPublishedListings } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export default async function AllProductsPage() {
  const listings = await getPublishedListings();

  return (
    <main className="section">
      <div className="container">
        <div className="section-heading product-heading">
          <div>
            <h1>All Products</h1>
            <p className="lead">
              Browse every available Twin Unity listing across all categories.
            </p>
          </div>
        </div>

        {listings.length > 0 ? (
          <div className="listing-grid">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="panel">
            <h2>No products found</h2>
            <p>Check back soon. New Twin Unity drops are added regularly.</p>
          </div>
        )}
      </div>
    </main>
  );
}
