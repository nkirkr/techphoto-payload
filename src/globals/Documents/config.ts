import type { GlobalConfig } from 'payload'
import { revalidateDocuments } from './hooks/revalidateDocuments'

export const Documents: GlobalConfig = {
  slug: 'documents',
  label: {
    ru: 'Документы',
    en: 'Documents',
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
      name: 'privacyPolicy',
      label: {
        ru: 'Политика конфиденциальности',
        en: 'Privacy Policy',
      },
      type: 'group',
      fields: [
        {
          name: 'title',
          label: {
            ru: 'Название ссылки',
            en: 'Link title',
          },
          type: 'text',
          defaultValue: 'политика конфиденциальности',
          localized: true,
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          defaultValue: 'https://x-potok.net/policy',
        },
      ],
    },
    {
      name: 'termsOfService',
      label: {
        ru: 'Пользовательское соглашение',
        en: 'Terms of Service',
      },
      type: 'group',
      fields: [
        {
          name: 'title',
          label: {
            ru: 'Название ссылки',
            en: 'Link title',
          },
          type: 'text',
          defaultValue: 'пользовательское соглашение',
          localized: true,
        },
        {
          name: 'url',
          label: 'URL',
          type: 'text',
          defaultValue: '#',
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateDocuments],
  },
}
