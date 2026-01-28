'use client'

import Image from 'next/image'

interface PhotoItem {
  type: 'image' | 'video'
  src: string
  alt?: string
}

interface PhotosGridProps {
  photos: PhotoItem[]
  variant?: 'object' | 'machine' | 'macro' | 'portrait' | '3d'
}

export const PhotosGrid: React.FC<PhotosGridProps> = ({
  photos,
  variant = 'object',
}) => {
  return (
    <section className={`photos photos--${variant}`}>
      <div className="photos__grid">
        {photos.map((photo, index) => (
          <article key={index} className={`photos__item photos__item--${index + 1}`}>
            {photo.type === 'video' ? (
              <video
                className="photos__video"
                autoPlay
                loop
                muted
                playsInline
                aria-label={photo.alt || 'Video'}
              >
                <source src={photo.src} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={photo.src}
                alt={photo.alt || ''}
                className="photos__image"
                width={500}
                height={280}
                loading="lazy"
              />
            )}
          </article>
        ))}
      </div>
    </section>
  )
}

export default PhotosGrid
