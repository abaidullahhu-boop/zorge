import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { SITE_CONTACT } from '../../data/siteContact'
import {
  INVENTORY_BOOKING_FORM_URL,
  submitInventoryBooking,
} from '../../lib/inventoryBooking'

const INITIAL_FORM = {
  name: '',
  phone: '',
  email: '',
  message: '',
}

export default function InventoryBookingModal({ project, unit, onClose }) {
  const formId = useId()
  const dialogRef = useRef(null)
  const [fields, setFields] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const isSubmitting = status === 'submitting'
  const isSuccess = status === 'success'
  const unitLabel = unit?.unitLabel || unit?.title || 'Unit'
  const unitMeta = [unit?.floorLabel, unit?.area].filter(Boolean).join(' · ')

  useEffect(() => {
    const previousFocus = document.activeElement
    document.body.classList.add('inventory-booking-open')
    dialogRef.current?.focus()

    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      event.stopPropagation()
      onClose()
    }

    window.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.body.classList.remove('inventory-booking-open')
      window.removeEventListener('keydown', onKeyDown, true)
      if (previousFocus instanceof HTMLElement) previousFocus.focus()
    }
  }, [onClose])

  const updateField = (key) => (event) => {
    setFields((prev) => ({ ...prev, [key]: event.target.value }))
    if (status === 'error') {
      setStatus('idle')
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!INVENTORY_BOOKING_FORM_URL) {
      setStatus('error')
      setError('Booking form is not configured yet. Please call or WhatsApp us instead.')
      return
    }

    if (!fields.name.trim() || !fields.phone.trim()) {
      setStatus('error')
      setError('Please enter your name and phone number.')
      return
    }

    setStatus('submitting')
    setError('')

    try {
      await submitInventoryBooking({ project, unit, fields })
      setStatus('success')
      setFields(INITIAL_FORM)
    } catch {
      setStatus('error')
      setError(
        `Something went wrong. Please try again or contact ${SITE_CONTACT.phone.display}.`,
      )
    }
  }

  return createPortal(
    <div
      className="inventory-booking"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        className="inventory-booking__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${formId}-title`}
        ref={dialogRef}
        tabIndex={-1}
      >
        <button
          type="button"
          className="inventory-booking__close"
          onClick={onClose}
          aria-label="Close booking form"
        >
          ×
        </button>

        <p className="inventory-booking__kicker">Book unit</p>
        <h2 id={`${formId}-title`} className="inventory-booking__title">
          {unitLabel}
        </h2>
        {unitMeta ? (
          <p className="inventory-booking__meta">{unitMeta}</p>
        ) : null}
        <p className="inventory-booking__lead">
          Share your details and our team will confirm availability for this unit.
        </p>

        {isSuccess ? (
          <div className="inventory-booking__success" role="status">
            <h3>Request sent</h3>
            <p>
              Thank you. We have received your booking inquiry and will contact you
              shortly.
            </p>
            <button
              type="button"
              className="inventory-booking__button inventory-booking__button--ghost"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        ) : (
          <form className="inventory-booking__form" onSubmit={handleSubmit} noValidate>
            <div className="inventory-booking__grid">
              <label className="inventory-booking__field" htmlFor={`${formId}-name`}>
                <span className="inventory-booking__label">
                  Name <abbr title="required">*</abbr>
                </span>
                <input
                  id={`${formId}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={fields.name}
                  onChange={updateField('name')}
                  disabled={isSubmitting}
                  required
                />
              </label>

              <label className="inventory-booking__field" htmlFor={`${formId}-phone`}>
                <span className="inventory-booking__label">
                  Phone <abbr title="required">*</abbr>
                </span>
                <input
                  id={`${formId}-phone`}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={fields.phone}
                  onChange={updateField('phone')}
                  disabled={isSubmitting}
                  required
                />
              </label>
            </div>

            <label className="inventory-booking__field" htmlFor={`${formId}-email`}>
              <span className="inventory-booking__label">Email</span>
              <input
                id={`${formId}-email`}
                name="email"
                type="email"
                autoComplete="email"
                value={fields.email}
                onChange={updateField('email')}
                disabled={isSubmitting}
              />
            </label>

            <label className="inventory-booking__field" htmlFor={`${formId}-message`}>
              <span className="inventory-booking__label">Message</span>
              <textarea
                id={`${formId}-message`}
                name="message"
                rows={3}
                value={fields.message}
                onChange={updateField('message')}
                disabled={isSubmitting}
                placeholder="Preferred visit time, questions, etc."
              />
            </label>

            {error ? (
              <p className="inventory-booking__error" role="alert">
                {error}
              </p>
            ) : null}

            <div className="inventory-booking__actions">
              <button
                className="inventory-booking__button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending…' : 'Submit request'}
              </button>
              <a
                className="inventory-booking__whatsapp"
                href={SITE_CONTACT.phone.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                Or WhatsApp
              </a>
            </div>
          </form>
        )}
      </div>
    </div>,
    document.body,
  )
}
