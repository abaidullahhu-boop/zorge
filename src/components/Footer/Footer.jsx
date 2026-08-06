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

function Footer() {
  const scrollToTop = (event) => {
    event.preventDefault()
    window.dispatchEvent(new CustomEvent('dayim:scroll-top'))
  }

  return (
    <footer className="site-footer">
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

      <div className="site-footer-row">
        <p className="site-footer-copy">© 2026 Dayim Developers</p>

        <a
          className="site-footer-logo"
          href="#top"
          aria-label="Dayim Developers — scroll to top"
          onClick={scrollToTop}
        >
          <span className="site-footer-logo-text" aria-hidden="true">
            Dayim Developers
          </span>
        </a>

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
