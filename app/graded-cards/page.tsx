import { ProductListingPage } from "@/components/ProductListingPage";

export const dynamic = "force-dynamic";

export default function GradedCardsPage() {
  return (
    <ProductListingPage
      category="graded"
      description="Shop graded Pokemon cards and display-ready slabs."
      title="Graded Cards"
    />
  );
}
