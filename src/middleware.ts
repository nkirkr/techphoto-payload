import { NextRequest, NextResponse } from 'next/server'
import { defaultLocale, type Locale } from './i18n/config'

function getLocaleFromCookie(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value
  if (cookieLocale === 'en' || cookieLocale === 'ru') {
    return cookieLocale
  }
  return defaultLocale
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Пропускаем статические файлы, API и админку
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/next') ||
    pathname.includes('.') ||
    pathname.startsWith('/media')
  ) {
    return NextResponse.next()
  }

  // Если путь начинается с /en - это английская версия
  if (pathname.startsWith('/en/') || pathname === '/en') {
    // Rewrite на [locale] с locale=en
    const newPathname = pathname === '/en' ? '/' : pathname.replace('/en', '')
    const url = request.nextUrl.clone()
    url.pathname = `/en${newPathname}`
    return NextResponse.rewrite(url)
  }

  // Если путь начинается с /ru - редиректим на версию без префикса
  if (pathname.startsWith('/ru/') || pathname === '/ru') {
    const newPathname = pathname === '/ru' ? '/' : pathname.replace('/ru', '')
    return NextResponse.redirect(new URL(newPathname, request.url))
  }

  // Все остальные пути - русская версия (без префикса в URL)
  // Rewrite на [locale] с locale=ru
  const url = request.nextUrl.clone()
  url.pathname = `/ru${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    // Пропускаем все внутренние пути Next.js и статические файлы
    '/((?!_next|api|admin|media|.*\\..*).*)',
  ],
}
