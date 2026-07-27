import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import './assets/styles/App.css'
import AboutSection from './components/AboutSection/AboutSection'
import HeroSection from './components/HeroSection/HeroSection'
import LoadingScreen from './components/LoadingScreen/LoadingScreen'
import LocationSection from './components/LocationSection/LocationSection'
import MapSection from './components/MapSection/MapSection'
import PanoramaSection from './components/PanoramaSection/PanoramaSection'
import ArchitectureSection from './components/ArchitectureSection/ArchitectureSection'
import GallerySection from './components/GallerySection/GallerySection'
import TimeSection from './components/TimeSection/TimeSection'
import LobbySection from './components/LobbySection/LobbySection'
import AdvantagesSection from './components/AdvantagesSection/AdvantagesSection'
import FitnessSection from './components/FitnessSection/FitnessSection'
import InfrastructureSection from './components/InfrastructureSection/InfrastructureSection'
import ImprovementSection from './components/ImprovementSection/ImprovementSection'
import ApartmentsSection from './components/ApartmentsSection/ApartmentsSection'
import ServicesSection from './components/ServicesSection/ServicesSection'
import PenthousesSection from './components/PenthousesSection/PenthousesSection'
import Footer from './components/Footer/Footer'
import ScrollIndicator from './components/ScrollIndicator/ScrollIndicator'
import { gsap, ScrollTrigger } from './lib/gsap'

