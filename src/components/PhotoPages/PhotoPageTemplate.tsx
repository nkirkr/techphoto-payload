'use client'

import { PageHero, PhotosGrid, WhereUsed, Cycle, ProductsSection } from '@/components/PhotoPages'
import type { PhotoPageData } from '@/utilities/getPhotoPage'

interface PhotoPageTemplateProps {
  data: PhotoPageData
  variant?: 'object' | 'machine' | 'macro' | 'portrait' | '3d'
}

export const PhotoPageTemplate: React.FC<PhotoPageTemplateProps> = ({
  data,
  variant = 'object',
}) => {
  return (
    <main>
      <PageHero
        title={data.heroTitle}
        description={data.heroDescription}
        heroImage={data.heroImage}
        heroImageAlt={data.heroImageAlt}
      />

      {/* Products section для варианта 3d */}
      {variant === '3d' && <ProductsSection />}

      {/* PhotosGrid для остальных вариантов */}
      {variant !== '3d' && data.photos && data.photos.length > 0 && (
        <PhotosGrid photos={data.photos} variant={variant} />
      )}

      {data.whereItems && data.whereItems.length > 0 && (
        <WhereUsed title={data.whereTitle} items={data.whereItems} />
      )}
      
      {data.showCycle && data.cycleImage && (
        <Cycle
          number={data.cycleNumber}
          leftText={data.cycleLeftText}
          rightText={data.cycleRightText}
          overlayText={data.cycleOverlayText}
          image={data.cycleImage}
          imageTablet={data.cycleImageTablet}
          imageMobile={data.cycleImageMobile}
        />
      )}
    </main>
  )
}

export default PhotoPageTemplate
