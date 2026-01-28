'use client'

import { PageHero, PhotosGrid, WhereUsed } from '@/components/PhotoPages'
import { Contact } from '@/components/Home'

const macroPhotos = [
  { type: 'image' as const, src: '/macro/1.png', alt: 'Макросъемка деталей' },
  { type: 'image' as const, src: '/macro/2.png', alt: 'Крупный план изделия' },
  { type: 'image' as const, src: '/macro/3.png', alt: 'Макро фотография' },
  { type: 'image' as const, src: '/macro/4.png', alt: 'Детали крупным планом' },
  { type: 'image' as const, src: '/macro/5.png', alt: 'Макросъемка компонентов' },
  { type: 'image' as const, src: '/macro/6.png', alt: 'Микродетали' },
  { type: 'image' as const, src: '/macro/7.png', alt: 'Текстура поверхности' },
  { type: 'image' as const, src: '/macro/8.png', alt: 'Макро изделия' },
]

const whereItems = [
  {
    icon: '/svgicons/photos/post.svg',
    title: 'Рекламные<br />материалы',
    description:
      'Буклеты, каталоги — детализированные изображения. Баннеры и постеры — для выставок. Социальные сети — впечатляющие макро-фото.',
  },
  {
    icon: '/svgicons/photos/documentation.svg',
    title: 'Техническая<br />документация',
    description:
      'Инструкции — детальные фото компонентов. Сервисные мануалы — крупные планы узлов. Сертификационные документы.',
  },
  {
    icon: '/svgicons/photos/search.svg',
    title: 'Контроль<br />качества',
    description:
      'Фиксация дефектов и особенностей. Документирование производственного процесса. Создание эталонных образцов.',
  },
  {
    icon: '/svgicons/photos/partners.svg',
    title: 'B2B и партнёры',
    description:
      'Презентации — показ качества материалов. Демонстрация технологий обработки. Сравнительные материалы.',
  },
  {
    icon: '/svgicons/photos/photo.svg',
    title: 'Научные<br />публикации',
    description:
      'Исследовательские материалы. Технические статьи. Патентная документация.',
  },
]

export default function MacroPage() {
  return (
    <main>
      <PageHero
        title="макро"
        description="Макросъёмка позволяет показать мельчайшие детали продукции — текстуру материалов, качество обработки поверхностей, точность изготовления компонентов."
        heroImage="/macro/hero.png"
        heroImageAlt="Макросъёмка деталей и компонентов"
      />

      <PhotosGrid photos={macroPhotos} variant="object" />

      <WhereUsed title="где это используется?" items={whereItems} />

      <Contact />
    </main>
  )
}
