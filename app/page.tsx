import Link from "next/link";
import Image from "next/image";
import { ListingCard } from "@/components/ListingCard";
import { getPublishedListings, getSoldListings } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const RECENTLY_SOLD_DAYS = 7;
const HOME_SECTION_LIMIT = 5;

export default async function Home() {
  const [listings, soldListings] = await Promise.all([
    getPublishedListings(),
    getSoldListings()
  ]);
  // eslint-disable-next-line react-hooks/purity
  const soldCutoff = Date.now() - RECENTLY_SOLD_DAYS * 24 * 60 * 60 * 1000;
  const recentlySold = soldListings.filter(
    (listing) => new Date(listing.updated_at).getTime() >= soldCutoff
  );

  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="container home-hero-content">
          <div className="home-copy">
            <h1>Browse Our Inventory</h1>
            <p className="lead">
              Fresh singles, slabs, and sealed Pokemon products from Twin Unity.
            </p>
            <div className="actions">
              <Link className="btn primary" href="/single-cards">
                Shop
              </Link>
            </div>
          </div>
          <div className="home-art" aria-hidden="true">
            <Image
              className="home-logo"
              src="/twin-unity-logo-transparent.png"
              alt=""
              width={701}
              height={407}
              priority
            />
          </div>
        </div>
      </section>

      <section className="section home-listing-section">
        <div className="container">
          <div className="section-heading product-heading">
            <div>
              <h2>New Arrivals</h2>
              <p className="lead">
                Browse the latest Twin Unity listings across every category.
              </p>
            </div>
            <Link className="btn secondary" href="/new-arrivals">
              View all
            </Link>
          </div>
          {listings.length > 0 ? (
            <div className="listing-grid home-preview-grid">
              {listings.slice(0, HOME_SECTION_LIMIT).map((listing) => (
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
      </section>

      <section className="section home-listing-section">
        <div className="container">
          <div className="section-heading product-heading">
            <div>
              <h2>Recently Sold</h2>
              <p className="lead">
                Products sold within the last 7 days.
              </p>
            </div>
            <Link className="btn secondary" href="/sold">
              View all
            </Link>
          </div>
          {recentlySold.length > 0 ? (
            <div className="listing-grid home-preview-grid">
              {recentlySold.slice(0, HOME_SECTION_LIMIT).map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="panel">
              <h2>No recent sold items</h2>
              <p>Recently sold products will appear here for 7 days.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
