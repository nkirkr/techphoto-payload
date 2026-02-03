'use client'

interface DetailsProps {
  text?: string
  backgroundImage?: string
  backgroundImageTablet?: string
  backgroundImageMobile?: string
}

export const Details: React.FC<DetailsProps> = ({
  text = 'детали, формирующие образ',
  backgroundImage = '/home/camera.png',
  backgroundImageTablet,
  backgroundImageMobile = '/object/camera-mob.png',
}) => {
  return (
    <section
      className="details"
      style={
        {
          '--bg-desktop': `url(${backgroundImage})`,
          '--bg-tablet': backgroundImageTablet ? `url(${backgroundImageTablet})` : `url(${backgroundImage})`,
          '--bg-mobile': `url(${backgroundImageMobile})`,
          backgroundImage: `var(--bg-desktop)`,
        } as React.CSSProperties
      }
    >
      <div className="details__content">
        <p className="details__text">{text}</p>
      </div>
    </section>
  )
}

export default Details
