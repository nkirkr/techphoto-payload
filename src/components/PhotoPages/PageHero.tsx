'use client'

import Image from 'next/image'

interface PageHeroProps {
  title: string
  description: string
  heroImage: string
  heroImageAlt?: string
}

export const PageHero: React.FC<PageHeroProps> = ({
  title,
  description,
  heroImage,
  heroImageAlt = '',
}) => {
  return (
    <section className="photo-page__hero">
      <div className="container">
        <div className="photo-page__content">
          <h1 className="photo-page__title">{title}</h1>
          <p className="photo-page__description">{description}</p>
        </div>
      </div>
      <div className="photo-page__image-wrapper">
        <Image
          src={heroImage}
          alt={heroImageAlt || title}
          className="photo-page__image"
          width={1440}
          height={350}
          priority
        />
      </div>
    </section>
  )
}

export default PageHero
