import { ProductListingPage } from "@/components/ProductListingPage";

export const dynamic = "force-dynamic";

export default function OthersPage() {
  return (
    <ProductListingPage
      category="collection"
      description="Browse miscellaneous Twin Unity listings and special inventory."
      title="Others"
    />
  );
}
