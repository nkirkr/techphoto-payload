import { getPayload } from 'payload'
import config from '@payload-config'
import type { Locale } from '@/i18n/config'

export interface DocumentsData {
  privacyPolicy: {
    title: string
    url: string
  }
  termsOfService: {
    title: string
    url: string
  }
}

export async function getDocuments(locale: Locale = 'ru'): Promise<DocumentsData> {
  const payload = await getPayload({ config })

  const documents = await payload.findGlobal({
    slug: 'documents',
    locale,
  })

  return {
    privacyPolicy: {
      title: documents.privacyPolicy?.title || 'политика конфиденциальности',
      url: documents.privacyPolicy?.url || '#',
    },
    termsOfService: {
      title: documents.termsOfService?.title || 'пользовательское соглашение',
      url: documents.termsOfService?.url || '#',
    },
  }
}
