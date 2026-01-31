import { getPayload } from 'payload'
import config from '@payload-config'
import type { PhotoPage, Media } from '@/payload-types'
import type { Locale } from '@/i18n/config'

export interface PhotoPageData {
  title: string
  heroTitle: string
  heroDescription: string
  heroImage: string
  heroImageAlt: string
  photos: Array<{
    type: 'image' | 'video'
    src: string
    alt: string
  }>
  showCycle: boolean
  cycleNumber?: string
  cycleLeftText?: string
  cycleRightText?: string
  cycleOverlayText?: string
  cycleImage?: string
  cycleImageMobile?: string
  whereTitle: string
  whereItems: Array<{
    icon: string
    title: string
    description: string
  }>
}

function getMediaUrl(media: Media | number | string | null | undefined): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  if (typeof media === 'number') return '' // ID without populated data
  return media.url || ''
}

export async function getPhotoPage(slug: string, locale: Locale = 'ru'): Promise<PhotoPageData | null> {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'photo-pages',
      locale,
      where: {
        slug: {
          equals: slug,
        },
        _status: {
          equals: 'published',
        },
      },
      limit: 1,
    })

    if (!result.docs || result.docs.length === 0) {
      return null
    }

    const page = result.docs[0] as PhotoPage

    return {
      title: page.title,
      heroTitle: page.heroTitle,
      heroDescription: page.heroDescription,
      heroImage: getMediaUrl(page.heroImage),
      heroImageAlt: (page.heroImage as Media)?.alt || page.heroTitle,
      photos: (page.photos || []).map((photo) => ({
        type: photo.type || 'image',
        src: photo.type === 'video' ? getMediaUrl(photo.video) : getMediaUrl(photo.image),
        alt: photo.alt || '',
      })),
      showCycle: page.showCycle || false,
      cycleNumber: page.cycleNumber || '3',
      cycleLeftText: page.cycleLeftText || 'Полный цикл',
      cycleRightText: page.cycleRightText || 'Полный',
      cycleOverlayText: page.cycleOverlayText || '',
      cycleImage: getMediaUrl(page.cycleImage),
      cycleImageMobile: getMediaUrl(page.cycleImageMobile),
      whereTitle: page.whereTitle || 'где это используется?',
      whereItems: (page.whereItems || []).map((item) => ({
        icon: getMediaUrl(item.icon),
        title: item.title,
        description: item.description,
      })),
    }
  } catch (error) {
    console.error(`Error fetching photo page with slug "${slug}":`, error)
    return null
  }
}
