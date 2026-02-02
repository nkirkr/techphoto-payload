import { getPayload } from 'payload'
import config from '@payload-config'
import type { PhotoPage, Media } from '@/payload-types'
import type { Locale } from '@/i18n/config'

export interface PortfolioCard {
  title: string
  href: string
  backgroundImage: string
  slug?: string // Для внутренней сортировки
}

function getMediaUrl(media: Media | number | string | null | undefined): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  if (typeof media === 'number') return ''
  return media.url || ''
}

export async function getPortfolioCards(locale: Locale = 'ru'): Promise<PortfolioCard[]> {
  try {
    const payload = await getPayload({ config })

    // Определяем порядок карточек
    const ORDER = ['object', 'machine', 'macro', 'portraits', '3d']

    // Получаем все опубликованные PhotoPages с текущей локалью
    const result = await payload.find({
      collection: 'photo-pages',
      locale, // Используем переданную локаль
      where: {
        _status: {
          equals: 'published',
        },
      },
      limit: 100,
    })

    if (!result.docs || result.docs.length === 0) {
      return []
    }

    // Маппим данные в формат карточек
    const cards = result.docs.map((page) => {
      const photoPage = page as PhotoPage
      return {
        title: photoPage.title || '',
        href: `/${photoPage.slug}`,
        backgroundImage: getMediaUrl(photoPage.cardImage) || '/home/default.png',
        slug: photoPage.slug,
      }
    })

    // Сортируем карточки по заданному порядку
    return cards.sort((a, b) => {
      const indexA = ORDER.indexOf(a.slug || '')
      const indexB = ORDER.indexOf(b.slug || '')
      
      // Если slug не в списке ORDER, помещаем в конец
      if (indexA === -1) return 1
      if (indexB === -1) return -1
      
      return indexA - indexB
    })
  } catch (error) {
    console.error('Error fetching portfolio cards:', error)
    return []
  }
}
