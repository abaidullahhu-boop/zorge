import { Link } from 'react-router-dom'
import useScrollToTop from '../hooks/useScrollToTop'
import './LegalPage.css'

function DisclaimerPage() {
  useScrollToTop()
  const currentYear = new Date().getFullYear()

  return (
    <main className="legal-page">
      <div className="legal-page__inner">
        <Link className="legal-page__back" to="/">
          ← Back to home
        </Link>

        <h1 className="legal-page__title">Disclaimer</h1>
        <p className="legal-page__updated">Last updated: August 2026</p>

        <div className="legal-page__content">
          <p>
            The information provided on the Dayim Developers website is intended for
            general informational and promotional purposes only. While we make reasonable
            efforts to ensure that the information presented on this website is accurate
            and up to date, Dayim Developers does not guarantee that all information is
            complete, current, or free from errors.
          </p>

          <section>
            <h2>Property and Project Information</h2>
            <p>
              Project details, apartment specifications, layouts, sizes, amenities,
              facilities, locations, development timelines, construction updates, and
              other information displayed on this website may be subject to change
              without prior notice. The information shown on the website should not be
              considered a final representation of any property unless confirmed through
              official documentation issued by Dayim Developers or an authorized
              representative.
            </p>
          </section>

          <section>
            <h2>Images, Renders and Visual Materials</h2>
            <p>
              Photographs, architectural renders, illustrations, floor plans, videos,
              animations, virtual tours, and other visual materials may be used for
              promotional and illustrative purposes. Actual properties, finishes,
              furnishings, landscaping, views, colors, dimensions, facilities, and
              surrounding development may differ from the images or representations
              shown on the website.
            </p>
          </section>

          <section>
            <h2>Prices and Payment Plans</h2>
            <p>
              Property prices, payment plans, discounts, promotional offers, booking
              amounts, installment schedules, and other commercial information displayed
              on the website may change without prior notice. Any price or offer shown
              online should be verified with an authorized Dayim Developers
              representative before making a booking, payment, or financial decision.
            </p>
          </section>

          <section>
            <h2>Availability</h2>
            <p>
              The availability of apartments, units, floor plans, and other properties
              may change at any time. Displaying a property or unit on the website does
              not guarantee that it remains available.
            </p>
          </section>

          <section>
            <h2>Investment Disclaimer</h2>
            <p>
              Nothing on this website should be interpreted as financial, investment,
              legal, tax, or professional advice. Dayim Developers does not guarantee any
              specific return on investment, capital appreciation, rental income, resale
              value, profit, or future property value. Real-estate investment involves
              risks, and prospective buyers should conduct their own due diligence and
              seek independent professional advice where appropriate.
            </p>
          </section>

          <section>
            <h2>Construction and Development Information</h2>
            <p>
              Construction progress, estimated completion dates, development schedules,
              and related updates are provided for general information and may change
              due to circumstances beyond our control. Any estimated date or timeline
              should not be interpreted as an unconditional guarantee of completion.
            </p>
          </section>

          <section>
            <h2>Third-Party Information</h2>
            <p>
              Our website may contain links, references, maps, social-media content, or
              information provided by third parties. Dayim Developers does not
              necessarily endorse or guarantee the accuracy, availability, security, or
              reliability of third-party content or services.
            </p>
          </section>

          <section>
            <h2>No Guarantee of Accuracy</h2>
            <p>
              Although we take reasonable steps to maintain accurate information, Dayim
              Developers does not warrant that the website or its content will always be
              accurate, complete, current, uninterrupted, or error-free. Users should
              verify important information directly with Dayim Developers before
              relying on it.
            </p>
          </section>

          <section>
            <h2>No Contract Created</h2>
            <p>
              Information published on this website, including advertisements, property
              descriptions, prices, promotional material, and project information, does
              not by itself constitute a binding contract, offer, booking confirmation,
              or guarantee of sale. Any property transaction will be subject to the
              applicable official booking documents, agreements, terms, payment plans,
              and other documentation issued by Dayim Developers or the relevant
              authorized entity.
            </p>
          </section>

          <section>
            <h2>Website and Technical Disclaimer</h2>
            <p>
              Dayim Developers does not guarantee that the website will always be
              available, secure, or free from technical errors, viruses, or
              interruptions. We may modify, update, suspend, or discontinue any part of
              the website without prior notice.
            </p>
          </section>

          <section>
            <h2>Contact and Verification</h2>
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
              Al-Kabir Town, Phase 2, Opposite Lake City, Raiwind Road, Lahore,
              Pakistan.
            </p>
          </section>

          <section>
            <h2>Acceptance</h2>
            <p>
              By using this website, you acknowledge that you have read and understood
              this Disclaimer and agree that information provided on the website should
              be independently verified before making any property or financial
              decision.
            </p>
          </section>

          <p>
            <strong>Important:</strong> This disclaimer is a general website template
            and should be reviewed by a qualified legal professional before
            publication, particularly where it relates to property sales, investment
            representations, payment plans, or contractual obligations.
          </p>

          <p>
            &copy; {currentYear} Dayim Developers. All Rights Reserved.
          </p>
        </div>
      </div>
    </main>
  )
}

export default DisclaimerPage
