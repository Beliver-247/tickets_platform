import { eventConfig } from "@/config/event";
import { createAdminClient } from "@/lib/supabase/admin";

export async function getSalesOpen() {
  const { data, error } = await createAdminClient()
    .from("event_settings")
    .select("sales_open")
    .eq("event_id", eventConfig.eventId)
    .maybeSingle();

  if (error) {
    console.error("Could not load sales status.", error);
    return eventConfig.salesOpen;
  }
  return data?.sales_open ?? eventConfig.salesOpen;
}
