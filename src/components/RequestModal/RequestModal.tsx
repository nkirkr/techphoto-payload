'use client'

import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { useModal } from './ModalContext'
import { PhoneInput, PhoneInputRef } from '@/components/PhoneInput'

interface RequestModalProps {
  title?: string
  subtitle?: string
  namePlaceholder?: string
  phonePlaceholder?: string
  emailPlaceholder?: string
  submitButtonText?: string
  agreementText?: string
  privacyPolicyUrl?: string
  privacyPolicyLinkText?: string
  consentUrl?: string
  consentLinkText?: string
  andText?: string
  finalText?: string
  successTitle?: string
  successText?: string
}

export const RequestModal: React.FC<RequestModalProps> = ({
  title = 'оставьте заявку',
  subtitle = 'мы свяжемся с вами в ближайшее время',
  namePlaceholder = 'имя',
  phonePlaceholder = 'телефон',
  emailPlaceholder = 'email',
  submitButtonText = 'отправить',
  agreementText = 'Я подтверждаю, что ознакомлен(а) с',
  privacyPolicyUrl = 'https://x-potok.net/policy',
  privacyPolicyLinkText = 'Политикой конфиденциальности',
  consentUrl = 'https://x-potok.net/soglasie-na-obrabotku-dannyh',
  consentLinkText = 'Согласием на обработку персональных данных',
  andText = 'и',
  finalText = ', и выражаю своё согласие на обработку моих персональных данных.',
  successTitle = 'Спасибо!',
  successText = 'Ваша заявка отправлена. Мы свяжемся с вами в ближайшее время.',
}) => {
  const { isOpen, closeModal } = useModal()
  const phoneInputRef = useRef<PhoneInputRef>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    agreement: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal()
      }
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, closeModal])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setFormData({ name: '', phone: '', email: '', agreement: false })
        setIsSuccess(false)
        setError(null)
      }, 300)
    }
  }, [isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
    setError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    // Валидация телефона
    if (phoneInputRef.current && !phoneInputRef.current.isValidNumber()) {
      // Показываем ошибку на поле телефона
      const phoneInput = document.querySelector('.modal__input[name="phone"]') as HTMLInputElement
      if (phoneInput) {
        phoneInput.classList.add('error')
        phoneInput.focus()
      }
      setError('Пожалуйста, введите корректный номер телефона')
      return
    }
    
    setIsSubmitting(true)

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
          source: 'modal',
        }),
      })

      if (!response.ok) {
        throw new Error('Ошибка отправки')
      }

      setIsSuccess(true)
      // Очищаем форму
      setFormData({ name: '', phone: '', email: '', agreement: false })
      const phoneInput = document.querySelector('.modal__input[name="phone"]') as HTMLInputElement
      if (phoneInput) {
        phoneInput.value = ''
        phoneInput.classList.remove('error', 'valid')
      }
    } catch (err) {
      setError('Произошла ошибка. Попробуйте позже.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeModal()
    }
  }

  return (
    <div
      className={`modal ${isOpen ? 'is-open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      aria-hidden={!isOpen}
    >
      <div className="modal__overlay" onClick={handleOverlayClick} />
      <div className="modal__content">
        <button
          className="modal__close"
          type="button"
          aria-label="Закрыть модальное окно"
          onClick={closeModal}
        >
          <Image src="/svgicons/home/cross.svg" alt="" width={18} height={18} />
        </button>

        {isSuccess ? (
          <div className="modal__success">
            <h2 className="modal__success-title">{successTitle}</h2>
            <p className="modal__success-text">{successText}</p>
          </div>
        ) : (
          <>
            <h2 className="modal__title" id="modalTitle">
              {title}
            </h2>
            <p className="modal__subtitle">{subtitle}</p>

            <form className="modal__form" onSubmit={handleSubmit} noValidate>
              <div className="modal__field">
                <input
                  type="text"
                  className="modal__input"
                  name="name"
                  placeholder={namePlaceholder}
                  required
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="modal__field">
                <PhoneInput
                  ref={phoneInputRef}
                  className="modal__input"
                  name="phone"
                  placeholder={phonePlaceholder}
                  required
                  value={formData.phone}
                  onChange={(phone) => {
                    setFormData((prev) => ({ ...prev, phone }))
                    setError(null)
                  }}
                />
              </div>

              <div className="modal__field">
                <input
                  type="email"
                  className="modal__input"
                  name="email"
                  placeholder={emailPlaceholder}
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="modal__checkbox">
                <label className="modal__checkbox-label">
                  <input
                    type="checkbox"
                    className="modal__checkbox-input"
                    name="agreement"
                    required
                    checked={formData.agreement}
                    onChange={handleChange}
                  />
                  <span className="modal__checkbox-box"></span>
                  <span className="modal__checkbox-text">
                    {agreementText}{' '}
                    <a
                      href={consentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal__checkbox-link"
                    >
                      {consentLinkText}
                    </a>{' '}
                    {andText}{' '}
                    <a
                      href={privacyPolicyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="modal__checkbox-link"
                    >
                      {privacyPolicyLinkText}
                    </a>
                    {finalText}
                  </span>
                </label>
              </div>

              {error && <p className="modal__error">{error}</p>}

              <button type="submit" className="modal__submit" disabled={isSubmitting}>
                {isSubmitting ? 'Отправка...' : submitButtonText}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default RequestModal
