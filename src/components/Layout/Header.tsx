'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { type Locale, locales, localeLabels } from '@/i18n/config'

interface NavLink {
  label: Record<Locale, string>
  href: string
}

interface HeaderProps {
  locale?: Locale
  logoLight?: string
  logoDark?: string
  navLinks?: NavLink[]
  mobileNavLinks?: NavLink[]
  telegramUrl?: string
  whatsappUrl?: string
}

const defaultNavLinks: NavLink[] = [
  { label: { ru: 'главная', en: 'home' }, href: '/' },
  { label: { ru: 'портфолио', en: 'portfolio' }, href: '/#portfolio' },
  { label: { ru: 'написать нам', en: 'contact us' }, href: '/#contact' },
]

const defaultMobileNavLinks: NavLink[] = [
  { label: { ru: 'главная', en: 'home' }, href: '/' },
  { label: { ru: 'предметная съемка', en: 'product photo' }, href: '/object' },
  { label: { ru: 'станки', en: 'machines' }, href: '/machine' },
  { label: { ru: 'макро', en: 'macro' }, href: '/macro' },
  { label: { ru: 'персонал', en: 'staff' }, href: '/portraits' },
  { label: { ru: '3D', en: '3D' }, href: '/3d' },
  { label: { ru: 'контакты', en: 'contacts' }, href: '/#contact' },
]

export const Header: React.FC<HeaderProps> = ({
  locale = 'ru',
  logoLight = '/logo-white.svg',
  logoDark = '/logo-black.svg',
  navLinks = defaultNavLinks,
  mobileNavLinks = defaultMobileNavLinks,
  telegramUrl = '#',
  whatsappUrl = '#',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    document.body.classList.toggle('menu-open')
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    document.body.classList.remove('menu-open')
  }

  const switchLocale = (newLocale: Locale) => {
    // Получаем чистый путь без локали
    let cleanPath = pathname
    if (pathname.startsWith('/en/')) {
      cleanPath = pathname.replace('/en', '')
    } else if (pathname === '/en') {
      cleanPath = '/'
    }
    // Для /ru путей (не должно быть, но на всякий случай)
    if (pathname.startsWith('/ru/')) {
      cleanPath = pathname.replace('/ru', '')
    } else if (pathname === '/ru') {
      cleanPath = '/'
    }
    
    // Формируем новый путь
    let newPath: string
    if (newLocale === 'ru') {
      newPath = cleanPath // Русский без префикса
    } else {
      newPath = `/en${cleanPath}` // Английский с /en
    }
    
    // Сохраняем выбор в cookie
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=31536000`
    
    router.push(newPath)
  }

  const otherLocale = locale === 'ru' ? 'en' : 'ru'

  // Добавляем локаль к ссылкам
  // Русский - без префикса, английский - с /en
  const getLocalizedHref = (href: string) => {
    if (locale === 'ru') {
      return href // Русский без префикса
    }
    // Английский с /en
    if (href === '/') {
      return '/en'
    }
    return `/en${href}`
  }

  return (
    <>
      <header className="header">
        <div className="container header__content">
          <div className="header__left">
            <button
              type="button"
              className="header__lang-mobile"
              onClick={() => switchLocale(otherLocale)}
            >
              {localeLabels[otherLocale]}
            </button>
            <Link href={getLocalizedHref('/')} className="header__logo" onClick={closeMenu}>
              <Image
                src={logoDark}
                alt="Техфото"
                className="header__logo-dark"
                width={180}
                height={20}
              />
              <Image
                src={logoLight}
                alt="Техфото"
                className="header__logo-light"
                width={180}
                height={20}
              />
            </Link>
          </div>
          <nav className="header__nav nav">
            {navLinks.map((link, index) => (
              <Link key={index} href={getLocalizedHref(link.href)} className="nav__link">
                {link.label[locale]}
              </Link>
            ))}
            <button
              type="button"
              className="nav__link nav__lang"
              onClick={() => switchLocale(otherLocale)}
            >
              {localeLabels[otherLocale]}
            </button>
          </nav>
          <button
            className="header__burger"
            type="button"
            aria-label={locale === 'ru' ? 'Открыть меню' : 'Open menu'}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div className="mobile-menu-overlay" onClick={closeMenu}></div>
      <div className="mobile-menu">
        <nav className="mobile-menu__nav">
          {mobileNavLinks.map((link, index) => (
            <Link
              key={index}
              href={getLocalizedHref(link.href)}
              className={`mobile-menu__link ${link.href === '/' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {link.label[locale]}
            </Link>
          ))}
        </nav>
        <div className="mobile-menu__socials">
          <a href={telegramUrl} className="mobile-menu__social" aria-label="Telegram">
            <Image src="/svgicons/all/tg.svg" alt="Telegram" width={24} height={24} />
          </a>
          <a href={whatsappUrl} className="mobile-menu__social" aria-label="WhatsApp">
            <Image src="/svgicons/all/wp.svg" alt="WhatsApp" width={24} height={24} />
          </a>
        </div>
      </div>
    </>
  )
}

export default Header
