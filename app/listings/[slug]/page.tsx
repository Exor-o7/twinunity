import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCartButton } from "@/components/AddToCartButton";
import { CheckoutButton } from "@/components/CheckoutButton";
import { formatListingTitle, formatMoney } from "@/lib/format";
import { getListingBySlug } from "@/lib/supabase";

export const dynamic = "force-dynamic";

type ListingDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ListingDetailPage({
  params
}: ListingDetailPageProps) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  if (!listing || !["published", "sold"].includes(listing.status)) {
    notFound();
  }

  const isSold = listing.status === "sold";
  const canAddToCart = !isSold && listing.price_cents !== null;
  const canCheckout = !isSold && listing.price_cents !== null && listing.quantity > 0;
  const primaryImage = listing.image_urls[0];
  const listingTitle = formatListingTitle(listing);

  return (
    <main className="section">
      <div className="container">
        <Link href="/single-cards">Back to listings</Link>
        <div className="detail-grid section">
          <div className="listing-image">
            {primaryImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={primaryImage} alt={listingTitle} />
            ) : (
              <span>Twin Unity</span>
            )}
            {isSold ? <span className="sold-badge detail">Sold</span> : null}
          </div>

          <article>
            {isSold ? <p className="sold-label">Sold</p> : null}
            <h1>{listing.name}</h1>
            <dl className="listing-detail-meta" aria-label="Listing details">
              {listing.set_name ? (
                <div>
                  <dt>Set</dt>
                  <dd>{listing.set_name}</dd>
                </div>
              ) : null}
              {listing.card_number ? (
                <div>
                  <dt>Card Number</dt>
                  <dd>{listing.card_number}</dd>
                </div>
              ) : null}
              {listing.rarity ? (
                <div>
                  <dt>Rarity</dt>
                  <dd>{listing.rarity}</dd>
                </div>
              ) : null}
              {listing.grade ? (
                <div>
                  <dt>Grade</dt>
                  <dd>{listing.grade}</dd>
                </div>
              ) : null}
            </dl>
            <p className="price">{formatMoney(listing.price_cents)}</p>
            <p className="lead">{listing.description}</p>

            <div className="actions">
              {isSold ? (
                <button className="btn secondary" disabled type="button">
                  Sold
                </button>
              ) : canAddToCart ? (
                <>
                  {canCheckout ? (
                    <CheckoutButton listingId={listing.id} />
                  ) : (
                    <a className="btn primary" href="mailto:hello@twinunitytcg.com">
                      Contact Twin Unity
                    </a>
                  )}
                  <AddToCartButton
                    item={{
                      id: listing.id,
                      slug: listing.slug,
                      name: listingTitle,
                      price_cents: listing.price_cents,
                      image_url: primaryImage ?? null
                    }}
                  />
                </>
              ) : (
                <a className="btn primary" href="mailto:hello@twinunitytcg.com">
                  Contact Twin Unity
                </a>
              )}
              <a
                className="btn secondary"
                href="https://www.instagram.com/twin_unity/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Ask on Instagram
              </a>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
