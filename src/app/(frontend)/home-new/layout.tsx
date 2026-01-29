import React from 'react'
import '@/styles/main.scss'
import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'

export default function HomeNewLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  )
}
