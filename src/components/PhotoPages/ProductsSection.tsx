'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { Application as SplineApplication } from '@splinetool/runtime'
import Lenis from 'lenis'

// Конфигурация продуктов
interface ProductConfig {
  name: string
  title: string
  link: string
  totalFrames: number
  path: string
  filePrefix: string
  digits: number
  descriptions: DescriptionConfig[]
}

interface DescriptionConfig {
  title: string
  text: string[]
  frameStart?: number
  frameEnd?: number
  position?: 'top-right' | 'bottom-left'
}

interface HotspotConfig {
  id: number
  title: string
  description: string[]
}

// Конфигурация всех продуктов
const PRODUCTS: ProductConfig[] = [
  {
    name: 'Uniguide',
    title: 'Uniguide Kit',
    link: '/uniguide-kit/',
    totalFrames: 182,
    path: '/img/Files/Uniguide/WEBP',
    filePrefix: '',
    digits: 4,
    descriptions: [
      {
        title: '11° Conical',
        text: ['Switching tablet with implant drivers<br>Straumann type / Korean type'],
        frameStart: 0,
        frameEnd: 33,
        position: 'top-right',
      },
      {
        title: 'Step Drills',
        text: [
          'Allow achive high torque due to the narrowing towards the apex of the implant<br>Allow place implants from 6 till 20 mm',
        ],
        frameStart: 34,
        frameEnd: 97,
        position: 'bottom-left',
      },
      {
        title: 'Counter Sink System',
        text: [
          'Allow to change the hole for implants with a straight body to avoid over-torque<br>Allow to flatten the bone ridge',
        ],
        frameStart: 98,
        frameEnd: 181,
        position: 'top-right',
      },
    ],
  },
  {
    name: 'Box',
    title: 'Hitless Bone tacks Kit',
    link: '/bone-scrapper/',
    totalFrames: 251,
    path: '/img/Files/Box/WEBP',
    filePrefix: 'Box_',
    digits: 5,
    descriptions: [
      {
        title: 'handpiece',
        text: [
          'The heart of the system. Thanks to its rotary motion, allows tacks to be inserted without hitting them. Can be equipped with LED for comfortable work in distant areas',
        ],
        frameStart: 0,
        frameEnd: 36,
        position: 'top-right',
      },
      {
        title: 'tack box',
        text: ['Allows for storage and sterilization of bone tacks<br>Fits 30 bone tacks'],
        frameStart: 37,
        frameEnd: 84,
        position: 'bottom-left',
      },
      {
        title: 'Bone Tacks',
        text: [
          'Allows to fix both membranes and blocks thanks to a wide range of lengths from 3 to 6 mm. Made from high-strength, biocompatible grade 5 titanium',
        ],
        frameStart: 85,
        frameEnd: 250,
        position: 'top-right',
      },
    ],
  },
  {
    name: 'Granules',
    title: 'Granules',
    link: '/granules/',
    totalFrames: 224,
    path: '/img/Files/Granules/WEBP',
    filePrefix: 'Granules_',
    digits: 5,
    descriptions: [
      {
        title: 'Granules',
        text: [
          'Used for sinus lifting, alveolar and periodontal regeneration, and bone augmentation. REGEGRAFT® Granules ensure biocompatibility, osteoconduction, and fast integration with natural bone.',
        ],
        frameStart: 0,
        frameEnd: 72,
        position: 'top-right',
      },
    ],
  },
  {
    name: 'Membrane',
    title: 'Membrane',
    link: '/membrane/',
    totalFrames: 181,
    path: '/img/Files/Membrane/WEBP',
    filePrefix: 'Membrane_rc_',
    digits: 5,
    descriptions: [
      {
        title: 'eRCO Membrane',
        text: [
          'Dense collagen fiber layer -- High resistance to enzymes',
          'Small pore size & High density per unit volume -- Prevent soft tissue growth to bone graft area during new bone formation',
          'Excellent biocompatibility -- Optimal integration with surrounding soft tissue & Low Frequency of membrane exposure',
        ],
        frameStart: 0,
        frameEnd: 151,
        position: 'top-right',
      },
    ],
  },
]

// Default Spline scene URL (для планшета - Uniguide)
const SPLINE_URL = 'https://prod.spline.design/CBZN86OgsAQ4Vc1g/scene.splinecode'

