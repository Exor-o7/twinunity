import { ProductListingPage } from "@/components/ProductListingPage";

export const dynamic = "force-dynamic";

export default function BoosterPacksPage() {
  return (
    <ProductListingPage
      category="sealed"
      description="Shop sealed booster packs ready for collectors and players."
      sealedType="booster_pack"
      title="Booster Packs"
    />
  );
}
