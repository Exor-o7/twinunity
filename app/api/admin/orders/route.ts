import { NextResponse, type NextRequest } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { createSupabaseAdminClient } from "@/lib/supabase";
import type { AdminStreamOrder, StreamStatus } from "@/lib/types";

const streamStatuses: StreamStatus[] = [
  "queued",
  "opened",
  "ready_to_ship",
  "fulfilled"
];

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);

  if (admin.error) {
    return admin.error;
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase service role key is not configured" },
      { status: 500 }
    );
  }

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      listing:listings (
        id,
        slug,
        name,
        set_name,
        card_number,
        sealed_type
      )
    `
    )
    .eq("stream_open_required", true)
    .in("status", ["paid", "fulfilled"])
    .order("stream_queue_number", { ascending: true, nullsFirst: false })
    .order("paid_at", { ascending: true });

  if (error) {
    return NextResponse.json(
      { error: "Unable to load stream queue" },
      { status: 500 }
    );
  }

  return NextResponse.json({ orders: data as AdminStreamOrder[] });
}

export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin(request);

  if (admin.error) {
    return admin.error;
  }

  const supabase = createSupabaseAdminClient();

  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase service role key is not configured" },
      { status: 500 }
    );
  }

  const body = (await request.json()) as {
    id?: string;
    stream_status?: StreamStatus;
  };

  if (!body.id || !body.stream_status || !streamStatuses.includes(body.stream_status)) {
    return NextResponse.json({ error: "Invalid stream order update" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("orders")
    .update({
      stream_status: body.stream_status,
      status: body.stream_status === "fulfilled" ? "fulfilled" : "paid"
    })
    .eq("id", body.id)
    .eq("stream_open_required", true)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "Unable to update stream order" },
      { status: 500 }
    );
  }

  return NextResponse.json({ order: data });
}
