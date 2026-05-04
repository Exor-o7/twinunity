import { ProductListingPage } from "@/components/ProductListingPage";

export const dynamic = "force-dynamic";

export default function GradedCardsPage() {
  return (
    <ProductListingPage
      category="graded"
      description="Shop authenticated graded Pokemon cards."
      title="Graded Cards"
    />
  );
}
