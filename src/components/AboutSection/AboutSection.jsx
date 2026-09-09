import dayimLogo from '../../assets/images/dayim-logo.png'
import '../../assets/styles/AboutSection.css'

const ABOUT_LEADERSHIP = [
  {
    name: 'Waleed Ahmad',
    role: 'CEO',
    initials: 'WA',
  },
  {
    name: 'Ubaid Ullah',
    role: 'Director',
    initials: 'UU',
  },
]

const ABOUT_FEATURES = [
  {
    title: 'Innovation',
    description: 'Pioneering architectural solutions.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M9 18h6M10 22h4M12 2a6 6 0 0 0-3 10.7V15h6v-2.3A6 6 0 0 0 12 2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: 'Transparency',
    description: 'Clear communication every step.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    ),
  },
  {
    title: 'Quality',
    description: 'Uncompromising standards.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M12 3 4 6.5v6.8c0 4.2 3.4 7.4 8 9.7 4.6-2.3 8-5.5 8-9.7V6.5L12 3Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="m9.5 12 1.8 1.8L15.5 9.5"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]

function AboutSection() {
  return (
    <section
      className="about-section"
      id="about"
      aria-labelledby="about-title"
    >
      <div className="about-content">
        <div className="about-panel about-panel--copy">
          <h2 id="about-title" className="about-title">
            About
          </h2>

          <div className="about-intro">
            <p>
              <span className="about-highlight">Dayim Developers</span> was founded
              with a vision to redefine Pakistan&apos;s real estate industry through
              innovation, transparency, and quality. Led by CEO{' '}
              <span className="about-highlight">Waleed Ahmad</span> and Director{' '}
              <span className="about-highlight">Ubaid Ullah</span>, we have evolved
              from a real estate consultancy into a trusted marketing and development
              firm.
            </p>
            <p>
              We create modern spaces designed to enhance lifestyles, build
              communities, and deliver lasting value. With a growing portfolio of
              successful projects, we remain committed to excellence, trust, and
              sustainable growth.
            </p>
          </div>

          <ul className="about-leadership" aria-label="Leadership">
            {ABOUT_LEADERSHIP.map(({ name, role, initials }) => (
              <li key={name} className="about-leader">
                <span className="about-leader-avatar" aria-hidden="true">
                  {initials}
                </span>
                <span className="about-leader-copy">
                  <strong className="about-leader-name">{name}</strong>
                  <span className="about-leader-role">{role}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="about-divider" aria-hidden="true" />

          <ul className="about-features">
            {ABOUT_FEATURES.map(({ title, description, icon }) => (
              <li key={title} className="about-feature">
                <span className="about-feature-icon">{icon}</span>
                <span className="about-feature-copy">
                  <strong>{title}</strong>
                  <span>{description}</span>
                </span>
              </li>
            ))}
          </ul>

          <div className="about-divider" aria-hidden="true" />

          <blockquote className="about-quote">
            We don&apos;t just build properties—we build confidence, opportunities,
            and a better future.
          </blockquote>
        </div>

        <div className="about-panel about-panel--visual">
          <div className="about-visual">
            <img
              className="about-visual-logo"
              src={dayimLogo}
              alt="Dayim Developers"
              width={518}
              height={776}
              draggable="false"
            />
            <span className="about-visual-corner" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
