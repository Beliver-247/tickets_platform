import { eventConfig } from "@/config/event";
import { formatDate, formatMoney } from "@/lib/format";
import { SiteShell, ButtonLink } from "@/components/site-shell";
import { PurchaseCta } from "@/components/purchase-cta";
import { CapacityNotice } from "@/components/capacity-notice";
import Image from "next/image";

export default function Home() {
  return (
    <SiteShell>
      <section className="noise border-b border-[var(--theme-border)]">
        <div className="mx-auto grid max-w-6xl min-w-0 gap-10 px-5 py-14 sm:py-20 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)] lg:items-start lg:py-28">
          <div className="order-1 min-w-0 lg:order-none">
            <p className="mb-5 text-sm font-bold uppercase tracking-[.3em] text-[var(--accent)]">
              {eventConfig.tagline}
            </p>
            <h1
              className="max-w-4xl break-words text-[clamp(3rem,8vw,7.5rem)] font-black uppercase leading-[.92] tracking-[-.05em]"
              style={{ overflowWrap: "anywhere" }}
            >
              {eventConfig.eventName}
            </h1>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-[var(--theme-muted)]">
              {formatDate(eventConfig.date)}
              <br />
              {eventConfig.venueName}, {eventConfig.venueAddress}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <PurchaseCta />
              <ButtonLink href="/status" muted>
                Check an order
              </ButtonLink>
            </div>
            <p className="mt-4 text-sm text-[var(--theme-muted)]">
              To physically buy tickets, contact the numbers given below.
            </p>
            <div className="mt-2 flex flex-col gap-1 text-base font-semibold">
              {eventConfig.contact.supportContacts.map((contact) => (
                <a
                  key={contact.phone}
                  href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                  className="text-[var(--accent)] underline underline-offset-2"
                >
                  {contact.name}: {contact.phone}
                </a>
              ))}
            </div>
          </div>
          <div className="order-2 flex min-w-0 flex-col gap-5 self-start lg:col-start-2 lg:row-start-1">
            <div className="order-2 rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 shadow-2xl lg:order-1">
              <p className="text-sm uppercase tracking-widest text-zinc-500">
                Bank transfer
              </p>
              <h2 className="mt-4 text-3xl font-black">
                {formatMoney(eventConfig.ticketPrice)}{" "}
                <span className="text-base font-normal text-zinc-500">
                  per ticket
                </span>
              </h2>
              <div className="mt-6 space-y-3 text-sm leading-relaxed text-zinc-300">
                <p>
                  <b className="text-white">Account Holder:</b>{" "}
                  {eventConfig.bank.accountName}
                </p>
                <p>
                  <b className="text-white">Bank:</b> {eventConfig.bank.bankName}
                </p>
                <p>
                  <b className="text-white">Number:</b>{" "}
                  {eventConfig.bank.accountNumber}
                </p>
                <p>
                  <b className="text-white">Branch:</b> {eventConfig.bank.branch}
                </p>
                <p
                  className="break-words border-t border-zinc-800 pt-4"
                  style={{ overflowWrap: "anywhere" }}
                >
                  {eventConfig.bank.paymentInstructions}
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-center text-sm font-bold uppercase tracking-widest text-zinc-500">
                Proudly partnering with
              </p>
              <div className="mt-3 rounded-2xl border border-[#164d9b] bg-[#003b7a] p-5 text-center shadow-xl">
                <Image
                  src="/partners/redbull.webp"
                  alt="Red Bull"
                  width={520}
                  height={340}
                  className="mx-auto h-auto w-full max-w-[230px]"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <CapacityNotice />
    </SiteShell>
  );
}
