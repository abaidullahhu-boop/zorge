import { useEffect, useMemo, useRef, useState } from 'react'
import { gsap } from '../../lib/gsap'
import dsaFoundation1 from '../../assets/images/dsaconstruction/foundation/IMG_1853.jpg'
import dsaFoundation2 from '../../assets/images/dsaconstruction/foundation/IMG_2048.jpg'
import dsaFoundation3 from '../../assets/images/dsaconstruction/foundation/IMG_3347.jpg'
import dsaFoundation4 from '../../assets/images/dsaconstruction/foundation/IMG_3436.jpg'
import dsaFoundation5 from '../../assets/images/dsaconstruction/foundation/IMG_3502.jpg'
import dsaStructure1 from '../../assets/images/dsaconstruction/structure/IMG_0033.jpg'
import dsaStructure2 from '../../assets/images/dsaconstruction/structure/IMG_0457.jpg'
import dsaStructure3 from '../../assets/images/dsaconstruction/structure/IMG_2961.jpg'
import dsaStructure4 from '../../assets/images/dsaconstruction/structure/IMG_9792.jpg'
import dsaStructure5 from '../../assets/images/dsaconstruction/structure/IMG_9911.jpg'
import dsaBrick1 from '../../assets/images/dsaconstruction/brick/IMG_0215.jpg'
import dsaBrick2 from '../../assets/images/dsaconstruction/brick/IMG_4914.jpg'
import dsaBrickExtra from '../../assets/images/dsaconstruction/brick/brick.JPG'
import dsaBrick3 from '../../assets/images/dsaconstruction/brick/IMG_4996.jpg'
import dsaBrick4 from '../../assets/images/dsaconstruction/brick/IMG_5229.jpg'
import dsaPlaster1 from '../../assets/images/dsaconstruction/plaster/img03.jpg'
import dsaPlaster2 from '../../assets/images/dsaconstruction/plaster/floring.jpeg'
import dsaFinished1 from '../../assets/images/dsaconstruction/finished/img01.jpg'
import dsaCeiling1 from '../../assets/images/dsaconstruction/ceiling/img01.jpeg'
import dsaCeiling2 from '../../assets/images/dsaconstruction/ceiling/img02.jpeg'
import dsaCeiling3 from '../../assets/images/dsaconstruction/ceiling/img03.jpeg'
import dsaFlooring from '../../assets/images/dsaconstruction/flooring/flooring.png'
import dsMark from '../../assets/images/dsmark.png'
import '../../assets/styles/TimeSection.css'

