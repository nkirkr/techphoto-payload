'use client'

interface Step {
  number: string
  title: string
  text: string
  isHighlighted?: boolean
}

interface StepsProps {
  subtitle?: string
  title?: string
  steps?: Step[]
}

const defaultSteps: Step[] = [
  {
    number: '1',
    title: 'консультация',
    text: '— на этом этапе мы обсуждаем задачи проекта, определяем формат съёмки, объёмы работ и ключевые цели. Это помогает понять ваши ожидания и предложить оптимальное решение под ваш объект и бренд.',
  },
  {
    number: '2',
    title: 'техническое задание',
    text: '— мы формируем чёткий план съёмки: фиксируем объекты, ракурсы, стиль, сроки и формат итоговых материалов. Это обеспечивает прозрачность процесса и точное соответствие результата вашим требованиям.',
  },
  {
    number: '3',
    title: 'съемка',
    text: '— мы выезжаем на площадку и проводим фото и видеосъёмку согласно утверждённому плану. Процесс работы станков останавливать не обязательно — съёмка проводится по всем нормам безопасности и не мешает производственному процессу.',
  },
  {
    number: '4',
    title: 'отправка готового контента',
    text: 'Мы не просто фиксируем оборудование — мы формируем его образ, передавая цвета, материалы и детали в наилучшем свете.',
    isHighlighted: true,
  },
]

export const Steps: React.FC<StepsProps> = ({
  subtitle = 'этапы работы',
  title = 'как мы работаем?',
  steps = defaultSteps,
}) => {
  return (
    <section className="steps">
      <div className="container">
        <p className="steps__subtitle">{subtitle}</p>
        <h2 className="steps__title">{title}</h2>

        <div className="steps__grid-wrapper">
          <div className="steps__grid">
            {steps.map((step, index) => (
              <article
                key={index}
                className={`steps__card ${step.isHighlighted ? 'steps__card--orange' : ''}`}
              >
                <span className="steps__number">{step.number}</span>
                <h3
                  className="steps__card-title"
                  dangerouslySetInnerHTML={{ __html: step.title.replace(/\n/g, '<br />') }}
                />
                <p className="steps__card-text">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Steps
