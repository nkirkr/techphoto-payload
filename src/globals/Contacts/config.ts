import type { GlobalConfig } from 'payload'
import { revalidateContacts } from './hooks/revalidateContacts'

export const Contacts: GlobalConfig = {
  slug: 'contacts',
  label: {
    ru: 'Контакты',
    en: 'Contacts',
  },
  access: {
    read: () => true,
  },
  admin: {
    group: {
      ru: 'Настройки сайта',
      en: 'Site Settings',
    },
  },
  fields: [
    {
      name: 'title',
      label: {
        ru: 'Заголовок',
        en: 'Title',
      },
      type: 'text',
      defaultValue: 'контакты',
      localized: true,
    },
    {
      name: 'phone',
      label: {
        ru: 'Телефон',
        en: 'Phone',
      },
      type: 'text',
      defaultValue: '+7 (923) 337-01-09',
    },
    {
      name: 'email',
      label: {
        ru: 'Email',
        en: 'Email',
      },
      type: 'email',
      defaultValue: 'tehphoto@mail.ru',
    },
    {
      name: 'telegramUrl',
      label: 'Telegram URL',
      type: 'text',
      defaultValue: '#',
    },
    {
      name: 'whatsappUrl',
      label: 'WhatsApp URL',
      type: 'text',
      defaultValue: '#',
    },
    {
      name: 'formNamePlaceholder',
      label: {
        ru: 'Плейсхолдер поля "Имя"',
        en: 'Name field placeholder',
      },
      type: 'text',
      defaultValue: 'имя',
      localized: true,
    },
    {
      name: 'formEmailPlaceholder',
      label: {
        ru: 'Плейсхолдер поля "Email"',
        en: 'Email field placeholder',
      },
      type: 'text',
      defaultValue: 'email',
      localized: true,
    },
    {
      name: 'formPhonePlaceholder',
      label: {
        ru: 'Плейсхолдер поля "Телефон"',
        en: 'Phone field placeholder',
      },
      type: 'text',
      defaultValue: 'тел',
      localized: true,
    },
    {
      name: 'formSubmitButtonText',
      label: {
        ru: 'Текст кнопки отправки',
        en: 'Submit button text',
      },
      type: 'text',
      defaultValue: 'оставить заявку',
      localized: true,
    },
    {
      name: 'destinationEmail',
      label: {
        ru: 'Email для получения заявок',
        en: 'Destination email for requests',
      },
      type: 'email',
      defaultValue: 'tehphoto@mail.ru',
      admin: {
        description: {
          ru: 'На этот email будут приходить заявки с сайта',
          en: 'Requests from the site will be sent to this email',
        },
      },
    },
    {
      name: 'modalTitle',
      label: {
        ru: 'Заголовок модального окна',
        en: 'Modal title',
      },
      type: 'text',
      defaultValue: 'оставьте заявку',
      localized: true,
    },
    {
      name: 'modalSubtitle',
      label: {
        ru: 'Подзаголовок модального окна',
        en: 'Modal subtitle',
      },
      type: 'text',
      defaultValue: 'мы свяжемся с вами в ближайшее время',
      localized: true,
    },
    {
      name: 'modalSubmitButtonText',
      label: {
        ru: 'Текст кнопки отправки в модалке',
        en: 'Modal submit button text',
      },
      type: 'text',
      defaultValue: 'отправить',
      localized: true,
    },
  ],
  hooks: {
    afterChange: [revalidateContacts],
  },
}
