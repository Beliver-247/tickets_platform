import { eventConfig } from "@/config/event";
import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";

type DailySales = {
  date: string;
  orders: number;
  tickets: number;
  revenue: number;
};

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { data, error } = await createAdminClient()
    .from("orders")
    .select("status, qty, checked_in_count, transaction_at")
    .eq("event_id", eventConfig.eventId);

  if (error) {
    console.error("Could not load analytics.", error);
    return Response.json({ error: "Could not load analytics." }, { status: 500 });
  }

  const orders = data ?? [];
  const approved = orders.filter((order) => order.status === "approved");
  const pending = orders.filter((order) => order.status === "pending");
  const rejected = orders.filter((order) => order.status === "rejected");
  const daily = new Map<string, DailySales>();

  for (const order of approved) {
    const date = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(order.transaction_at));
    const current = daily.get(date) ?? {
      date,
      orders: 0,
      tickets: 0,
      revenue: 0,
    };
    current.orders += 1;
    current.tickets += order.qty;
    current.revenue += order.qty * eventConfig.ticketPrice;
    daily.set(date, current);
  }

  return Response.json({
    summary: {
      totalOrders: orders.length,
      approvedOrders: approved.length,
      approvedTickets: approved.reduce((sum, order) => sum + order.qty, 0),
      approvedRevenue: approved.reduce(
        (sum, order) => sum + order.qty * eventConfig.ticketPrice,
        0,
      ),
      pendingOrders: pending.length,
      pendingTickets: pending.reduce((sum, order) => sum + order.qty, 0),
      rejectedOrders: rejected.length,
      rejectedTickets: rejected.reduce((sum, order) => sum + order.qty, 0),
      checkedInTickets: approved.reduce(
        (sum, order) => sum + order.checked_in_count,
        0,
      ),
    },
    dailySales: Array.from(daily.values()).sort((a, b) =>
      a.date.localeCompare(b.date),
    ),
  });
}
