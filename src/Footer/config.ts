import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: {
    ru: 'Подвал сайта',
    en: 'Footer',
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
      name: 'description',
      label: {
        ru: 'Описание',
        en: 'Description',
      },
      type: 'textarea',
      localized: true,
      defaultValue: 'студия промышленной фото и видеосъёмки, создающая контент для производственных предприятий, инженерных и технологических компаний',
    },
    {
      name: 'navTitle',
      label: {
        ru: 'Заголовок "Навигация"',
        en: 'Navigation Title',
      },
      type: 'text',
      localized: true,
      defaultValue: 'навигация',
    },
    {
      name: 'contactsTitle',
      label: {
        ru: 'Заголовок "Контакты"',
        en: 'Contacts Title',
      },
      type: 'text',
      localized: true,
      defaultValue: 'контакты',
    },
    {
      name: 'docsTitle',
      label: {
        ru: 'Заголовок "Документация"',
        en: 'Documentation Title',
      },
      type: 'text',
      localized: true,
      defaultValue: 'документация',
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
