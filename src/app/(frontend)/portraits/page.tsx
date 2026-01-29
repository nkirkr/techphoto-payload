import { getPhotoPage } from '@/utilities/getPhotoPage'
import { PhotoPageTemplate } from '@/components/PhotoPages'
import { PageHero, PhotosGrid, WhereUsed } from '@/components/PhotoPages'
import { Contact } from '@/components/Home'

const defaultPhotos = [
  { type: 'image' as const, src: '/portrait/1.png', alt: 'Портрет сотрудника' },
  { type: 'image' as const, src: '/portrait/2.png', alt: 'Корпоративная фотосъемка' },
  { type: 'image' as const, src: '/portrait/3.png', alt: 'Бизнес-портрет' },
  { type: 'image' as const, src: '/portrait/4.png', alt: 'Фото персонала' },
  { type: 'image' as const, src: '/portrait/5.png', alt: 'Съемка команды' },
  { type: 'image' as const, src: '/portrait/6.png', alt: 'Профессиональный портрет' },
  { type: 'image' as const, src: '/portrait/7.png', alt: 'Портрет специалиста' },
  { type: 'image' as const, src: '/portrait/8.png', alt: 'Корпоративное фото' },
]

const defaultWhereItems = [
  {
    icon: '/svgicons/photos/tick.svg',
    title: 'Корпоративные<br />и PR-материалы',
    description:
      'Портреты сотрудников и руководителей для сайта компании («О нас», «Команда», «Руководство»). Интервью и публикации в отраслевых СМИ, пресс-релизы, социальные сети. Визуализация корпоративной культуры, создание образа профессиональной и дружелюбной команды.',
  },
  {
    icon: '/svgicons/photos/humans.svg',
    title: 'Маркетинг и реклама',
    description:
      'Использование фотографий операторов станков или инженеров в буклетах, презентациях и постерах — подчёркивает профессионализм и человеческий фактор производства. Социальные сети и рекламные кампании, где важен личный контакт с брендом.',
  },
  {
    icon: '/svgicons/photos/smile.svg',
    title: 'Мероприятия и события',
    description:
      'Отчеты о конференциях, выставках, командных активностях. Документирование корпоративных мероприятий и награждений сотрудников.',
  },
]

export default async function PortraitsPage() {
  const cmsData = await getPhotoPage('portraits')

  if (cmsData) {
    return <PhotoPageTemplate data={cmsData} variant="portrait" />
  }

  return (
    <main>
      <PageHero
        title="персонал"
        description="Профессиональная съёмка сотрудников и команды. Создаём корпоративные портреты, которые показывают людей компании в лучшем свете."
        heroImage="/portrait/hero.png"
        heroImageAlt="Корпоративная съёмка персонала"
      />

      <PhotosGrid photos={defaultPhotos} variant="object" />

      <WhereUsed title="где это используется?" items={defaultWhereItems} variant="three" />

      <Contact />
    </main>
  )
}
