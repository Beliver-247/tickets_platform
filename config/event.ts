export const eventConfig = {
  eventId: "REPLACE_ME_EVENT_ID",
  eventName: "REPLACE_ME_EVENT_NAME",
  tagline: "REPLACE_ME_TAGLINE",
  date: "2026-12-31T22:00:00+05:30",
  doorsOpenTime: "REPLACE_ME_DOORS_OPEN_TIME",
  venueName: "REPLACE_ME_VENUE_NAME",
  venueAddress: "REPLACE_ME_VENUE_ADDRESS",
  mapLink: "https://maps.google.com/?q=REPLACE_ME",
  ticketPrice: 2500,
  currency: "LKR",
  maxTicketsPerOrder: 5,
  totalCapacity: undefined as number | undefined,
  salesOpen: true,
  bank: {
    accountName: "REPLACE_ME_ACCOUNT_NAME",
    bankName: "REPLACE_ME_BANK_NAME",
    accountNumber: "REPLACE_ME_ACCOUNT_NUMBER",
    branch: "REPLACE_ME_BRANCH",
    paymentInstructions: "REPLACE_ME_PAYMENT_INSTRUCTIONS"
  },
  contact: {
    supportEmail: "REPLACE_ME_SUPPORT_EMAIL",
    supportPhone: "REPLACE_ME_SUPPORT_PHONE_OR_WHATSAPP"
  },
  theme: {
    primary: "#d8ff3e",
    accent: "#ff3cac",
    logoPath: "",
    heroImagePath: ""
  },
  ticketPrefix: "DJ-",
  emailSubject: "REPLACE_ME_EMAIL_SUBJECT",
  emailFooterNote: "REPLACE_ME_EMAIL_FOOTER_NOTE"
} as const;

export type EventConfig = typeof eventConfig;

export const {
  eventId,
  eventName,
  tagline,
  date,
  doorsOpenTime,
  venueName,
  venueAddress,
  mapLink,
  ticketPrice,
  currency,
  maxTicketsPerOrder,
  totalCapacity,
  salesOpen,
  ticketPrefix,
  emailSubject,
  emailFooterNote
} = eventConfig;
