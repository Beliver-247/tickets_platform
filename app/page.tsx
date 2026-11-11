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
        <div className="mx-auto grid max-w-6xl min-w-0 gap-x-10 gap-y-0 px-5 pb-14 pt-3 sm:pb-20 sm:pt-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(300px,.8fr)] lg:items-start lg:gap-10 lg:pb-28 lg:pt-5">
          <div className="contents lg:col-start-1 lg:row-start-1 lg:block">
            <div className="order-1 min-w-0">
              <p className="mb-5 text-sm font-bold uppercase tracking-[.3em] text-[var(--accent)]">
                {eventConfig.tagline}
              </p>
              <h1
                className="max-w-4xl break-words text-[clamp(3rem,8vw,7.5rem)] font-black uppercase leading-[.92] tracking-[-.05em]"
                style={{ overflowWrap: "anywhere" }}
              >
                {eventConfig.eventName}
              </h1>
            </div>
            <p className="order-2 mt-8 max-w-xl text-lg leading-relaxed text-[var(--theme-muted)]">
              {formatDate(eventConfig.date)}
              <br />
              {eventConfig.venueName}, {eventConfig.venueAddress}
            </p>
            <div className="order-5 mt-8 flex flex-wrap gap-3">
              <PurchaseCta />
              <ButtonLink href="/status" muted>
                Check an order
              </ButtonLink>
            </div>
            <div className="order-7 mt-4">
              <p className="text-sm text-[var(--theme-muted)]">
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
          </div>
          <div className="contents lg:col-start-2 lg:row-start-1 lg:flex lg:flex-col lg:gap-5 lg:self-start">
            <div className="early-bird-card order-3 relative mt-6 overflow-hidden rounded-2xl border border-fuchsia-400/30 bg-[radial-gradient(circle_at_top_right,_rgba(255,43,214,.25),_transparent_45%),linear-gradient(145deg,#24102f,#120c1c)] p-3 shadow-xl shadow-fuchsia-950/30 lg:order-1 lg:mt-0 lg:p-4">
              <div className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-black uppercase tracking-[.2em] text-fuchsia-200">
                    Limited-time offer
                  </p>
                  <h2 className="early-bird-title mt-1 text-xl font-black uppercase leading-none tracking-[-.03em] text-white lg:text-2xl">
                    Free Barista voucher
                  </h2>
                </div>
                <Image
                  src="/partners/Barista.svg"
                  alt="Barista"
                  width={240}
                  height={113}
                  className="h-auto w-16 shrink-0 lg:w-20"
                />
              </div>
              <p className="mt-2 text-xs leading-relaxed text-fuchsia-100/80 lg:mt-3">
                Purchase your Open Mic &amp; DJ Night ticket before November
                14, 2026 and get a free Barista voucher!
              </p>
              <div className="early-bird-deadline mt-2 inline-block rounded-lg border border-fuchsia-200/30 bg-fuchsia-400/15 px-2 py-1 text-[9px] font-black tracking-[.1em] text-white lg:mt-3 lg:px-2.5 lg:text-[10px] lg:tracking-[.12em]">
                BUY BEFORE 14 NOVEMBER
              </div>
            </div>
            <div className="order-4 mt-3 rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-surface)] px-4 py-3 text-center shadow-lg lg:order-2 lg:mt-0">
              <p className="text-[9px] font-bold uppercase tracking-[.16em] text-zinc-500">
                Proudly partnering with
              </p>
              <Image
                src="/partners/redbull.webp"
                alt="Red Bull"
                width={220}
                height={144}
                className="mx-auto mt-1 h-auto w-[90px]"
              />
            </div>
            <div className="order-6 mt-5 rounded-3xl border border-[var(--theme-border)] bg-[var(--theme-surface)] p-6 shadow-2xl lg:order-3 lg:mt-0">
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
          </div>
        </div>
      </section>
      <CapacityNotice />
    </SiteShell>
  );
}
