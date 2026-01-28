'use client'

import { PageHero, WhereUsed } from '@/components/PhotoPages'
import { Contact } from '@/components/Home'

const whereItems = [
  {
    icon: '/svgicons/photos/portal.svg',
    title: 'Интернет-магазины<br />и каталоги',
    description:
      '3D-просмотр товаров — интерактивное вращение на 360°. Детализация продукции — зум на любую часть. Повышение конверсии продаж.',
  },
  {
    icon: '/svgicons/photos/presentation.svg',
    title: 'Презентации<br />и демо',
    description:
      'Интерактивные презентации оборудования. Виртуальные демонстрации для клиентов. Обучающие материалы.',
  },
  {
    icon: '/svgicons/photos/documentation.svg',
    title: 'Техническая<br />документация',
    description:
      '3D-инструкции по сборке и эксплуатации. Визуализация внутренних компонентов. Анимированные руководства.',
  },
  {
    icon: '/svgicons/photos/sell.svg',
    title: 'Маркетинг<br />и реклама',
    description:
      'Видеоролики с 3D-анимацией. Рекламные материалы с интерактивом. AR/VR опыт для клиентов.',
  },
  {
    icon: '/svgicons/photos/photo.svg',
    title: 'Выставки<br />и мероприятия',
    description:
      'Интерактивные стенды с 3D-моделями. Виртуальные туры по производству. Демонстрация прототипов.',
  },
]

export default function ThreeDPage() {
  return (
    <main>
      <PageHero
        title="3D"
        description="Создание 3D-моделей и интерактивных визуализаций оборудования. Позвольте клиентам рассмотреть вашу продукцию со всех сторон."
        heroImage="/3d/hero.png"
        heroImageAlt="3D визуализация оборудования"
      />

      <div className="photo-page__3d-viewer">
        <div className="container">
          <div className="photo-page__3d-placeholder"></div>
        </div>
      </div>

      <WhereUsed title="где это используется?" items={whereItems} />

      <Contact />
    </main>
  )
}
