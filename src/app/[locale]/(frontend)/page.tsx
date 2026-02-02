import { Hero, WhatWeDo, Steps, Details } from '@/components/Home'
import { getHomePage } from '@/utilities/getHomePage'
import { getPortfolioCards } from '@/utilities/getPortfolioCards'
import type { Locale } from '@/i18n/config'

interface Props {
  params: Promise<{ locale: Locale }>
}

export default async function HomePageComponent({ params }: Props) {
  const { locale } = await params
  const data = await getHomePage(locale)
  
  // Получаем карточки портфолио из PhotoPages с текущей локалью
  const portfolioCards = await getPortfolioCards(locale)

  // Дефолтные значения если данных нет в CMS
  const defaultCards = [
    { title: 'Предметная съемка', href: '/object', backgroundImage: '/home/object.png' },
    { title: 'Станки', href: '/machine', backgroundImage: '/home/machine.png' },
    { title: 'Макро', href: '/macro', backgroundImage: '/home/macro.png' },
    { title: 'Портрет', href: '/portraits', backgroundImage: '/home/portrait.png' },
    { title: '3D', href: '/3d', backgroundImage: '/home/3d.png' },
  ]

  const defaultFeatures = [
    {
      title: 'Авторский подход',
      text: 'Мы не просто фиксируем оборудование — мы формируем его образ, передавая цвета, материалы и детали в наилучшем свете.',
    },
    {
      title: 'Промышленная точность',
      text: 'Мы снимаем станки и оборудование так, как на них смотрят инженеры и покупатели: с акцентом на ключевые узлы, рабочие поверхности, направляющие, шпиндели, органы управления и маркировку.',
    },
    {
      title: 'Полный цикл',
      text: 'от выезда на объект и построения световой схемы до постобработки и адаптации фото под каталоги, маркетплейсы, техдокументацию и презентации.',
    },
  ]

  const defaultSteps = [
    {
      number: '1',
      title: 'консультация',
      text: '— на этом этапе мы обсуждаем задачи проекта, определяем формат съёмки, объёмы работ и ключевые цели.',
    },
    {
      number: '2',
      title: 'техническое задание',
      text: '— мы формируем чёткий план съёмки: фиксируем объекты, ракурсы, стиль, сроки и формат итоговых материалов.',
    },
    {
      number: '3',
      title: 'съемка',
      text: '— мы выезжаем на площадку и проводим фото и видеосъёмку согласно утверждённому плану.',
    },
    {
      number: '4',
      title: 'отправка готового контента',
      text: 'Мы не просто фиксируем оборудование — мы формируем его образ, передавая цвета, материалы и детали в наилучшем свете.',
      isHighlighted: true,
    },
  ]

  return (
    <main>
      <Hero
        subtitle={data?.heroSubtitle}
        text={data?.heroText}
        buttonText={data?.heroButtonText}
        portfolioButtonText={data?.heroPortfolioButtonText}
        backgroundImage={data?.heroBackgroundImage || '/home/hero.png'}
      />
      <WhatWeDo
        text={data?.whatWeDoText}
        buttonText={data?.whatWeDoButtonText}
        sectionTitle={data?.whatWeDoSectionTitle}
        cards={portfolioCards.length > 0 ? portfolioCards : defaultCards}
        features={data?.features?.length ? data.features : defaultFeatures}
      />
      <Details
        text={data?.detailsText}
        backgroundImage={data?.detailsBackgroundImage || '/home/camera.png'}
      />
      <Steps
        subtitle={data?.stepsSubtitle}
        title={data?.stepsTitle}
        steps={data?.steps?.length ? data.steps : defaultSteps}
      />
    </main>
  )
}
