import { useEffect, useRef } from 'react'
import PanoramaSection from '../PanoramaSection/PanoramaSection'
import { gsap } from '../../lib/gsap'

function MapPanoramaTransition() {
  const rootRef = useRef(null)
  const panoramaSectionRef = useRef(null)
  const slideInnerRef = useRef(null)

  useEffect(() => {
    const root = rootRef.current
    const panoramaSection = panoramaSectionRef.current
    const slideInner = slideInnerRef.current

    if (!root || !panoramaSection || !slideInner) return undefined

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reduceMotion) {
      gsap.set(slideInner, { y: 0, clearProps: 'transform' })
      return undefined
    }

    const ctx = gsap.context(() => {
      const getDistance = () => window.innerHeight

      gsap.fromTo(
        slideInner,
        {
          y: getDistance,
          force3D: true,
        },
        {
          y: 0,
          ease: 'none',
          scrollTrigger: {
            trigger: panoramaSection,
            start: 'top bottom',
            end: 'top top',
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={rootRef} className="relative isolate">
      <div ref={panoramaSectionRef}>
        <PanoramaSection slideInnerRef={slideInnerRef} />
      </div>
    </div>
  )
}

export default MapPanoramaTransition
