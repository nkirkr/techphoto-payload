'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

export const Preloader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [isFading, setIsFading] = useState(false)

  useEffect(() => {
    const startFading = () => {
      setIsFading(true)
      setTimeout(() => setIsVisible(false), 800)
    }

    const timer = setTimeout(startFading, 3000)
    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) return null

  return (
    <div className={`preloader ${isFading ? 'preloader--fading' : ''}`}>
      <div className="preloader__content">
        <Image
          src="/logo-white.svg"
          alt="ТЕХФОТО.РФ"
          className="preloader__logo"
          width={260}
          height={36}
          priority
        />
        <div className="preloader__spinner">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  )
}

export default Preloader
