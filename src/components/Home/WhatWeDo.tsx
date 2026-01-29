'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useModal } from '@/components/RequestModal'

interface Card {
  title: string
  href: string
  backgroundImage: string
}

interface Feature {
  title: string
  text: string
}

interface WhatWeDoProps {
  logo?: string
  text?: string
  buttonText?: string
  sectionTitle?: string
  cards?: Card[]
  features?: Feature[]
}

const defaultCards: Card[] = [
  {
    title: 'Предметная съемка',
    href: '/object',
    backgroundImage: '/home/object.png',
  },
  {
    title: 'Станки',
    href: '/machine',
    backgroundImage: '/home/machine.png',
  },
  {
    title: 'Макро',
    href: '/macro',
    backgroundImage: '/home/macro.png',
  },
  {
    title: 'Портрет',
    href: '/portraits',
    backgroundImage: '/home/portrait.png',
  },
  {
    title: '3D',
    href: '/3d',
    backgroundImage: '/home/3d.png',
  },
]

const defaultFeatures: Feature[] = [
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

export const WhatWeDo: React.FC<WhatWeDoProps> = ({
  logo = '/logo-black.svg',
  text = 'Предметная съемка позволяет показать продукцию в максимально выгодном, чистом и понятном виде. Мы снимаем станки, узлы, инструменты и комплектующие на нейтральном фоне — в студийных или производственных условиях.',
  buttonText = 'Оставьте заявку',
  sectionTitle = 'Что мы предлагаем:',
  cards = defaultCards,
  features = defaultFeatures,
}) => {
  const { openModal } = useModal()

  return (
    <section className="what-we-do" id="portfolio">
      <div className="container">
        <div className="what-we-do__top">
          <div className="what-we-do__left">
            <Image
              src={logo}
              alt="ТЕХФОТО.РФ"
              className="what-we-do__logo"
              width={260}
              height={36}
            />
            <p className="what-we-do__text">{text}</p>
            <button className="what-we-do__btn" type="button" onClick={openModal}>
              <span>{buttonText}</span>
              <span className="what-we-do__btn-circle">
                <Image src="/svgicons/all/arrow-hero.svg" alt="Arrow" width={20} height={20} />
              </span>
            </button>
          </div>
          <div className="what-we-do__right">
            <h2 className="what-we-do__title">
              {sectionTitle.split(' ').map((word, i) => (
                <span key={i}>
                  {word}
                  {i === 1 && <br />}
                  {i !== 1 && ' '}
                </span>
              ))}
            </h2>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="what-we-do__cards">
          {cards.map((card, index) => (
            <Link
              key={index}
              href={card.href}
              className="what-we-do__card"
              style={{ backgroundImage: `url(${card.backgroundImage})` }}
            >
              <div className="what-we-do__card-btn">
                <span>{card.title}</span>
                <span className="what-we-do__card-arrow">
                  <Image src="/svgicons/all/arrow-hero.svg" alt="Arrow" width={24} height={24} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="container">
        <div className="what-we-do__features">
          {features.flatMap((feature, index) => {
            const elements = [
              <div className="what-we-do__feature" key={`feature-${index}`}>
                <h3 className="what-we-do__feature-title">
                  {feature.title}
                </h3>
                <p className="what-we-do__feature-text">{feature.text}</p>
              </div>,
            ]
            if (index < features.length - 1) {
              elements.push(
                <Image
                  key={`divider-${index}`}
                  src="/svgicons/home/line.svg"
                  alt=""
                  className="what-we-do__divider"
                  width={190}
                  height={1}
                />,
              )
            }
            return elements
          })}
        </div>
      </div>
    </section>
  )
}

export default WhatWeDo
