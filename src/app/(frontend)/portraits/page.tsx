'use client'

import { PageHero, PhotosGrid, WhereUsed } from '@/components/PhotoPages'
import { Contact } from '@/components/Home'

const portraitPhotos = [
  { type: 'image' as const, src: '/portrait/1.png', alt: 'Портрет сотрудника' },
  { type: 'image' as const, src: '/portrait/2.png', alt: 'Корпоративная фотосъемка' },
  { type: 'image' as const, src: '/portrait/3.png', alt: 'Бизнес-портрет' },
  { type: 'image' as const, src: '/portrait/4.png', alt: 'Фото персонала' },
  { type: 'image' as const, src: '/portrait/5.png', alt: 'Съемка команды' },
  { type: 'image' as const, src: '/portrait/6.png', alt: 'Профессиональный портрет' },
  { type: 'image' as const, src: '/portrait/7.png', alt: 'Портрет специалиста' },
  { type: 'image' as const, src: '/portrait/8.png', alt: 'Корпоративное фото' },
]

const whereItems = [
  {
    icon: '/svgicons/photos/humans.svg',
    title: 'Корпоративный<br />сайт',
    description:
      'Раздел «О компании» — фото руководства и команды. Страницы отделов — портреты специалистов. Блог компании — авторские фото.',
  },
  {
    icon: '/svgicons/photos/presentation.svg',
    title: 'Презентации<br />и отчёты',
    description:
      'Годовые отчёты — фото ключевых сотрудников. Презентации для инвесторов. Материалы для партнёров.',
  },
  {
    icon: '/svgicons/photos/post.svg',
    title: 'Социальные<br />сети',
    description:
      'LinkedIn — профессиональные профили. Корпоративные страницы — командные фото. HR-контент — привлечение талантов.',
  },
  {
    icon: '/svgicons/photos/archive.svg',
    title: 'Внутренние<br />коммуникации',
    description:
      'Корпоративный портал — профили сотрудников. Доска почёта. Внутренние издания компании.',
  },
  {
    icon: '/svgicons/photos/beenhere.svg',
    title: 'HR и рекрутинг',
    description:
      'Карьерные страницы — фото рабочей атмосферы. Вакансии — визуализация команды. Онбординг новых сотрудников.',
  },
]

export default function PortraitsPage() {
  return (
    <main>
      <PageHero
        title="персонал"
        description="Профессиональная съёмка сотрудников и команды. Создаём корпоративные портреты, которые показывают людей компании в лучшем свете."
        heroImage="/portrait/hero.png"
        heroImageAlt="Корпоративная съёмка персонала"
      />

      <PhotosGrid photos={portraitPhotos} variant="object" />

      <WhereUsed title="где это используется?" items={whereItems} />

      <Contact />
    </main>
  )
}
