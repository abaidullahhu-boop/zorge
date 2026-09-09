export const INVENTORY_BOOKING_FORM_URL =
  import.meta.env.VITE_INVENTORY_BOOKING_FORM_URL?.trim() || ''

export async function submitInventoryBooking({
  project,
  unit,
  fields,
}) {
  if (!INVENTORY_BOOKING_FORM_URL) {
    throw new Error('Booking form is not configured yet.')
  }

  const body = new URLSearchParams({
    formType: 'inventory-booking',
    projectId: project?.id ?? '',
    projectTitle: project?.title ?? '',
    floorId: unit?.floorId ?? '',
    floorLabel: unit?.floorLabel ?? '',
    unit: unit?.unitLabel || unit?.title || '',
    area: unit?.area ?? '',
    name: fields.name.trim(),
    phone: fields.phone.trim(),
    email: fields.email.trim(),
    message: fields.message.trim(),
  })

  // Apps Script web apps often return opaque CORS responses.
  await fetch(INVENTORY_BOOKING_FORM_URL, {
    method: 'POST',
    mode: 'no-cors',
    body,
  })
}
