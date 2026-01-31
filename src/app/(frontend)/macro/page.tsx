import { getPhotoPage } from '@/utilities/getPhotoPage'
import { PhotoPageTemplate } from '@/components/PhotoPages'
import { PageHero, PhotosGrid, WhereUsed } from '@/components/PhotoPages'
import { Contact } from '@/components/Home'

const defaultPhotos = [
  { type: 'image' as const, src: '/macro/1.png', alt: 'Макросъемка деталей' },
  { type: 'image' as const, src: '/macro/2.png', alt: 'Крупный план изделия' },
  { type: 'image' as const, src: '/macro/3.png', alt: 'Макро фотография' },
  { type: 'image' as const, src: '/macro/4.png', alt: 'Детали крупным планом' },
  { type: 'image' as const, src: '/macro/5.png', alt: 'Макросъемка компонентов' },
  { type: 'image' as const, src: '/macro/6.png', alt: 'Микродетали' },
  { type: 'image' as const, src: '/macro/7.png', alt: 'Текстура поверхности' },
  { type: 'image' as const, src: '/macro/8.png', alt: 'Макро изделия' },
]

const defaultWhereItems = [
  {
    icon: '/svgicons/photos/tick.svg',
    title: 'Рекламные<br />и\u00A0презентационные<br />материалы',
    description:
      'Каталоги и\u00A0буклеты — акцент на\u00A0точности обработки, высоком качестве металла, деталях конструкции. Постеры и\u00A0баннеры для выставок, где необходимо показать конкурентные преимущества станков. Видео с\u00A0акцентом на\u00A0технологические особенности (острота режущего инструмента, качество поверхности после обработки).',
  },
  {
    icon: '/svgicons/photos/beenhere.svg',
    iconOrange: true,
    title: 'Цифровые каналы',
    description:
      'На\u00A0сайте — в\u00A0карточках товаров, чтобы показать качество сборки, материалов и\u00A0обработки. В\u00A0социальных сетях — эффектные макро-кадры для привлечения внимания к\u00A0бренду. Для онлайн-каталогов и\u00A0маркетплейсов — подтверждение качества продукции.',
  },
  {
    icon: '/svgicons/photos/smile.svg',
    title: 'Имидж и\u00A0PR',
    description:
      'В\u00A0пресс-релизах и\u00A0отраслевых публикациях как доказательство современного технологического уровня. В\u00A0отчетах для инвесторов и\u00A0партнеров. В\u00A0корпоративных видеороликах, где акцент делается на\u00A0высокоточном оборудовании.',
  },
]

export default async function MacroPage() {
  const cmsData = await getPhotoPage('macro')

  if (cmsData) {
    return <PhotoPageTemplate data={cmsData} variant="macro" />
  }

  return (
    <main>
      <PageHero
        title="макро"
        description="Макросъёмка позволяет показать мельчайшие детали продукции — текстуру материалов, качество обработки поверхностей, точность изготовления компонентов."
        heroImage="/macro/hero.png"
        heroImageAlt="Макросъёмка деталей и компонентов"
      />

      <PhotosGrid photos={defaultPhotos} variant="macro" />

      <WhereUsed title="где это используется?" items={defaultWhereItems} variant="three" />

      <Contact />
    </main>
  )
}
