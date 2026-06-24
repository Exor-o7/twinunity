export type ListingCategory = "single" | "graded" | "sealed" | "collection";

export type ListingIntent = "buy" | "sell" | "trade";

export type ListingStatus = "draft" | "published" | "sold" | "archived";

export type ListingSealedType =
  | "booster_pack"
  | "booster_bundle"
  | "elite_trainer_box";

export type Listing = {
  id: string;
  slug: string;
  name: string;
  category: ListingCategory;
  intent: ListingIntent;
  status: ListingStatus;
  set_name: string | null;
  card_number: string | null;
  rarity: string | null;
  sealed_type: ListingSealedType | null;
  condition: string | null;
  grade: string | null;
  price_cents: number | null;
  quantity: number;
  description: string | null;
  notes: string | null;
  image_urls: string[];
  created_at: string;
  updated_at: string;
};

export type ListingInput = Omit<Listing, "id" | "created_at" | "updated_at">;

export type OrderStatus = "pending" | "paid" | "cancelled" | "fulfilled";

export type StreamStatus = "queued" | "opened" | "ready_to_ship" | "fulfilled";

export type Order = {
  id: string;
  listing_id: string;
  stripe_checkout_session_id: string;
  buyer_email: string | null;
  quantity: number;
  amount_total_cents: number;
  currency: string;
  status: OrderStatus;
  stream_open_required: boolean;
  stream_customer_name: string | null;
  stream_queue_number: number | null;
  stream_status: StreamStatus | null;
  paid_at: string | null;
  shipping_name: string | null;
  shipping_address: Record<string, unknown> | null;
  shipping_amount_cents: number | null;
  created_at: string;
  updated_at: string;
};

export type AdminStreamOrder = Order & {
  listing: Pick<
    Listing,
    "id" | "slug" | "name" | "set_name" | "card_number" | "sealed_type"
  > | null;
};
