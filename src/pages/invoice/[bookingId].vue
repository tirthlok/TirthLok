<template>
  <div>
    <!-- Print Controls — hidden when printing -->
    <div class="print:hidden fixed top-0 left-0 right-0 z-50
                bg-gray-900 border-b border-gray-700 px-6 py-3
                flex items-center justify-between">
      <div class="flex items-center gap-3">
        <NuxtLink
          :to="`/bookings/${route.params.bookingId}`"
          class="flex items-center gap-2 text-gray-400
                 hover:text-white transition text-sm font-medium"
        >
          <Icon :name="('ArrowLeft' as any)" :size="16" />
          Back to Booking
        </NuxtLink>
      </div>
      <button
        @click="printInvoice"
        class="flex items-center gap-2 px-5 py-2
               bg-blue-600 text-white rounded-xl font-bold
               text-sm hover:bg-blue-700 transition"
      >
        <Icon :name="('Download' as any)" :size="16" />
        Download PDF
      </button>
    </div>

    <!-- Invoice Paper -->
    <div class="print:pt-0 pt-16 min-h-screen bg-gray-100
                print:bg-white flex justify-center py-8 print:py-0">
      <div
        id="invoice"
        class="bg-white w-full max-w-2xl mx-4 print:mx-0
               print:max-w-none print:shadow-none
               shadow-2xl rounded-2xl print:rounded-none
               overflow-hidden"
      >

        <!-- Loading -->
        <div v-if="loading"
             class="flex items-center justify-center h-96">
          <div class="w-8 h-8 border-2 border-blue-600
                      border-t-transparent rounded-full animate-spin"/>
        </div>

        <!-- Error -->
        <div v-else-if="error"
             class="flex items-center justify-center h-96 text-red-500">
          {{ error }}
        </div>

        <!-- Invoice Content -->
        <div v-else-if="data">

          <!-- Header -->
          <div style="background: linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)"
               class="px-10 py-8 text-white">
            <div class="flex items-start justify-between">
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <span class="text-3xl">🛕</span>
                  <div>
                    <h1 class="text-2xl font-black tracking-tight">
                      TirthLok
                    </h1>
                    <p class="text-blue-200 text-xs">
                      Sacred Pilgrimages & Dharamshala Stays
                    </p>
                  </div>
                </div>
                <div class="mt-3 space-y-0.5 text-blue-200 text-xs">
                  <p>tirthlok.in</p>
                  <p>bookings@tirthlok.in</p>
                </div>
              </div>
              <div class="text-right">
                <p class="text-blue-200 text-xs font-semibold
                           uppercase tracking-widest mb-1">
                  Invoice
                </p>
                <p class="text-white font-black text-xl font-mono">
                  {{ data.booking.invoice_number || data.invoice?.invoice_number || 'TL-PENDING' }}
                </p>
                <p class="text-blue-200 text-xs mt-1">
                  {{ formatDate(data.invoice?.issued_at || data.booking.created_at) }}
                </p>
              </div>
            </div>
          </div>

          <!-- Bill To + Booking Status -->
          <div class="px-10 py-6 grid grid-cols-2 gap-8
                      border-b border-gray-100">
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase
                         tracking-widest mb-3">
                Billed To
              </p>
              <p class="font-bold text-gray-900 text-base">
                {{ data.booking.guest_name }}
              </p>
              <p class="text-gray-600 text-sm mt-1">
                {{ data.booking.guest_email }}
              </p>
              <p class="text-gray-600 text-sm">
                {{ data.booking.guest_phone }}
              </p>
            </div>
            <div>
              <p class="text-xs font-bold text-gray-400 uppercase
                         tracking-widest mb-3">
                Booking Status
              </p>
              <div class="inline-flex items-center gap-2 px-3 py-1.5
                          rounded-full text-sm font-bold"
                   :style="statusStyle">
                <div class="w-2 h-2 rounded-full bg-current opacity-70"/>
                {{ statusLabel }}
              </div>
              <p class="text-gray-500 text-xs mt-2">
                Booked on {{ formatDate(data.booking.created_at) }}
              </p>
            </div>
          </div>

          <!-- Property + Stay Details -->
          <div class="px-10 py-6 border-b border-gray-100">
            <p class="text-xs font-bold text-gray-400 uppercase
                       tracking-widest mb-4">
              Stay Details
            </p>
            <div class="grid grid-cols-2 gap-6">
              <div class="space-y-3">
                <div>
                  <p class="text-xs text-gray-400 font-medium">Property</p>
                  <p class="font-bold text-gray-900">
                    {{ (data.booking.dharamshala as any)?.dharamshala_name }}
                  </p>
                  <p class="text-gray-500 text-sm">
                    {{ (data.booking.dharamshala as any)?.dharamshala_city }},
                    {{ (data.booking.dharamshala as any)?.dharamshala_state }}
                  </p>
                </div>
                <div>
                  <p class="text-xs text-gray-400 font-medium">Room Type</p>
                  <p class="font-semibold text-gray-900">
                    {{ (data.booking.room as any)?.name }}
                  </p>
                  <p class="text-gray-500 text-sm capitalize">
                    {{ (data.booking.room as any)?.bed_configuration }}
                  </p>
                </div>
              </div>
              <div class="space-y-3">
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-blue-50 rounded-xl p-3">
                    <p class="text-xs text-blue-500 font-semibold mb-1">
                      Check-in
                    </p>
                    <p class="font-bold text-blue-900 text-sm">
                      {{ formatDate(data.booking.check_in_date) }}
                    </p>
                  </div>
                  <div class="bg-orange-50 rounded-xl p-3">
                    <p class="text-xs text-orange-500 font-semibold mb-1">
                      Check-out
                    </p>
                    <p class="font-bold text-orange-900 text-sm">
                      {{ formatDate(data.booking.check_out_date) }}
                    </p>
                  </div>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div class="bg-gray-50 rounded-xl p-3">
                    <p class="text-xs text-gray-400 font-semibold mb-1">
                      Duration
                    </p>
                    <p class="font-bold text-gray-900 text-sm">
                      {{ data.calculated.nights }} Night{{ data.calculated.nights > 1 ? 's' : '' }}
                    </p>
                  </div>
                  <div class="bg-gray-50 rounded-xl p-3">
                    <p class="text-xs text-gray-400 font-semibold mb-1">
                      Guests
                    </p>
                    <p class="font-bold text-gray-900 text-sm">
                      {{ data.booking.adults_count || 1 }} Adults
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Pricing Breakdown -->
          <div class="px-10 py-6 border-b border-gray-100">
            <p class="text-xs font-bold text-gray-400 uppercase
                       tracking-widest mb-4">
              Pricing Breakdown
            </p>
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-100">
                  <th class="text-left text-xs font-bold text-gray-400
                              uppercase tracking-wide pb-3">
                    Description
                  </th>
                  <th class="text-center text-xs font-bold text-gray-400
                               uppercase tracking-wide pb-3">
                    Nights
                  </th>
                  <th class="text-right text-xs font-bold text-gray-400
                              uppercase tracking-wide pb-3">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50">
                <tr class="py-3">
                  <td class="py-3">
                    <p class="font-semibold text-gray-900 text-sm">
                      {{ (data.booking.room as any)?.name }}
                    </p>
                    <p class="text-gray-500 text-xs">
                      ₹{{ data.calculated.basePrice.toLocaleString('en-IN') }} per night
                    </p>
                  </td>
                  <td class="py-3 text-center text-gray-600 text-sm">
                    {{ data.calculated.nights }}
                  </td>
                  <td class="py-3 text-right font-semibold text-gray-900 text-sm">
                    ₹{{ data.calculated.subtotal.toLocaleString('en-IN') }}
                  </td>
                </tr>
                <tr>
                  <td class="py-3 text-gray-600 text-sm">
                    GST (5%)
                  </td>
                  <td class="py-3 text-center text-gray-600 text-sm">—</td>
                  <td class="py-3 text-right text-gray-600 text-sm">
                    ₹{{ data.calculated.tax.toLocaleString('en-IN') }}
                  </td>
                </tr>
                <tr>
                  <td class="py-3 text-gray-600 text-sm">
                    Service Charge
                  </td>
                  <td class="py-3 text-center text-gray-600 text-sm">—</td>
                  <td class="py-3 text-right text-gray-600 text-sm">
                    ₹{{ data.calculated.serviceCharge.toLocaleString('en-IN') }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Total -->
          <div class="px-10 py-5 border-b border-gray-100">
            <div class="flex items-center justify-between">
              <div>
                <p class="font-bold text-gray-900 text-lg">Total Amount</p>
                <p class="text-gray-500 text-xs mt-0.5">
                  Payment due at property on arrival
                </p>
              </div>
              <div class="text-right">
                <p class="text-3xl font-black text-gray-900">
                  ₹{{ data.calculated.grandTotal.toLocaleString('en-IN') }}
                </p>
                <p class="text-xs text-gray-400 mt-0.5">
                  Inclusive of all taxes
                </p>
              </div>
            </div>
          </div>

          <!-- Notes -->
          <div class="px-10 py-5 bg-amber-50 border-b border-amber-100">
            <p class="text-xs font-bold text-amber-700 mb-1">
              Important Note
            </p>
            <p class="text-xs text-amber-700 leading-relaxed">
              Please carry this invoice and a valid government ID proof
              at the time of check-in. Payment to be made directly at
              the property.
            </p>
          </div>

          <!-- Footer -->
          <div class="px-10 py-5 flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-400">
                Generated by TirthLok · tirthlok.in
              </p>
              <p class="text-xs text-gray-400 mt-0.5">
                For support: support@tirthlok.in
              </p>
            </div>
            <p class="text-xs text-gray-300 font-mono">
              {{ data.booking.invoice_number || data.invoice?.invoice_number }}
            </p>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuth } from '~/features/auth/composables/useAuth'
