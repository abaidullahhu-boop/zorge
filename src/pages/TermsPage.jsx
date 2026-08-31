import { Link } from 'react-router-dom'
import useScrollToTop from '../hooks/useScrollToTop'
import './LegalPage.css'

function TermsPage() {
  useScrollToTop()
  const currentYear = new Date().getFullYear()

  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <Link className="legal-page__back" to="/">
          ← Back to home
        </Link>

        <h1 className="legal-page__title">Terms &amp; Conditions</h1>
        <p className="legal-page__subtitle">Dayim Developers</p>
        <p className="legal-page__updated">Last updated: August 2026</p>

        <div className="legal-page__content">
          <p>
            These Terms &amp; Conditions (&quot;Terms&quot;) govern your use of the Dayim
            Developers website and any information, services, inquiry forms, or other
            features made available through the website. By accessing or using the
            website, you agree to these Terms.
          </p>

          <section>
            <h2>About These Terms</h2>
            <p>
              Dayim Developers (&quot;Dayim Developers,&quot; &quot;we,&quot; &quot;our,&quot;
              or &quot;us&quot;) operates this website to provide information about our
              real-estate projects, apartments, services, and related offerings. These
              Terms apply to all visitors and users of the website.
            </p>
          </section>

          <section>
            <h2>Use of the Website</h2>
            <p>
              You agree to use this website only for lawful purposes and in a manner that
              does not interfere with the operation, security, or availability of the
              website. You must not attempt to gain unauthorized access to the website, its
              systems, databases, or other users&apos; information.
            </p>
          </section>

          <section>
            <h2>Project and Property Information</h2>
            <p>
              We make reasonable efforts to keep project descriptions, apartment
              specifications, images, layouts, amenities, prices, payment plans,
              availability, completion timelines, and other information accurate and up
              to date. However, such information may change without prior notice. Images,
              renders, floor plans, dimensions, furniture, finishes, views, and other
              visual materials may be illustrative and may not represent the final
              delivered property.
            </p>
          </section>

          <section>
            <h2>Prices and Availability</h2>
            <p>
              Prices, payment plans, promotions, discounts, unit availability,
              specifications, and other commercial terms are subject to change and may
              vary by unit or project. The information displayed on the website does not
              constitute a final offer unless expressly confirmed in writing by an
              authorized representative of Dayim Developers.
            </p>
          </section>

          <section>
            <h2>Inquiries and Contact Forms</h2>
            <p>
              When you submit an inquiry, registration, or contact form, you agree to
              provide accurate and current information. Submission of a form does not
              itself create a booking, sale, purchase agreement, tenancy, or other
              contractual relationship. A representative may contact you using the
              information you provide.
            </p>
          </section>

          <section>
            <h2>Bookings and Payments</h2>
            <p>
              Any booking, purchase, installment, payment, cancellation, refund,
              transfer, or other property transaction will be governed by the applicable
              booking form, agreement, payment plan, or other official documentation
              issued by Dayim Developers or the relevant authorized entity. In the event
              of a conflict between these website Terms and a signed agreement, the signed
              agreement will generally govern the specific transaction.
            </p>
          </section>

          <section>
            <h2>No Guarantee of Investment Returns</h2>
            <p>
              Information on this website is provided for general informational purposes
              and should not be interpreted as a guarantee of profit, appreciation,
              rental income, investment return, or future property value. Real-estate
              transactions involve risks, and users should make decisions based on their
              own circumstances and, where appropriate, independent professional advice.
            </p>
          </section>

          <section>
            <h2>Intellectual Property</h2>
            <p>
              Unless otherwise stated, the website and its content—including text, logos,
              graphics, photographs, videos, designs, layouts, trademarks, and other
              materials—are owned by or licensed to Dayim Developers. You may not
              reproduce, copy, modify, distribute, publish, sell, or commercially
              exploit website content without prior written permission.
            </p>
          </section>

          <section>
            <h2>Third-Party Links and Services</h2>
            <p>
              The website may contain links to third-party websites, platforms,
              social-media pages, maps, payment services, or other resources. These third
              parties operate independently, and Dayim Developers is not responsible for
              their content, availability, security, or privacy practices.
            </p>
          </section>

          <section>
            <h2>Website Availability</h2>
            <p>
              We aim to keep the website available and functioning properly, but we do
              not guarantee uninterrupted, error-free, or completely secure access. We may
              temporarily suspend, modify, or discontinue any part of the website for
              maintenance, updates, security, or other business reasons.
            </p>
          </section>

          <section>
            <h2>Limitation of Liability</h2>
            <p>
              To the extent permitted by applicable law, Dayim Developers will not be
              responsible for losses or damages arising from reliance on website
              information, temporary website unavailability, technical issues, third-party
              services, or changes to project information, prices, availability, or
              specifications. Nothing in these Terms excludes liability that cannot
              legally be excluded.
            </p>
          </section>

          <section>
            <h2>User-Provided Information</h2>
            <p>
              You are responsible for ensuring that information submitted through the
              website is accurate and that you have the right to provide it. You must not
              submit unlawful, fraudulent, misleading, harmful, or unauthorized content.
            </p>
          </section>

          <section>
            <h2>Privacy</h2>
            <p>
              Your use of this website is also subject to our{' '}
              <Link to="/privacy-policy">Privacy Policy</Link>, which explains how we
              collect and use personal information. By using the website, you acknowledge
              that you have reviewed the Privacy Policy.
            </p>
          </section>

          <section>
            <h2>Changes to These Terms</h2>
            <p>
              Dayim Developers may update or modify these Terms from time to time. Updated
              Terms will be published on this page with a revised &quot;Last Updated&quot;
              date. Your continued use of the website after changes are published
              constitutes acceptance of the updated Terms, to the extent permitted by
              applicable law.
            </p>
          </section>

          <section>
            <h2>Governing Law</h2>
            <p>
              These Terms shall be governed by and interpreted in accordance with the
              applicable laws of Pakistan, unless otherwise required by applicable law or
              expressly stated in a written agreement.
            </p>
          </section>

          <section>
            <h2>Contact Us</h2>
            <p>
              <strong>Dayim Developers</strong>
              <br />
              Website:{' '}
              <a
                href="https://www.dayimdevelopers.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://www.dayimdevelopers.com/
              </a>
              <br />
              Email:{' '}
              <a href="mailto:info@dayimdevelopers.com">info@dayimdevelopers.com</a>
              <br />
              Phone: <a href="tel:+923085111176">+92 308 5111176</a>
              <br />
              Office Address: Dayim Developers – 45,46,47- A side, Broadway Commercial,
              Al-Kabir Town, Phase 2, Opposite Lake City, Raiwind Road, Lahore, Pakistan.
            </p>
          </section>

          <p className="legal-page__notice">
            <strong>Important:</strong> These website Terms &amp; Conditions are a general
            template and should be reviewed by a qualified lawyer before publication,
            particularly for property booking, payment, cancellation, refund, and
            investment-related terms.
          </p>

          <p>
            &copy; {currentYear} Dayim Developers. All Rights Reserved.
          </p>
        </div>
      </div>
    </main>
  )
}

export default TermsPage
