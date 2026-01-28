'use client'

import { PageHero, PhotosGrid, WhereUsed, Cycle } from '@/components/PhotoPages'
import { Contact } from '@/components/Home'

const machinePhotos = [
  { type: 'image' as const, src: '/machine/1.png', alt: 'Съемка станков' },
  { type: 'image' as const, src: '/machine/2.png', alt: 'Фотосъемка оборудования' },
  { type: 'video' as const, src: '/example.mp4', alt: 'Видео съемки станков' },
  { type: 'image' as const, src: '/machine/4.png', alt: 'Промышленное оборудование' },
  { type: 'image' as const, src: '/machine/5.png', alt: 'Съемка производственных линий' },
  { type: 'image' as const, src: '/machine/6.png', alt: 'Фотография станка' },
  { type: 'image' as const, src: '/machine/7.png', alt: 'Детали оборудования' },
  { type: 'image' as const, src: '/machine/8.png', alt: 'Станок крупным планом' },
]

const whereItems = [
  {
    icon: '/svgicons/photos/post.svg',
    title: 'Рекламные<br />материалы',
    description:
      'Буклеты, каталоги — качественные изображения станков. Баннеры и постеры — для выставок или презентаций. Социальные сети — имиджевые фото для постов.',
  },
  {
    icon: '/svgicons/photos/sell.svg',
    title: 'Продажи<br />и каталогизация',
    description:
      'Интернет-каталог на сайте — фото оборудования. Прайс-листы и коммерческие предложения. Маркетплейсы и онлайн-площадки.',
  },
  {
    icon: '/svgicons/photos/search.svg',
    title: 'Техническая<br />документация',
    description:
      'Инструкции по эксплуатации — пошаговые фото деталей. Сервисные мануалы — крупные планы узлов. Сертификационные документы.',
  },
  {
    icon: '/svgicons/photos/partners.svg',
    title: 'B2B и партнёры',
    description:
      'Презентации для клиентов — детализированные фото оборудования. Инвесторы и дистрибьюторы — показ ассортимента.',
  },
  {
    icon: '/svgicons/photos/photo.svg',
    title: 'PR и выставки',
    description:
      'Стенды на выставках — большие фото станков. Видео-ролики с анимацией. Пресс-релизы — изображения нового оборудования.',
  },
]

export default function MachinePage() {
  return (
    <main>
      <PageHero
        title="станки"
        description="Съёмка станков и промышленного оборудования. Мы создаём качественный визуальный контент для каталогов, технической документации и маркетинговых материалов."
        heroImage="/machine/hero.png"
        heroImageAlt="Съёмка станков и промышленного оборудования"
      />

      <PhotosGrid photos={machinePhotos} variant="object" />

      <Cycle
        number="3"
        leftText="Полный цикл"
        rightText="Полный"
        overlayText="мощность в деталях"
        image="/machine/cycle.png"
        imageAlt="Мощность в деталях - съёмка станков"
      />

      <WhereUsed title="где это используется?" items={whereItems} />

      <Contact />
    </main>
  )
}