function App() {
  const [introReady, setIntroReady] = useState(false)
  const handleIntroHidden = useCallback(() => setIntroReady(true), [])

  useEffect(() => {
    const aboutSection = document.querySelector('.about-section')
    const locationSection = document.querySelector('.location-section')
    const locationImage = document.querySelector('.location-image-wrap')
    const mapSection = document.querySelector('.map-section')
    const panoramaSection = document.querySelector('.panorama-section')
    const architectureSection = document.querySelector('.architecture-section')
    const gallerySection = document.querySelector('.gallery-section')
    const timeSection = document.querySelector('.time-section')
    const lobbySection = document.querySelector('.lobby-section')
    const advantagesSection = document.querySelector('.advantages-section')
    const fitnessSection = document.querySelector('.fitness-section')
    const fitnessTitle = document.querySelector('.fitness-panel--title')
    const fitnessInfra = document.querySelector('.fitness-infra-hero')
    const infrastructureSection = document.querySelector(
      '.infrastructure-section',
    )
    const infrastructurePanel = document.querySelector('.infrastructure-panel')
    const improvementSection = document.querySelector('.improvement-section')
    const apartmentsSection = document.querySelector('.apartments-section')
    const servicesSection = document.querySelector('.services-section')
    const penthousesSection = document.querySelector('.penthouses-section')
    const siteFooter = document.querySelector('.site-footer')
    const wordmarkRail = document.querySelector('.about-wordmark-rail')
    const wordmark = document.querySelector('.about-wordmark')

    if (
      !aboutSection ||
      !locationSection ||
      !locationImage ||
      !mapSection ||
      !wordmarkRail ||
      !wordmark
    ) {
      return undefined
    }

    const updateWordmark = () => {
      const wordmarkRect = wordmark.getBoundingClientRect()
      const wordmarkTop = wordmarkRect.top
      const aboutRect = aboutSection.getBoundingClientRect()
      const locationRect = locationSection.getBoundingClientRect()
      const imageRect = locationImage.getBoundingClientRect()
      const mapRect = mapSection.getBoundingClientRect()
      const panoramaRect = panoramaSection?.getBoundingClientRect()
      const architectureRect = architectureSection?.getBoundingClientRect()
      const galleryRect = gallerySection?.getBoundingClientRect()
      const timeRect = timeSection?.getBoundingClientRect()
      const lobbyRect = lobbySection?.getBoundingClientRect()
      const advantagesRect = advantagesSection?.getBoundingClientRect()
      const fitnessRect = fitnessSection?.getBoundingClientRect()
      const infrastructureRect = infrastructureSection?.getBoundingClientRect()
      const infrastructurePanelRect = infrastructurePanel?.getBoundingClientRect()
      const apartmentsRect = apartmentsSection?.getBoundingClientRect()
      const servicesRect = servicesSection?.getBoundingClientRect()
      const improvementRect = improvementSection?.getBoundingClientRect()
      const penthousesRect = penthousesSection?.getBoundingClientRect()
      const footerRect = siteFooter?.getBoundingClientRect()
      const isOnLocation =
        locationRect.top <= wordmarkTop &&
        locationRect.bottom > wordmarkTop
      const isOnMap =
        mapRect.top <= wordmarkTop && mapRect.bottom > wordmarkTop
      const isOnPanorama =
        panoramaRect &&
        panoramaRect.top <= wordmarkTop &&
        panoramaRect.bottom > wordmarkTop
      const isOnArchitecture =
        architectureRect &&
        architectureRect.top <= wordmarkTop &&
        architectureRect.bottom > wordmarkTop
      const isOnGallery =
        galleryRect &&
        galleryRect.top <= wordmarkTop &&
        galleryRect.bottom > wordmarkTop
      const isOnTime =
        timeRect &&
        timeRect.top <= wordmarkTop &&
        timeRect.bottom > wordmarkTop
      const isOnLobby =
        lobbyRect &&
        lobbyRect.top <= wordmarkTop &&
        lobbyRect.bottom > wordmarkTop
      const isOnAdvantages =
        advantagesRect &&
        advantagesRect.top <= wordmarkTop &&
        advantagesRect.bottom > wordmarkTop
      const isOnImprovement = Boolean(
        improvementRect &&
          improvementRect.top <= wordmarkTop &&
          improvementRect.bottom > wordmarkTop,
      )
      const isOnServices = Boolean(
        servicesRect &&
          servicesRect.top <= wordmarkTop &&
          servicesRect.bottom > wordmarkTop,
      )
      const isOnPenthouses = Boolean(
        penthousesRect &&
          penthousesRect.top <= wordmarkTop &&
          penthousesRect.bottom > wordmarkTop,
      )
      const isOnFooter = Boolean(
        footerRect &&
          footerRect.top <= wordmarkTop &&
          footerRect.bottom > wordmarkTop,
      )
      // Hide ZORGE only while apartments alone is under the wordmark —
      // Improvement / Services / Penthouses cover this pin and keep the logo visible.
      const isOnApartments = Boolean(
        apartmentsRect &&
          apartmentsRect.top <= wordmarkTop &&
          apartmentsRect.bottom > wordmarkTop &&
          !isOnServices &&
          !isOnImprovement &&
          !isOnPenthouses,
      )
      const isOnInfrastructure = Boolean(
        infrastructureRect &&
          infrastructureRect.top <= wordmarkTop &&
          infrastructureRect.bottom > wordmarkTop,
      )
      // Split panel: logo sits over the white/light image column — needs black.
      const isOnInfrastructurePanel = Boolean(
        infrastructurePanelRect &&
          infrastructurePanelRect.top <= wordmarkTop &&
          infrastructurePanelRect.bottom > wordmarkTop,
      )
      // Fitness sticky is transparent at first (leading spacer). Only treat it
      // as a light slide once the white panels reach under the wordmark —
      // otherwise ZORGE flips black while still on the dark advantages card.
      const fitnessSectionActive = Boolean(
        fitnessRect &&
          fitnessRect.top <= wordmarkTop &&
          fitnessRect.bottom > wordmarkTop &&
          !isOnInfrastructure,
      )
      // Infra hero rides inside the Fitness track — once it covers ZORGE,
      // switch to the dark (white wordmark) treatment.
      let isOnFitnessInfra = false
      if (fitnessSectionActive && fitnessInfra) {
        const infraLeft = fitnessInfra.getBoundingClientRect().left
        if (infraLeft < wordmarkRect.right) {
          isOnFitnessInfra = true
        }
      }
      let isOnFitness = false
      let fitnessClip = '100%'
      if (fitnessSectionActive && fitnessTitle && !isOnFitnessInfra) {
        const panelLeft = fitnessTitle.getBoundingClientRect().left
        if (panelLeft < wordmarkRect.right) {
          isOnFitness = true
          if (panelLeft <= wordmarkRect.left) {
            fitnessClip = '0%'
          } else {
            const pct =
              ((panelLeft - wordmarkRect.left) / wordmarkRect.width) * 100
            fitnessClip = `${Math.max(0, Math.min(100, pct))}%`
          }
        }
      }
      if (isOnFitness) {
        wordmarkRail.style.setProperty('--fitness-clip', fitnessClip)
      } else {
        wordmarkRail.style.removeProperty('--fitness-clip')
      }
      // Fitness (light) sits above advantages (dark) when white is under ZORGE.
      // Infra hero (Fitness track / mobile hero) stays dark; the split panel is light.
      const isOnDarkSlide = Boolean(
        (isOnGallery ||
          isOnTime ||
          isOnLobby ||
          isOnAdvantages ||
          isOnServices ||
          isOnPenthouses ||
          isOnFooter ||
          isOnFitnessInfra ||
          (isOnInfrastructure && !isOnInfrastructurePanel)) &&
          !isOnFitness,
      )
      const isOnArchitectureLight = Boolean(
        (isOnArchitecture || isOnInfrastructurePanel || isOnImprovement) &&
          !isOnDarkSlide &&
          !isOnFitness &&
          !isOnServices &&
          !isOnPenthouses,
      )

      wordmarkRail.classList.toggle(
        'is-visible',
        aboutRect.top <= 1 && !isOnApartments,
      )
      wordmarkRail.classList.toggle('is-on-location', isOnLocation)
      wordmarkRail.classList.toggle('is-on-map', isOnMap)
      // Higher overlapping slides win: fitness (light) >
      // lobby/time/gallery/advantages (dark) > architecture (light) >
      // panorama (dark).
      wordmarkRail.classList.toggle(
        'is-on-panorama',
        Boolean(
          isOnPanorama && !isOnArchitectureLight && !isOnDarkSlide && !isOnFitness,
        ),
      )
      wordmarkRail.classList.toggle('is-on-architecture', isOnArchitectureLight)
      wordmarkRail.classList.toggle('is-on-fitness', isOnFitness)
      wordmarkRail.classList.toggle('is-on-gallery', isOnDarkSlide)
      wordmarkRail.classList.toggle(
        'is-past-location-image',
        isOnLocation && imageRect.bottom <= wordmarkTop && !isOnMap,
      )
    }

    updateWordmark()
    window.addEventListener('scroll', updateWordmark, { passive: true })
    window.addEventListener('resize', updateWordmark)

    return () => {
      window.removeEventListener('scroll', updateWordmark)
      window.removeEventListener('resize', updateWordmark)
    }
  }, [])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'auto' })
      }
      const handleScrollTo = (event) => {
        const el = event.detail?.el
        if (!(el instanceof Element)) return
        el.scrollIntoView({ behavior: 'auto', block: 'start' })
      }
      window.addEventListener('zorge:scroll-top', handleScrollTop)
      window.addEventListener('zorge:scroll-to', handleScrollTo)
      return () => {
        window.removeEventListener('zorge:scroll-top', handleScrollTop)
        window.removeEventListener('zorge:scroll-to', handleScrollTo)
      }
    }

    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      wheelMultiplier: 0.65,
    })
    window.__zorgeLenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true })
        }
        return lenis.scroll
      },
      getBoundingClientRect() {
        return {
          top: 0,
          left: 0,
          width: window.innerWidth,
          height: window.innerHeight,
        }
      },
    })

    const handleScrollTriggerRefresh = () => {
      lenis.resize()
    }

    ScrollTrigger.addEventListener('refresh', handleScrollTriggerRefresh)

    const heroFrame = document.querySelector('.hero-scroll-frame')
    const aboutFlow = document.querySelector('.about-location-flow')
    const locationSection = document.querySelector('.location-section')
    const advantagesSection = document.querySelector('.advantages-section')
    const servicesSection = document.querySelector('.services-section')
    const infrastructurePanel = document.querySelector('.infrastructure-panel')
    let snapTimeout
    let isSnapping = false

    const getDocumentOffsetTop = (element) => {
      let top = 0
      let node = element
      while (node) {
        top += node.offsetTop
        node = node.offsetParent
      }
      return top
    }

    // Never measure sticky nodes with offsetTop — while stuck, browsers
    // report a moving offset and snap ranges collapse.
    const getSnapRanges = () => {
      if (!heroFrame || !aboutFlow || !locationSection) return []

      const heroStart = getDocumentOffsetTop(heroFrame)
      const aboutStart = getDocumentOffsetTop(aboutFlow)
      const locationStart = getDocumentOffsetTop(locationSection)
      const ranges = []

      // Hero ↔ about center snap is desktop-only; free-scroll on mobile.
      if (aboutStart > heroStart && window.innerWidth > 760) {
        ranges.push({ start: heroStart, end: aboutStart, id: 'about-snap' })
      }

      // Location: only snap to section top (about ↔ location), not within content.
      // Desktop-only; free-scroll on mobile.
      if (locationStart > aboutStart && window.innerWidth > 760) {
        ranges.push({
          start: aboutStart,
          end: locationStart,
          id: 'location-snap',
        })
      }

      // Advantages: center snap between each card (works both directions).
      // Above center → previous card top; below center → next card.
      if (advantagesSection) {
        const advantagesStart = getDocumentOffsetTop(advantagesSection)
        const itemCount =
          Number.parseInt(
            getComputedStyle(advantagesSection)
              .getPropertyValue('--item-count')
              .trim(),
            10,
          ) || 5
        const vh = window.innerHeight
        const steps = Math.max(1, itemCount - 1)

        for (let i = 0; i < steps; i += 1) {
          ranges.push({
            start: advantagesStart + i * vh,
            end: advantagesStart + (i + 1) * vh,
            id: `advantages-snap-${i}`,
          })
        }
      }

      // Services: center snap between each technology card.
      if (servicesSection && servicesSection.offsetHeight > window.innerHeight) {
        const servicesStart = getDocumentOffsetTop(servicesSection)
        const itemCount =
          Number.parseInt(
            getComputedStyle(servicesSection)
              .getPropertyValue('--item-count')
              .trim(),
            10,
          ) || 3
        const vh = window.innerHeight
        const steps = Math.max(1, itemCount - 1)

        for (let i = 0; i < steps; i += 1) {
          ranges.push({
            start: servicesStart + i * vh,
            end: servicesStart + (i + 1) * vh,
            id: `services-snap-${i}`,
          })
        }
      }

      // Infrastructure restaurant panel: center snap across cover + hold
      // (streetscape → restaurant). Improvement overlay is free-scroll —
      // no center snap while park covers Restaurant. Mobile hides this panel.
      if (infrastructurePanel && infrastructurePanel.offsetHeight > 0) {
        const panelStart = getDocumentOffsetTop(infrastructurePanel)
        const vh = window.innerHeight
        const infraSection = infrastructurePanel.closest(
          '.infrastructure-section',
        )
        const panelStyles = getComputedStyle(
          infraSection ?? infrastructurePanel,
        )
        const readVh = (name, fallback) => {
          const raw = panelStyles.getPropertyValue(name).trim()
          if (!raw) return fallback
          if (raw.endsWith('px')) {
            const px = Number.parseFloat(raw)
            return Number.isFinite(px) ? px : fallback
          }
          // 100svh / 100vh → one viewport height in px
          if (raw.endsWith('svh') || raw.endsWith('vh')) {
            const n = Number.parseFloat(raw)
            return Number.isFinite(n) ? (n / 100) * vh : fallback
          }
          // Bare number = viewport multiples (1 = 100vh)
          const n = Number.parseFloat(raw)
          return Number.isFinite(n) ? n * vh : fallback
        }
        // Cover + hold only (exclude --improvement-handoff pin).
        const snapDistance =
          readVh('--infra-handoff', vh) + readVh('--restaurant-hold', vh)
        const steps = Math.max(1, Math.round(snapDistance / vh))

        for (let i = 0; i < steps; i += 1) {
          ranges.push({
            start: panelStart + i * vh,
            end: panelStart + (i + 1) * vh,
            id: `infrastructure-snap-${i}`,
          })
        }
      }

      return ranges
    }

    const findActiveSnapRange = (scrollY, ranges) =>
      ranges.find(
        ({ start, end }) => scrollY > start + 1 && scrollY < end - 1,
      )

    const snapSections = ({ deltaY = 0, event }) => {
      if (isSnapping) return
      if (event.type === 'touchmove' || deltaY === 0) return

      const ranges = getSnapRanges()
      if (!ranges.length) return

      const activeRange = findActiveSnapRange(lenis.scroll, ranges)
      if (!activeRange) {
        window.clearTimeout(snapTimeout)
        snapTimeout = undefined
        return
      }

      window.clearTimeout(snapTimeout)
      snapTimeout = window.setTimeout(() => {
        snapTimeout = undefined
        if (isSnapping) return

        // Re-resolve by id so sticky offset bugs can't collapse the range.
        const range =
          getSnapRanges().find((item) => item.id === activeRange.id) ??
          activeRange
        const { start, end } = range
        const current = Math.max(
          start,
          Math.min(end, lenis.targetScroll),
        )
        const center = start + (end - start) / 2
        const destination = current < center ? start : end

        if (Math.abs(lenis.scroll - destination) <= 1) return

        isSnapping = true
        lenis.scrollTo(destination, {
          duration: 1.4,
          lock: true,
          easing: (time) =>
            time < 0.5
              ? 4 * time ** 3
              : 1 - (-2 * time + 2) ** 3 / 2,
          userData: { initiator: range.id },
          onComplete: () => {
            isSnapping = false
          },
        })
      }, 120)
    }

    lenis.on('virtual-scroll', snapSections)

    const handleScrollTop = () => {
      isSnapping = true
      lenis.scrollTo(0, {
        duration: 1.4,
        lock: true,
        easing: (time) =>
          time < 0.5
            ? 4 * time ** 3
            : 1 - (-2 * time + 2) ** 3 / 2,
        onComplete: () => {
          isSnapping = false
        },
      })
    }

    const handleScrollTo = (event) => {
      const el = event.detail?.el
      if (!(el instanceof Element)) return
      isSnapping = true
      lenis.scrollTo(el, {
        offset: 0,
        immediate: true,
        onComplete: () => {
          // Keep snap locked briefly so wheel-snap doesn't re-animate away.
          window.setTimeout(() => {
            isSnapping = false
          }, 80)
        },
      })
    }

    window.addEventListener('zorge:scroll-top', handleScrollTop)
    window.addEventListener('zorge:scroll-to', handleScrollTo)

    const lenisTicker = (time) => {
      lenis.raf(time * 1000)
    }

    lenisTicker(0)
    gsap.ticker.add(lenisTicker)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()

    return () => {
      window.clearTimeout(snapTimeout)
      window.removeEventListener('zorge:scroll-top', handleScrollTop)
      window.removeEventListener('zorge:scroll-to', handleScrollTo)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.off('virtual-scroll', snapSections)
      ScrollTrigger.removeEventListener('refresh', handleScrollTriggerRefresh)
      gsap.ticker.remove(lenisTicker)
      ScrollTrigger.scrollerProxy(document.documentElement, {})
      lenis.destroy()
      if (window.__zorgeLenis === lenis) delete window.__zorgeLenis
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <main className="zorge-page" id="top">
      <ScrollIndicator />
      <LoadingScreen onHidden={handleIntroHidden} />
      <HeroSection introReady={introReady} />
      <div className="about-wordmark-rail" aria-hidden="true">
        <div className="about-wordmark">
          <p className="about-wordmark-layer">
            <span>ZORGE</span>
            <small className="about-wordmark-no">
              <span className="about-wordmark-n">N</span>
              <span className="about-wordmark-mark">
                <span className="about-wordmark-mark-ring">º</span>
                <span className="about-wordmark-mark-dot" />
              </span>
              <span>9</span>
            </small>
          </p>
          <p className="about-wordmark-layer about-wordmark-layer--dark">
            <span>ZORGE</span>
            <small className="about-wordmark-no">
              <span className="about-wordmark-n">N</span>
              <span className="about-wordmark-mark">
                <span className="about-wordmark-mark-ring">º</span>
                <span className="about-wordmark-mark-dot" />
              </span>
              <span>9</span>
            </small>
          </p>
        </div>
      </div>
      <div className="about-location-flow">
        <AboutSection />
        <LocationSection />
        <MapSection />
        <PanoramaSection />
        <ArchitectureSection />
        <GallerySection />
        <TimeSection />
        <LobbySection />
        <AdvantagesSection />
        <FitnessSection />
        <InfrastructureSection />
        <ImprovementSection />
        <ApartmentsSection />
        <ServicesSection />
        <PenthousesSection />
        <Footer />
      </div>
    </main>
  )
}

export default App
