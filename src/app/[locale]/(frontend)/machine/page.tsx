import { getPhotoPage } from '@/utilities/getPhotoPage'
import { PhotoPageTemplate } from '@/components/PhotoPages'
import { PageHero, PhotosGrid, WhereUsed, Cycle } from '@/components/PhotoPages'
import type { Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: Locale }>
}

const defaultPhotos = [
  { type: 'image' as const, src: '/machine/1.png', alt: 'Съемка станков' },
  { type: 'image' as const, src: '/machine/2.png', alt: 'Фотосъемка оборудования' },
  { type: 'video' as const, src: '/example.mp4', alt: 'Видео съемки станков' },
  { type: 'image' as const, src: '/machine/4.png', alt: 'Промышленное оборудование' },
  { type: 'image' as const, src: '/machine/5.png', alt: 'Съемка производственных линий' },
  { type: 'image' as const, src: '/machine/6.png', alt: 'Фотография станка' },
  { type: 'image' as const, src: '/machine/7.png', alt: 'Детали оборудования' },
  { type: 'image' as const, src: '/machine/8.png', alt: 'Станок крупным планом' },
]

const defaultWhereItems = [
  {
    icon: '/svgicons/photos/presentation.svg',
    title: 'Коммерческое<br />продвижение',
    description:
      'Презентации для клиентов и\u00A0партнеров. Видеоролики и\u00A0фото для рассылок и\u00A0коммерческих предложений. Визуальные материалы для участия в\u00A0тендерах.',
  },
  {
    icon: '/svgicons/photos/documentation.svg',
    title: 'Внутренние<br />корпоративные цели',
    description:
      'Обучающие материалы для сотрудников (инструкции, демонстрация работы станков). Документация по\u00A0эксплуатации и\u00A0техобслуживанию. Визуальное сопровождение внутренних отчетов и\u00A0презентаций.',
  },
  {
    icon: '/svgicons/photos/search.svg',
    title: 'Сайт и\u00A0цифровые<br />платформы',
    description:
      'Галереи и\u00A0карточки товаров на\u00A0корпоративном сайте. Видеообзоры для разделов «Продукция» и\u00A0«Оборудование». Встраивание фото и\u00A0видео в\u00A0онлайн-каталоги, маркетплейсы, порталы о\u00A0промышленности.',
  },
  {
    icon: '/svgicons/photos/archive.svg',
    title: 'Рекламные и\u00A0маркетинговые<br />материалы',
    description:
      'Буклеты, каталоги, прайс-листы с\u00A0иллюстрациями станков. Баннеры и\u00A0постеры для выставок, презентаций и\u00A0отраслевых мероприятий. Имиджевые и\u00A0информационные публикации в\u00A0социальных сетях. Рекламные ролики для ТВ\u00A0или онлайн-площадок.',
  },
  {
    icon: '/svgicons/photos/beenhere.svg',
    title: 'PR\u00A0и\u00A0имиджевые цели',
    description:
      'Публикации в\u00A0отраслевых СМИ и\u00A0профильных изданиях. Использование в\u00A0пресс-релизах, интервью, отчетах для инвесторов. Формирование визуального образа современного и\u00A0технологичного производства.',
  },
]

export default async function MachinePage({ params }: Props) {
  const { locale } = await params
  const cmsData = await getPhotoPage('machine', locale)

  if (cmsData) {
    return <PhotoPageTemplate data={cmsData} variant="machine" />
  }

  return (
    <main>
      <PageHero
        title="станки"
        description="Съёмка станков и промышленного оборудования. Мы создаём качественный визуальный контент для каталогов, технической документации и маркетинговых материалов."
        heroImage="/machine/hero.png"
        heroImageAlt="Съёмка станков и промышленного оборудования"
      />

      <PhotosGrid photos={defaultPhotos} variant="object" />

      <Cycle
        number="3"
        leftText="Полный цикл"
        rightText="Полный"
        overlayText="мощность в деталях"
        image="/machine/cycle.png"
        imageAlt="Мощность в деталях - съёмка станков"
      />

      <WhereUsed title="где это используется?" items={defaultWhereItems} />
    </main>
  )
}
