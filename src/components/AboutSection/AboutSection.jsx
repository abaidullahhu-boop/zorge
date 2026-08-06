import { useEffect, useState } from 'react'
import '../../assets/styles/AboutSection.css'

function LongArrowUp() {
  return (
    <svg
      className="about-arrow-icon"
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

const VIMEO_VIDEO =
  'https://player.vimeo.com/video/1185877284?autoplay=1&title=0&byline=0&portrait=0'

function AboutSection() {
  const [videoOpen, setVideoOpen] = useState(false)

  useEffect(() => {
    if (!videoOpen) return undefined

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setVideoOpen(false)
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', closeOnEscape)

    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [videoOpen])

  return (
    <>
      <section
        className="about-section"
        id="about"
        aria-labelledby="about-title"
      >
        <div className="about-background" aria-hidden="true">
          <video autoPlay muted loop playsInline preload="metadata">
            <source src="/assets/images/dayim-main-video.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="about-shade" aria-hidden="true" />

        <div className="about-content">
          

          <h2 id="about-title">
            Building Tomorrow.
            <br />
            Setting New Standards.
          </h2>

          <div className="about-cards">
            <button
              className="about-card about-card--dark"
              type="button"
              onClick={() => setVideoOpen(true)}
              aria-label="Watch video about Dayim Developers"
            >
              <span className="about-card-kicker">About Us</span>
              <svg
                className="about-play"
                viewBox="0 0 12 24"
                aria-hidden="true"
              >
                <path pathLength="100" d="M1 1.5 11 12 1 22.5Z" />
              </svg>
            </button>

            <a className="about-card about-card--light" href="#architecture">
              <span className="about-card-kicker">
                Our Vision
                <br />
                &amp; Mission
              </span>
              <strong>Our Story</strong>
              <span className="about-watch">Explore</span>
            </a>
          </div>
        </div>
      </section>

      {videoOpen && (
        <div
          className="video-modal"
          role="dialog"
          aria-modal="true"
          aria-label="About Dayim Developers video"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setVideoOpen(false)
          }}
        >
          <button
            className="video-modal-close"
            type="button"
            onClick={() => setVideoOpen(false)}
            aria-label="Close video"
          >
            <span />
            <span />
          </button>
          <div className="video-modal-frame">
            <iframe
              src={VIMEO_VIDEO}
              title="About Dayim Developers"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}

export default AboutSection
