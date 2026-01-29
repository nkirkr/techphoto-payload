import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { slugField } from 'payload'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const PhotoPages: CollectionConfig<'photo-pages'> = {
  slug: 'photo-pages',
  labels: {
    singular: {
      ru: 'Страница фотосъемки',
      en: 'Photo Page',
    },
    plural: {
      ru: 'Страницы фотосъемки',
      en: 'Photo Pages',
    },
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    useAsTitle: 'title',
    group: 'Контент',
  },
  fields: [
    {
      name: 'title',
      label: 'Название страницы',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        // Hero секция
        {
          label: 'Hero',
          fields: [
            {
              name: 'heroTitle',
              label: 'Заголовок',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'heroDescription',
              label: 'Описание',
              type: 'textarea',
              required: true,
              localized: true,
            },
            {
              name: 'heroImage',
              label: 'Изображение',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
          ],
        },
        // Галерея фото
        {
          label: 'Галерея',
          fields: [
            {
              name: 'photos',
              label: 'Фотографии',
              type: 'array',
              minRows: 1,
              maxRows: 12,
              fields: [
                {
                  name: 'type',
                  label: 'Тип',
                  type: 'select',
                  defaultValue: 'image',
                  options: [
                    { label: 'Изображение', value: 'image' },
                    { label: 'Видео', value: 'video' },
                  ],
                },
                {
                  name: 'image',
                  label: 'Изображение',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    condition: (data, siblingData) => siblingData?.type === 'image',
                  },
                },
                {
                  name: 'video',
                  label: 'Видео URL',
                  type: 'text',
                  admin: {
                    condition: (data, siblingData) => siblingData?.type === 'video',
                  },
                },
                {
                  name: 'alt',
                  label: 'Alt текст',
                  type: 'text',
                  localized: true,
                },
              ],
            },
          ],
        },
        // Cycle секция (опционально)
        {
          label: 'Cycle',
          fields: [
            {
              name: 'showCycle',
              label: 'Показывать секцию Cycle',
              type: 'checkbox',
              defaultValue: true,
            },
            {
              name: 'cycleNumber',
              label: 'Число',
              type: 'text',
              defaultValue: '3',
              admin: {
                condition: (data) => data?.showCycle,
              },
            },
            {
              name: 'cycleLeftText',
              label: 'Текст слева',
              type: 'text',
              defaultValue: 'Полный цикл',
              localized: true,
              admin: {
                condition: (data) => data?.showCycle,
              },
            },
            {
              name: 'cycleRightText',
              label: 'Текст справа',
              type: 'text',
              defaultValue: 'Полный',
              localized: true,
              admin: {
                condition: (data) => data?.showCycle,
              },
            },
            {
              name: 'cycleOverlayText',
              label: 'Текст на изображении',
              type: 'text',
              localized: true,
              admin: {
                condition: (data) => data?.showCycle,
              },
            },
            {
              name: 'cycleImage',
              label: 'Изображение',
              type: 'upload',
              relationTo: 'media',
              admin: {
                condition: (data) => data?.showCycle,
              },
            },
          ],
        },
        // Где используется
        {
          label: 'Где используется',
          fields: [
            {
              name: 'whereTitle',
              label: 'Заголовок секции',
              type: 'text',
              defaultValue: 'где это используется?',
              localized: true,
            },
            {
              name: 'whereItems',
              label: 'Элементы',
              type: 'array',
              minRows: 1,
              maxRows: 6,
              localized: true,
              fields: [
                {
                  name: 'icon',
                  label: 'Иконка',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'title',
                  label: 'Заголовок',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'description',
                  label: 'Описание',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
          ],
        },
        // SEO
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
