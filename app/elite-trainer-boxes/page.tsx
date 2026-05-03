import { ProductListingPage } from "@/components/ProductListingPage";

export const dynamic = "force-dynamic";

export default function EliteTrainerBoxesPage() {
  return (
    <ProductListingPage
      category="sealed"
      description="Find sealed Elite Trainer Boxes and ETB releases."
      sealedType="elite_trainer_box"
      title="Elite Trainer Boxes"
    />
  );
}
