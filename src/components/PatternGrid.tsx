"use client";\n\nimport { useEffect, useRef, useState } from 'react';\nimport styled from 'styled-components';\nimport { createNoise2D } from 'simplex-noise';\n\nconst Container = styled.div`\n  display: grid;\n  grid-template-columns: repeat(2, 1fr);\n  gap: 20px;\n  padding: 20px;\n  background: #000;\n  width: 100%;\n  max-width: 1200px;\n  margin: 0 auto;\n`;\n\nconst PatternContainer = styled.div`\n  position: relative;\n  aspect-ratio: 1;\n  background: #111;\n  border: 2px solid #0f0;\n  cursor: pointer;\n  transition: transform 0.2s;\n\n  &:hover {\n    transform: scale(1.02);\n  }\n`;\n\nconst Canvas = styled.canvas`\n  width: 100%;\n  height: 100%;\n`;\n\nconst Controls = styled.div`\n  position: fixed;\n  bottom: 20px;\n  left: 50%;\n  transform: translateX(-50%);\n  display: flex;\n  gap: 20px;\n  z-index: 10;\n`;\n\nconst Button = styled.button`\n  background: #000;\n  color: #0f0;\n  border: 2px solid #0f0;\n  padding: 10px 20px;\n  font-family: monospace;\n  font-size: 16px;\n  cursor: pointer;\n  transition: all 0.2s;\n\n  &:hover {\n    background: #0f0;\n    color: #000;\n  }\n`;\n\ninterface Pattern {\n  type: 'noise' | 'geometric' | 'mathematical' | 'fractal';\n  seed: number;\n  colorScheme: string[];\n}\n\nexport default function PatternGrid() {\n  const [patterns, setPatterns] = useState<Pattern[]>([]);\n  const [isLoading, setIsLoading] = useState(true);\n  const [loadingText, setLoadingText] = useState('');\n  const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([]);\n\n  const colorSchemes = [\n    ['#ff0000', '#00ff00', '#0000ff'],\n    ['#ff00ff', '#00ffff', '#ffff00'],\n    ['#ff8800', '#00ff88', '#8800ff'],\n    ['#88ff00', '#0088ff', '#ff0088']\n  ];\n\n  const generatePattern = async (canvas: HTMLCanvasElement, pattern: Pattern) => {\n    const ctx = canvas.getContext('2d');\n    if (!ctx) return;\n\n    const { width, height } = canvas;\n    const noise2D = createNoise2D();\n\n    switch (pattern.type) {\n      case 'noise':\n        const imageData = ctx.createImageData(width, height);\n        for (let x = 0; x < width; x++) {\n          for (let y = 0; y < height; y++) {\n            const value = (noise2D(x / 50, y / 50) + 1) / 2;\n            const index = (y * width + x) * 4;\n            const color = pattern.colorScheme[Math.floor(value * pattern.colorScheme.length)];\n            const [r, g, b] = color.match(/\\w\\w/g)?.map(x => parseInt(x, 16)) || [0, 0, 0];\n            imageData.data[index] = r;\n            imageData.data[index + 1] = g;\n            imageData.data[index + 2] = b;\n            imageData.data[index + 3] = 255;\n          }\n        }\n        ctx.putImageData(imageData, 0, 0);\n        break;\n\n      case 'geometric':\n        ctx.fillStyle = '#000';\n        ctx.fillRect(0, 0, width, height);\n        for (let i = 0; i < 50; i++) {\n          const color = pattern.colorScheme[i % pattern.colorScheme.length];\n          ctx.strokeStyle = color;\n          ctx.beginPath();\n          ctx.arc(\n            width / 2,\n            height / 2,\n            (Math.min(width, height) / 2) * (i / 50),\n            0,\n            Math.PI * 2\n          );\n          ctx.stroke();\n        }\n        break;\n\n      case 'mathematical':\n        ctx.fillStyle = '#000';\n        ctx.fillRect(0, 0, width, height);\n        const points = [];\n        for (let t = 0; t < Math.PI * 20; t += 0.1) {\n          const x = width / 2 + Math.cos(t) * (t * 2);\n          const y = height / 2 + Math.sin(t) * (t * 2);\n          points.push([x, y]);\n        }\n        ctx.strokeStyle = pattern.colorScheme[0];\n        ctx.beginPath();\n        ctx.moveTo(points[0][0], points[0][1]);\n        points.forEach(([x, y]) => ctx.lineTo(x, y));\n        ctx.stroke();\n        break;\n\n      case 'fractal':\n        ctx.fillStyle = '#000';\n        ctx.fillRect(0, 0, width, height);\n        const maxIterations = 100;\n        const scale = 4 / Math.min(width, height);\n        for (let x = 0; x < width; x++) {\n          for (let y = 0; y < height; y++) {\n            let zx = (x - width / 2) * scale;\n            let zy = (y - height / 2) * scale;\n            let i = 0;\n            while (zx * zx + zy * zy < 4 && i < maxIterations) {\n              const temp = zx * zx - zy * zy + pattern.seed / 100;\n              zy = 2 * zx * zy + pattern.seed / 100;\n              zx = temp;\n              i++;\n            }\n            const color = pattern.colorScheme[Math.floor((i / maxIterations) * pattern.colorScheme.length)];\n            ctx.fillStyle = color;\n            ctx.fillRect(x, y, 1, 1);\n          }\n        }\n        break;\n    }\n  };\n\n  const generateNewPatterns = async () => {\n    setIsLoading(true);\n    setLoadingText('Initializing pattern generation...');\n\n    const types: Pattern['type'][] = ['noise', 'geometric', 'mathematical', 'fractal'];\n    const newPatterns = Array(4).fill(null).map(() => ({\n      type: types[Math.floor(Math.random() * types.length)],\n      seed: Math.random() * 100,\n      colorScheme: colorSchemes[Math.floor(Math.random() * colorSchemes.length)]\n    }));\n\n    setPatterns(newPatterns);\n    setLoadingText('Generating patterns...');\n\n    await new Promise(resolve => setTimeout(resolve, 100));\n\n    canvasRefs.current.forEach((canvas, i) => {\n      if (canvas) {\n        canvas.width = 500;\n        canvas.height = 500;\n        generatePattern(canvas, newPatterns[i]);\n      }\n    });\n\n    setLoadingText('Finalizing...');\n    await new Promise(resolve => setTimeout(resolve, 500));\n    setIsLoading(false);\n  };\n\n  const savePattern = (canvas: HTMLCanvasElement) => {\n    const link = document.createElement('a');\n    link.download = `trippy-art-${Date.now()}.png`;\n    link.href = canvas.toDataURL();\n    link.click();\n  };\n\n  const saveAllPatterns = () => {\n    canvasRefs.current.forEach((canvas) => {\n      if (canvas) savePattern(canvas);\n    });\n  };\n\n  useEffect(() => {\n    generateNewPatterns();\n  }, []);\n\n  const setCanvasRef = (index: number) => (element: HTMLCanvasElement | null) => {\n    canvasRefs.current[index] = element;\n  };\n\n  return (\n    <>\n      <Container>\n        {patterns.map((pattern, i) => (\n          <PatternContainer key={i} onClick={() => canvasRefs.current[i] && savePattern(canvasRefs.current[i]!)}>\n            <Canvas ref={setCanvasRef(i)} />\n          </PatternContainer>\n        ))}\n      </Container>\n      <Controls>\n        <Button onClick={generateNewPatterns}>Generate New Patterns</Button>\n        <Button onClick={saveAllPatterns}>Save All Patterns</Button>\n      </Controls>\n    </>\n  );\n}\n"