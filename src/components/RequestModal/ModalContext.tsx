'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface ModalContextType {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)

  const openModal = useCallback(() => {
    setIsOpen(true)
    document.body.classList.add('modal-open')
  }, [])

  const closeModal = useCallback(() => {
    setIsOpen(false)
    document.body.classList.remove('modal-open')
  }, [])

  return (
    <ModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  )
}

export function useModal() {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}
