'use client'

interface ParallaxScene1Props {
  scrollProgress: number
}

export function ParallaxScene1({ scrollProgress }: ParallaxScene1Props) {
  // Sky gradient
  const skyOffset = scrollProgress * 50

  // Cloud layers with different speeds
  const cloud1Offset = scrollProgress * 100
  const cloud2Offset = scrollProgress * 150
  const cloud3Offset = scrollProgress * 200

  // Airplane starts at center and moves up more
  // Start at center (50% from top), move up more as scroll progresses
  const airplaneStartY = 50 // Start at 50% from top (center)
  const airplaneEndY = 20 // End at 5% from top (much higher)
  const movementDistance = airplaneStartY - airplaneEndY // 45% movement distance
  const airplaneY = airplaneStartY - (scrollProgress * movementDistance * 1.5) // Multiply by 1.5 for more movement speed
  
  // Keep airplane centered horizontally
  const airplaneX = 0 // No horizontal movement, stay centered
  
  // Optional: slight scale change as it moves up
  const airplaneScale = 1.0 + (scrollProgress * 0.3) // Start at 100%, grow to 130%

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, 
            #87CEEB 0%, 
            #B0E0E6 ${50 + skyOffset * 0.1}%, 
            #E0F6FF 100%)`,
          transform: `translateY(${-skyOffset}px)`,
        }}
      />

      {/* Cloud Layer 1 - Far background */}
      <svg
        className="absolute bottom-0 w-full opacity-40"
        style={{
          transform: `translateX(${-cloud1Offset}px)`,
          height: '40%',
        }}
        viewBox="0 0 1200 400"
        preserveAspectRatio="none"
      >
        <path
          d="M100,200 Q150,150 200,200 T300,200 Q350,150 400,200 T500,200 Q550,150 600,200 T700,200 Q750,150 800,200 T900,200 Q950,150 1000,200 T1100,200"
          fill="white"
          opacity="0.6"
        />
      </svg>

      {/* Cloud Layer 2 - Mid background */}
      <svg
        className="absolute bottom-0 w-full opacity-50"
        style={{
          transform: `translateX(${cloud2Offset * 0.5}px)`,
          height: '50%',
        }}
        viewBox="0 0 1200 500"
        preserveAspectRatio="none"
      >
        <path
          d="M50,250 Q100,200 150,250 T250,250 Q300,200 350,250 T450,250 Q500,200 550,250 T650,250 Q700,200 750,250 T850,250 Q900,200 950,250 T1050,250 Q1100,200 1150,250"
          fill="white"
          opacity="0.7"
        />
      </svg>

      {/* Cloud Layer 3 - Foreground */}
      <svg
        className="absolute bottom-0 w-full opacity-60"
        style={{
          transform: `translateX(${-cloud3Offset * 0.3}px)`,
          height: '60%',
        }}
        viewBox="0 0 1200 600"
        preserveAspectRatio="none"
      >
        <path
          d="M0,300 Q80,250 160,300 T320,300 Q400,250 480,300 T640,300 Q720,250 800,300 T960,300 Q1040,250 1120,300 L1200,300 L1200,600 L0,600 Z"
          fill="white"
          opacity="0.8"
        />
      </svg>

      {/* Airplane - Starts at center, moves up, behind text */}
      <div
        className="absolute"
        style={{
          transform: `translate(-50%, 0) rotate(-5deg) scale(${airplaneScale})`,
          width: '100%',
          maxWidth: '900px',
          height: 'auto',
          left: '50%',
          top: `${airplaneY}%`,
          willChange: 'transform',
          zIndex: 1, // Behind text (text is z-10 in ParallaxScene)
          pointerEvents: 'none',
          opacity: 0.4, // Lower opacity
        }}
      >
        <img
          src="/avion.png"
          alt="Avión"
          className="w-full h-full object-contain"
          style={{
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))',
            maxWidth: '100%',
            height: 'auto',
          }}
          loading="eager"
        />
      </div>
    </div>
  )
}

