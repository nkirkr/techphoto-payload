import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, email, source } = body

    if (!name || !phone || !email) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 })
    }

    // Get destination email from Contacts global
    const payload = await getPayload({ config })
    const contacts = await payload.findGlobal({
      slug: 'contacts',
    })

    const destinationEmail = contacts.destinationEmail || 'tehphoto@mail.ru'

    // Log the submission (for now, since email adapter might not be configured)
    payload.logger.info(`New contact form submission:
      Name: ${name}
      Phone: ${phone}
      Email: ${email}
      Source: ${source || 'unknown'}
      Destination: ${destinationEmail}
    `)

    // Try to send email if email adapter is configured
    try {
      await payload.sendEmail({
        to: destinationEmail,
        subject: `Новая заявка с сайта от ${name}`,
        html: `
          <h2>Новая заявка с сайта</h2>
          <p><strong>Имя:</strong> ${name}</p>
          <p><strong>Телефон:</strong> ${phone}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Источник:</strong> ${source === 'modal' ? 'Модальное окно' : 'Форма контактов'}</p>
          <p><strong>Дата:</strong> ${new Date().toLocaleString('ru-RU')}</p>
        `,
      })
    } catch (emailError) {
      // Email adapter might not be configured, just log
      payload.logger.warn('Email adapter not configured, submission logged to console')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Ошибка сервера' }, { status: 500 })
  }
}
