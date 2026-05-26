import nodemailer from 'nodemailer';
import 'dotenv/config';

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;


  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    console.warn("⚠️ SMTP environment variables missing. Email will be mocked.");
    return null;
  }

  // Trim any accidental whitespace
  const host = SMTP_HOST.trim();
  const port = (SMTP_PORT || "").trim();
  const user = SMTP_USER.trim();
  const pass = (SMTP_PASS || "").trim();

  console.log(`📧 Email transporter config -> host=${host}, port=${port}, user=${user}`);

  // Use Gmail shortcut if host contains gmail (auto TLS handling)
  // Force explicit SMTP configuration (avoid Gmail shortcut which may try IPv6/port 465)
  const transportOptions = {
    host,
    port: parseInt(port || '587', 10),
    secure: false, // use STARTTLS on port 587
    auth: { user, pass },
    // Force IPv4 (Render sometimes cannot reach IPv6 smtp.gmail.com)
    family: 4,
    // Nodemailer will upgrade to TLS via STARTTLS automatically
    tls: {
      // Allow self‑signed certs just in case (Render's egress)
      rejectUnauthorized: false
    }
  };

  transporter = nodemailer.createTransport(transportOptions);
  return transporter;
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'THB' }).format(amount);
};

export async function sendBookingConfirmation(reservation) {
  const mailer = getTransporter();
  const to = reservation.email;
  const subject = `Reservation Confirmed - Dear Ruby`;
  
  let preOrderHtml = '';
  if (reservation.preOrderJson) {
    try {
      const items = JSON.parse(reservation.preOrderJson);
      if (items.length > 0) {
        let total = 0;
        const itemsHtml = items.map(item => {
          const itemTotal = item.price * item.qty;
          total += itemTotal;
          return `
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); color: #F6F4EE;">${item.qty}x ${item.name}</td>
              <td style="padding: 12px 0; border-bottom: 1px solid rgba(255,255,255,0.1); text-align: right; color: #D4AF37;">${formatCurrency(itemTotal)}</td>
            </tr>
          `;
        }).join('');
        
        preOrderHtml = `
          <div style="margin-top: 32px; background: rgba(0,0,0,0.3); padding: 24px; border-radius: 8px;">
            <h3 style="color: #D4AF37; font-family: 'Playfair Display', serif; margin-top: 0; font-size: 1.2rem; font-weight: normal; text-transform: uppercase; letter-spacing: 1px;">Pre-Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              ${itemsHtml}
              <tr>
                <td style="padding-top: 16px; font-weight: bold; color: #F6F4EE;">Pre-Order Total</td>
                <td style="padding-top: 16px; font-weight: bold; text-align: right; color: #D4AF37;">${formatCurrency(total)}</td>
              </tr>
            </table>
          </div>
        `;
      }
    } catch (e) {
      console.error("Failed to parse pre-order JSON for email", e);
    }
  }

  const html = `
    <div style="font-family: 'Montserrat', sans-serif; max-width: 600px; margin: 0 auto; background: #0A0A0A; color: #F6F4EE; line-height: 1.6;">
      <!-- Header -->
      <div style="background: url('https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80') center/cover; padding: 40px 20px; text-align: center; border-bottom: 3px solid #8A1E20;">
        <div style="background: rgba(0,0,0,0.6); padding: 20px; display: inline-block; text-align: center;">
          <a href="https://dearruby.onrender.com" style="text-decoration: none; border: none;">
            <img src="https://dearruby.onrender.com/images/logo-transparent.png" alt="Dear Ruby" style="height: 140px; max-width: 100%; object-fit: contain; margin-bottom: 8px; display: block; margin-left: auto; margin-right: auto; border: none;" />
          </a>
          <p style="margin: 10px 0 0; color: #D4AF37; text-transform: uppercase; letter-spacing: 2px; font-size: 0.85rem;">Booking Confirmation</p>
        </div>
      </div>

      <!-- Body -->
      <div style="padding: 40px 30px;">
        <p style="font-size: 1.1rem; color: #F6F4EE;">Dear <strong>${reservation.firstName} ${reservation.lastName}</strong>,</p>
        <p style="color: #C8C4B7;">We are delighted to confirm your reservation at Dear Ruby. Below are the details of your booking:</p>

        <div style="margin: 32px 0; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); color: #C8C4B7; width: 40%;">Date</td>
              <td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: bold; color: #F6F4EE;">${reservation.date}</td>
            </tr>
            <tr>
              <td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #C8C4B7;">Time</td>
              <td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: bold; color: #F6F4EE;">${reservation.time}</td>
            </tr>
            <tr>
              <td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.02); color: #C8C4B7;">Guests</td>
              <td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: bold; color: #F6F4EE;">${reservation.guests} pax</td>
            </tr>
            <tr>
              <td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #C8C4B7;">Deposit Paid</td>
              <td style="padding: 16px 20px; border-bottom: 1px solid rgba(255,255,255,0.1); font-weight: bold; color: #D4AF37;">฿3,000</td>
            </tr>
            <tr>
              <td style="padding: 16px 20px; background: rgba(255,255,255,0.02); color: #C8C4B7;">Service Type</td>
              <td style="padding: 16px 20px; font-weight: bold; color: #F6F4EE; text-transform: uppercase;">${reservation.serviceType || 'Dine-in'}</td>
            </tr>
          </table>
        </div>

        ${preOrderHtml}

        <h4 style="margin: 32px 0 12px; color: #F6F4EE; font-family: 'Playfair Display', serif; font-size: 1.2rem;">Important Information</h4>
        <ul style="color: #C8C4B7; padding-left: 20px; margin: 0; font-size: 0.9rem;">
          <li style="margin-bottom: 8px;"><strong>Punctuality:</strong> Please arrive promptly. We reserve the right to cancel bookings if you arrive more than 15 minutes late.</li>
          <li style="margin-bottom: 8px;"><strong>Dress Code:</strong> Smart Elegance. Athletic wear and flip-flops are not permitted.</li>
          <li><strong>Location:</strong> Rooftop, 45th Floor.</li>
        </ul>

        <p style="margin-top: 32px; color: #C8C4B7;">We look forward to providing you with an unforgettable culinary journey.</p>
        <p style="color: #C8C4B7;">Warm regards,<br><span style="color: #F6F4EE; font-weight: bold; font-style: italic;">The Dear Ruby Team</span></p>
      </div>
      
      <!-- Footer -->
      <div style="background: #050505; padding: 24px; text-align: center; color: rgba(246, 244, 238, 0.4); font-size: 0.75rem;">
        <p style="margin: 0;">Need to change your booking? Contact us at reservations@dearruby.co or call 043 100 555.</p>
        <p style="margin: 8px 0 0;">&copy; ${new Date().getFullYear()} Dear Ruby. All rights reserved.</p>
      </div>
    </div>
  `;

  if (!mailer) {
    console.log("-----------------------------------------");
    console.log(`[MOCK EMAIL TO: ${to}]`);
    console.log(`Subject: ${subject}`);
    console.log(`(Email omitted from console due to length. Configure SMTP to send real emails.)`);
    console.log("-----------------------------------------");
    return;
  }

  try {
    await mailer.sendMail({
      from: process.env.SMTP_FROM || 'reservations@dearruby.co',
      to,
      subject,
      html
    });
    console.log(`Email sent successfully to ${to}`);
  } catch (error) {
    console.error(`Failed to send email to ${to}:`, error);
    throw error;
  }
}

