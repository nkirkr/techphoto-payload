import type { Locale } from '@/i18n/config'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getFooter(locale: Locale) {
  const payload = await getPayload({ config: configPromise })

  const footer = await payload.findGlobal({
    slug: 'footer',
    locale,
  })

  return {
    description: footer.description || '',
    navTitle: footer.navTitle || 'навигация',
    contactsTitle: footer.contactsTitle || 'контакты',
    docsTitle: footer.docsTitle || 'документация',
  }
}
