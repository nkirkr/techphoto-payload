import Image from 'next/image'
import Link from 'next/link'
import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'
import '@/styles/main.scss'

export default function NotFound() {
  return (
    <html lang="ru">
      <body>
        <Header locale="ru" />
        <main className="error-page">
          <div className="error-page__content container">
            <div className="error-page__code">
              <span className="error-page__digit">4</span>
              <Image
                src="/404.svg"
                alt="0"
                className="error-page__image"
                width={200}
                height={249}
              />
              <span className="error-page__digit">4</span>
            </div>

            <p className="error-page__message">Извините, страница не найдена</p>

            <Link href="/" className="error-page__button">
              Главная
            </Link>
          </div>
        </main>
        <Footer />
      </body>
    </html>
  )
}
