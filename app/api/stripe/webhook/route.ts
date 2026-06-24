import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";
import { createStripeClient } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase";
import type { Listing, Order } from "@/lib/types";

export async function POST(request: NextRequest) {
  const stripe = createStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const supabase = createSupabaseAdminClient();

  if (!stripe || !webhookSecret || !supabase) {
    return NextResponse.json(
      { error: "Stripe webhook or Supabase is not configured" },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const listingId = session.metadata?.listing_id;
    const quantity = Math.max(
      1,
      Number.parseInt(session.metadata?.quantity ?? "1", 10) || 1
    );

    if (!listingId) {
      return NextResponse.json({ received: true });
    }

    const { data: orderData } = await supabase
      .from("orders")
      .select("*")
      .eq("stripe_checkout_session_id", session.id)
      .single();

    if (!orderData) {
      return NextResponse.json({ received: true });
    }

    const order = orderData as Order;

    if (order.status === "paid") {
      return NextResponse.json({ received: true });
    }

    let streamQueueNumber = order.stream_queue_number;

    if (order.stream_open_required && streamQueueNumber === null) {
      const { data: nextQueueNumber } = await supabase.rpc(
        "next_stream_queue_number",
        { counter_id: "global" }
      );

      if (typeof nextQueueNumber === "number") {
        streamQueueNumber = nextQueueNumber;
      }
    }

    await supabase
      .from("orders")
      .update({
        status: "paid",
        buyer_email: session.customer_details?.email ?? null,
        quantity,
        amount_total_cents: session.amount_total ?? order.amount_total_cents,
        currency: session.currency ?? order.currency,
        paid_at: new Date().toISOString(),
        shipping_name: session.customer_details?.name ?? null,
        shipping_address: session.customer_details?.address ?? null,
        shipping_amount_cents: session.total_details?.amount_shipping ?? null,
        stream_queue_number: streamQueueNumber,
        stream_status: order.stream_open_required ? "queued" : null
      })
      .eq("stripe_checkout_session_id", session.id);

    const { data } = await supabase
      .from("listings")
      .select("*")
      .eq("id", listingId)
      .single();

    if (data) {
      const listing = data as Listing;
      const nextQuantity = Math.max(0, listing.quantity - quantity);

      await supabase
        .from("listings")
        .update({
          quantity: nextQuantity,
          status: nextQuantity === 0 ? "sold" : listing.status
        })
        .eq("id", listing.id);
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("stripe_checkout_session_id", session.id);
  }

  return NextResponse.json({ received: true });
}
