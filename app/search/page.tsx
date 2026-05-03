import { ListingCard } from "@/components/ListingCard";
import { formatSealedType } from "@/lib/format";
import { getPublishedListings } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams: Promise<{ q?: string }>;
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const normalizedQuery = query.toLowerCase();
  const listings = await getPublishedListings();
  const results = normalizedQuery
    ? listings.filter((listing) => {
        const searchableText = [
          listing.name,
          listing.set_name,
          listing.card_number,
          listing.rarity,
          formatSealedType(listing.sealed_type),
          listing.description
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(normalizedQuery);
      })
    : [];

  return (
    <main className="section">
      <div className="container">
        <div className="section-heading product-heading">
          <div>
            <h1>Search Products</h1>
            <p className="lead">
              {query
                ? `Showing results for "${query}"`
                : "Search Twin Unity products by name or description."}
            </p>
          </div>
        </div>

        {results.length > 0 ? (
          <div className="listing-grid">
            {results.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        ) : (
          <div className="panel">
            <h2>{query ? "No products found" : "Start a search"}</h2>
            <p>
              {query
                ? "Try a different card name, set, product type, or keyword."
                : "Use the search field at the top of the page to find products."}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
