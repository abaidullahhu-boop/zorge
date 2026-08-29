import { useCallback, useEffect, useState } from 'react'
import Lenis from 'lenis'
import '../assets/styles/App.css'
import AboutSection from '../components/AboutSection/AboutSection'
import HeroSection from '../components/HeroSection/HeroSection'
import LoadingScreen from '../components/LoadingScreen/LoadingScreen'
// import LocationSection from '../components/LocationSection/LocationSection'
import MapSection from '../components/MapSection/MapSection'
import ProjectsSection from '../components/ProjectsSection/ProjectsSection'
import PanoramaSection from '../components/PanoramaSection/PanoramaSection'
import ArchitectureSection from '../components/ArchitectureSection/ArchitectureSection'
import GallerySection from '../components/GallerySection/GallerySection'
import LobbySection from '../components/LobbySection/LobbySection'
import AdvantagesSection from '../components/AdvantagesSection/AdvantagesSection'
import Footer from '../components/Footer/Footer'
import ScrollIndicator from '../components/ScrollIndicator/ScrollIndicator'
import { gsap, ScrollTrigger } from '../lib/gsap'

function HomePage() {
  const [showIntro] = useState(() => {
    try {
      return sessionStorage.getItem('dayim-intro-seen') !== '1'
    } catch {
      return true
    }
  })
  const [introReady, setIntroReady] = useState(() => !showIntro)
  const handleIntroHidden = useCallback(() => {
    try {
      sessionStorage.setItem('dayim-intro-seen', '1')
    } catch {
      /* ignore */
    }
    setIntroReady(true)
  }, [])

  useEffect(() => {
    const aboutSection = document.querySelector('.about-section')
    const locationSection = document.querySelector('.location-section')
    const locationImage = document.querySelector('.location-image-wrap')
    const mapSection = document.querySelector('.map-section')
    const projectsSection = document.querySelector('.projects-section')
    const panoramaSection = document.querySelector('.panorama-section')
    const architectureSection = document.querySelector('.architecture-section')
    const gallerySection = document.querySelector('.gallery-section')
    const lobbySection = document.querySelector('.lobby-section')
    const advantagesSection = document.querySelector('.advantages-section')
    const siteFooter = document.querySelector('.site-footer')
    const wordmarkRail = document.querySelector('.about-wordmark-rail')
    const wordmark = document.querySelector('.about-wordmark')

    if (!aboutSection || !wordmarkRail || !wordmark) {
      return undefined
    }

    const updateWordmark = () => {
      const wordmarkRect = wordmark.getBoundingClientRect()
      const wordmarkTop = wordmarkRect.top
      const aboutRect = aboutSection.getBoundingClientRect()
      const locationRect = locationSection?.getBoundingClientRect()
      const imageRect = locationImage?.getBoundingClientRect()
      const mapRect = mapSection?.getBoundingClientRect()
      const projectsRect = projectsSection?.getBoundingClientRect()
      const panoramaRect = panoramaSection?.getBoundingClientRect()
      const architectureRect = architectureSection?.getBoundingClientRect()
      const galleryRect = gallerySection?.getBoundingClientRect()
      const lobbyRect = lobbySection?.getBoundingClientRect()
      const advantagesRect = advantagesSection?.getBoundingClientRect()
      const footerRect = siteFooter?.getBoundingClientRect()
      const isOnLocation = Boolean(
        locationRect &&
          locationRect.top <= wordmarkTop &&
          locationRect.bottom > wordmarkTop,
      )
      const isOnMap = Boolean(
        mapRect &&
          mapRect.top <= wordmarkTop &&
          mapRect.bottom > wordmarkTop,
      )
      const isOnProjects = Boolean(
        projectsRect &&
          projectsRect.top <= wordmarkTop &&
          projectsRect.bottom > wordmarkTop,
      )
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
      const isOnLobby =
        lobbyRect &&
        lobbyRect.top <= wordmarkTop &&
        lobbyRect.bottom > wordmarkTop
      const isOnAdvantages =
        advantagesRect &&
        advantagesRect.top <= wordmarkTop &&
        advantagesRect.bottom > wordmarkTop
      const isOnFooter = Boolean(
        footerRect &&
          footerRect.top <= wordmarkTop &&
          footerRect.bottom > wordmarkTop,
      )
      const isOnDarkSlide = Boolean(
        isOnGallery || isOnLobby || isOnAdvantages || isOnFooter,
      )
      const isOnArchitectureLight = Boolean(
        isOnArchitecture && !isOnDarkSlide,
      )
      const isOnProjectsLight = Boolean(isOnProjects && !isOnDarkSlide)

      wordmarkRail.classList.toggle(
        'is-visible',
        aboutRect.top <= 1 && !isOnProjects,
      )
      wordmarkRail.classList.toggle('is-on-location', isOnLocation)
      wordmarkRail.classList.toggle('is-on-map', isOnMap)
      // Higher overlapping slides win: lobby/gallery/advantages (dark) >
      // architecture (light) > panorama (dark).
      wordmarkRail.classList.toggle(
        'is-on-panorama',
        Boolean(
          isOnPanorama && !isOnArchitectureLight && !isOnDarkSlide,
        ),
      )
      wordmarkRail.classList.toggle('is-on-architecture', isOnArchitectureLight)
      wordmarkRail.classList.toggle('is-on-projects', isOnProjectsLight)
      wordmarkRail.classList.toggle('is-on-gallery', isOnDarkSlide)
      wordmarkRail.classList.toggle(
        'is-past-location-image',
        Boolean(
          isOnLocation &&
            imageRect &&
            imageRect.bottom <= wordmarkTop &&
            !isOnMap,
        ),
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
      window.addEventListener('dayim:scroll-top', handleScrollTop)
      window.addEventListener('dayim:scroll-to', handleScrollTo)
      return () => {
        window.removeEventListener('dayim:scroll-top', handleScrollTop)
        window.removeEventListener('dayim:scroll-to', handleScrollTo)
      }
    }

    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
      wheelMultiplier: 0.65,
    })
    window.__dayimLenis = lenis

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
    const panoramaSection = document.querySelector('.panorama-section')
    const lobbySection = document.querySelector('.lobby-section')
    const mapSection = document.querySelector('.map-section')
    const advantagesSection = document.querySelector('.advantages-section')
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

    const freeScrollStackSections = [
      panoramaSection,
      lobbySection,
      mapSection,
    ].filter(Boolean)

    const isInFreeScrollStack = (scrollY) =>
      freeScrollStackSections.some((section) => {
        const start = getDocumentOffsetTop(section)
        const end = start + section.offsetHeight
        return scrollY > start + 1 && scrollY < end - 1
      })

    // Never measure sticky nodes with offsetTop — while stuck, browsers
    // report a moving offset and snap ranges collapse.
    const getSnapRanges = () => {
      if (!heroFrame || !aboutFlow || !locationSection) return []

      // Disable all center-snap behaviour on mobile — free scroll only.
      if (window.innerWidth <= 760) return []

      const heroStart = getDocumentOffsetTop(heroFrame)
      const aboutStart = getDocumentOffsetTop(aboutFlow)
      const locationStart = getDocumentOffsetTop(locationSection)
      const ranges = []

      // Hero ↔ about center snap is desktop-only; free-scroll on mobile.
      if (aboutStart > heroStart && window.innerWidth > 760) {
        ranges.push({ start: heroStart, end: aboutStart, id: 'about-snap' })
      }

      // Location: snap only near the location section top. Panorama, lobby,
      // and map between about and location stay free-scroll.
      if (locationStart > aboutStart && window.innerWidth > 760) {
        const vh = window.innerHeight
        const snapStart = locationStart - vh * 0.65
        if (snapStart > aboutStart) {
          ranges.push({
            start: snapStart,
            end: locationStart,
            id: 'location-snap',
          })
        }
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

      // Panorama, lobby, and map sit between about and location — keep them
      // free-scroll; the old about→location snap pulled scroll back on release.
      if (
        activeRange.id === 'location-snap' &&
        isInFreeScrollStack(lenis.scroll)
      ) {
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

    window.addEventListener('dayim:scroll-top', handleScrollTop)
    window.addEventListener('dayim:scroll-to', handleScrollTo)

    const lenisTicker = (time) => {
      lenis.raf(time * 1000)
    }

    lenisTicker(0)
    gsap.ticker.add(lenisTicker)
    gsap.ticker.lagSmoothing(0)
    ScrollTrigger.refresh()

    return () => {
      window.clearTimeout(snapTimeout)
      window.removeEventListener('dayim:scroll-top', handleScrollTop)
      window.removeEventListener('dayim:scroll-to', handleScrollTo)
      lenis.off('scroll', ScrollTrigger.update)
      lenis.off('virtual-scroll', snapSections)
      ScrollTrigger.removeEventListener('refresh', handleScrollTriggerRefresh)
      gsap.ticker.remove(lenisTicker)
      ScrollTrigger.scrollerProxy(document.documentElement, {})
      lenis.destroy()
      if (window.__dayimLenis === lenis) delete window.__dayimLenis
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <main className="dayim-page" id="top">
      <ScrollIndicator />
      {showIntro ? <LoadingScreen onHidden={handleIntroHidden} /> : null}
      <HeroSection introReady={introReady} />
      <div className="about-wordmark-rail" aria-hidden="true">
        <div className="about-wordmark">
          <p className="about-wordmark-layer">
            <span>DAYIM DEVELOPERS</span>
          </p>
          <p className="about-wordmark-layer about-wordmark-layer--dark">
            <span>DAYIM DEVELOPERS</span>
          </p>
        </div>
      </div>
      <div className="about-location-flow">
        <AboutSection />
        <PanoramaSection />
        <LobbySection />
        <MapSection />
        <ArchitectureSection />
        <AdvantagesSection />      
        {/* <LocationSection /> */}
        <ProjectsSection />
        <GallerySection />
        <Footer />
      </div>
    </main>
  )
}

export default HomePage
