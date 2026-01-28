'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

interface NavLink {
  label: string
  href: string
}

interface HeaderProps {
  logoLight?: string
  logoDark?: string
  navLinks?: NavLink[]
  mobileNavLinks?: NavLink[]
  telegramUrl?: string
  whatsappUrl?: string
}

const defaultNavLinks: NavLink[] = [
  { label: 'главная', href: '/' },
  { label: 'портфолио', href: '/#portfolio' },
  { label: 'написать нам', href: '/#contact' },
]

const defaultMobileNavLinks: NavLink[] = [
  { label: 'главная', href: '/' },
  { label: 'предметная съемка', href: '/object' },
  { label: 'станки', href: '/machine' },
  { label: 'макро', href: '/macro' },
  { label: 'персонал', href: '/portraits' },
  { label: '3D', href: '/3d' },
  { label: 'контакты', href: '/#contact' },
]

export const Header: React.FC<HeaderProps> = ({
  logoLight = '/logo-white.svg',
  logoDark = '/logo-black.svg',
  navLinks = defaultNavLinks,
  mobileNavLinks = defaultMobileNavLinks,
  telegramUrl = '#',
  whatsappUrl = '#',
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    document.body.classList.toggle('menu-open')
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    document.body.classList.remove('menu-open')
  }

  return (
    <>
      <header className="header">
        <div className="container header__content">
          <div className="header__left">
            <button type="button" className="header__lang-mobile" data-lang="eng">
              eng
            </button>
            <Link href="/" className="header__logo" onClick={closeMenu}>
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
              <Link key={index} href={link.href} className="nav__link">
                {link.label}
              </Link>
            ))}
            <button type="button" className="nav__link nav__lang" data-lang="eng">
              eng
            </button>
          </nav>
          <button
            className="header__burger"
            type="button"
            aria-label="Открыть меню"
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
              href={link.href}
              className={`mobile-menu__link ${link.href === '/' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {link.label}
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
