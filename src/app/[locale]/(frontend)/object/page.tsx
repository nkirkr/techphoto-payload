import { getPhotoPage } from '@/utilities/getPhotoPage'
import { PhotoPageTemplate } from '@/components/PhotoPages'
import { PageHero, PhotosGrid, WhereUsed, Cycle } from '@/components/PhotoPages'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: Locale }>
}

const defaultPhotos = [
  { type: 'image' as const, src: '/object/1.png', alt: 'Предметная съемка промышленных изделий' },
  { type: 'image' as const, src: '/object/2.png', alt: 'Фотосъемка продукции на нейтральном фоне' },
  { type: 'video' as const, src: '/example.mp4', alt: 'Видео предметной съемки' },
  { type: 'image' as const, src: '/object/4.png', alt: 'Студийная съемка изделий' },
  { type: 'image' as const, src: '/object/5.png', alt: 'Профессиональная предметная фотосъемка' },
  { type: 'image' as const, src: '/object/6.png', alt: 'Съемка промышленной продукции' },
  { type: 'image' as const, src: '/object/7.png', alt: 'Качественная предметная съемка' },
  { type: 'image' as const, src: '/object/8.png', alt: 'Фотография изделий на производстве' },
]

const defaultWhereItems = [
  {
    icon: '/svgicons/photos/post.svg',
    title: 'Рекламные<br />материалы',
    description:
      'Буклеты, каталоги, визитки — качественные изображения продукции. Баннеры и постеры — для выставок или презентаций. Социальные сети — имиджевые фото для постов.',
  },
  {
    icon: '/svgicons/photos/sell.svg',
    title: 'Продажи<br />и\u00A0каталогизация',
    description:
      'Интернет-каталог на сайте — чистые фото продукции на белом/нейтральном фоне. Прайс-листы и коммерческие предложения — иллюстрации товаров. Маркетплейсы и онлайн-площадки (Alibaba, eBay, Avito, Auto.ru для станков и\u00A0т.д.).',
  },
  {
    icon: '/svgicons/photos/search.svg',
    title: 'Техническая<br />документация',
    description:
      'Инструкции по эксплуатации — пошаговые фото деталей и сборки. Сервисные и ремонтные мануалы — крупные планы узлов. Сертификационные документы — подтверждающие фото изделия.',
  },
  {
    icon: '/svgicons/photos/partners.svg',
    title: 'B2B\u00A0и\u00A0партнёры',
    description:
      'Презентации для клиентов — детализированные фото продукции. Инвесторы и дистрибьюторы — показ ассортимента и качества. Сравнительные материалы — демонстрация разных моделей или вариантов исполнения.',
  },
  {
    icon: '/svgicons/photos/photo.svg',
    title: 'PR\u00A0и\u00A0выставки',
    description:
      'Стенды на выставках — большие фото продукции на постерах. Видео-ролики с анимацией — предметные фото как основа для 3D-визуализаций. Пресс-релизы — изображения новых продуктов.',
  },
]

export default async function ObjectPage({ params }: Props) {
  const { locale } = await params
  const cmsData = await getPhotoPage('object', locale)

  if (cmsData) {
    return <PhotoPageTemplate data={cmsData} variant="object" />
  }

  return (
    <main>
      <PageHero
        title="предметная съемка"
        description="Предметная съёмка позволяет показать продукцию в максимально выгодном, чистом и понятном виде. Мы снимаем станки, узлы, инструменты и комплектующие на нейтральном фоне — в студийных или производственных условиях."
        heroImage="/object/hero.png"
        heroImageAlt="Предметная съёмка промышленных изделий и оборудования"
      />

      <PhotosGrid photos={defaultPhotos} variant="object" />


      <WhereUsed title="где это используется?" items={defaultWhereItems} />

      <Cycle
        number="3"
        leftText="Полный цикл"
        rightText="Полный"
        overlayText="акцент на важном"
        image="/object/cycle.png"
        imageAlt="Акцент на важном - предметная съёмка"
      />
    </main>
  )
}
