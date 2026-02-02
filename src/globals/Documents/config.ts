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
            ru: 'Название (именительный падеж)',
            en: 'Title (nominative)',
          },
          type: 'text',
          defaultValue: 'политика конфиденциальности',
          localized: true,
          admin: {
            description: {
              ru: 'Используется в футере и других местах',
              en: 'Used in footer and other places',
            },
          },
        },
        {
          name: 'titleInstrumental',
          label: {
            ru: 'Название (творительный падеж)',
            en: 'Title (instrumental)',
          },
          type: 'text',
          defaultValue: 'политикой конфиденциальности',
          localized: true,
          admin: {
            description: {
              ru: 'Используется в тексте согласия: "...соглашаетесь с [политикой конфиденциальности]"',
              en: 'Used in agreement text: "...agree with [privacy policy]"',
            },
          },
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
            ru: 'Название (именительный падеж)',
            en: 'Title (nominative)',
          },
          type: 'text',
          defaultValue: 'пользовательское соглашение',
          localized: true,
          admin: {
            description: {
              ru: 'Используется в футере',
              en: 'Used in footer',
            },
          },
        },
        {
          name: 'titleInstrumental',
          label: {
            ru: 'Название (творительный падеж)',
            en: 'Title (instrumental)',
          },
          type: 'text',
          defaultValue: 'пользовательским соглашением',
          localized: true,
          admin: {
            description: {
              ru: 'Используется в тексте согласия (если потребуется)',
              en: 'Used in agreement text (if needed)',
            },
          },
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
