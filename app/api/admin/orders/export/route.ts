import { eventConfig } from "@/config/event";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

const columns = [
  "Order ID",
  "Created At",
  "Name",
  "Email",
  "Phone",
  "SLIIT ID",
  "Quantity",
  "Bank Reference",
  "Transaction At",
  "Status",
  "Ticket Number",
  "Checked In Count",
  "Approved At",
  "Rejection Reason",
];

function csvCell(value: unknown) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { data, error } = await createAdminClient()
    .from("orders")
    .select(
      "id,created_at,name,email,phone,sliit_id,qty,bank_reference,transaction_at,status,ticket_number,checked_in_count,approved_at,rejection_reason",
    )
    .eq("event_id", eventConfig.eventId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Could not export orders.", error);
    return Response.json({ error: "Could not export orders." }, { status: 500 });
  }

  const rows = (data ?? []).map((order) =>
    [
      order.id,
      order.created_at,
      order.name,
      order.email,
      order.phone,
      order.sliit_id,
      order.qty,
      order.bank_reference,
      order.transaction_at,
      order.status,
      order.ticket_number,
      order.checked_in_count,
      order.approved_at,
      order.rejection_reason,
    ]
      .map(csvCell)
      .join(","),
  );
  const csv = `\uFEFF${columns.map(csvCell).join(",")}\r\n${rows.join("\r\n")}`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${eventConfig.eventId}-sales.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
