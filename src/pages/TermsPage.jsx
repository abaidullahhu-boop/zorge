import { Link } from 'react-router-dom'
import { SITE_CONTACT } from '../data/siteContact'
import './LegalPage.css'

function TermsPage() {
  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <Link className="legal-page__back" to="/">
          ← Back to home
        </Link>

        <h1 className="legal-page__title">Terms of Use</h1>
        <p className="legal-page__updated">Last updated: August 2026</p>

        <div className="legal-page__content">
          <p>
            By accessing this website, you agree to these Terms of Use. If you do
            not agree, please do not use the site.
          </p>

          <section>
            <h2>Website content</h2>
            <p>
              Project descriptions, images, floor plans, pricing references, and
              availability shown on this website are for general information only
              and may change without notice. They do not constitute a binding offer
              unless confirmed in writing by Dayim Developers.
            </p>
          </section>

          <section>
            <h2>Intellectual property</h2>
            <p>
              All content on this website — including text, visuals, branding, and
              layouts — is owned by Dayim Developers or used with permission and
              may not be copied, reproduced, or distributed without prior written
              consent.
            </p>
          </section>

          <section>
            <h2>Limitation of liability</h2>
            <p>
              We strive to keep information accurate and up to date, but we make no
              warranties regarding completeness or suitability for any particular
              purpose. Dayim Developers is not liable for decisions made based on
              website content alone.
            </p>
          </section>

          <section>
            <h2>External links</h2>
            <p>
              This website may link to third-party services such as maps or social
              platforms. We are not responsible for the content or privacy practices
              of those external sites.
            </p>
          </section>

          <section>
            <h2>Contact</h2>
            <p>
              Questions about these terms may be directed to{' '}
              <a href={SITE_CONTACT.email.href}>{SITE_CONTACT.email.display}</a>{' '}
              or{' '}
              <a href={SITE_CONTACT.phone.href}>{SITE_CONTACT.phone.display}</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

export default TermsPage
