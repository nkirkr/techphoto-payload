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

// Маски для разных стран
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

// Placeholder для разных стран
const getPlaceholder = (countryCode: string): string => {
  switch (countryCode) {
    case 'ru':
      return '9XX XXX-XX-XX'
    case 'kz':
      return '7XX XXX-XX-XX'
    case 'by':
      return 'XX XXX-XX-XX'
    case 'ua':
      return 'XX XXX-XX-XX'
    default:
      return ''
  }
}

export const PhoneInput = forwardRef<PhoneInputRef, PhoneInputProps>(
  ({ value, onChange, className = '', placeholder = '', required = false, name = 'phone' }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const itiRef = useRef<ReturnType<typeof intlTelInput> | null>(null)
    const maskRef = useRef<ReturnType<typeof IMask> | null>(null)
    const onChangeRef = useRef(onChange)
    const dialCodeRef = useRef<string>('+7')

    useEffect(() => {
      onChangeRef.current = onChange
    }, [onChange])

    // Функция для получения полного номера без изменения input.value
    const getFullNumber = (): string => {
      if (!maskRef.current) return ''
      const unmasked = maskRef.current.unmaskedValue
      if (!unmasked) return ''
      return dialCodeRef.current + unmasked
    }

    useImperativeHandle(ref, () => ({
      getNumber: () => {
        return getFullNumber()
      },
      isValidNumber: () => {
        if (!itiRef.current || !inputRef.current || !maskRef.current) return false
        
        const unmasked = maskRef.current.unmaskedValue
        if (!unmasked) return false
        
        // Проверяем минимальную длину номера (10 цифр для RU/KZ)
        const countryCode = itiRef.current.getSelectedCountryData()?.iso2?.toLowerCase() || 'ru'
        const minLength = (countryCode === 'ru' || countryCode === 'kz') ? 10 : 9
        
        return unmasked.length >= minLength
      },
    }))

    useEffect(() => {
      if (inputRef.current && !itiRef.current) {
        const input = inputRef.current

        // Инициализируем intl-tel-input
        const options = {
          initialCountry: 'ru',
          countryOrder: ['ru', 'kz', 'by', 'ua'],
          separateDialCode: true,
          formatOnDisplay: false,
          nationalMode: true,
          countrySearch: true,
          autoPlaceholder: 'off', // Отключаем, будем управлять сами
          loadUtilsOnInit: () => import('intl-tel-input/utils'),
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        itiRef.current = intlTelInput(input, options as any)

        // Получаем начальную страну
        const countryData = itiRef.current.getSelectedCountryData()
        const countryCode = countryData?.iso2?.toLowerCase() || 'ru'
        dialCodeRef.current = '+' + (countryData?.dialCode || '7')
        const maskPattern = getMaskPattern(countryCode)

        // Устанавливаем placeholder
        input.placeholder = getPlaceholder(countryCode) || placeholder

        // Инициализируем IMask с lazy: true (не показываем маску пока не начнется ввод)
        maskRef.current = IMask(input, {
          mask: maskPattern,
          lazy: true, // Маска применяется только при вводе
        })

        // Обновляем значение при изменении маски
        maskRef.current.on('accept', () => {
          const fullNumber = getFullNumber()
          onChangeRef.current(fullNumber)
        })

        // Обновляем маску при смене страны
        input.addEventListener('countrychange', () => {
          const newCountryData = itiRef.current?.getSelectedCountryData()
          const newCountryCode = newCountryData?.iso2?.toLowerCase() || 'ru'
          dialCodeRef.current = '+' + (newCountryData?.dialCode || '7')
          const newMaskPattern = getMaskPattern(newCountryCode)

          // Обновляем placeholder
          input.placeholder = getPlaceholder(newCountryCode) || placeholder

          // Пересоздаем маску с новым паттерном
          if (maskRef.current) {
            maskRef.current.destroy()
          }

          maskRef.current = IMask(input, {
            mask: newMaskPattern,
            lazy: true,
          })

          maskRef.current.on('accept', () => {
            const fullNumber = getFullNumber()
            onChangeRef.current(fullNumber)
          })

          // Уведомляем об изменении
          const fullNumber = getFullNumber()
          onChangeRef.current(fullNumber)
        })

        // Валидация при blur
        input.addEventListener('blur', () => {
          const trimmedValue = input.value.trim()
          
          // Не валидируем, если поле пустое
          if (!trimmedValue) {
            input.classList.remove('error', 'valid')
            return
          }
          
          // Проверяем валидность через наш метод
          const unmasked = maskRef.current?.unmaskedValue || ''
          const countryCode = itiRef.current?.getSelectedCountryData()?.iso2?.toLowerCase() || 'ru'
          const minLength = (countryCode === 'ru' || countryCode === 'kz') ? 10 : 9
          
          if (unmasked.length >= minLength) {
            input.classList.remove('error')
            input.classList.add('valid')
          } else {
            input.classList.add('error')
            input.classList.remove('valid')
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
    }, [placeholder])

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
