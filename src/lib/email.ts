import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendBookingConfirmation(booking: any) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials missing, skipped email for booking:", booking.id);
    return;
  }

  const { name, email, service_type, items, start_date, check_in_time, total_amount, id } = booking;
  
  if (!email || email.includes("stayer-")) {
    console.log("No valid email or stayer email, skipping confirmation for:", id);
    return;
  }

  const appUrl = process.env.NEXTAUTH_URL || "https://srrresorts.com";
  const itemsList = Array.isArray(items) ? items.join(", ") : items;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmed - SRR Resorts</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }
        .header { background: #0b1a10; padding: 50px 40px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; }
        .header p { color: #c5a059; margin: 10px 0 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 700; color: #0b1a10; margin-bottom: 10px; }
        .intro { color: #666; font-size: 15px; line-height: 1.6; margin-bottom: 30px; }
        .card { background: #fbfbfb; border: 1px solid #f0f0f0; border-radius: 20px; padding: 25px; margin-bottom: 30px; }
        .detail-row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
        .detail-row:last-child { border-bottom: none; }
        .detail-label { color: #999; font-size: 11px; font-weight: 800; text-transform: uppercase; tracking: 1px; }
        .detail-value { color: #0b1a10; font-size: 14px; font-weight: 700; text-align: right; }
        .button-container { text-align: center; margin-top: 10px; }
        .button { background-image: linear-gradient(to right, #c5a059, #e0c283); color: #0b1a10; padding: 18px 35px; border-radius: 14px; text-decoration: none; font-weight: 800; font-size: 14px; display: inline-block; transition: transform 0.2s; box-shadow: 0 4px 15px rgba(197, 160, 89, 0.3); }
        .footer { background: #fafafa; padding: 30px; text-align: center; border-top: 1px solid #f0f0f0; }
        .footer p { color: #aaa; font-size: 12px; margin: 0; }
        .brand-text { color: #c5a059; font-weight: 700; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <p>Confirmation</p>
          <h1>Booking successful</h1>
        </div>
        <div class="content">
          <p class="greeting">Hello ${name},</p>
          <p class="intro">Your reservation at <span class="brand-text">SRR Resorts</span> is confirmed. We've locked in your choices and our team is preparing for your arrival.</p>
          
          <div class="card">
            <div class="detail-row">
              <span class="detail-label">Service</span>
              <span class="detail-value">${service_type}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Selections</span>
              <span class="detail-value">${itemsList}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Date</span>
              <span class="detail-value">${start_date}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Time</span>
              <span class="detail-value">${check_in_time}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Contact</span>
              <span class="detail-value">${booking.phone}</span>
            </div>
          </div>

          <div class="button-container">
            <a href="${appUrl}/dashboard" class="button">View Digital Ticket</a>
          </div>
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} SRR Resorts & Convention. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"SRR Resorts" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Booking Confirmed: ${service_type} - SRR Resorts`,
      html: html,
    });
    console.log(`Confirmation email sent to ${email} for booking ${id}`);
  } catch (error) {
    console.error("Failed to send confirmation email:", error);
  }
}
