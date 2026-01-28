'use client'

import Image from 'next/image'

interface CycleProps {
  number?: string
  leftText?: string
  rightText?: string
  overlayText?: string
  image: string
  imageMobile?: string
  imageAlt?: string
}

export const Cycle: React.FC<CycleProps> = ({
  number = '3',
  leftText = 'Полный цикл',
  rightText = 'Полный',
  overlayText = 'акцент на важном',
  image,
  imageMobile,
  imageAlt = '',
}) => {
  return (
    <section className="cycle cycle--object">
      <div className="cycle__container">
        <div className="cycle__text-row">
          <p className="cycle__text cycle__text--left">{leftText}</p>
          <p className="cycle__text cycle__text--right">{rightText}</p>
        </div>

        <div className="cycle__bar">
          <div className="cycle__line cycle__line--left"></div>
          <div className="cycle__number-wrapper">
            <span className="cycle__number">{number}</span>
          </div>
          <div className="cycle__line cycle__line--right"></div>
        </div>
      </div>

      <div className="cycle__image-container">
        <Image
          src={image}
          alt={imageAlt}
          className="cycle__image-object"
          width={1440}
          height={451}
          loading="lazy"
        />

        {overlayText && (
          <div className="cycle__overlay">
            <div className="cycle__text-wrapper">
              <p className="cycle__text-white">{overlayText}</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default Cycle
