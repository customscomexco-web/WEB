'use client'

import { useEffect, useRef, useState } from 'react'
import { ParallaxScene1 } from './ParallaxScene1'
import { ParallaxScene2 } from './ParallaxScene2'
import { ParallaxScene3 } from './ParallaxScene3'

type SceneType = 'hero' | 'services' | 'importadora'

interface ParallaxSceneProps {
  type: SceneType
  className?: string
  children?: React.ReactNode
}

export function ParallaxScene({ type, className = '', children }: ParallaxSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mediaQuery.addEventListener('change', handleChange)

    if (reducedMotion) {
      return () => mediaQuery.removeEventListener('change', handleChange)
    }

    // Parallax scroll handler
    const handleScroll = () => {
      if (!containerRef.current) return

      const rect = containerRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const elementTop = rect.top
      const elementHeight = rect.height

      // Calculate scroll progress (0 to 1)
      const progress = Math.max(
        0,
        Math.min(1, (windowHeight - elementTop) / (windowHeight + elementHeight))
      )

      setScrollY(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll)
      mediaQuery.removeEventListener('change', handleChange)
    }
  }, [reducedMotion])

  const renderScene = () => {
    if (reducedMotion) {
      return null // Static version or no parallax
    }

    switch (type) {
      case 'hero':
        return <ParallaxScene1 scrollProgress={scrollY} />
      case 'services':
        return <ParallaxScene2 scrollProgress={scrollY} />
      case 'importadora':
        return <ParallaxScene3 scrollProgress={scrollY} />
      default:
        return null
    }
  }

  return (
    <div
      ref={containerRef}
      className={`parallax-container relative ${className}`}
      style={{ minHeight: '100vh' }}
    >
      {renderScene()}
      {children && (
        <div className="relative z-10 w-full">
          {children}
        </div>
      )}
    </div>
  )
}

