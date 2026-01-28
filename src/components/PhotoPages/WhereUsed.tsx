'use client'

import Image from 'next/image'

interface WhereItem {
  icon: string
  title: string
  description: string
}

interface WhereUsedProps {
  title?: string
  items: WhereItem[]
}

export const WhereUsed: React.FC<WhereUsedProps> = ({
  title = 'где это используется?',
  items,
}) => {
  return (
    <section className="where">
      <div className="container">
        <h2 className="where__title">
          {title.split(' ').slice(0, 2).join(' ')} <br />
          {title.split(' ').slice(2).join(' ')}
        </h2>
      </div>

      <div className="where__grid">
        {items.map((item, index) => (
          <article key={index} className="where__item">
            <Image
              src={item.icon}
              alt=""
              className="where__icon"
              width={60}
              height={60}
              aria-hidden="true"
            />
            <h3
              className="where__item-title"
              dangerouslySetInnerHTML={{ __html: item.title }}
            />
            <p className="where__item-description">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default WhereUsed
