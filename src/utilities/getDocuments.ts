import { getPayload } from 'payload'
import config from '@payload-config'
import type { Locale } from '@/i18n/config'

export interface DocumentsData {
  privacyPolicy: {
    title: string
    titleInstrumental: string
    url: string
  }
  termsOfService: {
    title: string
    titleInstrumental: string
    url: string
  }
  dataProcessingConsent: {
    title: string
    titleInstrumental: string
    url: string
  }
}

export async function getDocuments(locale: Locale = 'ru'): Promise<DocumentsData> {
  try {
    const payload = await getPayload({ config })

    const documents = await payload.findGlobal({
      slug: 'documents',
      locale,
    })

    return {
      privacyPolicy: {
        title: documents.privacyPolicy?.title || 'политика конфиденциальности',
        titleInstrumental: documents.privacyPolicy?.titleInstrumental || 'политикой конфиденциальности',
        url: documents.privacyPolicy?.url || '#',
      },
      termsOfService: {
        title: documents.termsOfService?.title || 'пользовательское соглашение',
        titleInstrumental: documents.termsOfService?.titleInstrumental || 'пользовательским соглашением',
        url: documents.termsOfService?.url || '#',
      },
      dataProcessingConsent: {
        title: documents.dataProcessingConsent?.title || 'согласие на обработку персональных данных',
        titleInstrumental: documents.dataProcessingConsent?.titleInstrumental || 'согласием на обработку персональных данных',
        url: documents.dataProcessingConsent?.url || 'https://x-potok.net/soglasie-na-obrabotku-dannyh',
      },
    }
  } catch (error) {
    // Return default values if database is not available during build
    console.warn('Failed to fetch documents from database, using defaults:', error)
    return {
      privacyPolicy: {
        title: 'политика конфиденциальности',
        titleInstrumental: 'политикой конфиденциальности',
        url: '#',
      },
      termsOfService: {
        title: 'пользовательское соглашение',
        titleInstrumental: 'пользовательским соглашением',
        url: '#',
      },
      dataProcessingConsent: {
        title: 'согласие на обработку персональных данных',
        titleInstrumental: 'согласием на обработку персональных данных',
        url: 'https://x-potok.net/soglasie-na-obrabotku-dannyh',
      },
    }
  }
}
