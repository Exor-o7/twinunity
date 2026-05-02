import { ProductListingPage } from "@/components/ProductListingPage";

export const dynamic = "force-dynamic";

export default function SingleCardsPage() {
  return (
    <ProductListingPage
      category="single"
      title="Single Cards"
      description="Browse individual Pokemon cards available from Twin Unity."
    />
  );
}
