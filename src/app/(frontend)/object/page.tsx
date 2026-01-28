'use client'

import { PageHero, PhotosGrid, WhereUsed, Cycle } from '@/components/PhotoPages'
import { Contact } from '@/components/Home'

const objectPhotos = [
  { type: 'image' as const, src: '/object/1.png', alt: 'Предметная съемка промышленных изделий' },
  { type: 'image' as const, src: '/object/2.png', alt: 'Фотосъемка продукции на нейтральном фоне' },
  { type: 'video' as const, src: '/example.mp4', alt: 'Видео предметной съемки' },
  { type: 'image' as const, src: '/object/4.png', alt: 'Студийная съемка изделий' },
  { type: 'image' as const, src: '/object/5.png', alt: 'Профессиональная предметная фотосъемка' },
  { type: 'image' as const, src: '/object/6.png', alt: 'Съемка промышленной продукции' },
  { type: 'image' as const, src: '/object/7.png', alt: 'Качественная предметная съемка' },
  { type: 'image' as const, src: '/object/8.png', alt: 'Фотография изделий на производстве' },
]

const whereItems = [
  {
    icon: '/svgicons/photos/post.svg',
    title: 'Рекламные<br />материалы',
    description:
      'Буклеты, каталоги, визитки — качественные изображения продукции. Баннеры и постеры — для выставок или презентаций. Социальные сети — имиджевые фото для постов.',
  },
  {
    icon: '/svgicons/photos/sell.svg',
    title: 'Продажи<br />и каталогизация',
    description:
      'Интернет-каталог на сайте — чистые фото продукции на белом/нейтральном фоне. Прайс-листы и коммерческие предложения — иллюстрации товаров. Маркетплейсы и онлайн-площадки.',
  },
  {
    icon: '/svgicons/photos/search.svg',
    title: 'Техническая<br />документация',
    description:
      'Инструкции по эксплуатации — пошаговые фото деталей и сборки. Сервисные и ремонтные мануалы — крупные планы узлов. Сертификационные документы — подтверждающие фото изделия.',
  },
  {
    icon: '/svgicons/photos/partners.svg',
    title: 'B2B и партнёры',
    description:
      'Презентации для клиентов — детализированные фото продукции. Инвесторы и дистрибьюторы — показ ассортимента и качества. Сравнительные материалы — демонстрация разных моделей.',
  },
  {
    icon: '/svgicons/photos/photo.svg',
    title: 'PR и выставки',
    description:
      'Стенды на выставках — большие фото продукции на постерах. Видео-ролики с анимацией — предметные фото как основа для 3D-визуализаций. Пресс-релизы — изображения новых продуктов.',
  },
]

export default function ObjectPage() {
  return (
    <main>
      <PageHero
        title="предметная съемка"
        description="Предметная съёмка позволяет показать продукцию в максимально выгодном, чистом и понятном виде. Мы снимаем станки, узлы, инструменты и комплектующие на нейтральном фоне — в студийных или производственных условиях."
        heroImage="/object/hero.png"
        heroImageAlt="Предметная съёмка промышленных изделий и оборудования"
      />

      <PhotosGrid photos={objectPhotos} variant="object" />

      <Cycle
        number="3"
        leftText="Полный цикл"
        rightText="Полный"
        overlayText="акцент на важном"
        image="/object/cycle.png"
        imageAlt="Акцент на важном - предметная съёмка"
      />

      <WhereUsed title="где это используется?" items={whereItems} />

      <Contact />
    </main>
  )
}
