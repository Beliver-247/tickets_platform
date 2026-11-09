"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { formatMoney } from "@/lib/format";

type Summary = {
  totalOrders: number;
  approvedOrders: number;
  approvedTickets: number;
  approvedRevenue: number;
  pendingOrders: number;
  pendingTickets: number;
  rejectedOrders: number;
  rejectedTickets: number;
  checkedInTickets: number;
};

type DailySales = {
  date: string;
  orders: number;
  tickets: number;
  revenue: number;
};

type Analytics = {
  summary: Summary;
  dailySales: DailySales[];
};

function formatDay(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
  }).format(new Date(`${date}T00:00:00+05:30`));
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState("");

  async function load() {
    const response = await fetch("/api/admin/analytics");
    const data = await response.json();
    if (!response.ok) setError(data.error ?? "Could not load analytics.");
    else setAnalytics(data);
  }

  useEffect(() => {
    load();
    const interval = window.setInterval(load, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const maxTickets = Math.max(
    ...(analytics?.dailySales.map((day) => day.tickets) ?? [1]),
    1,
  );
  const summary = analytics?.summary;

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100 md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-black">Analytics</h1>
          <div className="flex flex-wrap gap-2">
            <ThemeToggle />
            <a
              href="/admin/orders"
              className="rounded-full bg-zinc-800 px-4 py-2 text-sm"
            >
              Orders
            </a>
            <a
              href="/admin/checkin"
              className="rounded-full bg-zinc-800 px-4 py-2 text-sm"
            >
              Check-in
            </a>
          </div>
        </div>
        {error && <p className="mt-5 rounded-xl bg-red-950 p-3 text-red-300">{error}</p>}
        {!summary ? (
          <p className="mt-8 text-zinc-400">Loading analytics...</p>
        ) : (
          <>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Metric label="Tickets sold" value={summary.approvedTickets} accent />
              <Metric
                label="Approved revenue"
                value={formatMoney(summary.approvedRevenue)}
              />
              <Metric
                label="Pending tickets"
                value={summary.pendingTickets}
                detail={`${summary.pendingOrders} pending order${summary.pendingOrders === 1 ? "" : "s"}`}
              />
              <Metric
                label="Checked in"
                value={summary.checkedInTickets}
                detail={`${summary.approvedTickets - summary.checkedInTickets} remaining`}
              />
            </div>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Metric label="Total orders" value={summary.totalOrders} />
              <Metric
                label="Rejected tickets"
                value={summary.rejectedTickets}
                detail={`${summary.rejectedOrders} rejected order${summary.rejectedOrders === 1 ? "" : "s"}`}
              />
              <Metric label="Approved orders" value={summary.approvedOrders} />
            </div>
            <section className="mt-8 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 md:p-7">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-sm uppercase tracking-widest text-zinc-500">
                    Sales activity
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    Approved tickets by day
                  </h2>
                </div>
                <p className="text-sm text-zinc-500">Updates automatically</p>
              </div>
              {analytics.dailySales.length === 0 ? (
                <p className="mt-8 text-zinc-400">No approved sales yet.</p>
              ) : (
                <div className="mt-8 flex min-h-64 items-end gap-3 overflow-x-auto pb-2">
                  {analytics.dailySales.map((day) => (
                    <div
                      key={day.date}
                      className="flex min-w-16 flex-1 flex-col items-center gap-2"
                      title={`${day.tickets} tickets · ${formatMoney(day.revenue)}`}
                    >
                      <span className="text-sm font-bold">{day.tickets}</span>
                      <div className="flex h-44 w-full items-end rounded-lg bg-zinc-800 px-1">
                        <div
                          className="w-full rounded-md bg-[var(--primary)]"
                          style={{
                            height: `${Math.max((day.tickets / maxTickets) * 100, 5)}%`,
                          }}
                        />
                      </div>
                      <span className="text-xs text-zinc-500">{formatDay(day.date)}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

function Metric({
  label,
  value,
  detail,
  accent = false,
}: {
  label: string;
  value: number | string;
  detail?: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
      <p className="text-sm text-zinc-500">{label}</p>
      <p className={`mt-2 text-3xl font-black ${accent ? "text-[var(--primary)]" : ""}`}>
        {value}
      </p>
      {detail && <p className="mt-1 text-xs text-zinc-500">{detail}</p>}
    </div>
  );
}
