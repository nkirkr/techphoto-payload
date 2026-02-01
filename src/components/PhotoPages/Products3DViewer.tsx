'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { Application as SplineApplication } from '@splinetool/runtime'

// Конфигурация продуктов для анимации
interface ProductConfig {
  name: string
  title: string
  totalFrames: number
  path: string
  descriptions: DescriptionBlock[]
}

interface DescriptionBlock {
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

interface Products3DViewerProps {
  splineUrl?: string
  products?: ProductConfig[]
  hotspots?: HotspotConfig[]
}

// Default Spline scene URL (для планшета)
const DEFAULT_SPLINE_URL = 'https://prod.spline.design/CBZN86OgsAQ4Vc1g/scene.splinecode'

// Конфигурация по умолчанию для Uniguide
const DEFAULT_PRODUCTS: ProductConfig[] = [
  {
    name: 'Uniguide',
    title: 'Uniguide Kit',
    totalFrames: 182,
    path: '/img/Files/Uniguide',
    descriptions: [
      {
        title: '11° Conical',
        text: ['Switching tablet with implant drivers', 'Straumann type / Korean type'],
        frameStart: 0,
        frameEnd: 33,
        position: 'top-right',
      },
      {
        title: 'Step Drills',
        text: [
          'Allow achieve high torque due to the narrowing towards the apex of the implant',
          'Allow place implants from 6 till 20 mm',
        ],
        frameStart: 34,
        frameEnd: 97,
        position: 'bottom-left',
      },
      {
        title: 'Counter Sink System',
        text: [
          'Allow to change the hole for implants with a straight body to avoid over-torque',
          'Allow to flatten the bone ridge',
        ],
        frameStart: 98,
        frameEnd: 181,
        position: 'top-right',
      },
    ],
  },
]

// Default hotspots for Spline mode
const DEFAULT_HOTSPOTS: HotspotConfig[] = [
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

export const Products3DViewer: React.FC<Products3DViewerProps> = ({
  splineUrl = DEFAULT_SPLINE_URL,
  products = DEFAULT_PRODUCTS,
  hotspots = DEFAULT_HOTSPOTS,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const appRef = useRef<SplineApplication | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const hotspotsUpdateLoopRef = useRef<number | null>(null)
  const hotspotElementsRef = useRef<
    Array<{
      element: HTMLDivElement
      cubeObject: any
      textObject: any
      config: HotspotConfig
    }>
  >([])

  // State
  const [isTablet, setIsTablet] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeDescription, setActiveDescription] = useState<HotspotConfig | null>(null)
  const [currentProductIndex, setCurrentProductIndex] = useState(0)
  const [isLocked, setIsLocked] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [visibleDescription, setVisibleDescription] = useState<DescriptionBlock | null>(null)

  // Images cache
  const imagesRef = useRef<Map<string, HTMLImageElement[]>>(new Map())
  const loadedProductsRef = useRef<Set<string>>(new Set())

  // Check if tablet
  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth <= 1024)
    }
    checkTablet()
    window.addEventListener('resize', checkTablet)
    return () => window.removeEventListener('resize', checkTablet)
  }, [])

  // Check WebP support
  const checkWebPSupport = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      const webP = new Image()
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2)
      }
      webP.src =
        'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
    })
  }, [])

  // Load animation frames
  const loadAnimation = useCallback(
    async (product: ProductConfig) => {
      if (loadedProductsRef.current.has(product.name)) return

      const supportsWebP = await checkWebPSupport()
      const extension = supportsWebP ? 'webp' : 'png'
      const folder = supportsWebP ? 'WEBP' : 'PNG'

      const images: HTMLImageElement[] = []
      const loadPromises: Promise<void>[] = []

      for (let i = 0; i < product.totalFrames; i++) {
        const img = new Image()
        const frameNumber = String(i).padStart(4, '0')
        const filename = `${frameNumber}.${extension}`

        const promise = new Promise<void>((resolve, reject) => {
          img.onload = () => resolve()
          img.onerror = () => reject(new Error(`Failed to load frame ${filename}`))
        })

        img.src = `${product.path}/${folder}/${filename}`
        images[i] = img
        loadPromises.push(promise)
      }

      try {
        await Promise.all(loadPromises)
        imagesRef.current.set(product.name, images)
        loadedProductsRef.current.add(product.name)
        console.log(`Animation ${product.name} loaded (${product.totalFrames} frames)`)
      } catch (err) {
        console.error(`Error loading animation ${product.name}:`, err)
      }
    },
    [checkWebPSupport],
  )

  // Render frame on canvas
  const renderFrame = useCallback(
    (productName: string, frameIndex: number) => {
      const images = imagesRef.current.get(productName)
      const ctx = ctxRef.current
      const canvas = canvasRef.current

      if (!images || !ctx || !canvas || !images[frameIndex]) return

      const img = images[frameIndex]
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const scale = Math.min(canvas.width / img.width, canvas.height / img.height)
      const x = (canvas.width - img.width * scale) / 2
      const y = (canvas.height - img.height * scale) / 2

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale)

      // Update visible description based on frame
      const product = products[currentProductIndex]
      if (product) {
        const desc = product.descriptions.find(
          (d) =>
            frameIndex >= (d.frameStart ?? 0) && frameIndex <= (d.frameEnd ?? product.totalFrames),
        )
        setVisibleDescription(desc || null)
      }
    },
    [products, currentProductIndex],
  )

  // Setup canvas
  const setupCanvas = useCallback(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctxRef.current = ctx

    const rect = container.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
  }, [])

  // Initialize desktop mode (canvas animation)
  const initDesktopMode = useCallback(async () => {
    setupCanvas()

    const product = products[currentProductIndex]
    if (!product) return

    await loadAnimation(product)
    setIsLoading(false)

    // Render first frame
    renderFrame(product.name, 0)
  }, [setupCanvas, products, currentProductIndex, loadAnimation, renderFrame])

  // Initialize Spline (tablet mode)
  const initSpline = useCallback(async () => {
    if (!canvasRef.current) return

    try {
      const { Application } = await import('@splinetool/runtime')

      const app = new Application(canvasRef.current)
      await app.load(splineUrl)

      appRef.current = app
      setIsLoading(false)

      // Create hotspots after loading
      createHotspots()

      // Start hotspots position update loop
      startHotspotsUpdate()
    } catch (err) {
      console.error('Failed to load Spline scene:', err)
      setError('Ошибка загрузки 3D')
      setIsLoading(false)
    }
  }, [splineUrl])

  // Find hotspot objects in Spline scene
  const findHotspotObjects = useCallback(() => {
    const app = appRef.current
    if (!app || !(app as any)._scene) return { cubeObjects: [], textObjects: [] }

    const hotspotNames = ['Hotspot_1', 'Hotspot_2', 'Hotspot_3', 'Hotspot_4']
    const cubeObjects: any[] = []
    const textObjects: any[] = []

    const traverse = (obj: any) => {
      if (hotspotNames.includes(obj.name)) {
        const index = parseInt(obj.name.split('_')[1]) - 1
        cubeObjects[index] = obj
      }
      if (obj.name === 'Text') {
        textObjects.push(obj)
      }
      if (obj.children) {
        obj.children.forEach((child: any) => traverse(child))
      }
    }

    traverse((app as any)._scene)
    return { cubeObjects, textObjects }
  }, [])

  // Create hotspot DOM elements
  const createHotspots = useCallback(() => {
    const container = containerRef.current?.querySelector('.viewer-3d__hotspots')
    if (!container) return

    const { cubeObjects, textObjects } = findHotspotObjects()
    if (cubeObjects.length === 0) return

    container.innerHTML = ''
    hotspotElementsRef.current = []

    hotspots.forEach((config, index) => {
      const cubeObject = cubeObjects[index]
      const textObject = textObjects[index]

      if (!cubeObject) return

      const hotspot = document.createElement('div')
      hotspot.className = 'viewer-3d__hotspot'
      hotspot.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4.16666V15.8333M4.16666 9.99999H15.8333" stroke="white" stroke-width="2" stroke-linecap="round"/>
        </svg>
      `

      hotspot.addEventListener('click', (e) => {
        e.stopPropagation()
        handleHotspotClick(config, textObject)
      })

      container.appendChild(hotspot)

      hotspotElementsRef.current.push({
        element: hotspot as HTMLDivElement,
        cubeObject,
        textObject,
        config,
      })
    })
  }, [hotspots, findHotspotObjects])

  // Handle hotspot click
  const handleHotspotClick = useCallback(
    (config: HotspotConfig, textObject: any) => {
      if (activeDescription?.id === config.id) {
        setActiveDescription(null)
        const app = appRef.current
        if (app && textObject && (app as any).emitEventReverse) {
          try {
            ;(app as any).emitEventReverse('mouseDown', textObject.uuid)
          } catch (e) {}
        }
      } else {
        setActiveDescription(config)
        const app = appRef.current
        if (app && textObject && (app as any).emitEvent) {
          try {
            ;(app as any).emitEvent('mouseDown', textObject.uuid)
          } catch (e) {}
        }
      }
    },
    [activeDescription],
  )

  // Update hotspots positions
  const updateHotspotsPositions = useCallback(() => {
    const app = appRef.current
    if (!app) return

    const camera = (app as any)._camera
    if (!camera) return

    if (camera.updateMatrixWorld) {
      camera.updateMatrixWorld()
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const canvasRect = canvas.getBoundingClientRect()
    if (!canvasRect.width || !canvasRect.height) return

    hotspotElementsRef.current.forEach(({ element, cubeObject }) => {
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

  // Convert world to screen
  const worldToScreen = (
    worldPos: { x: number; y: number; z: number },
    camera: any,
    canvasRect: DOMRect,
  ) => {
    try {
      if (!camera.matrixWorldInverse || !camera.projectionMatrix) {
        return null
      }

      const position = { x: worldPos.x, y: worldPos.y, z: worldPos.z, w: 1 }
      const viewMatrix = camera.matrixWorldInverse.elements
      const projMatrix = camera.projectionMatrix.elements

      const vx =
        position.x * viewMatrix[0] +
        position.y * viewMatrix[4] +
        position.z * viewMatrix[8] +
        viewMatrix[12]
      const vy =
        position.x * viewMatrix[1] +
        position.y * viewMatrix[5] +
        position.z * viewMatrix[9] +
        viewMatrix[13]
      const vz =
        position.x * viewMatrix[2] +
        position.y * viewMatrix[6] +
        position.z * viewMatrix[10] +
        viewMatrix[14]
      const vw =
        position.x * viewMatrix[3] +
        position.y * viewMatrix[7] +
        position.z * viewMatrix[11] +
        viewMatrix[15]

      const px =
        vx * projMatrix[0] + vy * projMatrix[4] + vz * projMatrix[8] + vw * projMatrix[12]
      const py =
        vx * projMatrix[1] + vy * projMatrix[5] + vz * projMatrix[9] + vw * projMatrix[13]
      const pw =
        vx * projMatrix[3] + vy * projMatrix[7] + vz * projMatrix[11] + vw * projMatrix[15]

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

  // Handle wheel for scroll animation (desktop only)
  useEffect(() => {
    if (isTablet) return

    const handleWheel = (e: WheelEvent) => {
      const section = sectionRef.current
      if (!section) return

      const rect = section.getBoundingClientRect()
      const viewportHeight = window.innerHeight

      // Check if section is in view
      const sectionInView = rect.top < viewportHeight && rect.bottom > 0

      if (!sectionInView) return

      // Lock zone check
      const bottomDiff = Math.abs(rect.bottom - 50 - viewportHeight)
      const topDiff = Math.abs(rect.top - 70)
      const inLockZone = bottomDiff < 100 || topDiff < 100

      if (!isLocked && inLockZone && e.deltaY > 0) {
        e.preventDefault()
        setIsLocked(true)
        setScrollProgress(0)
        return
      }

      if (isLocked) {
        e.preventDefault()

        const delta = e.deltaY
        const sensitivity = 0.0005
        const newProgress = Math.max(0, Math.min(1, scrollProgress + delta * sensitivity))

        setScrollProgress(newProgress)

        const product = products[currentProductIndex]
        if (product) {
          const targetFrame = Math.floor(newProgress * (product.totalFrames - 1))
          setCurrentFrame(targetFrame)
          renderFrame(product.name, targetFrame)
        }

        // Unlock at boundaries
        if (newProgress >= 1 && delta > 0) {
          setIsLocked(false)
        } else if (newProgress <= 0 && delta < 0) {
          setIsLocked(false)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [isTablet, isLocked, scrollProgress, products, currentProductIndex, renderFrame])

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
      const product = products[currentProductIndex]
      if (product && loadedProductsRef.current.has(product.name)) {
        renderFrame(product.name, currentFrame)
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isTablet, setupCanvas, products, currentProductIndex, currentFrame, renderFrame])

  return (
    <section className="viewer-3d" ref={sectionRef}>
      <div className="viewer-3d__container" ref={containerRef}>
        <div className="viewer-3d__spline-wrapper">
          <canvas ref={canvasRef} className="viewer-3d__canvas" />

          {/* Hotspots container (tablet only) */}
          {isTablet && <div className="viewer-3d__hotspots" />}

          {/* 360 icon hint (tablet only) */}
          {isTablet && (
            <div className="viewer-3d__360-icon" aria-hidden="true">
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
          )}

          {/* Loader */}
          {isLoading && (
            <div className="viewer-3d__loader">
              <div className="viewer-3d__spinner" />
              <span className="viewer-3d__loader-text">Загрузка 3D...</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="viewer-3d__loader">
              <span className="viewer-3d__loader-text" style={{ color: '#ef4444' }}>
                {error}
              </span>
            </div>
          )}
        </div>

        {/* Desktop description (based on frame) */}
        {!isTablet && visibleDescription && (
          <div
            className={`viewer-3d__description visible ${visibleDescription.position === 'bottom-left' ? 'viewer-3d__description--bottom-left' : ''}`}
          >
            <h3 className="viewer-3d__description-title">{visibleDescription.title}</h3>
            <ul className="viewer-3d__description-text">
              {visibleDescription.text.map((text, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: text }} />
              ))}
            </ul>
          </div>
        )}

        {/* Tablet description (based on hotspot click) */}
        {isTablet && activeDescription && (
          <div
            className={`viewer-3d__description visible`}
            onClick={() => setActiveDescription(null)}
          >
            <div className="viewer-3d__description-badge">{activeDescription.id}</div>
            <h3 className="viewer-3d__description-title">{activeDescription.title}</h3>
            <ul className="viewer-3d__description-text">
              {activeDescription.description.map((text, index) => (
                <li key={index} dangerouslySetInnerHTML={{ __html: text }} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}

export default Products3DViewer
