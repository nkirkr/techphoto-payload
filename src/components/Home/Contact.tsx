'use client'

import Image from 'next/image'
import { useState, useRef } from 'react'
import { PhoneInput, PhoneInputRef } from '@/components/PhoneInput'

interface ContactProps {
  title?: string
  phoneLabel?: string
  emailLabel?: string
  phone?: string
  email?: string
  telegramUrl?: string
  whatsappUrl?: string
  privacyPolicyUrl?: string
  formNamePlaceholder?: string
  formEmailPlaceholder?: string
  formPhonePlaceholder?: string
  formSubmitButtonText?: string
  privacyPolicyText?: string
  privacyPolicyLinkText?: string
}

export const Contact: React.FC<ContactProps> = ({
  title = 'контакты',
  phoneLabel = 'телефон:',
  emailLabel = 'e-mail:',
  phone = '+7 (923) 337-01-09',
  email = 'tehphoto@mail.ru',
  telegramUrl = '#',
  whatsappUrl = '#',
  privacyPolicyUrl = 'https://x-potok.net/policy',
  formNamePlaceholder = 'имя',
  formEmailPlaceholder = 'email',
  formPhonePlaceholder = 'тел',
  formSubmitButtonText = 'оставить заявку',
  privacyPolicyText = 'Нажимая на кнопку, вы даете согласие на обработку своих персональных данных и соглашаетесь с',
  privacyPolicyLinkText = 'политикой конфиденциальности',
}) => {
  const phoneInputRef = useRef<PhoneInputRef>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    agreement: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Валидация телефона
    if (phoneInputRef.current && !phoneInputRef.current.isValidNumber()) {
      // Показываем ошибку на поле телефона
      const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement
      if (phoneInput) {
        phoneInput.classList.add('error')
        phoneInput.focus()
      }
      return
    }
    
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // Получаем полный номер с кодом страны
      const fullPhoneNumber = phoneInputRef.current?.getNumber() || formData.phone
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          phone: fullPhoneNumber,
          email: formData.email,
          source: 'contact-form',
        }),
      })

      if (response.ok) {
        setSubmitStatus('success')
        setFormData({ name: '', email: '', phone: '', agreement: false })
        // Очищаем поле телефона
        const phoneInput = document.querySelector('input[name="phone"]') as HTMLInputElement
        if (phoneInput) {
          phoneInput.value = ''
          phoneInput.classList.remove('error', 'valid')
        }
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setSubmitStatus('idle')
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
            <span className="request__contact-label">{phoneLabel}</span>
            <a href={`tel:${phone.replace(/\D/g, '')}`} className="request__contact-value">
              {phone}
            </a>
          </div>

          <div className="request__contact">
            <span className="request__contact-label">{emailLabel}</span>
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
                placeholder={formNamePlaceholder}
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
                placeholder={formEmailPlaceholder}
                required
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="request__field">
              <PhoneInput
                ref={phoneInputRef}
                className="request__input"
                name="phone"
                placeholder={formPhonePlaceholder}
                required
                value={formData.phone}
                onChange={(phone) => {
                  setFormData((prev) => ({ ...prev, phone }))
                  setSubmitStatus('idle')
                }}
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
                  {privacyPolicyText}{' '}
                  <a
                    href={privacyPolicyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="request__checkbox-link"
                  >
                    {privacyPolicyLinkText}
                  </a>
                  .
                </span>
              </label>
            </div>

            {submitStatus === 'success' && (
              <p className="request__success">Спасибо! Ваша заявка отправлена.</p>
            )}
            {submitStatus === 'error' && (
              <p className="request__error">Произошла ошибка. Попробуйте позже.</p>
            )}

            <button type="submit" className="request__submit" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Отправка...' : formSubmitButtonText}</span>
              <span className="request__submit-circle">
              <svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.4932 2.3803C20.5418 1.5533 19.9108 0.843459 19.0838 0.794823L5.60712 0.00226912C4.78012 -0.0463659 4.07028 0.584622 4.02165 1.41162C3.97301 2.23862 4.604 2.94846 5.431 2.9971L17.4103 3.70159L16.7058 15.6809C16.6572 16.5079 17.2882 17.2177 18.1152 17.2664C18.9422 17.315 19.652 16.684 19.7006 15.857L20.4932 2.3803ZM0.996182 18.2923L1.99274 19.4134L19.9923 3.41334L18.9958 2.29224L17.9992 1.17114L-0.000379955 17.1712L0.996182 18.2923Z" fill="#1E1E1E" />
              </svg>
              </span>
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default Contact
