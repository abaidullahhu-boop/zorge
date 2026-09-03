import { useId, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CAREER_FORM_URL,
  CAREER_RESUME_ACCEPT,
  CAREER_RESUME_MAX_BYTES,
} from '../data/careerPositions'
import { SITE_CONTACT } from '../data/siteContact'
import useScrollToTop from '../hooks/useScrollToTop'
import './LegalPage.css'
import './CareerPage.css'

const INITIAL_FORM = {
  name: '',
  phone: '',
  email: '',
  lastExperience: '',
  message: '',
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = String(reader.result || '')
      const base64 = result.includes(',') ? result.split(',')[1] : result
      resolve(base64)
    }
    reader.onerror = () => reject(new Error('Could not read the selected file.'))
    reader.readAsDataURL(file)
  })
}

function isAllowedResume(file) {
  const name = file.name.toLowerCase()
  return (
    name.endsWith('.pdf') ||
    name.endsWith('.doc') ||
    name.endsWith('.docx') ||
    file.type === 'application/pdf' ||
    file.type === 'application/msword' ||
    file.type ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  )
}

function CareerPage() {
  useScrollToTop()
  const formId = useId()
  const [fields, setFields] = useState(INITIAL_FORM)
  const [resume, setResume] = useState(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  const isSubmitting = status === 'submitting'
  const isSuccess = status === 'success'

  const updateField = (key) => (event) => {
    setFields((prev) => ({ ...prev, [key]: event.target.value }))
    if (status === 'error') {
      setStatus('idle')
      setError('')
    }
  }

  const onResumeChange = (event) => {
    const file = event.target.files?.[0] ?? null
    setResume(file)
    if (status === 'error') {
      setStatus('idle')
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!CAREER_FORM_URL) {
      setStatus('error')
      setError('Career form is not configured yet. Please email us instead.')
      return
    }

    if (
      !fields.name.trim() ||
      !fields.phone.trim() ||
      !fields.email.trim() ||
      !fields.lastExperience.trim()
    ) {
      setStatus('error')
      setError('Please fill in all required fields.')
      return
    }

    if (!resume) {
      setStatus('error')
      setError('Please upload your CV / resume.')
      return
    }

    if (!isAllowedResume(resume)) {
      setStatus('error')
      setError('Resume must be a PDF, DOC, or DOCX file.')
      return
    }

    if (resume.size > CAREER_RESUME_MAX_BYTES) {
      setStatus('error')
      setError('Resume must be 5MB or smaller.')
      return
    }

    setStatus('submitting')
    setError('')

    try {
      const resumeBase64 = await fileToBase64(resume)
      const lastExperience = fields.lastExperience.trim()
      const body = new URLSearchParams({
        name: fields.name.trim(),
        phone: fields.phone.trim(),
        email: fields.email.trim(),
        lastExperience,
        // Existing Apps Script reads `position` — keep in sync
        position: lastExperience,
        message: fields.message.trim(),
        resumeName: resume.name,
        resumeMime: resume.type || 'application/pdf',
        resumeBase64,
      })

      // Apps Script web apps often return opaque CORS responses.
      await fetch(CAREER_FORM_URL, {
        method: 'POST',
        mode: 'no-cors',
        body,
      })

      setStatus('success')
      setFields(INITIAL_FORM)
      setResume(null)
      event.target.reset()
    } catch {
      setStatus('error')
      setError(
        `Something went wrong. Please try again or email ${SITE_CONTACT.email.display}.`,
      )
    }
  }

  return (
    <main className="legal-page career-page">
      <div className="legal-page__inner career-page__inner">
        <Link className="legal-page__back" to="/">
          ← Back to home
        </Link>

        <h1 className="legal-page__title">Careers</h1>
        <p className="legal-page__subtitle">Join the Dayim Developers team</p>
        <p className="legal-page__updated">
          Share your details and CV. Our team will review your application and get in
          touch.
        </p>

        {isSuccess ? (
          <div className="career-form__success" role="status">
            <h2>Application submitted</h2>
            <p>
              Thank you for applying. We have received your details and CV, and will
              contact you if your profile matches an opening.
            </p>
            <button
              className="career-form__button career-form__button--ghost"
              type="button"
              onClick={() => setStatus('idle')}
            >
              Submit another application
            </button>
          </div>
        ) : (
          <form className="career-form" onSubmit={handleSubmit} noValidate>
            <div className="career-form__grid">
              <label className="career-form__field" htmlFor={`${formId}-name`}>
                <span className="career-form__label">
                  Name <abbr title="required">*</abbr>
                </span>
                <input
                  id={`${formId}-name`}
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={fields.name}
                  onChange={updateField('name')}
                  disabled={isSubmitting}
                />
              </label>

              <label className="career-form__field" htmlFor={`${formId}-phone`}>
                <span className="career-form__label">
                  Phone <abbr title="required">*</abbr>
                </span>
                <input
                  id={`${formId}-phone`}
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={fields.phone}
                  onChange={updateField('phone')}
                  disabled={isSubmitting}
                />
              </label>

              <label className="career-form__field" htmlFor={`${formId}-email`}>
                <span className="career-form__label">
                  Email <abbr title="required">*</abbr>
                </span>
                <input
                  id={`${formId}-email`}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={fields.email}
                  onChange={updateField('email')}
                  disabled={isSubmitting}
                />
              </label>

              <label className="career-form__field" htmlFor={`${formId}-experience`}>
                <span className="career-form__label">
                  Last experience <abbr title="required">*</abbr>
                </span>
                <input
                  id={`${formId}-experience`}
                  name="lastExperience"
                  type="text"
                  required
                  value={fields.lastExperience}
                  onChange={updateField('lastExperience')}
                  disabled={isSubmitting}
                  placeholder="e.g. Sales Executive at ABC (2022–2025)"
                />
              </label>
            </div>

            <label className="career-form__field" htmlFor={`${formId}-message`}>
              <span className="career-form__label">Message</span>
              <textarea
                id={`${formId}-message`}
                name="message"
                rows={5}
                value={fields.message}
                onChange={updateField('message')}
                disabled={isSubmitting}
                placeholder="Write a short message about yourself."
              />
            </label>

            <label
              className="career-form__field career-form__field--file"
              htmlFor={`${formId}-resume`}
            >
              <span className="career-form__label">
                CV <abbr title="required">*</abbr>
              </span>
              <span className="career-form__file">
                <input
                  id={`${formId}-resume`}
                  name="resume"
                  type="file"
                  accept={CAREER_RESUME_ACCEPT}
                  required
                  onChange={onResumeChange}
                  disabled={isSubmitting}
                />
                <span className="career-form__file-meta">
                  {resume ? resume.name : 'PDF, DOC, or DOCX — max 5MB'}
                </span>
              </span>
            </label>

            {error ? (
              <p className="career-form__error" role="alert">
                {error}
              </p>
            ) : null}

            <button className="career-form__button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting…' : 'Submit application'}
            </button>

            <p className="career-form__note">
              By submitting, you agree that Dayim Developers may contact you about this
              application. Prefer email?{' '}
              <a href={SITE_CONTACT.email.href}>{SITE_CONTACT.email.display}</a>
            </p>
          </form>
        )}
      </div>
    </main>
  )
}

export default CareerPage
