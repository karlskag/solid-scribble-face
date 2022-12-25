import './styles.css'
import { createSignal } from "solid-js";

let canvas: HTMLCanvasElement

export const Canvas = () => {
  const [isDrawing, setDrawing] = createSignal(false)

  const handleMouseDown = (e: MouseEvent) => {
    setDrawing(true)
    const { x, y } = e
    const ctx = canvas.getContext('2d')

    if (ctx) {
      const transformedCoords = { x: x - canvas.offsetLeft, y: y - canvas.offsetTop }
      ctx.strokeStyle = 'black'
      ctx.beginPath()
      ctx.moveTo(transformedCoords.x, transformedCoords.y)
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    setDrawing(false)
  }

  const handleMouseMove= (e: MouseEvent) => {
    if (isDrawing()) {
      const { x, y } = e
      const ctx = canvas.getContext('2d')

      if (ctx) {
        const transformedCoords = { x: x - canvas.offsetLeft, y: y - canvas.offsetTop }
        ctx.lineTo(transformedCoords.x, transformedCoords.y)
        ctx.closePath()
        ctx.stroke()
      }
    }
  }

  return <canvas
    ref={canvas}
    class="main-canvas"
    onMouseDown={handleMouseDown}
    onMouseUp={handleMouseUp}
    onMouseMove={handleMouseMove}
    height={600}
    width={600}
  />
}