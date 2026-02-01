import { getPhotoPage } from '@/utilities/getPhotoPage'
import { PhotoPageTemplate } from '@/components/PhotoPages'
import { PageHero, WhereUsed, Cycle, ProductsSection } from '@/components/PhotoPages'
import { Contact } from '@/components/Home'

const defaultWhereItems = [
  {
    icon: '/svgicons/photos/presentation.svg',
    title: 'Презентации<br />и маркетинг',
    description:
      '3D-съёмка и рендеры позволяют эффектно представить промышленное оборудование без необходимости его физического присутствия. Реалистичные визуализации используются в каталогах, на сайтах, в рекламных видео и презентациях. Они наглядно демонстрируют конструкцию, функционал и преимущества станков, помогая компании выделиться на рынке и упростить коммуникацию с клиентом.',
  },
  {
    icon: '/svgicons/photos/documentation.svg',
    title: 'Техническая<br />документация и обучение',
    description:
      'Интерактивные инструкции и мануалы — вместо статичных схем используются 3D-модели, демонстрирующие сборку, замену узлов или настройку.<br />Обучающие видео и AR-материалы — обучение операторов и инженеров без доступа к реальному оборудованию.',
  },
  {
    icon: '/svgicons/photos/portal.svg',
    title: 'Продажи и клиентские<br />демонстрации',
    description:
      '3D-каталоги и конфигураторы — клиент может рассмотреть станок под любым углом, выбрать комплектацию или цвет. Визуализация работы оборудования — особенно полезна для сложных или дорогих машин, которые невозможно транспортировать на встречу.',
  },
  {
    icon: '/svgicons/photos/archive.svg',
    title: 'Архивирование<br />и цифровизация',
    description:
      'Создание цифрового двойника предприятия — фиксируется текущее состояние цехов, станков и коммуникаций.<br />Учёт оборудования — точные 3D-копии помогают при инвентаризации<br />и планировании модернизации.',
  },
  {
    icon: '/svgicons/photos/beenhere.svg',
    title: 'Инвестиционные<br />и проектные презентации',
    description:
      'Демонстрация проектов инвесторам <br />и партнёрам — визуализация будущего завода, модернизации или новой линии значительно повышает доверие <br />и наглядность.',
  },
]

export default async function ThreeDPage() {
  const cmsData = await getPhotoPage('3d')

  if (cmsData) {
    return <PhotoPageTemplate data={cmsData} variant="3d" />
  }

  return (
    <main>
      <PageHero
        title="3D"
        description="Создание 3D-моделей и интерактивных визуализаций оборудования. Позвольте клиентам рассмотреть вашу продукцию со всех сторон."
        heroImage="/3d/hero.png"
        heroImageAlt="3D визуализация оборудования"
      />

      <ProductsSection />

      <WhereUsed title="где это используется?" items={defaultWhereItems} />

      <Cycle
        number="3"
        leftText="Полный цикл"
        rightText="Полный"
        overlayText="акцент на важном"
        image="/3d/cycle.png"
        imageAlt="Акцент на важном - 3D"
      />

      <Contact />
    </main>
  )
}
