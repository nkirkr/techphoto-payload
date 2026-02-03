import type { Locale } from '@/i18n/config'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

interface FooterLink {
  label: string
  href: string
}

export async function getFooter(locale: Locale) {
  const payload = await getPayload({ config: configPromise })

  const footer = await payload.findGlobal({
    slug: 'footer',
    locale,
  }) as any

  // Преобразуем navItems из Payload формата в FooterLink[]
  const navLinks: FooterLink[] = (footer.navItems || []).map((item: any) => ({
    label: item.link?.label || '',
    href: item.link?.url || '#',
  }))

  return {
    description: footer.description || '',
    navTitle: footer.navTitle || 'навигация',
    contactsTitle: footer.contactsTitle || 'контакты',
    docsTitle: footer.docsTitle || 'документация',
    copyright: footer.copyright || '© 2026 «техфото.рф». Все права защищены. ПО зарегистрировано в Роспатенте.',
    navLinks,
  }
}
