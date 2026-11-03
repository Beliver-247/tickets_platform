import webpush from "web-push";
import { createAdminClient } from "@/lib/supabase/admin";
import { eventConfig } from "@/config/event";

type PushSubscription = {
  endpoint: string;
  keys: { p256dh: string; auth: string };
};

function configureWebPush() {
  const subject = process.env.WEB_PUSH_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (!subject || !publicKey || !privateKey) return false;
  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

export async function sendPushToAdmins(payload: {
  title: string;
  body: string;
  url: string;
}): Promise<number> {
  if (!configureWebPush()) {
    throw new Error("Web Push is not configured on the server.");
  }
  const admin = createAdminClient();
  const { data: subscriptions, error } = await admin
    .from("admin_push_subscriptions")
    .select("endpoint, p256dh, auth");
  if (error) {
    console.error("Could not load admin push subscriptions.", error);
    throw new Error("Could not load admin push subscriptions.");
  }

  if (!subscriptions?.length)
    throw new Error(
      "No admin notification subscriptions are registered for this device.",
    );
  const result = await Promise.all(
    (subscriptions ?? []).map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: { p256dh: subscription.p256dh, auth: subscription.auth },
          },
          JSON.stringify(payload),
        );
        return true;
      } catch (error) {
        console.error("Could not send admin push notification.", error);
        if (
          error &&
          typeof error === "object" &&
          "statusCode" in error &&
          (error.statusCode === 404 || error.statusCode === 410)
        )
          await admin
            .from("admin_push_subscriptions")
            .delete()
            .eq("endpoint", subscription.endpoint);
        return false;
      }
    }),
  );
  if (!result.some(Boolean))
    throw new Error("Push service rejected all admin notification subscriptions.");
  return result.filter(Boolean).length;
}

export async function notifyAdminsOfNewOrder(order: {
  id: string;
  name: string;
  qty: number;
}) {
  try {
    await sendPushToAdmins({
      title: `New ticket request - ${eventConfig.eventName}`,
      body: `${order.name} requested ${order.qty} ticket${order.qty === 1 ? "" : "s"}.`,
      url: "/admin/orders",
    });
  } catch (error) {
    console.error("New-order notification failed.", error);
  }
}

export function isPushSubscription(value: unknown): value is PushSubscription {
  if (!value || typeof value !== "object") return false;
  const subscription = value as Record<string, unknown>;
  const keys =
    subscription.keys && typeof subscription.keys === "object"
      ? (subscription.keys as Record<string, unknown>)
      : null;
  return (
    typeof subscription.endpoint === "string" &&
    Boolean(keys) &&
    typeof keys?.p256dh === "string" &&
    typeof keys?.auth === "string"
  );
}
