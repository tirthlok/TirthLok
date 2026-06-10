export function bookingConfirmationTemplate(data: {
  bookingId: string
  guestName: string
  dharamshalaName: string
  dharamshalaCity: string
  dharamshalaState: string
  roomName: string
  checkInDate: string
  checkOutDate: string
  nights: number
  adults: number
  totalAmount: number
  guestPhone: string
  guestEmail: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Booking Confirmed — TirthLok</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" 
               style="max-width:600px;width:100%;background:#ffffff;
                      border-radius:16px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8 0%,#0891b2 100%);
                       padding:36px 40px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.15);
                          border-radius:50%;width:56px;height:56px;
                          line-height:56px;text-align:center;margin-bottom:12px;">
                <span style="font-size:28px;">🛕</span>
              </div>
              <h1 style="color:#ffffff;margin:0;font-size:26px;
                         font-weight:800;letter-spacing:-0.5px;">
                TirthLok
              </h1>
              <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;
                        font-size:13px;">
                Sacred Pilgrimages & Dharamshala Stays
              </p>
            </td>
          </tr>

          <!-- Confirmation Banner -->
          <tr>
            <td style="background:#f0fdf4;padding:20px 40px;
                       border-bottom:1px solid #bbf7d0;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <span style="display:inline-block;background:#16a34a;
                                 color:#ffffff;border-radius:50px;
                                 padding:8px 20px;font-size:13px;
                                 font-weight:700;letter-spacing:0.5px;">
                      ✓ BOOKING CONFIRMED
                    </span>
                    <p style="margin:12px 0 4px;font-size:22px;
                               font-weight:800;color:#14532d;">
                      Jai Jinendra, ${data.guestName}!
                    </p>
                    <p style="margin:0;color:#16a34a;font-size:13px;">
                      Your dharamshala stay has been successfully booked.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Booking ID -->
          <tr>
            <td style="padding:24px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#eff6ff;border-radius:12px;
                            border:1px solid #bfdbfe;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:11px;color:#3b82f6;
                               font-weight:700;letter-spacing:1px;
                               text-transform:uppercase;">
                      Booking Reference
                    </p>
                    <p style="margin:6px 0 0;font-size:20px;
                               font-weight:800;color:#1e3a8a;
                               font-family:monospace;">
                      #${data.bookingId.slice(0, 8).toUpperCase()}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Property Details -->
          <tr>
            <td style="padding:20px 40px 0;">
              <p style="margin:0 0 12px;font-size:12px;color:#6b7280;
                         font-weight:700;letter-spacing:1px;
                         text-transform:uppercase;">
                Property
              </p>
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#f8fafc;border-radius:12px;
                            border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0;font-size:18px;font-weight:800;
                               color:#0f172a;">
                      ${data.dharamshalaName}
                    </p>
                    <p style="margin:4px 0 0;font-size:13px;color:#64748b;">
                      📍 ${data.dharamshalaCity}, ${data.dharamshalaState}
                    </p>
                    <p style="margin:8px 0 0;font-size:13px;color:#475569;">
                      🛏 ${data.roomName}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Stay Details -->
          <tr>
            <td style="padding:20px 40px 0;">
              <p style="margin:0 0 12px;font-size:12px;color:#6b7280;
                         font-weight:700;letter-spacing:1px;
                         text-transform:uppercase;">
                Stay Details
              </p>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td width="48%" style="background:#eff6ff;border-radius:12px;
                                          padding:16px;text-align:center;">
                    <p style="margin:0;font-size:11px;color:#3b82f6;
                               font-weight:700;text-transform:uppercase;
                               letter-spacing:0.5px;">
                      Check-in
                    </p>
                    <p style="margin:6px 0 0;font-size:16px;font-weight:800;
                               color:#1e3a8a;">
                      ${data.checkInDate}
                    </p>
                  </td>
                  <td width="4%" style="text-align:center;color:#94a3b8;
                                         font-size:18px;">
                    →
                  </td>
                  <td width="48%" style="background:#fff7ed;border-radius:12px;
                                          padding:16px;text-align:center;">
                    <p style="margin:0;font-size:11px;color:#f97316;
                               font-weight:700;text-transform:uppercase;
                               letter-spacing:0.5px;">
                      Check-out
                    </p>
                    <p style="margin:6px 0 0;font-size:16px;font-weight:800;
                               color:#7c2d12;">
                      ${data.checkOutDate}
                    </p>
                  </td>
                </tr>
              </table>
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="margin-top:12px;">
                <tr>
                  <td width="48%" style="background:#f0fdf4;border-radius:12px;
                                          padding:16px;text-align:center;">
                    <p style="margin:0;font-size:11px;color:#16a34a;
                               font-weight:700;text-transform:uppercase;">
                      Duration
                    </p>
                    <p style="margin:6px 0 0;font-size:16px;font-weight:800;
                               color:#14532d;">
                      ${data.nights} Night${data.nights > 1 ? 's' : ''}
                    </p>
                  </td>
                  <td width="4%"></td>
                  <td width="48%" style="background:#faf5ff;border-radius:12px;
                                          padding:16px;text-align:center;">
                    <p style="margin:0;font-size:11px;color:#9333ea;
                               font-weight:700;text-transform:uppercase;">
                      Guests
                    </p>
                    <p style="margin:6px 0 0;font-size:16px;font-weight:800;
                               color:#581c87;">
                      ${data.adults} Adult${data.adults > 1 ? 's' : ''}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Amount -->
          <tr>
            <td style="padding:20px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:linear-gradient(135deg,#f0fdf4,#dcfce7);
                            border-radius:12px;border:1px solid #86efac;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td>
                          <p style="margin:0;font-size:13px;color:#15803d;
                                     font-weight:600;">
                            Total Amount
                          </p>
                          <p style="margin:4px 0 0;font-size:11px;color:#16a34a;">
                            Pay at property on arrival
                          </p>
                        </td>
                        <td align="right">
                          <p style="margin:0;font-size:28px;font-weight:800;
                                     color:#14532d;">
                            ₹${data.totalAmount}
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Important Note -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#fffbeb;border-radius:12px;
                            border:1px solid #fcd34d;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:13px;color:#92400e;
                               font-weight:700;">
                      ⚠️ Important
                    </p>
                    <p style="margin:6px 0 0;font-size:12px;color:#78350f;
                               line-height:1.6;">
                      Please carry a valid ID proof at check-in. 
                      Show this booking reference number to the dharamshala staff.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:0;"/>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;text-align:center;">
              <p style="margin:0;font-size:13px;color:#64748b;">
                Need help? Reply to this email or contact us at
              </p>
              <p style="margin:4px 0 0;font-size:13px;">
                <a href="mailto:support@tirthlok.in"
                   style="color:#2563eb;text-decoration:none;font-weight:600;">
                  support@tirthlok.in
                </a>
              </p>
              <p style="margin:20px 0 0;font-size:11px;color:#94a3b8;">
                © 2026 TirthLok · tirthlok.in
              </p>
              <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;">
                Connecting pilgrims to sacred destinations across India
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function adminNotificationTemplate(data: {
  bookingId: string
  guestName: string
  guestEmail: string
  guestPhone: string
  dharamshalaName: string
  dharamshalaCity: string
  roomName: string
  checkInDate: string
  checkOutDate: string
  nights: number
  adults: number
  totalAmount: number
  createdAt: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0f4f8;
             font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#f0f4f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;background:#ffffff;
                      border-radius:16px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1e40af,#1d4ed8);
                       padding:28px 40px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:22px;font-weight:800;">
                🔔 New Booking — TirthLok Admin
              </h1>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background:#fef3c7;padding:14px 40px;
                       border-bottom:1px solid #fcd34d;text-align:center;">
              <p style="margin:0;color:#92400e;font-size:13px;font-weight:700;">
                A new booking has been confirmed at ${data.dharamshalaName}
              </p>
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="padding:28px 40px;">

              <!-- Booking Info -->
              <p style="margin:0 0 16px;font-size:12px;color:#6b7280;
                         font-weight:700;letter-spacing:1px;
                         text-transform:uppercase;">
                Booking Details
              </p>
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="border:1px solid #e2e8f0;border-radius:12px;
                            overflow:hidden;">
                ${[
                  ['Booking ID', '#' + data.bookingId.slice(0, 8).toUpperCase()],
                  ['Property', data.dharamshalaName + ' · ' + data.dharamshalaCity],
                  ['Room', data.roomName],
                  ['Check-in', data.checkInDate],
                  ['Check-out', data.checkOutDate],
                  ['Duration', data.nights + ' night(s)'],
                  ['Guests', data.adults + ' adult(s)'],
                  ['Total', '₹' + data.totalAmount],
                  ['Booked at', data.createdAt],
                ].map((row, i) => `
                <tr style="background:${i % 2 === 0 ? '#f8fafc' : '#ffffff'};">
                  <td style="padding:12px 16px;font-size:12px;color:#64748b;
                              font-weight:600;width:35%;
                              border-bottom:1px solid #f1f5f9;">
                    ${row[0]}
                  </td>
                  <td style="padding:12px 16px;font-size:13px;color:#0f172a;
                              font-weight:700;
                              border-bottom:1px solid #f1f5f9;">
                    ${row[1]}
                  </td>
                </tr>`).join('')}
              </table>

              <!-- Guest Info -->
              <p style="margin:24px 0 16px;font-size:12px;color:#6b7280;
                         font-weight:700;letter-spacing:1px;
                         text-transform:uppercase;">
                Guest Information
              </p>
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#eff6ff;border-radius:12px;
                            border:1px solid #bfdbfe;">
                ${[
                  ['Name', data.guestName],
                  ['Email', data.guestEmail],
                  ['Phone', data.guestPhone],
                ].map(row => `
                <tr>
                  <td style="padding:12px 16px;font-size:12px;color:#3b82f6;
                              font-weight:600;width:35%;">
                    ${row[0]}
                  </td>
                  <td style="padding:12px 16px;font-size:13px;
                              color:#1e3a8a;font-weight:700;">
                    ${row[1]}
                  </td>
                </tr>`).join('')}
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;
                       text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:12px;color:#94a3b8;">
                TirthLok Admin Notification · admin@tirthlok.in
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function cancellationTemplate(data: {
  bookingId: string
  guestName: string
  dharamshalaName: string
  checkInDate: string
  checkOutDate: string
  totalAmount: number
  cancellationReason?: string
}): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f0f4f8;
             font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0"
         style="background:#f0f4f8;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0"
               style="max-width:600px;background:#ffffff;
                      border-radius:16px;overflow:hidden;
                      box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1d4ed8,#0891b2);
                       padding:36px 40px;text-align:center;">
              <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800;">
                TirthLok
              </h1>
              <p style="color:rgba(255,255,255,0.75);margin:6px 0 0;font-size:13px;">
                Sacred Pilgrimages & Dharamshala Stays
              </p>
            </td>
          </tr>

          <!-- Cancellation Banner -->
          <tr>
            <td style="background:#fef2f2;padding:20px 40px;
                       border-bottom:1px solid #fecaca;text-align:center;">
              <span style="display:inline-block;background:#dc2626;
                           color:#fff;border-radius:50px;
                           padding:8px 20px;font-size:13px;font-weight:700;">
                ✕ BOOKING CANCELLED
              </span>
              <p style="margin:12px 0 0;font-size:15px;font-weight:700;
                         color:#991b1b;">
                Your booking has been cancelled
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding:28px 40px;">
              <p style="margin:0 0 20px;font-size:14px;color:#374151;
                         line-height:1.6;">
                Dear ${data.guestName}, your booking at
                <strong>${data.dharamshalaName}</strong> has been cancelled.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#fef2f2;border-radius:12px;
                            border:1px solid #fecaca;">
                ${[
                  ['Booking ID', '#' + data.bookingId.slice(0, 8).toUpperCase()],
                  ['Property', data.dharamshalaName],
                  ['Check-in', data.checkInDate],
                  ['Check-out', data.checkOutDate],
                  ['Amount', '₹' + data.totalAmount],
                ].map(row => `
                <tr>
                  <td style="padding:12px 16px;font-size:12px;color:#dc2626;
                              font-weight:600;width:35%;">
                    ${row[0]}
                  </td>
                  <td style="padding:12px 16px;font-size:13px;
                              color:#7f1d1d;font-weight:700;">
                    ${row[1]}
                  </td>
                </tr>`).join('')}
              </table>

              ${data.cancellationReason ? `
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="margin-top:16px;background:#fffbeb;
                            border-radius:12px;border:1px solid #fcd34d;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0;font-size:12px;color:#92400e;
                               font-weight:700;">Reason</p>
                    <p style="margin:4px 0 0;font-size:13px;color:#78350f;">
                      ${data.cancellationReason}
                    </p>
                  </td>
                </tr>
              </table>` : ''}

              <p style="margin:24px 0 0;font-size:13px;color:#6b7280;
                         line-height:1.6;">
                If you did not request this cancellation or need assistance,
                please contact us at
                <a href="mailto:support@tirthlok.in"
                   style="color:#2563eb;text-decoration:none;font-weight:600;">
                  support@tirthlok.in
                </a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;padding:20px 40px;
                       text-align:center;border-top:1px solid #e2e8f0;">
              <p style="margin:0;font-size:11px;color:#94a3b8;">
                © 2026 TirthLok · tirthlok.in
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}
