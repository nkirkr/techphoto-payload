'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useModal } from '@/components/RequestModal'

interface HeroProps {
  logo?: string
  subtitle?: string
  text?: string
  buttonText?: string
  portfolioButtonText?: string
  backgroundImage?: string
  backgroundImageMobile?: string
}

export const Hero: React.FC<HeroProps> = ({
  logo = '/logo-white.svg',
  subtitle = 'промышленная съемка',
  text = 'Мы занимаемся профессиональной фото и видеосъемкой станков, производственных линий и заводов для каталогов, сайтов, маркетплейсов и технической документации.',
  buttonText = 'Оставьте заявку',
  portfolioButtonText = 'Посмотреть портфолио',
  backgroundImage = '/home/hero.png',
  backgroundImageMobile = '/home/hero-mob.png',
}) => {
  const { openModal } = useModal()

  return (
    <section
      className="hero"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container">
        <div className="hero__top">
          <Image
            src={logo}
            alt="ТЕХФОТО.РФ"
            className="hero__logo"
            width={673}
            height={93}
          />
          <p className="hero__subtitle">{subtitle}</p>
        </div>
        <div className="hero__bottom">
          <p className="hero__text">{text}</p>
          <button className="hero__btn" type="button" onClick={openModal}>
            <span>{buttonText}</span>
            <span className="hero__btn-circle">
              <Image src="/svgicons/all/arrow-hero.svg" alt="Arrow" width={20} height={20} />
            </span>
          </button>
          <Link href="#portfolio" className="hero__btn hero__btn--secondary">
            <span>{portfolioButtonText}</span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Hero
