import { eventConfig } from "@/config/event";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getSalesOpen } from "@/lib/sales";

export async function GET() {
  return Response.json({ salesOpen: await getSalesOpen() });
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const body = await request.json();
  if (typeof body.salesOpen !== "boolean")
    return Response.json({ error: "salesOpen must be a boolean." }, { status: 400 });

  const { error } = await createAdminClient().from("event_settings").upsert(
    { event_id: eventConfig.eventId, sales_open: body.salesOpen },
    { onConflict: "event_id" },
  );
  if (error) {
    console.error("Could not update sales status.", error);
    return Response.json({ error: "Could not update sales status." }, { status: 500 });
  }
  return Response.json({ salesOpen: body.salesOpen });
}
