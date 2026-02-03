import { getPayload } from 'payload'
import config from '@payload-config'
import type { Locale } from '@/i18n/config'

export interface ContactsData {
  title: string
  phoneLabel: string
  emailLabel: string
  phone: string
  email: string
  telegramUrl: string
  whatsappUrl: string
  formNamePlaceholder: string
  formEmailPlaceholder: string
  formPhonePlaceholder: string
  formSubmitButtonText: string
  privacyPolicyText: string
  modalPrivacyPolicyText: string
  modalAndText: string
  modalFinalText: string
  destinationEmail: string
  modalTitle: string
  modalSubtitle: string
  modalSubmitButtonText: string
}

export async function getContacts(locale: Locale = 'ru'): Promise<ContactsData> {
  try {
    const payload = await getPayload({ config })

    const contacts = await payload.findGlobal({
      slug: 'contacts',
      locale,
    })

    return {
      title: contacts.title || 'контакты',
      phoneLabel: contacts.phoneLabel || 'телефон:',
      emailLabel: contacts.emailLabel || 'e-mail:',
      phone: contacts.phone || '+7 (923) 337-01-09',
      email: contacts.email || 'tehphoto@mail.ru',
      telegramUrl: contacts.telegramUrl || '#',
      whatsappUrl: contacts.whatsappUrl || '#',
      formNamePlaceholder: contacts.formNamePlaceholder || 'имя',
      formEmailPlaceholder: contacts.formEmailPlaceholder || 'email',
      formPhonePlaceholder: contacts.formPhonePlaceholder || 'тел',
      formSubmitButtonText: contacts.formSubmitButtonText || 'оставить заявку',
      privacyPolicyText: contacts.privacyPolicyText || 'Нажимая на кнопку, вы даете согласие на обработку своих персональных данных и соглашаетесь с',
      modalPrivacyPolicyText: contacts.modalPrivacyPolicyText || 'Я подтверждаю, что ознакомлен(а) с',
      modalAndText: contacts.modalAndText || 'и',
      modalFinalText: contacts.modalFinalText || ', и выражаю своё согласие на обработку моих персональных данных.',
      destinationEmail: contacts.destinationEmail || 'tehphoto@mail.ru',
      modalTitle: contacts.modalTitle || 'оставьте заявку',
      modalSubtitle: contacts.modalSubtitle || 'мы свяжемся с вами в ближайшее время',
      modalSubmitButtonText: contacts.modalSubmitButtonText || 'отправить',
    }
  } catch (error) {
    console.error('Error fetching contacts:', error)
    return {
      title: 'контакты',
      phoneLabel: 'телефон:',
      emailLabel: 'e-mail:',
      phone: '+7 (923) 337-01-09',
      email: 'tehphoto@mail.ru',
      telegramUrl: '#',
      whatsappUrl: '#',
      formNamePlaceholder: 'имя',
      formEmailPlaceholder: 'email',
      formPhonePlaceholder: 'тел',
      formSubmitButtonText: 'оставить заявку',
      privacyPolicyText: 'Нажимая на кнопку, вы даете согласие на обработку своих персональных данных и соглашаетесь с',
      modalPrivacyPolicyText: 'Я подтверждаю, что ознакомлен(а) с',
      modalAndText: 'и',
      modalFinalText: ', и выражаю своё согласие на обработку моих персональных данных.',
      destinationEmail: 'tehphoto@mail.ru',
      modalTitle: 'оставьте заявку',
      modalSubtitle: 'мы свяжемся с вами в ближайшее время',
      modalSubmitButtonText: 'отправить',
    }
  }
}