// Hotspots for Spline mode
const HOTSPOTS: HotspotConfig[] = [
  {
    id: 1,
    title: '11° Conical',
    description: ['Switching tablet with implant drivers', 'Straumann type / Korean type'],
  },
  {
    id: 2,
    title: 'Step Drills',
    description: [
      'Allow achieve high torque due to the narrowing towards the apex of the implant',
      'Allow place implants from 6 till 20 mm',
    ],
  },
  {
    id: 3,
    title: 'Counter Sink System',
    description: [
      'Allow to change the hole for implants with a straight body to avoid over-torque',
      'Allow to flatten the bone ridge',
    ],
  },
]

export const ProductsSection: React.FC = () => {
  // Refs
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const splineCanvasRef = useRef<HTMLCanvasElement>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const appRef = useRef<SplineApplication | null>(null)
  const hotspotsContainerRef = useRef<HTMLDivElement>(null)
  const hotspotsUpdateLoopRef = useRef<number | null>(null)
  const lenisRef = useRef<Lenis | null>(null)

  // State
  const [isTablet, setIsTablet] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [showSkipBtn, setShowSkipBtn] = useState(false)
  const [activeSplineDescription, setActiveSplineDescription] = useState<HotspotConfig | null>(
    null,
  )
  const [justUnlocked, setJustUnlocked] = useState(false)
  const [lockDirection, setLockDirection] = useState<'down' | 'up' | null>(null)

  // Refs for instant state tracking (to avoid race conditions with useState)
  const isLockedRef = useRef(false)
  const lockDirectionRef = useRef<'down' | 'up' | null>(null)

  // Images cache
  const imagesRef = useRef<Map<string, HTMLImageElement[]>>(new Map())
  const loadedProductsRef = useRef<Set<string>>(new Set())
  const hotspotElementsRef = useRef<HTMLDivElement[]>([])

  const currentProduct = PRODUCTS[currentProductIndex]

  // Check if tablet
  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth <= 1024)
    }
    checkTablet()
    window.addEventListener('resize', checkTablet)
    return () => window.removeEventListener('resize', checkTablet)
  }, [])

  // Initialize Lenis for smooth scroll (like in erco-theme)
  useEffect(() => {
    if (isTablet) return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    })

    lenisRef.current = lenis

    // Animation loop for Lenis
    const raf = (time: number) => {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [isTablet])

  // Load animation frames
  const loadAnimation = useCallback(async (product: ProductConfig) => {
    if (loadedProductsRef.current.has(product.name)) return true

    const images: HTMLImageElement[] = []
    const loadPromises: Promise<void>[] = []

    for (let i = 0; i < product.totalFrames; i++) {
      const img = new Image()
      const frameNumber = String(i).padStart(product.digits, '0')
      const filename = `${product.filePrefix}${frameNumber}.webp`

      const promise = new Promise<void>((resolve) => {
        img.onload = () => resolve()
        img.onerror = () => resolve() // Don't fail on missing frames
      })

      img.src = `${product.path}/${filename}`
      images[i] = img
      loadPromises.push(promise)
    }

    await Promise.all(loadPromises)
    imagesRef.current.set(product.name, images)
    loadedProductsRef.current.add(product.name)
    return true
  }, [])

  // Render frame on canvas
  const renderFrame = useCallback(
    (productName: string, frameIndex: number) => {
      const images = imagesRef.current.get(productName)
      const ctx = ctxRef.current
      const canvas = canvasRef.current

      if (!images || !ctx || !canvas) return

      const img = images[frameIndex]
      if (!img || !img.complete) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
      const x = (canvas.width - img.width * scale) / 2
      const y = (canvas.height - img.height * scale) / 2

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)
    },
    [],
  )

  // Setup canvas
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctxRef.current = ctx

    const container = canvas.parentElement
    if (!container) return

    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
  }, [])

  // Initialize desktop mode
  const initDesktopMode = useCallback(async () => {
    setupCanvas()
    await loadAnimation(PRODUCTS[0])
    setIsLoading(false)
    renderFrame(PRODUCTS[0].name, 0)
  }, [setupCanvas, loadAnimation, renderFrame])

  // Initialize Spline (tablet mode)
  const initSpline = useCallback(async () => {
    const canvas = splineCanvasRef.current
    if (!canvas) return

    try {
      const { Application } = await import('@splinetool/runtime')
      const app = new Application(canvas)
      await app.load(SPLINE_URL)
      appRef.current = app
      setIsLoading(false)
      createHotspots()
      startHotspotsUpdate()
    } catch (err) {
      console.error('Failed to load Spline scene:', err)
      setIsLoading(false)
    }
  }, [])

  // Create hotspots for Spline
  const createHotspots = useCallback(() => {
    const container = hotspotsContainerRef.current
    if (!container) return

    container.innerHTML = ''
    hotspotElementsRef.current = []

    HOTSPOTS.forEach((config, index) => {
      const hotspot = document.createElement('div')
      hotspot.className = 'products__spline-hotspot'
      hotspot.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4.16666V15.8333M4.16666 9.99999H15.8333" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `

      hotspot.addEventListener('click', (e) => {
        e.stopPropagation()
        if (activeSplineDescription?.id === config.id) {
          setActiveSplineDescription(null)
        } else {
          setActiveSplineDescription(config)
        }
      })

      container.appendChild(hotspot)
      hotspotElementsRef.current.push(hotspot as HTMLDivElement)
    })
  }, [activeSplineDescription])

  // Update hotspots positions
  const updateHotspotsPositions = useCallback(() => {
    const app = appRef.current
    if (!app) return

    const camera = (app as any)._camera
    if (!camera) return

    const canvas = splineCanvasRef.current
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()
    if (!canvasRect.width || !canvasRect.height) return

    // Find hotspot objects
    const hotspotNames = ['Hotspot_1', 'Hotspot_2', 'Hotspot_3']
    const cubeObjects: any[] = []

    const traverse = (obj: any) => {
      if (hotspotNames.includes(obj.name)) {
        const index = parseInt(obj.name.split('_')[1]) - 1
        cubeObjects[index] = obj
      }
      if (obj.children) {
        obj.children.forEach((child: any) => traverse(child))
      }
    }

    if ((app as any)._scene) {
      traverse((app as any)._scene)
    }

    hotspotElementsRef.current.forEach((element, index) => {
      const cubeObject = cubeObjects[index]
      if (!cubeObject) {
        element.style.display = 'none'
        return
      }

      try {
        if (cubeObject.updateMatrixWorld) {
          cubeObject.updateMatrixWorld()
        }

        let worldPos: { x: number; y: number; z: number }
        if (cubeObject.matrixWorld?.elements) {
          const e = cubeObject.matrixWorld.elements
          worldPos = { x: e[12], y: e[13], z: e[14] }
        } else {
          worldPos = cubeObject.position
        }

        const screenPos = worldToScreen(worldPos, camera, canvasRect)

        if (!screenPos || !Number.isFinite(screenPos.x) || !Number.isFinite(screenPos.y)) {
          element.style.display = 'none'
          return
        }

        element.style.left = `${screenPos.x}px`
        element.style.top = `${screenPos.y}px`
        element.style.display = 'flex'
      } catch (error) {
        element.style.display = 'none'
      }
    })
  }, [])

  const worldToScreen = (
    worldPos: { x: number; y: number; z: number },
    camera: any,
    canvasRect: DOMRect,
  ) => {
    try {
      if (!camera.matrixWorldInverse || !camera.projectionMatrix) return null

      const viewMatrix = camera.matrixWorldInverse.elements
      const projMatrix = camera.projectionMatrix.elements

      const vx =
        worldPos.x * viewMatrix[0] +
        worldPos.y * viewMatrix[4] +
        worldPos.z * viewMatrix[8] +
        viewMatrix[12]
      const vy =
        worldPos.x * viewMatrix[1] +
        worldPos.y * viewMatrix[5] +
        worldPos.z * viewMatrix[9] +
        viewMatrix[13]
      const vz =
        worldPos.x * viewMatrix[2] +
        worldPos.y * viewMatrix[6] +
        worldPos.z * viewMatrix[10] +
        viewMatrix[14]
      const vw =
        worldPos.x * viewMatrix[3] +
        worldPos.y * viewMatrix[7] +
        worldPos.z * viewMatrix[11] +
        viewMatrix[15]

      const px = vx * projMatrix[0] + vy * projMatrix[4] + vz * projMatrix[8] + vw * projMatrix[12]
      const py = vx * projMatrix[1] + vy * projMatrix[5] + vz * projMatrix[9] + vw * projMatrix[13]
      const pw = vx * projMatrix[3] + vy * projMatrix[7] + vz * projMatrix[11] + vw * projMatrix[15]

      if (pw <= 0) return null

      const ndcX = px / pw
      const ndcY = py / pw

      const x = (ndcX * 0.5 + 0.5) * canvasRect.width
      const y = (-ndcY * 0.5 + 0.5) * canvasRect.height

      if (!Number.isFinite(x) || !Number.isFinite(y)) return null
      return { x, y }
    } catch (error) {
      return null
    }
  }

  const startHotspotsUpdate = useCallback(() => {
    const loop = () => {
      if (!appRef.current) return
      updateHotspotsPositions()
      hotspotsUpdateLoopRef.current = requestAnimationFrame(loop)
    }
    hotspotsUpdateLoopRef.current = requestAnimationFrame(loop)
  }, [updateHotspotsPositions])

  const stopHotspotsUpdate = useCallback(() => {
    if (hotspotsUpdateLoopRef.current) {
      cancelAnimationFrame(hotspotsUpdateLoopRef.current)
      hotspotsUpdateLoopRef.current = null
    }
  }, [])

  // Handle category click
  const handleCategoryClick = useCallback(
    async (index: number) => {
      if (index === currentProductIndex) return

      setCurrentProductIndex(index)
      setScrollProgress(0)
      setCurrentFrame(0)

      const product = PRODUCTS[index]

      if (!isTablet) {
        if (!loadedProductsRef.current.has(product.name)) {
          setIsLoading(true)
          await loadAnimation(product)
          setIsLoading(false)
        }
        renderFrame(product.name, 0)
      }

      // Update section data attribute for tablet CSS
      if (sectionRef.current) {
        sectionRef.current.dataset.activeAnimation = product.name
      }
    },
    [currentProductIndex, isTablet, loadAnimation, renderFrame],
  )

  // Refs for tracking scroll position
  const lastBottomDiffRef = useRef<number | null>(null)
  const lastTopDiffRef = useRef<number | null>(null)
  const isSwitchingRef = useRef(false)
  const scrollProgressRef = useRef(0)
  const intersectionCheckerRef = useRef<number | null>(null)

  // Sync scrollProgress ref
  useEffect(() => {
    scrollProgressRef.current = scrollProgress
  }, [scrollProgress])

  // Continuous position checker to catch fast scrolls
  useEffect(() => {
    if (isTablet || isLocked) return

    let lastScrollY = window.scrollY
    let lastDirection: 'down' | 'up' = 'down'

    const checkPosition = () => {
      const section = sectionRef.current
      if (!section) {
        intersectionCheckerRef.current = requestAnimationFrame(checkPosition)
        return
      }

      const sectionRect = section.getBoundingClientRect()
      const topDiff = Math.abs(sectionRect.top)
      const currentScrollY = window.scrollY

      // Определяем направление скролла (только если реально двигаемся)
      if (currentScrollY !== lastScrollY) {
        lastDirection = currentScrollY > lastScrollY ? 'down' : 'up'
        lastScrollY = currentScrollY
      }

      // If section top is very close to viewport top and we're not locked yet
      // Force lock to prevent fast scroll bypass
      // Use ref for instant check to avoid race conditions
      if (!isLockedRef.current && !justUnlocked && topDiff < 30) {
        // Set ref immediately to prevent re-triggering
        isLockedRef.current = true
        lockDirectionRef.current = lastDirection
        
        lenisRef.current?.stop()
        document.body.style.overflow = 'hidden'
        setIsLocked(true)
        setLockDirection(lastDirection)
        setScrollProgress(lastDirection === 'down' ? 0 : 1)
        scrollProgressRef.current = lastDirection === 'down' ? 0 : 1
        setShowSkipBtn(true)
        lastTopDiffRef.current = topDiff
      }

      intersectionCheckerRef.current = requestAnimationFrame(checkPosition)
    }

    intersectionCheckerRef.current = requestAnimationFrame(checkPosition)

    return () => {
      if (intersectionCheckerRef.current) {
        cancelAnimationFrame(intersectionCheckerRef.current)
      }
    }
  }, [isTablet, isLocked, justUnlocked])

  // Handle wheel for scroll animation (desktop only)
  // This implements the same logic as erco-theme products-animation.js
  useEffect(() => {
    if (isTablet) return

    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current
      if (!section) return

      const sectionRect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const delta = e.deltaY

      // Calculate distances based on section position
      // For scroll down: lock when section top reaches top of viewport
      const topDiff = Math.abs(sectionRect.top)
      // For scroll up: lock when section top is near top (with small offset for header)
      const topDiffUp = Math.abs(sectionRect.top - 70)
      
      // Distance from bottom
      const bottomDiff = Math.abs(viewportHeight - sectionRect.bottom)

      // Two zones (like in erco-theme):
      // 1. Trigger zone (150px) - animation starts, scroll continues
      // 2. Lock zone (50px) - scroll gets blocked
      const inTriggerZoneTop = topDiff < 150
      const inLockZoneTop = topDiff < 50

      // Check if approaching the top (section moving up to viewport top)
      const isApproachingTop = lastTopDiffRef.current === null || topDiff < lastTopDiffRef.current

      // Reset justUnlocked when far from trigger zone (200px)
      if (justUnlocked) {
        if (topDiff > 200) {
          setJustUnlocked(false)
        }
      }

      // SCROLL DOWN: lock when section top reaches viewport top
      if (!isLocked && !justUnlocked && delta > 0 && inLockZoneTop && isApproachingTop) {
        e.preventDefault()
        e.stopPropagation()
        // Set refs immediately
        isLockedRef.current = true
        lockDirectionRef.current = 'down'
        // Stop Lenis (block scroll)
        lenisRef.current?.stop()
        // Also lock via CSS as fallback
        document.body.style.overflow = 'hidden'
        setIsLocked(true)
        setLockDirection('down')
        setScrollProgress(0)
        scrollProgressRef.current = 0
        setShowSkipBtn(true)
        lastTopDiffRef.current = topDiff
        lastBottomDiffRef.current = bottomDiff
        return
      }

      // SCROLL UP: lock when section top is at ~70px (header offset)
      if (!isLocked && !justUnlocked && delta < 0 && topDiffUp < 50) {
        e.preventDefault()
        e.stopPropagation()
        // Set refs immediately
        isLockedRef.current = true
        lockDirectionRef.current = 'up'
        // Stop Lenis (block scroll)
        lenisRef.current?.stop()
        // Also lock via CSS as fallback
        document.body.style.overflow = 'hidden'
        setIsLocked(true)
        setLockDirection('up')
        setScrollProgress(1)
        scrollProgressRef.current = 1
        setShowSkipBtn(true)
        lastTopDiffRef.current = topDiff
        lastBottomDiffRef.current = bottomDiff
        return
      }

      // Update last values ALWAYS (not just on lock)
      lastTopDiffRef.current = topDiff
      lastBottomDiffRef.current = bottomDiff

      // Debug logging when in trigger zones (removed for production)

      // If locked - control animation with wheel
      if (isLocked) {
        e.preventDefault()

        // Normalize delta for different input devices
        let normalizedDelta = delta
        if (Math.abs(delta) > 50) {
          normalizedDelta = Math.sign(delta) * Math.min(Math.abs(delta), 50)
        }

        const sensitivity = 0.0005 // Animation speed (same as erco-theme)
        const newProgress = Math.max(0, Math.min(1, scrollProgressRef.current + normalizedDelta * sensitivity))

        setScrollProgress(newProgress)
        scrollProgressRef.current = newProgress

        const product = PRODUCTS[currentProductIndex]
        const targetFrame = Math.floor(newProgress * (product.totalFrames - 1))
        setCurrentFrame(targetFrame)
        renderFrame(product.name, targetFrame)

        // Switch animations at boundaries
        if (!isSwitchingRef.current) {
          if (newProgress >= 1 && delta > 0) {
            // Reached last frame, scrolling down - switch to next animation
            isSwitchingRef.current = true

            if (currentProductIndex < PRODUCTS.length - 1) {
              const nextIndex = currentProductIndex + 1
              setCurrentProductIndex(nextIndex)
              setScrollProgress(0)
              scrollProgressRef.current = 0
              setCurrentFrame(0)

              const nextProduct = PRODUCTS[nextIndex]
              if (!loadedProductsRef.current.has(nextProduct.name)) {
                loadAnimation(nextProduct).then(() => {
                  renderFrame(nextProduct.name, 0)
                  setTimeout(() => { isSwitchingRef.current = false }, 100)
                })
              } else {
                renderFrame(nextProduct.name, 0)
                setTimeout(() => { isSwitchingRef.current = false }, 100)
              }
            } else {
              // Last product - unlock scroll
              lenisRef.current?.start()
              document.body.style.overflow = ''
              setIsLocked(false)
              setJustUnlocked(true)
              setShowSkipBtn(false)
              setTimeout(() => { isSwitchingRef.current = false }, 100)
            }
          } else if (newProgress <= 0 && delta < 0) {
            // Reached first frame, scrolling up - switch to previous animation
            isSwitchingRef.current = true

            if (currentProductIndex > 0) {
              const prevIndex = currentProductIndex - 1
              setCurrentProductIndex(prevIndex)

              const prevProduct = PRODUCTS[prevIndex]
              if (!loadedProductsRef.current.has(prevProduct.name)) {
                loadAnimation(prevProduct).then(() => {
                  setScrollProgress(1)
                  scrollProgressRef.current = 1
                  setCurrentFrame(prevProduct.totalFrames - 1)
                  renderFrame(prevProduct.name, prevProduct.totalFrames - 1)
                  setTimeout(() => { isSwitchingRef.current = false }, 100)
                })
              } else {
                setScrollProgress(1)
                scrollProgressRef.current = 1
                setCurrentFrame(prevProduct.totalFrames - 1)
                renderFrame(prevProduct.name, prevProduct.totalFrames - 1)
                setTimeout(() => { isSwitchingRef.current = false }, 100)
              }
            } else {
              // First product - unlock scroll
              lenisRef.current?.start()
              document.body.style.overflow = ''
              setIsLocked(false)
              setJustUnlocked(true)
              setShowSkipBtn(false)
              setTimeout(() => { isSwitchingRef.current = false }, 100)
            }
          }
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [
    isTablet,
    isLocked,
    justUnlocked,
    currentProductIndex,
    renderFrame,
    loadAnimation,
  ])

  // Handle skip button
  const handleSkip = useCallback(() => {
    if (!isLockedRef.current) {
      return
    }

    // ВАЖНО: Сохраняем направление ПЕРЕД разблокировкой (как в erco-theme)
    // Используем ref для мгновенного значения
    const direction = lockDirectionRef.current

    // Разблокируем скролл (точный порядок из erco-theme)
    // Сначала refs для мгновенного эффекта
    isLockedRef.current = false
    lockDirectionRef.current = null
    // Потом state
    setIsLocked(false)
    setLockDirection(null) // Сбрасываем направление
    setJustUnlocked(true)

    // Возобновляем Lenis
    lenisRef.current?.start()
    // Возобновляем CSS scroll
    document.body.style.overflow = ''

    // Скрываем кнопку
    setShowSkipBtn(false)

    // Reset after delay
    setTimeout(() => setJustUnlocked(false), 1500)

    // Определяем целевой блок в зависимости от направления
    const section = sectionRef.current
    if (!section) {
      return
    }

    let targetSection: HTMLElement | null = null

    if (direction === 'down') {
      // Скролл сверху вниз - переходим к следующему блоку
      targetSection = section.nextElementSibling as HTMLElement
    } else if (direction === 'up') {
      // Скролл снизу вверх - переходим к предыдущему блоку
      targetSection = section.previousElementSibling as HTMLElement
    }

    if (targetSection) {
      const lenis = lenisRef.current
      const targetY = targetSection.offsetTop

      if (lenis) {
        // Плавная прокрутка к целевому блоку (как в erco-theme)
        lenis.scrollTo(targetY, {
          duration: 1.5,
          easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          offset: 0,
        })
      } else {
        // Fallback на обычный скролл
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: direction === 'down' ? 'start' : 'end',
        })
      }
    }
  }, []) // Using refs instead of state, no dependencies needed

  // Initialize based on mode
  useEffect(() => {
    if (isTablet) {
      initSpline()
    } else {
      initDesktopMode()
    }

    return () => {
      stopHotspotsUpdate()
      if (appRef.current && typeof (appRef.current as any).dispose === 'function') {
        ;(appRef.current as any).dispose()
      }
      appRef.current = null
    }
  }, [isTablet, initSpline, initDesktopMode, stopHotspotsUpdate])

  // Handle resize
  useEffect(() => {
    if (isTablet) return

    const handleResize = () => {
      setupCanvas()
      const product = PRODUCTS[currentProductIndex]
      if (loadedProductsRef.current.has(product.name)) {
        renderFrame(product.name, currentFrame)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isTablet, setupCanvas, currentProductIndex, currentFrame, renderFrame])

  return (
    <section
      className="products page-section"
      ref={sectionRef}
      data-active-animation={currentProduct.name}
    >

      <div className="products__content">
        <div className="container products__container">
          {/* Categories */}
          <div className="products__categories">
            {PRODUCTS.map((product, index) => (
              <button
                key={product.name}
                className={`products__category ${index === currentProductIndex ? 'active' : ''}`}
                data-animation={product.name}
                data-link={product.link}
                onClick={() => handleCategoryClick(index)}
              >
                <span className="products__category-dot"></span>
                <span className="products__category-text">
                  <span className="products__category-number">{`{0${index + 1}}`}</span>
                  {product.title}
                </span>
              </button>
            ))}
          </div>

          {/* Animation area */}
          <div className="products__animation">
            {/* Canvas for desktop */}
            <canvas
              id="productsCanvas"
              ref={canvasRef}
              className="products__canvas"
              style={{ display: isTablet ? 'none' : 'block' }}
            />

            {/* Spline wrapper for tablet */}
            <div
              className="products__spline-wrapper"
              style={{ display: isTablet && currentProduct.name === 'Uniguide' ? 'block' : 'none' }}
            >
              <canvas id="spline3d" ref={splineCanvasRef} />
              <div className="products__spline-hotspots" ref={hotspotsContainerRef} />

              {/* 360 icon */}
              <div className="products__spline-360" aria-hidden="true">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="84"
                  height="84"
                  viewBox="0 0 256 256"
                >
                  <g
                    style={{
                      stroke: 'none',
                      fill: 'none',
                      fillRule: 'nonzero',
                      opacity: 1,
                    }}
                    transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                  >
                    <path
                      d="M 45 58.961 c -21.815 0 -45 -4.48 -45 -12.785 c 0 -4.981 8.321 -8.037 15.301 -9.724 c 0.537 -0.127 1.077 0.2 1.207 0.737 c 0.129 0.537 -0.2 1.077 -0.737 1.207 C 7.276 40.449 2 43.43 2 46.176 c 0 5.102 17.66 10.785 43 10.785 c 0.552 0 1 0.447 1 1 S 45.552 58.961 45 58.961 z"
                      style={{ fill: 'rgb(0,0,0)' }}
                    />
                    <path
                      d="M 59.739 58.283 c -0.51 0 -0.945 -0.388 -0.994 -0.905 c -0.053 -0.55 0.351 -1.038 0.9 -1.09 C 78.261 54.516 88 49.859 88 46.176 c 0 -2.746 -5.276 -5.727 -13.771 -7.78 c -0.536 -0.13 -0.866 -0.67 -0.736 -1.207 c 0.13 -0.537 0.671 -0.864 1.207 -0.737 C 81.679 38.139 90 41.195 90 46.176 c 0 6.807 -15.582 10.715 -30.165 12.103 C 59.803 58.282 59.771 58.283 59.739 58.283 z"
                      style={{ fill: 'rgb(0,0,0)' }}
                    />
                    <path
                      d="M 39.827 64.152 c -0.256 0 -0.512 -0.098 -0.707 -0.293 c -0.391 -0.391 -0.391 -1.023 0 -1.414 l 4.484 -4.484 l -4.484 -4.484 c -0.391 -0.391 -0.391 -1.023 0 -1.414 s 1.023 -0.391 1.414 0 l 5.191 5.191 c 0.391 0.391 0.391 1.023 0 1.414 l -5.191 5.191 C 40.339 64.055 40.083 64.152 39.827 64.152 z"
                      style={{ fill: 'rgb(0,0,0)' }}
                    />
                  </g>
                </svg>
              </div>

              {/* Loader */}
              {isLoading && (
                <div className="products__spline-loader">
                  <div className="products__spline-spinner"></div>
                  <span className="products__spline-loader-text">Загрузка 3D...</span>
                </div>
              )}
            </div>
          </div>

          {/* Skip Animation Button */}
          <button
            className={`products__skip-btn ${showSkipBtn ? 'visible' : ''}`}
            onClick={handleSkip}
            aria-label="Skip animation"
          >
            <span>Пропустить анимацию</span>
          </button>

        </div>
      </div>
    </section>
  )
}

export default ProductsSection
