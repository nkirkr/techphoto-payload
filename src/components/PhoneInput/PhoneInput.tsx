'use client'

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react'
import intlTelInput from 'intl-tel-input'
import 'intl-tel-input/build/css/intlTelInput.css'
import IMask from 'imask'

interface PhoneInputProps {
  value: string
  onChange: (value: string) => void
  className?: string
  placeholder?: string
  required?: boolean
  name?: string
}

export interface PhoneInputRef {
  getNumber: () => string
  isValidNumber: () => boolean
}

// Маски для разных стран (как в оригинальной верстке)
const getMaskPattern = (countryCode: string): string => {
  switch (countryCode) {
    case 'ru':
    case 'kz':
      return '(000) 000-00-00'
    case 'by':
      return '(00) 000-00-00'
    case 'ua':
      return '(00) 000-00-00'
    default:
      return '0000000000000000' // Для остальных стран - только цифры
  }
}

export const PhoneInput = forwardRef<PhoneInputRef, PhoneInputProps>(
  ({ value, onChange, className = '', placeholder = '', required = false, name = 'phone' }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const itiRef = useRef<ReturnType<typeof intlTelInput> | null>(null)
    const maskRef = useRef<ReturnType<typeof IMask> | null>(null)
    const onChangeRef = useRef(onChange)

    useEffect(() => {
      onChangeRef.current = onChange
    }, [onChange])

    useImperativeHandle(ref, () => ({
      getNumber: () => {
        return itiRef.current?.getNumber() || ''
      },
      isValidNumber: () => {
        return itiRef.current?.isValidNumber() || false
      },
    }))

    useEffect(() => {
      if (inputRef.current && !itiRef.current) {
        const input = inputRef.current

        // Инициализируем intl-tel-input
        itiRef.current = intlTelInput(input, {
          initialCountry: 'ru',
          countryOrder: ['ru', 'kz', 'by', 'ua'],
          separateDialCode: true,
          formatOnDisplay: false, // Отключаем, т.к. используем IMask
          nationalMode: true,
          countrySearch: true,
          autoPlaceholder: 'polite',
          loadUtilsOnInit: () => import('intl-tel-input/utils'),
        })

        // Получаем начальную страну
        const countryCode = itiRef.current.getSelectedCountryData()?.iso2?.toLowerCase() || 'ru'
        const maskPattern = getMaskPattern(countryCode)

        // Инициализируем IMask
        maskRef.current = IMask(input, {
          mask: maskPattern,
          lazy: false, // Показывать маску сразу
          placeholderChar: '_',
        })

        // Обновляем значение при изменении маски
        maskRef.current.on('accept', () => {
          const number = itiRef.current?.getNumber() || ''
          onChangeRef.current(number)
        })

        // Обновляем маску при смене страны
        input.addEventListener('countrychange', () => {
          const newCountryCode =
            itiRef.current?.getSelectedCountryData()?.iso2?.toLowerCase() || 'ru'
          const newMaskPattern = getMaskPattern(newCountryCode)

          // Пересоздаем маску с новым паттерном
          if (maskRef.current) {
            maskRef.current.destroy()
          }

          maskRef.current = IMask(input, {
            mask: newMaskPattern,
            lazy: false,
            placeholderChar: '_',
          })

          maskRef.current.on('accept', () => {
            const number = itiRef.current?.getNumber() || ''
            onChangeRef.current(number)
          })

          // Уведомляем об изменении
          const number = itiRef.current?.getNumber() || ''
          onChangeRef.current(number)
        })

        // Валидация при blur
        input.addEventListener('blur', () => {
          if (input.value.trim() && input.value !== getMaskPattern(
            itiRef.current?.getSelectedCountryData()?.iso2?.toLowerCase() || 'ru'
          ).replace(/0/g, '_')) {
            if (itiRef.current?.isValidNumber()) {
              input.classList.remove('error')
              input.classList.add('valid')
            } else {
              input.classList.add('error')
              input.classList.remove('valid')
            }
          }
        })

        // Сброс валидации при вводе
        input.addEventListener('input', () => {
          input.classList.remove('error', 'valid')
        })
      }

      return () => {
        if (maskRef.current) {
          maskRef.current.destroy()
          maskRef.current = null
        }
        if (itiRef.current) {
          itiRef.current.destroy()
          itiRef.current = null
        }
      }
    }, [])

    return (
      <input
        ref={inputRef}
        type="tel"
        className={className}
        name={name}
        placeholder={placeholder}
        required={required}
        defaultValue={value}
        autoComplete="off"
      />
    )
  },
)

PhoneInput.displayName = 'PhoneInput'

export default PhoneInput
