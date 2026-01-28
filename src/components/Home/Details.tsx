'use client'

interface DetailsProps {
  text?: string
  backgroundImage?: string
  backgroundImageMobile?: string
}

export const Details: React.FC<DetailsProps> = ({
  text = 'детали, формирующие образ',
  backgroundImage = '/home/camera.png',
  backgroundImageMobile = '/object/camera-mob.png',
}) => {
  return (
    <section
      className="details"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="details__content">
        <div className="details__circle details__circle--middle"></div>
        <div className="details__circle details__circle--large"></div>
        <p className="details__text">{text}</p>
      </div>
    </section>
  )
}

export default Details