import Icon from '~/components/ui/Icon.vue'

definePageMeta({ layout: false })

const route   = useRoute()
const { session } = useAuth()
const data    = ref<any>(null)
const loading = ref(true)
const error   = ref<string | null>(null)

const fetchInvoice = async () => {
  try {
    data.value = await $fetch(
      `/api/invoice/${route.params.bookingId}`,
      {
        headers: {
          Authorization: `Bearer ${session.value?.access_token || ''}`
        }
      }
    )
  } catch {
    error.value = 'Invoice not found'
  } finally {
    loading.value = false
  }
}

const printInvoice = () => window.print()

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  })
}

const statusLabel = computed(() => {
  const map: Record<string, string> = {
    confirmed:  'Confirmed',
    initiated:  'Pending',
    checked_in: 'Checked In',
    checked_out:'Completed',
    cancelled:  'Cancelled',
  }
  return map[data.value?.booking?.status] || data.value?.booking?.status
})

const statusStyle = computed(() => {
  const map: Record<string, string> = {
    confirmed:  'background:#f0fdf4;color:#15803d',
    initiated:  'background:#fffbeb;color:#b45309',
    checked_in: 'background:#eff6ff;color:#1d4ed8',
    checked_out:'background:#f8fafc;color:#475569',
    cancelled:  'background:#fef2f2;color:#b91c1c',
  }
  return map[data.value?.booking?.status] || 'background:#f8fafc;color:#475569'
})

onMounted(async () => {
  await fetchInvoice()
  if (data.value) {
    setTimeout(() => window.print(), 800)
  }
})
</script>

<style>
@media print {
  @page {
    margin: 0;
    size: A4;
  }
  body {
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  .print\:hidden {
    display: none !important;
  }
}
</style>
