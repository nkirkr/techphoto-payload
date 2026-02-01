'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { Application as SplineApplication } from '@splinetool/runtime'

interface HotspotConfig {
  id: number
  title: string
  description: string[]
}

interface Spline3DViewerProps {
  splineUrl?: string
  hotspots?: HotspotConfig[]
}

// Default Spline scene URL
const DEFAULT_SPLINE_URL = 'https://prod.spline.design/CBZN86OgsAQ4Vc1g/scene.splinecode'

// Default hotspot configurations
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
  {
    id: 4,
    title: '11° conical',
    description: ['Switching tablet with implant drivers', 'Straumann type / Korean type'],
  },
]

export const Spline3DViewer: React.FC<Spline3DViewerProps> = ({
  splineUrl = DEFAULT_SPLINE_URL,
  hotspots = DEFAULT_HOTSPOTS,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<SplineApplication | null>(null)
  const hotspotsUpdateLoopRef = useRef<number | null>(null)
  const hotspotElementsRef = useRef<
    Array<{
      element: HTMLDivElement
      cubeObject: any
      textObject: any
      config: HotspotConfig
    }>
  >([])

  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeDescription, setActiveDescription] = useState<HotspotConfig | null>(null)

  // Initialize Spline
  const initSpline = useCallback(async () => {
    if (!canvasRef.current) return

    try {
      // Dynamic import for Spline runtime
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

    // Clear existing hotspots
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
      // Toggle description
      if (activeDescription?.id === config.id) {
        setActiveDescription(null)
        // Trigger camera reset animation if available
        const app = appRef.current
        if (app && textObject && (app as any).emitEventReverse) {
          try {
            ;(app as any).emitEventReverse('mouseDown', textObject.uuid)
          } catch (e) {
            console.warn('Could not trigger reverse animation')
          }
        }
      } else {
        setActiveDescription(config)
        // Trigger camera animation to hotspot
        const app = appRef.current
        if (app && textObject && (app as any).emitEvent) {
          try {
            ;(app as any).emitEvent('mouseDown', textObject.uuid)
          } catch (e) {
            console.warn('Could not trigger camera animation')
          }
        }
      }
    },
    [activeDescription],
  )

  // Close description on click
  const handleDescriptionClick = useCallback(() => {
    setActiveDescription(null)
  }, [])

  // Update hotspots positions based on 3D objects
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

  // Convert world coordinates to screen coordinates
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

  // Start hotspots update loop
  const startHotspotsUpdate = useCallback(() => {
    const loop = () => {
      if (!appRef.current) return
      updateHotspotsPositions()
      hotspotsUpdateLoopRef.current = requestAnimationFrame(loop)
    }
    hotspotsUpdateLoopRef.current = requestAnimationFrame(loop)
  }, [updateHotspotsPositions])

  // Stop hotspots update loop
  const stopHotspotsUpdate = useCallback(() => {
    if (hotspotsUpdateLoopRef.current) {
      cancelAnimationFrame(hotspotsUpdateLoopRef.current)
      hotspotsUpdateLoopRef.current = null
    }
  }, [])

  // Initialize on mount
  useEffect(() => {
    initSpline()

    return () => {
      stopHotspotsUpdate()
      // Dispose Spline app
      if (appRef.current && typeof (appRef.current as any).dispose === 'function') {
        ;(appRef.current as any).dispose()
      }
      appRef.current = null
    }
  }, [initSpline, stopHotspotsUpdate])

  return (
    <div className="viewer-3d" ref={containerRef}>
      <div className="viewer-3d__container">
        <div className="viewer-3d__spline-wrapper">
          <canvas ref={canvasRef} className="viewer-3d__canvas" />
          <div className="viewer-3d__hotspots" />

          {/* 360 icon hint */}
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

        {/* Description tooltip */}
        {activeDescription && (
          <div
            className={`viewer-3d__description ${activeDescription ? 'visible' : ''}`}
            onClick={handleDescriptionClick}
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
    </div>
  )
}

export default Spline3DViewer