const defaultJourneyGallery = [
  {
    id: 'dsa-groundwork-1',
    phase: 'groundwork',
    src: dsaFoundation1,
    alt: 'Dayim Signature Apartments groundwork and foundation progress',
    label: 'Groundwork & Foundation',
    detail:
      'The journey began with soil testing, site preparation, excavation, and PCC work. This was followed by the raft foundation and retaining wall works, creating a strong base for the structure above.',
  },
  {
    id: 'dsa-groundwork-2',
    phase: 'groundwork',
    src: dsaFoundation2,
    alt: 'Dayim Signature Apartments groundwork and foundation progress',
    label: 'Groundwork & Foundation',
    detail:
      'The journey began with soil testing, site preparation, excavation, and PCC work. This was followed by the raft foundation and retaining wall works, creating a strong base for the structure above.',
  },
  {
    id: 'dsa-groundwork-3',
    phase: 'groundwork',
    src: dsaFoundation3,
    alt: 'Dayim Signature Apartments groundwork and foundation progress',
    label: 'Groundwork & Foundation',
    detail:
      'The journey began with soil testing, site preparation, excavation, and PCC work. This was followed by the raft foundation and retaining wall works, creating a strong base for the structure above.',
  },
  {
    id: 'dsa-groundwork-4',
    phase: 'groundwork',
    src: dsaFoundation4,
    alt: 'Dayim Signature Apartments groundwork and foundation progress',
    label: 'Groundwork & Foundation',
    detail:
      'The journey began with soil testing, site preparation, excavation, and PCC work. This was followed by the raft foundation and retaining wall works, creating a strong base for the structure above.',
  },
  {
    id: 'dsa-groundwork-5',
    phase: 'groundwork',
    src: dsaFoundation5,
    alt: 'Dayim Signature Apartments groundwork and foundation progress',
    label: 'Groundwork & Foundation',
    detail:
      'The journey began with soil testing, site preparation, excavation, and PCC work. This was followed by the raft foundation and retaining wall works, creating a strong base for the structure above.',
  },
  {
    id: 'dsa-structure-1',
    phase: 'structure',
    src: dsaStructure1,
    alt: 'Dayim Signature Apartments structural construction progress',
    label: 'Building the Structure',
    detail:
      'With the foundation completed, structural work progressed floor by floor. From the lower ground to the sixth floor, the complete eight-floor structure was successfully constructed within approximately eight to nine months.',
  },
  {
    id: 'dsa-structure-2',
    phase: 'structure',
    src: dsaStructure2,
    alt: 'Dayim Signature Apartments structural construction progress',
    label: 'Building the Structure',
    detail:
      'With the foundation completed, structural work progressed floor by floor. From the lower ground to the sixth floor, the complete eight-floor structure was successfully constructed within approximately eight to nine months.',
  },
  {
    id: 'dsa-structure-5',
    phase: 'structure',
    src: dsaStructure5,
    alt: 'Dayim Signature Apartments structural construction progress',
    label: 'Building the Structure',
    detail:
      'With the foundation completed, structural work progressed floor by floor. From the lower ground to the sixth floor, the complete eight-floor structure was successfully constructed within approximately eight to nine months.',
  },
  {
    id: 'dsa-structure-3',
    phase: 'structure',
    src: dsaStructure3,
    alt: 'Dayim Signature Apartments structural construction progress',
    label: 'Building the Structure',
    detail:
      'With the foundation completed, structural work progressed floor by floor. From the lower ground to the sixth floor, the complete eight-floor structure was successfully constructed within approximately eight to nine months.',
  },
  {
    id: 'dsa-structure-4',
    phase: 'structure',
    src: dsaStructure4,
    alt: 'Dayim Signature Apartments structural construction progress',
    label: 'Building the Structure',
    detail:
      'With the foundation completed, structural work progressed floor by floor. From the lower ground to the sixth floor, the complete eight-floor structure was successfully constructed within approximately eight to nine months.',
  },
  {
    id: 'dsa-brickwork-extra',
    phase: 'brickwork',
    src: dsaBrickExtra,
    fit: 'contain',
    alt: 'Dayim Signature Apartments brickwork and internal divisions',
    label: 'Brickwork & Internal Divisions',
    detail:
      'Once the structure was completed, brickwork commenced across the building. Apartment and commercial spaces were divided and defined, with internal and external brickwork completed to establish the final layout.',
  },
  {
    id: 'dsa-brickwork-1',
    phase: 'brickwork',
    src: dsaBrick1,
    alt: 'Dayim Signature Apartments brickwork and internal divisions',
    label: 'Brickwork & Internal Divisions',
    detail:
      'Once the structure was completed, brickwork commenced across the building. Apartment and commercial spaces were divided and defined, with internal and external brickwork completed to establish the final layout.',
  },
 
  {
    id: 'dsa-brickwork-2',
    phase: 'brickwork',
    src: dsaBrick2,
    alt: 'Dayim Signature Apartments brickwork and internal divisions',
    label: 'Brickwork & Internal Divisions',
    detail:
      'Once the structure was completed, brickwork commenced across the building. Apartment and commercial spaces were divided and defined, with internal and external brickwork completed to establish the final layout.',
  },
  {
    id: 'dsa-brickwork-3',
    phase: 'brickwork',
    src: dsaBrick3,
    alt: 'Dayim Signature Apartments brickwork and internal divisions',
    label: 'Brickwork & Internal Divisions',
    detail:
      'Once the structure was completed, brickwork commenced across the building. Apartment and commercial spaces were divided and defined, with internal and external brickwork completed to establish the final layout.',
  },
  {
    id: 'dsa-brickwork-4',
    phase: 'brickwork',
    src: dsaBrick4,
    alt: 'Dayim Signature Apartments brickwork and internal divisions',
    label: 'Brickwork & Internal Divisions',
    detail:
      'Once the structure was completed, brickwork commenced across the building. Apartment and commercial spaces were divided and defined, with internal and external brickwork completed to establish the final layout.',
  },
  {
    id: 'dsa-plastering-1',
    phase: 'plastering',
    src: dsaPlaster1,
    alt: 'Dayim Signature Apartments exterior plastering and scaffolding in progress',
    label: 'Plastering & Surface Development',
    detail:
      'The next phase focused on inner and outer plastering, giving the building its finished architectural form. Internal surfaces were prepared for subsequent flooring, ceiling, paint, and finishing works.',
  },
  {
    id: 'dsa-plastering-2',
    phase: 'plastering',
    src: dsaPlaster2,
    alt: 'Dayim Signature Apartments exterior plastering and scaffolding in progress',
    label: 'Plastering & Surface Development',
    detail:
      'The next phase focused on inner and outer plastering, giving the building its finished architectural form. Internal surfaces were prepared for subsequent flooring, ceiling, paint, and finishing works.',
  },
  {
    id: 'dsa-flooring',
    phase: 'flooring',
    src: dsaFlooring,
    alt: 'Dayim Signature Apartments corridor with polished tile flooring and glass partitions',
    label: 'Flooring, Grills & Windows',
    detail:
      'Finishing works progressed with the installation of floor tiles, balcony and safety grills, and aluminum-framed glass windows. These elements brought both functionality and a refined appearance to the apartments and commercial spaces.',
  },
  {
    id: 'dsa-ceilings-1',
    phase: 'ceilings',
    src: dsaCeiling1,
    alt: 'Dayim Signature Apartments finished interior with ceilings, lighting, and paint',
    label: 'Ceilings, Lighting & Paint',
    detail:
      'False ceiling works, electrical lighting, and painting were carried out as the building moved into its final finishing stage. Each space was progressively prepared to achieve a clean and complete interior finish.',
  },
  {
    id: 'dsa-ceilings-2',
    phase: 'ceilings',
    src: dsaCeiling2,
    alt: 'Dayim Signature Apartments finished interior with ceilings, lighting, and paint',
    label: 'Ceilings, Lighting & Paint',
    detail:
      'False ceiling works, electrical lighting, and painting were carried out as the building moved into its final finishing stage. Each space was progressively prepared to achieve a clean and complete interior finish.',
  },
  {
    id: 'dsa-ceilings-3',
    phase: 'ceilings',
    src: dsaCeiling3,
    alt: 'Dayim Signature Apartments finished interior with ceilings, lighting, and paint',
    label: 'Ceilings, Lighting & Paint',
    detail:
      'False ceiling works, electrical lighting, and painting were carried out as the building moved into its final finishing stage. Each space was progressively prepared to achieve a clean and complete interior finish.',
  },
  {
    id: 'dsa-delivered',
    src: dsaFinished1,
    alt: 'Dayim Signature Apartments completed facade with Dayim Developers head office branding',
    label: 'Finished & Delivered',
    detail:
      'From foundation to final finishing, every major construction and finishing stage has been completed, bringing the building to its finished form. With the commercial spaces delivered and possession handed over in March 2026, Dayim Signature Apartments stands completed and ready for its next chapter.',
  },
]

