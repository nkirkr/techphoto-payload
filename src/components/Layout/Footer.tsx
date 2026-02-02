'use client'

import Image from 'next/image'
import Link from 'next/link'

interface FooterLink {
  label: string
  href: string
}

interface FooterProps {
  logo?: string
  description?: string
  navTitle?: string
  contactsTitle?: string
  docsTitle?: string
  navLinks?: FooterLink[]
  phone?: string
  email?: string
  docLinks?: FooterLink[]
  copyright?: string
}

const defaultNavLinks: FooterLink[] = [
  { label: 'главная', href: '/' },
  { label: 'портфолио', href: '/#portfolio' },
  { label: 'контакты', href: '/#contact' },
]

const defaultDocLinks: FooterLink[] = [
  { label: 'политика конфиденциальности', href: '#' },
  { label: 'пользовательское соглашение', href: '#' },
  { label: 'обработка персональных данных', href: '#' },
]

export const Footer: React.FC<FooterProps> = ({
  logo = '/logo-black.svg',
  description = 'студия промышленной фото и видеосъёмки, создающая контент для производственных предприятий, инженерных и технологических компаний',
  navTitle = 'навигация',
  contactsTitle = 'контакты',
  docsTitle = 'документация',
  navLinks = defaultNavLinks,
  phone = '+7 (923) 337-01-09',
  email = 'tehphoto@mail.ru',
  docLinks = defaultDocLinks,
  copyright = '© 2026 «техфото.рф». Все права защищены. ПО зарегистрировано в Роспатенте.',
}) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__content">
          <div className="footer__left">
            <Image src={logo} alt="ТехФото.РФ" className="footer__logo" width={258} height={28} />
            <p className="footer__description">{description}</p>
          </div>

          <div className="footer__row">
            <nav className="footer__nav">
              <h3 className="footer__title">{navTitle}</h3>
              <ul className="footer__list">
                {navLinks.map((link, index) => (
                  <li key={index} className="footer__item">
                    <Link href={link.href} className="footer__link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="footer__contacts">
              <h3 className="footer__title">{contactsTitle}</h3>
              <ul className="footer__list">
                <li className="footer__item">
                  <a href={`tel:${phone.replace(/\D/g, '')}`} className="footer__link">
                    {phone}
                  </a>
                </li>
                <li className="footer__item">
                  <a href={`mailto:${email}`} className="footer__link">
                    {email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer__docs">
            <h3 className="footer__title">{docsTitle}</h3>
            <ul className="footer__list">
              {docLinks.map((link, index) => (
                <li key={index} className="footer__item">
                  <a href={link.href} className="footer__link" target="_blank" rel="noopener noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <div className="footer__line"></div>
          <p className="footer__copyright">
            {copyright.split('.').map((part, index, arr) => (
              <span key={index}>
                {part}
                {index < arr.length - 1 && '.'}
                {index === 0 && <br className="footer__copyright-br" />}
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
