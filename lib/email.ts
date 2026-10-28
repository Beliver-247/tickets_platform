import nodemailer from "nodemailer";
import { eventConfig } from "@/config/event";
import { formatDate } from "@/lib/format";

function transporter() {
  return nodemailer.createTransport({ service: "gmail", auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD } });
}
function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[character] ?? character);
}
function ticketCard(ticket: string) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="margin:0 0 20px;border:1px solid #6f1bb8;border-radius:16px;overflow:hidden;background:#160d25;color:#ffffff"><tr><td style="padding:0"><table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"><tr><td style="padding:28px 24px;background:linear-gradient(135deg,#160d25 0%,#4b087e 55%,#c026ff 100%);min-height:220px"><div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#f0b8ff">SLIIT CHOIR PRESENTS</div><div style="font-size:30px;line-height:1.05;font-weight:900;text-transform:uppercase;margin-top:24px">Open Mic<br><span style="color:#ffb3ff">&amp; DJ Night</span></div><div style="font-size:12px;letter-spacing:2px;text-transform:uppercase;margin-top:24px;color:#f4d8ff">${escapeHtml(formatDate(eventConfig.date))} · ${escapeHtml(eventConfig.doorsOpenTime)}</div><div style="font-size:13px;margin-top:8px;color:#ead6f5">${escapeHtml(eventConfig.venueName)} · ${escapeHtml(eventConfig.venueAddress)}</div></td><td width="112" valign="middle" align="center" style="border-left:2px dashed #d98bff;background:#0d0714;padding:16px 8px"><div style="font-size:20px;letter-spacing:5px;font-weight:900;writing-mode:vertical-rl;transform:rotate(180deg);color:#ffffff">ADMIT ONE</div><div style="height:54px;margin-top:18px;background:repeating-linear-gradient(90deg,#ffffff 0,#ffffff 2px,transparent 2px,transparent 5px)"></div></td></tr></table></td></tr><tr><td style="padding:16px 24px;background:#0d0714;border-top:1px solid #6f1bb8"><div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#b9abc7">Ticket number</div><div style="font-family:Arial,sans-serif;font-size:26px;font-weight:900;letter-spacing:1px;color:#ffb3ff;margin-top:4px">${escapeHtml(ticket)}</div><div style="font-size:11px;color:#b9abc7;margin-top:8px">Show this ticket number at the entrance</div></td></tr></table>`;
}
export async function sendTicketEmail(order: { email: string; name: string; qty: number; ticket_number: string }) {
  const ticketNumbers = Array.from({ length: order.qty }, (_, index) => `${order.ticket_number}-${index + 1}`);
  const ticketList = ticketNumbers.join(", ");
  const ticketListHtml = ticketNumbers.map(ticket => `<li>${escapeHtml(ticket)}</li>`).join("");
  const ticketCards = ticketNumbers.map(ticketCard).join("");
  const subject = eventConfig.emailSubject.replace("REPLACE_ME_EMAIL_SUBJECT", `${eventConfig.eventName} ticket confirmation`);
  const html = `<div style="margin:0;background:#09060d;padding:24px 12px;font-family:Arial,sans-serif;color:#f4f4f5"><div style="max-width:640px;margin:0 auto"><h1 style="font-size:28px;margin:0 0 8px;color:#ffffff">${escapeHtml(eventConfig.eventName)}</h1><p style="margin:0 0 20px;color:#cfc1d8">Hi ${escapeHtml(order.name)}, your payment has been verified.</p>${ticketCards}<p style="margin:8px 0 20px;color:#d9cbe0"><b>Share these ticket numbers with your ${order.qty} friend${order.qty === 1 ? "" : "s"}:</b><br><span style="color:#ffb3ff">${ticketList}</span></p><p style="color:#cfc1d8"><b>Show the relevant ticket preview or ticket number at the entrance.</b></p><p style="color:#cfc1d8">Support: ${escapeHtml(eventConfig.contact.supportEmail)} · ${escapeHtml(eventConfig.contact.supportPhone)}</p><hr style="border:0;border-top:1px solid #33213f"><small style="color:#9e8ca8">${escapeHtml(eventConfig.emailFooterNote)}</small></div></div>`;
  const text = `Hi ${order.name},\n\nYour payment for ${eventConfig.eventName} has been verified.\nYour ticket numbers are: ${ticketList}\nShare these with your ${order.qty} friend${order.qty === 1 ? "" : "s"}.\nQuantity: ${order.qty}\n${formatDate(eventConfig.date)}\nDoors: ${eventConfig.doorsOpenTime}\nVenue: ${eventConfig.venueName}, ${eventConfig.venueAddress}\n\nShow the relevant ticket number at the entrance.\nSupport: ${eventConfig.contact.supportEmail} · ${eventConfig.contact.supportPhone}\n\n${eventConfig.emailFooterNote}`;
  await transporter().sendMail({ from: process.env.GMAIL_USER, to: order.email, subject, html, text });
}
export async function sendRejectionEmail(order: { email: string; name: string }, reason: string) {
  await transporter().sendMail({ from: process.env.GMAIL_USER, to: order.email, subject: `${eventConfig.eventName}: payment update`, text: `Hi ${order.name},\n\nWe could not verify your payment for ${eventConfig.eventName}.\nReason: ${reason}\n\nPlease contact ${eventConfig.contact.supportEmail}.` });
}
