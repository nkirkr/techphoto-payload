import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Header } from '@/components/Layout/Header'
import { Footer } from '@/components/Layout/Footer'
import { Contact } from '@/components/Home/Contact'
import { ModalProvider, RequestModal } from '@/components/RequestModal'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'
import { locales, type Locale } from '@/i18n/config'
import { getContacts } from '@/utilities/getContacts'

import './globals.css'
import '@/styles/main.scss'
import { getServerSideURL } from '@/utilities/getURL'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: Locale }>
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export default async function RootLayout({ children, params }: Props) {
  const { locale } = await params
  const { isEnabled } = await draftMode()
  const contacts = await getContacts(locale)

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang={locale} suppressHydrationWarning>
      <head>
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <ModalProvider>
            <AdminBar
              adminBarProps={{
                preview: isEnabled,
              }}
            />

            <Header locale={locale} />
            {children}
            <Contact
              title={contacts.title}
              phone={contacts.phone}
              email={contacts.email}
              telegramUrl={contacts.telegramUrl}
              whatsappUrl={contacts.whatsappUrl}
              privacyPolicyUrl={contacts.privacyPolicyUrl}
              formNamePlaceholder={contacts.formNamePlaceholder}
              formEmailPlaceholder={contacts.formEmailPlaceholder}
              formPhonePlaceholder={contacts.formPhonePlaceholder}
              formSubmitButtonText={contacts.formSubmitButtonText}
              formAgreementText={contacts.formAgreementText}
              privacyPolicyLinkText={contacts.privacyPolicyLinkText}
            />
            <Footer />
            <RequestModal
              title={contacts.modalTitle}
              subtitle={contacts.modalSubtitle}
              namePlaceholder={contacts.formNamePlaceholder}
              phonePlaceholder={contacts.formPhonePlaceholder}
              emailPlaceholder={contacts.formEmailPlaceholder}
              submitButtonText={contacts.modalSubmitButtonText}
              privacyPolicyUrl={contacts.privacyPolicyUrl}
              privacyPolicyLinkText={contacts.privacyPolicyLinkText}
            />
          </ModalProvider>
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
