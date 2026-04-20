export const WHATSAPP_NUMBER = "917702199889";

export interface WhatsAppBookingDetails {
  // Guest
  name: string;
  phone: string;
  email?: string;
  guests?: number;
  // Service
  serviceName: string;
  items: string[];
  // Dates & Times
  date?: string;
  checkOutDate?: string;
  checkInTime?: string;
  checkOutTime?: string;
  timeSlot?: string;
  durationHours?: number;
  // Payment
  totalAmount: number;
  paymentMethod?: string;
  isStayer?: boolean;
  roomNumber?: string;
  // Extras
  aadharUrl?: string;
  bookingId?: string;
}

export function buildWhatsAppMessage(details: WhatsAppBookingDetails): string {
  const {
    name,
    phone,
    email,
    guests,
    serviceName,
    items,
    date,
    checkOutDate,
    checkInTime,
    checkOutTime,
    timeSlot,
    durationHours,
    totalAmount,
    paymentMethod,
    isStayer,
    roomNumber,
    aadharUrl,
    bookingId,
  } = details;

  let msg = `🏨 *SRR Resorts & Convention — Booking Confirmed*\n\n`;

  if (bookingId) {
    msg += `📋 *Booking ID:* ${bookingId}\n\n`;
  }

  msg += `*👤 Guest Details*\n`;
  msg += `*Name:* ${name}\n`;
  msg += `*Phone:* ${phone}\n`;
  if (email) msg += `*Email:* ${email}\n`;
  if (guests) msg += `*Guests:* ${guests}\n`;
  msg += `\n`;

  msg += `*🛎 Stay / Service Details*\n`;
  msg += `*Service:* ${serviceName}\n`;
  if (items.length > 0) msg += `*Selections:* ${items.join(", ")}\n`;

  if (date) {
    const checkInDisplay = checkInTime
      ? formatTime24to12(checkInTime)
      : timeSlot || "";
    msg += `*Check-In:* ${date}${checkInDisplay ? ` @ ${checkInDisplay}` : ""}\n`;
  }

  if (checkOutDate) {
    const checkOutDisplay = checkOutTime ? formatTime24to12(checkOutTime) : "";
    msg += `*Check-Out:* ${checkOutDate}${checkOutDisplay ? ` @ ${checkOutDisplay}` : ""}\n`;
  }

  if (durationHours && durationHours > 1) {
    msg += `*Duration:* ${durationHours} Hour${durationHours > 1 ? "s" : ""}\n`;
  }

  msg += `\n`;

  msg += `*💳 Payment Summary*\n`;
  if (isStayer) {
    msg += `*Guest Type:* Resort Stayer (Complimentary Access)\n`;
    if (roomNumber) msg += `*Room No:* ${roomNumber}\n`;
  } else if (totalAmount === 0) {
    msg += `*Amount:* Quotation Pending (Staff to Confirm)\n`;
  } else {
    msg += `*Status:* ${paymentMethod === "CASH" ? "PAID (Cash)" : paymentMethod === "ONLINE" ? "PAID (Online)" : `PAID (${paymentMethod || "Direct"})`}\n`;
    msg += `*Total Amount:* ₹${totalAmount.toLocaleString("en-IN")}\n`;
  }

  if (aadharUrl) {
    msg += `\n`;
    msg += `*🪪 Identification*\n`;
    msg += `*Aadhar Card:* ${aadharUrl}\n`;
  }

  msg += `\n`;
  msg += `_Thank you for choosing SRR Resorts & Convention. We look forward to hosting you!_ 🌿`;

  return msg;
}

export function openWhatsApp(message: string, phone: string = WHATSAPP_NUMBER): void {
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

function formatTime24to12(time24: string): string {
  if (!time24) return "";
  const [h, m] = time24.split(":");
  let hour = parseInt(h);
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${m} ${period}`;
}
