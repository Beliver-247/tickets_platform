import { requireAdmin } from "@/lib/admin-auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isPushSubscription, sendPushToAdmins } from "@/lib/push";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!publicKey)
    return Response.json(
      { error: "Web Push is not configured on the server." },
      { status: 503 },
    );
  return Response.json({ publicKey });
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const subscription = await request.json().catch(() => null);
  if (!isPushSubscription(subscription))
    return Response.json({ error: "Invalid push subscription." }, { status: 400 });
  const { error } = await createAdminClient()
    .from("admin_push_subscriptions")
    .upsert({
      endpoint: subscription.endpoint,
      user_id: auth.user.id,
      p256dh: subscription.keys.p256dh,
      auth: subscription.keys.auth,
    });
  if (error) {
    console.error("Could not save admin push subscription.", error);
    return Response.json(
      { error: "Could not enable notifications." },
      { status: 500 },
    );
  }
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("endpoint" in body))
    return Response.json({ error: "Invalid push subscription." }, { status: 400 });
  const endpoint = body.endpoint;
  if (typeof endpoint !== "string")
    return Response.json({ error: "Invalid push subscription." }, { status: 400 });
  const { error } = await createAdminClient()
    .from("admin_push_subscriptions")
    .delete()
    .eq("endpoint", endpoint)
    .eq("user_id", auth.user.id);
  if (error) {
    console.error("Could not disable admin push subscription.", error);
    return Response.json(
      { error: "Could not disable notifications." },
      { status: 500 },
    );
  }
  return Response.json({ ok: true });
}

export async function PUT() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;
  try {
    const sent = await sendPushToAdmins({
      title: "Test notification",
      body: "Admin Web Push notifications are working.",
      url: "/admin/orders",
    });
    return Response.json({ ok: true, sent });
  } catch (error) {
    console.error("Admin test notification failed.", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Test notification failed." },
      { status: 502 },
    );
  }
}
