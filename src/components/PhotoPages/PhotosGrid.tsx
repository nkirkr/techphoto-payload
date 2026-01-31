'use client'

import Image from 'next/image'

interface PhotoItem {
  type: 'image' | 'video'
  src: string
  alt?: string
  /** Optional layout class for special styling (portrait, video, video-wide, landscape) */
  layoutClass?: 'portrait' | 'video' | 'video-wide' | 'landscape'
}

interface PhotosGridProps {
  photos: PhotoItem[]
  variant?: 'object' | 'machine' | 'macro' | 'portrait' | '3d'
}

export const PhotosGrid: React.FC<PhotosGridProps> = ({
  photos,
  variant = 'object',
}) => {
  const getItemClassName = (photo: PhotoItem, index: number) => {
    const baseClass = 'photos__item'
    const indexClass = `${baseClass}--${index + 1}`
    
    // For portrait variant, use layout classes if provided
    if (variant === 'portrait' && photo.layoutClass) {
      return `${baseClass} ${baseClass}--${photo.layoutClass}`
    }
    
    return `${baseClass} ${indexClass}`
  }

  return (
    <section className={`photos photos--${variant}`}>
      <div className="photos__grid">
        {photos.map((photo, index) => (
          <article key={index} className={getItemClassName(photo, index)}>
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
