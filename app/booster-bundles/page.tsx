import { ProductListingPage } from "@/components/ProductListingPage";

export const dynamic = "force-dynamic";

export default function BoosterBundlesPage() {
  return (
    <ProductListingPage
      category="sealed"
      description="Browse sealed booster bundles for collectors and players."
      sealedType="booster_bundle"
      title="Booster Bundles"
    />
  );
}
