import { ProductListingPage } from "@/components/ProductListingPage";

export const dynamic = "force-dynamic";

export default function EliteTrainerBoxesPage() {
  return (
    <ProductListingPage
      category="sealed"
      description="Find sealed Elite Trainer Boxes and ETB releases."
      keywords={["elite trainer box", "etb"]}
      title="Elite Trainer Boxes"
    />
  );
}
