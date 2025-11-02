'use client'

import { useState, useRef, useEffect } from 'react'
import styles from './page.module.css'

type PatternType = 'geometric' | 'organic' | 'grid' | 'radial' | 'fractal' | 'tessellation'

interface PatternConfig {
  type: PatternType
  density: number
  complexity: number
  colorScheme: string[]
  symmetry: number
  scale: number
  rotation: number
}

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [config, setConfig] = useState<PatternConfig>({
    type: 'geometric',
    density: 50,
    complexity: 5,
    colorScheme: ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
    symmetry: 4,
    scale: 1,
    rotation: 0
  })
  const [isGenerating, setIsGenerating] = useState(false)

  useEffect(() => {
    generatePattern()
  }, [config])

  const generatePattern = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    setIsGenerating(true)

    // Clear canvas
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Generate pattern based on type
    switch (config.type) {
      case 'geometric':
        drawGeometric(ctx, canvas.width, canvas.height)
        break
      case 'organic':
        drawOrganic(ctx, canvas.width, canvas.height)
        break
      case 'grid':
        drawGrid(ctx, canvas.width, canvas.height)
        break
      case 'radial':
        drawRadial(ctx, canvas.width, canvas.height)
        break
      case 'fractal':
        drawFractal(ctx, canvas.width, canvas.height)
        break
      case 'tessellation':
        drawTessellation(ctx, canvas.width, canvas.height)
        break
    }

    setTimeout(() => setIsGenerating(false), 100)
  }

  const drawGeometric = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const shapes = Math.floor(config.density / 2)
    const sizeRange = config.complexity * 20

    for (let i = 0; i < shapes; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const size = Math.random() * sizeRange + 20
      const color = config.colorScheme[Math.floor(Math.random() * config.colorScheme.length)]
      const sides = Math.floor(Math.random() * config.complexity) + 3

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((config.rotation + Math.random() * 360) * Math.PI / 180)
      ctx.scale(config.scale, config.scale)

      ctx.beginPath()
      for (let j = 0; j < sides; j++) {
        const angle = (j / sides) * Math.PI * 2
        const px = Math.cos(angle) * size
        const py = Math.sin(angle) * size
        if (j === 0) ctx.moveTo(px, py)
        else ctx.lineTo(px, py)
      }
      ctx.closePath()

      ctx.fillStyle = color + '80'
      ctx.fill()
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()

      ctx.restore()
    }
  }

  const drawOrganic = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const curves = Math.floor(config.density / 3)

    for (let i = 0; i < curves; i++) {
      const x = Math.random() * width
      const y = Math.random() * height
      const color = config.colorScheme[Math.floor(Math.random() * config.colorScheme.length)]

      ctx.save()
      ctx.translate(x, y)
      ctx.rotate((config.rotation + Math.random() * 360) * Math.PI / 180)
      ctx.scale(config.scale, config.scale)

      ctx.beginPath()
      ctx.moveTo(0, 0)

      for (let j = 0; j < config.complexity + 3; j++) {
        const cpx1 = Math.random() * 100 - 50
        const cpy1 = Math.random() * 100 - 50
        const cpx2 = Math.random() * 100 - 50
        const cpy2 = Math.random() * 100 - 50
        const x2 = Math.random() * 100 - 50
        const y2 = Math.random() * 100 - 50
        ctx.bezierCurveTo(cpx1, cpy1, cpx2, cpy2, x2, y2)
      }

      ctx.strokeStyle = color
      ctx.lineWidth = config.complexity
      ctx.stroke()

      ctx.restore()
    }
  }

  const drawGrid = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const cellSize = Math.max(20, 100 - config.density)
    const cols = Math.floor(width / cellSize)
    const rows = Math.floor(height / cellSize)

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        if (Math.random() > 0.3) {
          const x = j * cellSize
          const y = i * cellSize
          const color = config.colorScheme[Math.floor(Math.random() * config.colorScheme.length)]

          ctx.save()
          ctx.translate(x + cellSize / 2, y + cellSize / 2)
          ctx.rotate((config.rotation + (i + j) * 15) * Math.PI / 180)
          ctx.scale(config.scale, config.scale)

          const pattern = Math.floor(Math.random() * config.complexity)

          if (pattern === 0) {
            ctx.fillStyle = color + '80'
            ctx.fillRect(-cellSize / 2, -cellSize / 2, cellSize, cellSize)
          } else if (pattern === 1) {
            ctx.beginPath()
            ctx.arc(0, 0, cellSize / 2, 0, Math.PI * 2)
            ctx.fillStyle = color + '80'
            ctx.fill()
          } else if (pattern === 2) {
            ctx.beginPath()
            ctx.moveTo(-cellSize / 2, -cellSize / 2)
            ctx.lineTo(cellSize / 2, -cellSize / 2)
            ctx.lineTo(0, cellSize / 2)
            ctx.closePath()
            ctx.fillStyle = color + '80'
            ctx.fill()
          } else {
            ctx.strokeStyle = color
            ctx.lineWidth = 2
            ctx.beginPath()
            ctx.moveTo(-cellSize / 2, -cellSize / 2)
            ctx.lineTo(cellSize / 2, cellSize / 2)
            ctx.moveTo(cellSize / 2, -cellSize / 2)
            ctx.lineTo(-cellSize / 2, cellSize / 2)
            ctx.stroke()
          }

          ctx.restore()
        }
      }
    }
  }

  const drawRadial = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2
    const maxRadius = Math.min(width, height) / 2
    const segments = config.symmetry * 2

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(config.rotation * Math.PI / 180)
    ctx.scale(config.scale, config.scale)

    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2
      const color = config.colorScheme[i % config.colorScheme.length]

      for (let j = 0; j < config.complexity; j++) {
        const radius = (j + 1) * (maxRadius / config.complexity)
        const thickness = config.density / 2

        ctx.beginPath()
        ctx.arc(0, 0, radius, angle, angle + (Math.PI * 2 / segments))
        ctx.strokeStyle = color + '80'
        ctx.lineWidth = thickness
        ctx.stroke()
      }
    }

    ctx.restore()
  }

  const drawFractal = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const centerX = width / 2
    const centerY = height / 2

    const drawBranch = (x: number, y: number, length: number, angle: number, depth: number) => {
      if (depth === 0 || length < 2) return

      const x2 = x + Math.cos(angle) * length
      const y2 = y + Math.sin(angle) * length
      const color = config.colorScheme[depth % config.colorScheme.length]

      ctx.beginPath()
      ctx.moveTo(x, y)
      ctx.lineTo(x2, y2)
      ctx.strokeStyle = color
      ctx.lineWidth = depth
      ctx.stroke()

      const newLength = length * 0.7
      const angleStep = (Math.PI / 4) * (config.symmetry / 4)

      for (let i = 0; i < config.symmetry; i++) {
        drawBranch(x2, y2, newLength, angle + angleStep * (i - config.symmetry / 2), depth - 1)
      }
    }

    ctx.save()
    ctx.translate(centerX, centerY)
    ctx.rotate(config.rotation * Math.PI / 180)
    ctx.scale(config.scale, config.scale)

    const initialLength = config.density * 2
    drawBranch(0, 0, initialLength, -Math.PI / 2, config.complexity)

    ctx.restore()
  }

  const drawTessellation = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const tileSize = Math.max(30, 120 - config.density)
    const cols = Math.ceil(width / tileSize) + 1
    const rows = Math.ceil(height / tileSize) + 1

    for (let i = -1; i < rows; i++) {
      for (let j = -1; j < cols; j++) {
        const x = j * tileSize
        const y = i * tileSize
        const color = config.colorScheme[(i + j) % config.colorScheme.length]

        ctx.save()
        ctx.translate(x + tileSize / 2, y + tileSize / 2)
        ctx.rotate((config.rotation + (i + j) * 30) * Math.PI / 180)
        ctx.scale(config.scale, config.scale)

        // Hexagon
        if (config.complexity <= 3) {
          ctx.beginPath()
          for (let k = 0; k < 6; k++) {
            const angle = (k / 6) * Math.PI * 2
            const px = Math.cos(angle) * tileSize / 2
            const py = Math.sin(angle) * tileSize / 2
            if (k === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.closePath()
        }
        // Star
        else if (config.complexity <= 6) {
          ctx.beginPath()
          for (let k = 0; k < 10; k++) {
            const radius = k % 2 === 0 ? tileSize / 2 : tileSize / 4
            const angle = (k / 10) * Math.PI * 2
            const px = Math.cos(angle) * radius
            const py = Math.sin(angle) * radius
            if (k === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.closePath()
        }
        // Complex polygon
        else {
          ctx.beginPath()
          const sides = config.complexity + 3
          for (let k = 0; k < sides; k++) {
            const angle = (k / sides) * Math.PI * 2
            const px = Math.cos(angle) * tileSize / 2
            const py = Math.sin(angle) * tileSize / 2
            if (k === 0) ctx.moveTo(px, py)
            else ctx.lineTo(px, py)
          }
          ctx.closePath()
        }

        ctx.fillStyle = color + '60'
        ctx.fill()
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.stroke()

        ctx.restore()
      }
    }
  }

  const downloadPattern = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `pattern-${config.type}-${Date.now()}.png`
    link.href = canvas.toDataURL()
    link.click()
  }

  const randomizeConfig = () => {
    const types: PatternType[] = ['geometric', 'organic', 'grid', 'radial', 'fractal', 'tessellation']
    const schemes = [
      ['#667eea', '#764ba2', '#f093fb', '#4facfe'],
      ['#fa709a', '#fee140', '#30cfd0', '#330867'],
      ['#a8edea', '#fed6e3', '#ff6e7f', '#bfe9ff'],
      ['#f857a6', '#ff5858', '#feca57', '#48dbfb'],
      ['#00d2ff', '#3a7bd5', '#f093fb', '#f5576c']
    ]

    setConfig({
      type: types[Math.floor(Math.random() * types.length)],
      density: Math.floor(Math.random() * 80) + 20,
      complexity: Math.floor(Math.random() * 8) + 2,
      colorScheme: schemes[Math.floor(Math.random() * schemes.length)],
      symmetry: Math.floor(Math.random() * 8) + 2,
      scale: Math.random() * 1.5 + 0.5,
      rotation: Math.floor(Math.random() * 360)
    })
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Precise Pattern Maker Agent</h1>
        <p className={styles.subtitle}>AI-powered precision pattern generation</p>

        <div className={styles.content}>
          <div className={styles.canvasContainer}>
            <canvas
              ref={canvasRef}
              width={800}
              height={600}
              className={styles.canvas}
            />
            {isGenerating && (
              <div className={styles.generating}>Generating...</div>
            )}
          </div>

          <div className={styles.controls}>
            <div className={styles.controlGroup}>
              <label className={styles.label}>Pattern Type</label>
              <select
                className={styles.select}
                value={config.type}
                onChange={(e) => setConfig({ ...config, type: e.target.value as PatternType })}
              >
                <option value="geometric">Geometric</option>
                <option value="organic">Organic</option>
                <option value="grid">Grid</option>
                <option value="radial">Radial</option>
                <option value="fractal">Fractal</option>
                <option value="tessellation">Tessellation</option>
              </select>
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label}>Density: {config.density}</label>
              <input
                type="range"
                min="10"
                max="100"
                value={config.density}
                onChange={(e) => setConfig({ ...config, density: parseInt(e.target.value) })}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label}>Complexity: {config.complexity}</label>
              <input
                type="range"
                min="1"
                max="10"
                value={config.complexity}
                onChange={(e) => setConfig({ ...config, complexity: parseInt(e.target.value) })}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label}>Symmetry: {config.symmetry}</label>
              <input
                type="range"
                min="2"
                max="12"
                value={config.symmetry}
                onChange={(e) => setConfig({ ...config, symmetry: parseInt(e.target.value) })}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label}>Scale: {config.scale.toFixed(2)}</label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={config.scale}
                onChange={(e) => setConfig({ ...config, scale: parseFloat(e.target.value) })}
                className={styles.slider}
              />
            </div>

            <div className={styles.controlGroup}>
              <label className={styles.label}>Rotation: {config.rotation}°</label>
              <input
                type="range"
                min="0"
                max="360"
                value={config.rotation}
                onChange={(e) => setConfig({ ...config, rotation: parseInt(e.target.value) })}
                className={styles.slider}
              />
            </div>

            <div className={styles.buttonGroup}>
              <button onClick={randomizeConfig} className={styles.button}>
                Randomize
              </button>
              <button onClick={downloadPattern} className={styles.buttonPrimary}>
                Download PNG
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
