import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ТЕХФОТО.РФ',
  description: 'Промышленная фото и видеосъемка',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
