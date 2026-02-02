import { getPayload } from 'payload'
import config from '@payload-config'
import type { Media } from '@/payload-types'
import type { Locale } from '@/i18n/config'

export interface HomePageData {
  // Hero
  heroSubtitle: string
  heroText: string
  heroButtonText: string
  heroPortfolioButtonText: string
  heroBackgroundImage?: string

  // What We Do
  whatWeDoText: string
  whatWeDoButtonText: string
  whatWeDoSectionTitle: string
  portfolioCards: Array<{
    title: string
    href: string
    backgroundImage: string
  }>
  features: Array<{
    title: string
    text: string
  }>

  // Details
  detailsText: string
  detailsBackgroundImage?: string
  detailsBackgroundImageTablet?: string
  detailsBackgroundImageMobile?: string

  // Steps
  stepsSubtitle: string
  stepsTitle: string
  steps: Array<{
    number: string
    title: string
    text: string
    isHighlighted?: boolean
  }>
}

function getMediaUrl(media: Media | number | string | null | undefined): string {
  if (!media) return ''
  if (typeof media === 'string') return media
  if (typeof media === 'number') return ''
  return media.url || ''
}

export async function getHomePage(locale: Locale = 'ru'): Promise<HomePageData | null> {
  try {
    const payload = await getPayload({ config })

    const homePage = await payload.findGlobal({
      slug: 'home-page',
      locale,
      depth: 1,
    })

    if (!homePage) {
      return null
    }

    return {
      // Hero
      heroSubtitle: (homePage as any).heroSubtitle || 'промышленная съемка',
      heroText:
        (homePage as any).heroText ||
        'Мы занимаемся профессиональной фото и видеосъемкой станков, производственных линий и заводов для каталогов, сайтов, маркетплейсов и технической документации.',
      heroButtonText: (homePage as any).heroButtonText || 'Оставьте заявку',
      heroPortfolioButtonText: (homePage as any).heroPortfolioButtonText || 'Посмотреть портфолио',
      heroBackgroundImage: getMediaUrl((homePage as any).heroBackgroundImage),

      // What We Do
      whatWeDoText:
        (homePage as any).whatWeDoText ||
        'Предметная съемка позволяет показать продукцию в максимально выгодном, чистом и понятном виде.',
      whatWeDoButtonText: (homePage as any).whatWeDoButtonText || 'Оставьте заявку',
      whatWeDoSectionTitle: (homePage as any).whatWeDoSectionTitle || 'Что мы предлагаем:',
      portfolioCards: ((homePage as any).portfolioCards || []).map((card: any) => ({
        title: card.title || '',
        href: card.href || '',
        backgroundImage: getMediaUrl(card.backgroundImage),
      })),
      features: ((homePage as any).features || []).map((feature: any) => ({
        title: feature.title || '',
        text: feature.text || '',
      })),

      // Details
      detailsText: (homePage as any).detailsText || 'детали, формирующие образ',
      detailsBackgroundImage: getMediaUrl((homePage as any).detailsBackgroundImage),
      detailsBackgroundImageTablet: getMediaUrl((homePage as any).detailsBackgroundImageTablet),
      detailsBackgroundImageMobile: getMediaUrl((homePage as any).detailsBackgroundImageMobile),

      // Steps
      stepsSubtitle: (homePage as any).stepsSubtitle || 'этапы работы',
      stepsTitle: (homePage as any).stepsTitle || 'как мы работаем?',
      steps: ((homePage as any).steps || []).map((step: any) => ({
        number: step.number || '',
        title: step.title || '',
        text: step.text || '',
        isHighlighted: step.isHighlighted || false,
      })),
    }
  } catch (error) {
    console.error('Error fetching home page:', error)
    return null
  }
}
