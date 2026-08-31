import { Link } from 'react-router-dom'
import useScrollToTop from '../hooks/useScrollToTop'
import './LegalPage.css'

function PrivacyPolicyPage() {
  useScrollToTop()
  const currentYear = new Date().getFullYear()

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
            Dayim Developers (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects
            your privacy and is committed to protecting the personal information you
            provide when using our website.
          </p>

          <section>
            <h2>Information We Collect</h2>
            <p>We may collect information that you voluntarily provide to us, including:</p>
            <ul>
              <li>Full name</li>
              <li>Phone number</li>
              <li>Email address</li>
              <li>WhatsApp number</li>
              <li>Property or apartment preferences</li>
              <li>
                Information submitted through inquiry, contact, booking, or registration
                forms
              </li>
              <li>Any other information you choose to provide when contacting us</li>
            </ul>
            <p>We may also automatically collect certain technical information, such as:</p>
            <ul>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Device type</li>
              <li>Operating system</li>
              <li>Pages visited</li>
              <li>Time spent on the website</li>
              <li>Website interaction and usage information</li>
            </ul>
          </section>

          <section>
            <h2>How We Use Your Information</h2>
            <p>
              We may use the information we collect to respond to your inquiries and
              requests; provide information about our projects, apartments, prices, and
              services; contact you regarding your inquiry; schedule property visits or
              consultations; process and manage bookings or registrations where
              applicable; improve our website, services, and customer experience;
              understand website traffic and user behavior; measure the effectiveness of
              our advertising campaigns; send relevant marketing communications where
              permitted by applicable law; prevent fraud, misuse, or unauthorized activity;
              and comply with legal and regulatory requirements.
            </p>
          </section>

          <section>
            <h2>Communication With You</h2>
            <p>
              If you submit your contact details through our website, you may be contacted
              by Dayim Developers or its authorized representatives regarding your inquiry,
              project information, property availability, or related services. You may
              request that we stop sending you promotional communications at any time.
            </p>
          </section>

          <section>
            <h2>Cookies and Similar Technologies</h2>
            <p>
              Our website may use cookies and similar technologies to improve
              functionality, understand website usage, remember preferences, and measure
              advertising performance. Cookies may also be used by third-party services
              such as analytics and advertising platforms. You can manage or disable
              cookies through your browser settings. However, disabling certain cookies
              may affect some website functionality.
            </p>
          </section>

          <section>
            <h2>Google Analytics and Google Ads</h2>
            <p>
              We may use services such as Google Analytics and Google Ads to understand
              website traffic, measure advertising performance, and improve our marketing.
              These services may collect information about how visitors interact with our
              website through cookies or similar technologies. Where applicable,
              advertising and analytics providers may use information collected through
              these technologies in accordance with their own privacy policies.
            </p>
          </section>

          <section>
            <h2>Sharing of Information</h2>
            <p>
              We do not sell or rent your personal information. We may share information
              with trusted service providers, contractors, technology providers,
              marketing/advertising service providers, or authorized representatives when
              reasonably necessary to operate our website, respond to inquiries, provide
              services, or manage our business. We may also disclose information when
              required by law, legal proceedings, government authorities, or to protect
              our rights, property, users, or business.
            </p>
          </section>

          <section>
            <h2>Data Security</h2>
            <p>
              We take reasonable technical and organizational measures to protect your
              personal information against unauthorized access, loss, misuse, alteration,
              or disclosure. However, no method of transmission or electronic storage can
              be guaranteed to be completely secure.
            </p>
          </section>

          <section>
            <h2>Third-Party Websites</h2>
            <p>
              Our website may contain links to third-party websites, including social
              media platforms, payment services, maps, or other external websites.
              Dayim Developers is not responsible for the privacy practices, content, or
              security of third-party websites. We recommend reviewing the privacy
              policies of those websites before providing them with personal information.
            </p>
          </section>

          <section>
            <h2>Data Retention</h2>
            <p>
              We retain personal information only for as long as reasonably necessary to
              fulfill the purposes described in this Privacy Policy, provide services,
              maintain business records, resolve disputes, comply with legal obligations,
              and protect our legitimate interests.
            </p>
          </section>

          <section>
            <h2>Your Privacy Choices</h2>
            <p>
              Depending on applicable law, you may have the right to request access to
              personal information we hold about you; request correction of inaccurate
              information; request deletion of your information where legally applicable;
              withdraw consent where processing is based on consent; request that we stop
              sending promotional communications; and ask questions about how your
              information is being used. To make a privacy-related request, please contact
              us using the details provided below.
            </p>
          </section>

          <section>
            <h2>Children&apos;s Privacy</h2>
            <p>
              Our website is not intended for children, and we do not knowingly collect
              personal information from children. If you believe that a child has provided
              personal information to us, please contact us so that we can take
              appropriate action.
            </p>
          </section>

          <section>
            <h2>Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time to reflect changes in
              our business, website, technology, legal requirements, or privacy practices.
              Any updates will be posted on this page with a revised &quot;Last
              Updated&quot; date.
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

          <p>
            By using our website or submitting your information through our forms, you
            acknowledge that you have read and understood this Privacy Policy.
          </p>

          <p>
            &copy; {currentYear} Dayim Developers. All Rights Reserved.
          </p>
        </div>
      </div>
    </main>
  )
}

export default PrivacyPolicyPage
