import type { GlobalConfig } from 'payload'
import { revalidateHomePage } from './hooks/revalidateHomePage'

export const HomePage: GlobalConfig = {
  slug: 'home-page',
  label: {
    ru: 'Главная страница',
    en: 'Home Page',
  },
  access: {
    read: () => true,
  },
  admin: {
    group: {
      ru: 'Контент',
      en: 'Content',
    },
  },
  fields: [
    // Hero секция
    {
      name: 'heroSubtitle',
      label: {
        ru: 'Hero: Подзаголовок',
        en: 'Hero: Subtitle',
      },
      type: 'text',
      defaultValue: 'промышленная съемка',
      localized: true,
    },
    {
      name: 'heroText',
      label: {
        ru: 'Hero: Текст',
        en: 'Hero: Text',
      },
      type: 'textarea',
      defaultValue:
        'Мы занимаемся профессиональной фото и видеосъемкой станков, производственных линий и заводов для каталогов, сайтов, маркетплейсов и технической документации.',
      localized: true,
    },
    {
      name: 'heroButtonText',
      label: {
        ru: 'Hero: Текст кнопки',
        en: 'Hero: Button Text',
      },
      type: 'text',
      defaultValue: 'Оставьте заявку',
      localized: true,
    },
    {
      name: 'heroPortfolioButtonText',
      label: {
        ru: 'Hero: Текст кнопки портфолио',
        en: 'Hero: Portfolio Button Text',
      },
      type: 'text',
      defaultValue: 'Посмотреть портфолио',
      localized: true,
    },
    {
      name: 'heroBackgroundImage',
      label: {
        ru: 'Hero: Фоновое изображение',
        en: 'Hero: Background Image',
      },
      type: 'upload',
      relationTo: 'media',
    },
    // Секция "Что мы предлагаем"
    {
      name: 'whatWeDoText',
      label: {
        ru: 'Что мы предлагаем: Описание',
        en: 'What We Offer: Description',
      },
      type: 'textarea',
      defaultValue:
        'Предметная съемка позволяет показать продукцию в максимально выгодном, чистом и понятном виде. Мы снимаем станки, узлы, инструменты и комплектующие на нейтральном фоне — в студийных или производственных условиях.',
      localized: true,
    },
    {
      name: 'whatWeDoButtonText',
      label: {
        ru: 'Что мы предлагаем: Текст кнопки',
        en: 'What We Offer: Button Text',
      },
      type: 'text',
      defaultValue: 'Оставьте заявку',
      localized: true,
    },
    {
      name: 'whatWeDoSectionTitle',
      label: {
        ru: 'Что мы предлагаем: Заголовок',
        en: 'What We Offer: Title',
      },
      type: 'text',
      defaultValue: 'Что мы предлагаем:',
      localized: true,
    },
    {
      name: 'portfolioCards',
      label: {
        ru: 'Карточки портфолио',
        en: 'Portfolio Cards',
      },
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'title',
          label: {
            ru: 'Заголовок',
            en: 'Title',
          },
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'href',
          label: {
            ru: 'Ссылка',
            en: 'Link',
          },
          type: 'text',
          required: true,
        },
        {
          name: 'backgroundImage',
          label: {
            ru: 'Фоновое изображение',
            en: 'Background Image',
          },
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'features',
      label: {
        ru: 'Преимущества',
        en: 'Features',
      },
      type: 'array',
      minRows: 1,
      maxRows: 5,
      fields: [
        {
          name: 'title',
          label: {
            ru: 'Заголовок',
            en: 'Title',
          },
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'text',
          label: {
            ru: 'Текст',
            en: 'Text',
          },
          type: 'textarea',
          required: true,
          localized: true,
        },
      ],
    },
    // Секция "Детали"
    {
      name: 'detailsText',
      label: {
        ru: 'Детали: Текст',
        en: 'Details: Text',
      },
      type: 'text',
      defaultValue: 'детали, формирующие образ',
      localized: true,
    },
    {
      name: 'detailsBackgroundImage',
      label: {
        ru: 'Детали: Фоновое изображение',
        en: 'Details: Background Image',
      },
      type: 'upload',
      relationTo: 'media',
    },
    // Секция "Этапы работы"
    {
      name: 'stepsSubtitle',
      label: {
        ru: 'Этапы: Подзаголовок',
        en: 'Steps: Subtitle',
      },
      type: 'text',
      defaultValue: 'этапы работы',
      localized: true,
    },
    {
      name: 'stepsTitle',
      label: {
        ru: 'Этапы: Заголовок',
        en: 'Steps: Title',
      },
      type: 'text',
      defaultValue: 'как мы работаем?',
      localized: true,
    },
    {
      name: 'steps',
      label: {
        ru: 'Этапы',
        en: 'Steps',
      },
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'number',
          label: {
            ru: 'Номер',
            en: 'Number',
          },
          type: 'text',
          required: true,
        },
        {
          name: 'title',
          label: {
            ru: 'Заголовок',
            en: 'Title',
          },
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'text',
          label: {
            ru: 'Текст',
            en: 'Text',
          },
          type: 'textarea',
          required: true,
          localized: true,
        },
        {
          name: 'isHighlighted',
          label: {
            ru: 'Выделить (оранжевый)',
            en: 'Highlighted (orange)',
          },
          type: 'checkbox',
          defaultValue: false,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHomePage],
  },
}