export async function sendEventInquiryNotification(inquiry) {
  const mailer = getTransporter();
  // Usually this sends to the restaurant admin, but we'll send a copy to the customer too
  const to = process.env.SMTP_USER; // Send to admin
  const customerEmail = inquiry.email;
  const subject = `New Private Event Inquiry - ${inquiry.firstName} ${inquiry.lastName}`;
  
  const html = `
    <div style="font-family: 'Montserrat', sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; color: #111827; padding: 30px;">
      <h2 style="color: #8A1E20;">New Event Inquiry Received</h2>
      <p>A new private event inquiry has been submitted through the website.</p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
        <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Name</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${inquiry.firstName} ${inquiry.lastName}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Email</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${customerEmail}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Phone</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${inquiry.phone}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Event Date</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${inquiry.eventDate}</td></tr>
        <tr><td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold;">Guests</td><td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${inquiry.guestCount}</td></tr>
      </table>
      <div style="margin-top: 20px; padding: 20px; background: #fff; border-radius: 8px;">
        <strong>Details:</strong><br/>
        <p style="white-space: pre-wrap; margin-top: 10px;">${inquiry.eventDetails || 'No details provided.'}</p>
      </div>
    </div>
  `;

  if (!mailer) {
    console.log(`[MOCK INQUIRY EMAIL] New event inquiry from ${customerEmail}`);
    return;
  }

  try {
    await mailer.sendMail({
      from: process.env.SMTP_FROM || 'reservations@dearruby.co',
      to,
      replyTo: customerEmail,
      subject,
      html
    });
    console.log(`Inquiry notification sent to admin`);
  } catch (error) {
    console.error(`Failed to send inquiry notification:`, error);
  }
}
