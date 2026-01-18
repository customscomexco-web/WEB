'use client'

interface ParallaxScene2Props {
  scrollProgress: number
}

export function ParallaxScene2({ scrollProgress }: ParallaxScene2Props) {
  // Horizon
  const horizonOffset = scrollProgress * 30

  // Waves with different speeds
  const wave1Offset = scrollProgress * 200
  const wave2Offset = scrollProgress * 150
  const wave3Offset = scrollProgress * 100

  // Ship moves slowly
  const shipX = scrollProgress * 100

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, 
            #87CEEB 0%, 
            #B0D4E6 60%, 
            #4682B4 100%)`,
          transform: `translateY(${-horizonOffset}px)`,
        }}
      />

      {/* Horizon line */}
      <div
        className="absolute left-0 right-0"
        style={{
          top: '60%',
          height: '2px',
          background: '#2C3E50',
          transform: `translateY(${-horizonOffset}px)`,
        }}
      />

      {/* Wave Layer 1 - Background */}
      <svg
        className="absolute bottom-0 w-full"
        style={{
          transform: `translateX(${-wave1Offset}px)`,
          height: '40%',
          bottom: '0%',
        }}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path
          d="M0,300 Q150,250 300,300 T600,300 Q750,250 900,300 T1200,300 L1200,400 L0,400 Z"
          fill="#4A90E2"
          opacity="0.6"
        />
      </svg>

      {/* Wave Layer 2 - Mid */}
      <svg
        className="absolute bottom-0 w-full"
        style={{
          transform: `translateX(${wave2Offset}px)`,
          height: '35%',
          bottom: '0%',
        }}
        viewBox="0 0 1200 350"
        preserveAspectRatio="none"
      >
        <path
          d="M0,280 Q200,230 400,280 T800,280 Q1000,230 1200,280 L1200,350 L0,350 Z"
          fill="#5BA3F5"
          opacity="0.7"
        />
      </svg>

      {/* Wave Layer 3 - Foreground */}
      <svg
        className="absolute bottom-0 w-full"
        style={{
          transform: `translateX(${-wave3Offset * 0.8}px)`,
          height: '30%',
          bottom: '0%',
        }}
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
      >
        <path
          d="M0,260 Q250,210 500,260 T1000,260 Q1250,210 1200,260 L1200,300 L0,300 Z"
          fill="#6BB6FF"
          opacity="0.8"
        />
      </svg>

      {/* Container Ship */}
      <svg
        className="absolute hidden sm:block"
        style={{
          bottom: '35%',
          transform: `translateX(${shipX}px)`,
          width: '120px',
          height: '72px',
          left: '-120px',
        }}
        viewBox="0 0 200 120"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Ship hull */}
        <path
          d="M20,80 L180,80 L170,100 L30,100 Z"
          fill="#34495E"
        />
        {/* Containers */}
        <rect x="40" y="40" width="30" height="40" fill="#E74C3C" />
        <rect x="75" y="40" width="30" height="40" fill="#3498DB" />
        <rect x="110" y="40" width="30" height="40" fill="#F39C12" />
        <rect x="145" y="40" width="30" height="40" fill="#27AE60" />
        {/* Crane/superstructure */}
        <rect x="50" y="20" width="80" height="20" fill="#2C3E50" />
        <line x1="90" y1="20" x2="90" y2="0" stroke="#2C3E50" strokeWidth="3" />
      </svg>
    </div>
  )
}

