'use client'

interface ParallaxScene3Props {
  scrollProgress: number
}

export function ParallaxScene3({ scrollProgress }: ParallaxScene3Props) {
  // Background offset
  const bgOffset = scrollProgress * 40

  // Ship starts at right and moves left
  // Use pixel-based movement for better control
  const shipStartX = 0 // Start at right edge (0px from right)
  const shipMoveDistance = -700 // Move 700px to the left
  const shipX = shipStartX + (scrollProgress * shipMoveDistance)
  const shipY = 50 // Position vertically at 50% from top (in the water area, lower)
  const shipScale = 1.2 + (scrollProgress * 0.2) // Start at 120%, grow to 140%

  // Waves movement
  const wave1Offset = scrollProgress * 150
  const wave2Offset = scrollProgress * 120
  const wave3Offset = scrollProgress * 100

  return (
    <div className="absolute inset-0 overflow-hidden bg-gradient-to-b from-slate-200 via-slate-100 to-slate-50">
      {/* Sky and Water unified gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, 
            #87CEEB 0%, 
            #B0E0E6 40%, 
            #ADD8E6 48%,
            #87CEEB 50%,
            #7DB8E8 60%,
            #5BA3E5 75%,
            #4682B4 100%)`,
          transform: `translateY(${-bgOffset}px)`,
        }}
      />

      {/* Water/Ocean Area with waves */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '50%',
        }}
      >
        {/* Wave Layer 1 - Background */}
        <svg
          className="absolute bottom-0 w-full opacity-50"
          style={{
            transform: `translateX(${-wave1Offset}px)`,
            height: '100%',
          }}
          viewBox="0 0 1200 450"
          preserveAspectRatio="none"
        >
          <path
            d="M0,350 Q200,300 400,350 T800,350 Q1000,300 1200,350 L1200,450 L0,450 Z"
            fill="#6BB6FF"
            opacity="0.4"
          />
        </svg>

        {/* Wave Layer 2 - Mid */}
        <svg
          className="absolute bottom-0 w-full opacity-60"
          style={{
            transform: `translateX(${wave2Offset * 0.7}px)`,
            height: '90%',
          }}
          viewBox="0 0 1200 400"
          preserveAspectRatio="none"
        >
          <path
            d="M0,320 Q250,270 500,320 T1000,320 Q1250,270 1200,320 L1200,400 L0,400 Z"
            fill="#7CC7FF"
            opacity="0.5"
          />
        </svg>

        {/* Wave Layer 3 - Foreground */}
        <svg
          className="absolute bottom-0 w-full opacity-70"
          style={{
            transform: `translateX(${-wave3Offset * 0.5}px)`,
            height: '80%',
          }}
          viewBox="0 0 1200 360"
          preserveAspectRatio="none"
        >
          <path
            d="M0,300 Q300,250 600,300 Q900,250 1200,300 L1200,360 L0,360 Z"
            fill="#8DD8FF"
            opacity="0.6"
          />
        </svg>
      </div>

      {/* Ship - Starts at right, moves left, in the water */}
      <div
        className="absolute"
        style={{
          transform: `translate(${shipX}px, 0) scale(${shipScale})`,
          width: '100%',
          maxWidth: '1000px',
          height: 'auto',
          right: '0',
          top: `${shipY}%`,
          willChange: 'transform',
          zIndex: 15,
          pointerEvents: 'none',
          opacity: 0.85,
        }}
      >
        <img
          src="/barco.png"
          alt="Barco"
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))',
            maxWidth: '100%',
          }}
          loading="eager"
        />
      </div>
    </div>
  )
}

