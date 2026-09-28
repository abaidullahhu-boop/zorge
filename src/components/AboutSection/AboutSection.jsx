import dayimLogo from '../../assets/images/dayim-logo.png'
import ceoWaleed from '../../assets/images/ceo-waleed.png'
import directorUbaid from '../../assets/images/director-ubaid.png'
import '../../assets/styles/AboutSection.css'

const SocialLinkedInIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6.5 9.5H9v9H6.5v-9ZM7.75 5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM11 9.5h2.4v1.23h.03c.33-.63 1.15-1.3 2.37-1.3 2.54 0 3.01 1.67 3.01 3.84V18.5H16.4v-4.2c0-1-.02-2.28-1.39-2.28-1.39 0-1.6 1.09-1.6 2.21V18.5H11v-9Z"
      fill="currentColor"
    />
  </svg>
)

const SocialFacebookIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M14 8.5h2V6h-2c-2.2 0-4 1.8-4 4v2H8v2.5h2V21h2.5v-6.5H15L15.5 12H12.5v-1.5c0-.83.67-1.5 1.5-1.5Z"
      fill="currentColor"
    />
  </svg>
)

const SocialInstagramIcon = (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect
      x="4.5"
      y="4.5"
      width="15"
      height="15"
      rx="4"
      stroke="currentColor"
      strokeWidth="1.6"
    />
    <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="16.4" cy="7.6" r="1" fill="currentColor" />
  </svg>
)

const ABOUT_LEADERSHIP = [
  {
    name: 'Waleed Ahmad',
    role: 'Founder - CEO',
    image: ceoWaleed,
    socials: [
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/ceo-dayimmarketing',
        icon: SocialLinkedInIcon,
      },
      {
        label: 'Facebook',
        href: 'https://www.facebook.com/ceodayimdevelopers',
        icon: SocialFacebookIcon,
      },
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/iwaleed_ahmad/',
        icon: SocialInstagramIcon,
      },
    ],
  },
  {
    name: 'Ubaid Ullah',
    role: 'Director',
    image: directorUbaid,
    imagePosition: 'center 22%',
    socials: [
      {
        label: 'LinkedIn',
        href: 'https://www.linkedin.com/in/sheikh-ubaid-36364a254/',
        icon: SocialLinkedInIcon,
      },
      {
        label: 'Facebook',
        href: 'https://www.facebook.com/sheikh.ubaid.589',
        icon: SocialFacebookIcon,
      },
      {
        label: 'Instagram',
        href: 'https://www.instagram.com/sheikh_ubaid111/',
        icon: SocialInstagramIcon,
      },
    ],
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
            {ABOUT_LEADERSHIP.map(({ name, role, image, imagePosition, socials }) => (
              <li key={name} className="about-leader">
                <img
                  className="about-leader-avatar"
                  src={image}
                  alt=""
                  width={52}
                  height={52}
                  draggable="false"
                  style={imagePosition ? { objectPosition: imagePosition } : undefined}
                />
                <span className="about-leader-copy">
                  <strong className="about-leader-name">{name}</strong>
                  <span className="about-leader-role">{role}</span>
                  {socials?.length > 0 ? (
                    <span className="about-leader-socials">
                      {socials.map(({ label, href, icon }) => (
                        <a
                          key={label}
                          className="about-leader-social"
                          href={href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`${name} on ${label}`}
                        >
                          {icon}
                        </a>
                      ))}
                    </span>
                  ) : null}
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
