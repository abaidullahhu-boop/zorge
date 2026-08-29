import { Link } from 'react-router-dom'
import { FOOTER_LEGAL_LINKS, SITE_CONTACT } from '../../data/siteContact'
import '../../assets/styles/Footer.css'

function LongArrowUp() {
  return (
    <svg
      className="footer-icon footer-icon--arrow"
      width="14"
      height="31"
      aria-hidden="true"
      viewBox="0 0 14 31"
      fill="none"
    >
      <path
        pathLength="100"
        d="M13 7.102 8 1H7M1 7.102 6 1h1m0 0v30"
        stroke="currentColor"
        strokeWidth="1.2"
      />
    </svg>
  )
}

function PinIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M8 1.5a4.25 4.25 0 0 0-4.25 4.25c0 2.88 2.45 5.52 3.72 6.88a1.1 1.1 0 0 0 1.06.37 1.1 1.1 0 0 0 .72-.72c1.27-1.36 3.72-4 3.72-6.88A4.25 4.25 0 0 0 8 1.5Z"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="8" cy="5.75" r="1.35" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M4.2 2.5h2.4l1 2.4-1.5 1.1a8.6 8.6 0 0 0 3.8 3.8l1.1-1.5 2.4 1v2.4a1.2 1.2 0 0 1-1.1 1.2 10.8 10.8 0 0 1-7.3-3 10.8 10.8 0 0 1-3-7.3 1.2 1.2 0 0 1 1.2-1.1Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M2.5 4.5h11v7H2.5v-7Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="m2.5 5 5.5 3.5L13.5 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FooterLink({ href, children, external = false, className = '' }) {
  const classes = `site-footer-link${className ? ` ${className}` : ''}`

  if (external || href.startsWith('/')) {
    const props = external
      ? { href, target: '_blank', rel: 'noopener noreferrer' }
      : { to: href }

    const Tag = external ? 'a' : Link

    return (
      <Tag className={classes} {...props}>
        <span className="site-footer-link-text">{children}</span>
        <span className="site-footer-link-arrow" aria-hidden="true">
          <svg width="7" height="12" viewBox="0 0 7 12" fill="none">
            <path
              pathLength="100"
              d="M1.027 1 6 5.167v1.666L1.027 11"
              stroke="currentColor"
              strokeWidth="1.2"
            />
          </svg>
        </span>
      </Tag>
    )
  }

  return (
    <a className={classes} href={href}>
      <span className="site-footer-link-text">{children}</span>
    </a>
  )
}

function Footer({ onScrollTop }) {
  const scrollToTop = (event) => {
    event.preventDefault()
    if (onScrollTop) {
      onScrollTop()
      return
    }
    window.dispatchEvent(new CustomEvent('dayim:scroll-top'))
  }

  return (
    <footer className="site-footer" id="contact">
      <div className="site-footer-top">
        <a
          className="site-footer-scroll"
          href="#top"
          aria-label="Scroll to top of the page"
          onClick={scrollToTop}
        >
          <span className="site-footer-scroll-icons" aria-hidden="true">
            <LongArrowUp />
          </span>
        </a>
      </div>

      <div className="site-footer-main">
        <div className="site-footer-col site-footer-col--contact">
          <p className="site-footer-label">Contact Us</p>

          <ul className="site-footer-contact-list">
            <li className="site-footer-contact-item">
              <span className="site-footer-contact-icon" aria-hidden="true">
                <PinIcon />
              </span>
              <address className="site-footer-address">
                {SITE_CONTACT.address.lines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </address>
            </li>

            <li className="site-footer-contact-item">
              <span className="site-footer-contact-icon" aria-hidden="true">
                <PhoneIcon />
              </span>
              <FooterLink href={SITE_CONTACT.phone.href}>
                {SITE_CONTACT.phone.display}
              </FooterLink>
            </li>

            <li className="site-footer-contact-item">
              <span className="site-footer-contact-icon" aria-hidden="true">
                <MailIcon />
              </span>
              <FooterLink href={SITE_CONTACT.email.href}>
                {SITE_CONTACT.email.display}
              </FooterLink>
            </li>

            <li className="site-footer-contact-item site-footer-contact-item--maps">
              <FooterLink
                href={SITE_CONTACT.address.mapsUrl}
                external
                className="site-footer-link--accent"
              >
                View on Google Maps
              </FooterLink>
            </li>
          </ul>
        </div>

        <nav className="site-footer-col site-footer-col--legal" aria-label="Legal">
          <p className="site-footer-label">Legal</p>
          <ul className="site-footer-legal-list">
            {FOOTER_LEGAL_LINKS.map(({ label, href }) => (
              <li key={href}>
                <FooterLink href={href}>{label}</FooterLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="site-footer-bar">
        <p className="site-footer-copy">© 2026 Dayim Developers</p>

        <div className="site-footer-credit">
          <a
            className="site-footer-credit-link"
            target="_blank"
            rel="noopener noreferrer"
            title="Award-winning real estate website design agency"
          >
            <span className="site-footer-credit-label">
              <span>Site by 2wayclick</span>
              <span aria-hidden="true">Site by 2wayclick</span>
            </span>
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
