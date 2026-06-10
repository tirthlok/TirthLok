import { Resend } from 'resend'
import {
  bookingConfirmationTemplate,
  adminNotificationTemplate,
  cancellationTemplate,
} from './emailTemplates'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM    = process.env.RESEND_FROM_EMAIL  || 'bookings@tirthlok.in'
const ADMIN   = process.env.RESEND_ADMIN_EMAIL || 'admin@tirthlok.in'

function formatDate(dateStr: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

function calcNights(checkIn: string, checkOut: string): number {
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime()
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1)
}

export async function sendBookingConfirmation(booking: {
  booking_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in_date: string
  check_out_date: string
  total_amount: number
  adults_count: number
  dharamshala?: { dharamshala_name: string; dharamshala_city: string; dharamshala_state: string }
  room?: { name: string }
}): Promise<void> {
  try {
    const nights = calcNights(booking.check_in_date, booking.check_out_date)

    await resend.emails.send({
      from: `TirthLok Bookings <${FROM}>`,
      to: [booking.guest_email],
      subject: `Booking Confirmed — ${booking.dharamshala?.dharamshala_name || 'Dharamshala'} | TirthLok`,
      html: bookingConfirmationTemplate({
        bookingId:        booking.booking_id,
        guestName:        booking.guest_name,
        guestEmail:       booking.guest_email,
        guestPhone:       booking.guest_phone,
        dharamshalaName:  booking.dharamshala?.dharamshala_name  || 'Dharamshala',
        dharamshalaCity:  booking.dharamshala?.dharamshala_city  || '',
        dharamshalaState: booking.dharamshala?.dharamshala_state || '',
        roomName:         booking.room?.name || 'Room',
        checkInDate:      formatDate(booking.check_in_date),
        checkOutDate:     formatDate(booking.check_out_date),
        nights,
        adults:           booking.adults_count || 1,
        totalAmount:      Number(booking.total_amount),
      }),
    })
  } catch (err) {
    // Email failure must never block booking creation
    console.error('[email] confirmation send failed:', err)
  }
}

export async function sendAdminNotification(booking: {
  booking_id: string
  guest_name: string
  guest_email: string
  guest_phone: string
  check_in_date: string
  check_out_date: string
  total_amount: number
  adults_count: number
  created_at: string
  dharamshala?: { dharamshala_name: string; dharamshala_city: string }
  room?: { name: string }
}): Promise<void> {
  try {
    const nights = calcNights(booking.check_in_date, booking.check_out_date)

    await resend.emails.send({
      from: `TirthLok System <${FROM}>`,
      to: [ADMIN],
      subject: `New Booking — ${booking.dharamshala?.dharamshala_name || 'Dharamshala'}`,
      html: adminNotificationTemplate({
        bookingId:       booking.booking_id,
        guestName:       booking.guest_name,
        guestEmail:      booking.guest_email,
        guestPhone:      booking.guest_phone,
        dharamshalaName: booking.dharamshala?.dharamshala_name || 'Dharamshala',
        dharamshalaCity: booking.dharamshala?.dharamshala_city || '',
        roomName:        booking.room?.name || 'Room',
        checkInDate:     formatDate(booking.check_in_date),
        checkOutDate:    formatDate(booking.check_out_date),
        nights,
        adults:          booking.adults_count || 1,
        totalAmount:     Number(booking.total_amount),
        createdAt:       new Date(booking.created_at).toLocaleString('en-IN'),
      }),
    })
  } catch (err) {
    console.error('[email] admin notification failed:', err)
  }
}

export async function sendCancellationEmail(booking: {
  booking_id: string
  guest_name: string
  guest_email: string
  check_in_date: string
  check_out_date: string
  total_amount: number
  cancellation_reason?: string
  dharamshala?: { dharamshala_name: string }
}): Promise<void> {
  try {
    await resend.emails.send({
      from: `TirthLok Bookings <${FROM}>`,
      to: [booking.guest_email],
      subject: `Booking Cancelled — ${booking.dharamshala?.dharamshala_name || 'Dharamshala'} | TirthLok`,
      html: cancellationTemplate({
        bookingId:          booking.booking_id,
        guestName:          booking.guest_name,
        dharamshalaName:    booking.dharamshala?.dharamshala_name || 'Dharamshala',
        checkInDate:        booking.check_in_date,
        checkOutDate:       booking.check_out_date,
        totalAmount:        Number(booking.total_amount),
        cancellationReason: booking.cancellation_reason,
      }),
    })
  } catch (err) {
    console.error('[email] cancellation email failed:', err)
  }
}