const defaultJourneyCopy = {
  title: 'Construction Underway',
  body: 'Dayim Signature Apartments moved from groundwork and structural development to finishing and commercial handover in approximately two years. With major construction milestones achieved and commercial possession handed over in March 2026, the project stands as a reflection of our commitment to progress, quality, and timely delivery.',
  tagline:
    'From April 2024 to March 2026 — a journey from foundation to possession.',
}

const CLIP_HIDDEN = 'polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)'
const CLIP_VISIBLE = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'

function TimeSection({
  variant = 'default',
  scrollContainerRef = null,
  project = null,
}) {
  const isProjectVariant = variant === 'project'
  const journey = project?.story?.journey
  const journeyGallery = useMemo(
    () => journey?.items ?? defaultJourneyGallery,
    [journey],
  )
  const journeyCopy = useMemo(
    () => ({
      title: journey?.title ?? defaultJourneyCopy.title,
      body: journey?.body ?? defaultJourneyCopy.body,
      tagline: journey?.tagline ?? defaultJourneyCopy.tagline,
    }),
    [journey],
  )
  const journeyPhases = useMemo(() => {
    const phases = []
    const phaseIndexBySlide = []

    journeyGallery.forEach((item, slideIndex) => {
      const phaseKey = item.phase ?? item.id
      let phaseIndex = phases.findIndex((phase) => phase.key === phaseKey)

      if (phaseIndex === -1) {
        phaseIndex = phases.length
        phases.push({
          key: phaseKey,
          id: item.id,
          label: item.label,
          detail: item.detail,
          firstSlideIndex: slideIndex,
        })
      }

      phaseIndexBySlide.push(phaseIndex)
    })

    return { phases, phaseIndexBySlide }
  }, [journeyGallery])
  const planCount = journeyGallery.length
  const phaseCount = journeyPhases.phases.length
  const [isVisible, setIsVisible] = useState(false)
  const [activePlanIndex, setActivePlanIndex] = useState(0)
  const sectionRef = useRef(null)
  const galleryPinRef = useRef(null)
  const galleryStickyRef = useRef(null)
  const activeIndexRef = useRef(0)
  const setActiveFromScrollRef = useRef(null)
  const activePhaseIndex =
    journeyPhases.phaseIndexBySlide[activePlanIndex] ?? 0
  const activePhase =
    journeyPhases.phases[activePhaseIndex] ?? journeyPhases.phases[0]

  setActiveFromScrollRef.current = (nextIndex) => {
    if (nextIndex === activeIndexRef.current) return
    activeIndexRef.current = nextIndex
    setActivePlanIndex(nextIndex)
  }

  const scrollToPhase = (phaseIndex) => {
    if (phaseCount < 2 || phaseIndex === activePhaseIndex) return

    const phase = journeyPhases.phases[phaseIndex]
    if (!phase) return

    const targetSlideIndex = phase.firstSlideIndex ?? 0
    const pin = galleryPinRef.current
    const sticky = galleryStickyRef.current
    if (!pin || !sticky) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion || planCount < 2) {
      activeIndexRef.current = targetSlideIndex
      setActivePlanIndex(targetSlideIndex)
      return
    }

    const stickyH = sticky.offsetHeight || window.innerHeight
    const slideOffset = targetSlideIndex * stickyH
    const behavior = 'smooth'
    const scroller = scrollContainerRef?.current

    if (scroller) {
      const nextTop =
        pin.getBoundingClientRect().top -
        scroller.getBoundingClientRect().top +
        scroller.scrollTop +
        slideOffset
      scroller.scrollTo({ top: Math.max(0, nextTop), behavior })
      return
    }

    const nextTop =
      pin.getBoundingClientRect().top + window.scrollY + slideOffset
    const lenis = window.__dayimLenis
    if (lenis) {
      lenis.scrollTo(nextTop, { immediate: false })
      return
    }
    window.scrollTo({ top: Math.max(0, nextTop), behavior })
  }

  useEffect(() => {
    setActivePlanIndex(0)
    activeIndexRef.current = 0
  }, [project?.id])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      // Tall pin sections (many slides) can never reach a high ratio in one
      // viewport — any intersection is enough to reveal the sticky content.
      { threshold: 0 },
    )

    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const pin = galleryPinRef.current
    const sticky = galleryStickyRef.current
    if (!pin || !sticky) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const images = [...sticky.querySelectorAll('.time-gallery-stack-item')]

    if (reduceMotion || images.length < 2) {
      images.forEach((image, index) => {
        gsap.set(image, {
          zIndex: index + 1,
          clipPath: CLIP_VISIBLE,
          y: 0,
          clearProps: reduceMotion ? 'clipPath,transform' : undefined,
        })
      })
      return undefined
    }

    const scroller = scrollContainerRef?.current ?? undefined
    const scrollTriggerBase = scroller ? { scroller } : {}

    const ctx = gsap.context(() => {
      images.forEach((image, index) => {
        gsap.set(image, {
          zIndex: index === 0 ? 1 : 0,
          clipPath: index === 0 ? CLIP_VISIBLE : CLIP_HIDDEN,
          y: index === 0 ? '0%' : '5%',
        })
      })

      const getStickyH = () => sticky.offsetHeight || window.innerHeight

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          ...scrollTriggerBase,
          trigger: pin,
          start: 'top top',
          end: () => `+=${getStickyH() * (planCount - 1)}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const segments = planCount - 1
            const raw = self.progress * segments
            const base = Math.min(planCount - 1, Math.floor(raw))
            const local = raw - Math.floor(raw)
            const nextIndex =
              raw >= segments
                ? planCount - 1
                : local >= 0.5
                  ? Math.min(planCount - 1, base + 1)
                  : base
            setActiveFromScrollRef.current?.(nextIndex)
          },
        },
      })

      for (let i = 0; i < planCount - 1; i += 1) {
        const next = i + 1
        const position = i
        const prevImage = images[i]
        const nextImage = images[next]

        if (nextImage) {
          gsap.set(nextImage, { zIndex: next + 1 })
          tl.fromTo(
            nextImage,
            { clipPath: CLIP_HIDDEN, y: '5%' },
            { clipPath: CLIP_VISIBLE, y: '0%', duration: 1 },
            position,
          )
        }

        if (prevImage) {
          tl.to(prevImage, { y: '-8%', duration: 1 }, position)
        }
      }
    }, pin)

    return () => ctx.revert()
  }, [scrollContainerRef, planCount, project?.id])

  if (!planCount) return null

  return (
    <section
      ref={sectionRef}
      className={[
        'time-section',
        isProjectVariant ? 'time-section--project' : '',
        isVisible ? 'is-visible' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      id="daily-schedule"
      aria-labelledby="time-title"
      style={{ '--plan-count': planCount }}
    >
      <h2 id="time-title" className="time-sr-only">
        {journeyCopy.title}
      </h2>

      <div className="time-gallery-pin" ref={galleryPinRef}>
        <div className="time-gallery-sticky" ref={galleryStickyRef}>
          <img
            className="time-section__mark"
            src={project?.mark ?? dsMark}
            alt=""
            aria-hidden="true"
            draggable="false"
          />
          <div className="time-gallery-row">
            <div className="time-gallery-copy">
              <div className="time-gallery-intro">
                <p className="time-gallery-kicker">Journey</p>
                <h3 className="time-gallery-intro-title">
                  {journeyCopy.title}
                </h3>
                {journeyCopy.tagline ? (
                  <p className="time-gallery-intro-tagline">
                    {journeyCopy.tagline}
                  </p>
                ) : null}
                <p className="time-gallery-intro-body">{journeyCopy.body}</p>
              </div>

              <div className="time-gallery-stage" aria-live="polite">
                <div key={activePhase?.id} className="time-gallery-plan-text">
                  <div className="time-gallery-stage-head">
                    <p className="time-gallery-caption">{activePhase?.label}</p>
                    <p className="time-gallery-counter" aria-hidden="true">
                      <span className="time-gallery-counter-current">
                        {String(activePhaseIndex + 1).padStart(2, '0')}
                      </span>
                      <span className="time-gallery-counter-sep">/</span>
                      <span className="time-gallery-counter-total">
                        {String(phaseCount).padStart(2, '0')}
                      </span>
                    </p>
                  </div>
                  <p className="time-gallery-plan-detail">{activePhase?.detail}</p>
                </div>
                <div
                  className="time-gallery-progress"
                  role="group"
                  aria-label="Journey phase progress"
                >
                  {journeyPhases.phases.map((phase, index) => (
                    <button
                      key={phase.key}
                      type="button"
                      className={`time-gallery-progress-dot${
                        index === activePhaseIndex ? ' is-active' : ''
                      }${index < activePhaseIndex ? ' is-done' : ''}`}
                      aria-current={
                        index === activePhaseIndex ? 'true' : undefined
                      }
                      aria-label={`Go to phase ${index + 1}: ${phase.label}`}
                      onClick={() => scrollToPhase(index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="time-gallery-right">
              <div className="time-gallery-frame">
                <div
                  className="time-gallery-stack"
                  aria-label="Construction journey"
                >
                  {journeyGallery.map((plan, index) => (
                    <div
                      key={plan.id}
                      className={`time-gallery-stack-item${
                        plan.fit === 'contain'
                          ? ' time-gallery-stack-item--contain'
                          : ''
                      }`}
                      aria-hidden={index !== activePlanIndex}
                    >
                      <img
                        src={plan.src}
                        alt={plan.alt}
                        draggable="false"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TimeSection
