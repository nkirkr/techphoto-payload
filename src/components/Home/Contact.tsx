'use client'

import Image from 'next/image'
import { useState } from 'react'

interface ContactProps {
  title?: string
  phone?: string
  email?: string
  telegramUrl?: string
  whatsappUrl?: string
  privacyPolicyUrl?: string
}

export const Contact: React.FC<ContactProps> = ({
  title = 'контакты',
  phone = '+7 (923) 337-01-09',
  email = 'tehphoto@mail.ru',
  telegramUrl = '#',
  whatsappUrl = '#',
  privacyPolicyUrl = 'https://x-potok.net/policy',
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    agreement: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  return (
    <section className="request container" id="contact">
      <div className="request__content">
        <div className="request__left">
          <h2 className="request__title request__title--desktop">{title}</h2>

          <div className="request__header">
            <h2 className="request__title request__title--mobile">{title}</h2>
            <div className="request__socials request__socials--mobile">
              <a href={whatsappUrl} className="request__social" aria-label="WhatsApp">
                <Image src="/svgicons/all/wp.svg" alt="WhatsApp" width={31} height={31} />
              </a>
              <a href={telegramUrl} className="request__social" aria-label="Telegram">
                <Image src="/svgicons/all/tg.svg" alt="Telegram" width={31} height={31} />
              </a>
            </div>
          </div>

          <div className="request__contact">
            <span className="request__contact-label">телефон:</span>
            <a href={`tel:${phone.replace(/\D/g, '')}`} className="request__contact-value">
              {phone}
            </a>
          </div>

          <div className="request__contact">
            <span className="request__contact-label">e-mail:</span>
            <a
              href={`mailto:${email}`}
              className="request__contact-value request__contact-value--email"
            >
              {email}
            </a>
          </div>

          <div className="request__socials request__socials--desktop">
            <a href={whatsappUrl} className="request__social" target="_blank" aria-label="WhatsApp">
              <Image src="/svgicons/all/wp.svg" alt="WhatsApp" width={31} height={31} />
            </a>
            <a href={telegramUrl} className="request__social" target="_blank" aria-label="Telegram">
              <Image src="/svgicons/all/tg.svg" alt="Telegram" width={31} height={31} />
            </a>
          </div>
        </div>

        <div className="request__right">
          <form className="request__form" onSubmit={handleSubmit}>
            <div className="request__field">
              <input
                type="text"
                className="request__input"
                name="name"
                placeholder="имя"
                required
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="request__field">
              <input
                type="email"
                className="request__input"
                name="email"
                placeholder="email"
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="request__field">
              <input
                type="tel"
                className="request__input"
                name="phone"
                placeholder="тел"
                required
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className="request__checkbox">
              <label className="request__checkbox-label">
                <input
                  type="checkbox"
                  className="request__checkbox-input"
                  name="agreement"
                  required
                  checked={formData.agreement}
                  onChange={handleChange}
                />
                <span className="request__checkbox-box"></span>
                <span className="request__checkbox-text">
                  Нажимая на кнопку, вы даете согласие на обработку
                  <br />
                  своих персональных данных и соглашаетесь
                  <br />с{' '}
                  <a
                    href={privacyPolicyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="request__checkbox-link"
                  >
                    политикой конфиденциальности
                  </a>
                  .
                </span>
              </label>
            </div>

            <button type="submit" className="request__submit">
              <span>оставить заявку</span>
              <span className="request__submit-circle">
                <Image src="/svgicons/all/arrow-hero.svg" alt="" width={37} height={37} />
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
