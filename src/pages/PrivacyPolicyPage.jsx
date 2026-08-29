import { Link } from 'react-router-dom'
import { SITE_CONTACT } from '../data/siteContact'
import './LegalPage.css'

function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <Link className="legal-page__back" to="/">
          ← Back to home
        </Link>

        <h1 className="legal-page__title">Privacy Policy</h1>
        <p className="legal-page__updated">Last updated: August 2026</p>

        <div className="legal-page__content">
          <p>
            Dayim Developers (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) respects your
            privacy. This policy explains how we collect, use, and protect personal
            information when you visit our website or contact us about our projects.
          </p>

          <section>
            <h2>Information we collect</h2>
            <p>
              We may collect information you provide directly, such as your name,
              phone number, email address, and enquiry details when you request
              project information, schedule a visit, or subscribe to updates.
            </p>
          </section>

          <section>
            <h2>How we use your information</h2>
            <ul>
              <li>To respond to enquiries and booking requests</li>
              <li>To share project updates and marketing communications you opt into</li>
              <li>To improve our website and customer experience</li>
              <li>To comply with applicable legal obligations</li>
            </ul>
          </section>

          <section>
            <h2>Cookies</h2>
            <p>
              Our website may use cookies and similar technologies to remember
              preferences and analyse site usage. You can manage cookies through
              your browser settings.
            </p>
          </section>

          <section>
            <h2>Data sharing</h2>
            <p>
              We do not sell your personal information. We may share data with
              trusted service providers who assist us in operating the website or
              serving clients, subject to confidentiality obligations.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              For privacy-related questions, contact us at{' '}
              <a href={SITE_CONTACT.email.href}>{SITE_CONTACT.email.display}</a>{' '}
              or call{' '}
              <a href={SITE_CONTACT.phone.href}>{SITE_CONTACT.phone.display}</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

export default PrivacyPolicyPage
