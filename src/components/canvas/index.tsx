import './styles.css'
import {createEffect, createSignal, onMount} from "solid-js";
import {GameState} from "~/components/game-stage";

let canvas: HTMLCanvasElement
const getImgUrl = () => `url(images/obj_${Math.floor(Math.random() * 10) + 1 }.jpeg)`

type CanvasProps = {
  onStartGame: () => void
  onResetGame: () => void
  gameStatus: GameState['status']
}

export const Canvas = (props: CanvasProps) => {
  const [isDrawing, setDrawing] = createSignal(false)
  const [imgUrl, setImgUrl] = createSignal(getImgUrl())

  createEffect(() => {
    if (props.gameStatus === 'ENDED') {
      toggleBackground()
    }
  })

  onMount(() => {
    canvas.style.backgroundImage = imgUrl()
    canvas.style.backgroundPosition = 'center'
    canvas.style.backgroundRepeat = 'no-repeat'
    canvas.style.backgroundSize = 'contain'
  })

  createEffect(() => {
    canvas.style.backgroundImage = imgUrl()
  })

  const handleMouseDown = (e: MouseEvent) => {
    setDrawing(true)
    props.onStartGame()

    const { x, y } = e
    const ctx = canvas.getContext('2d')

    if (ctx) {
      const transformedCoords = { x: x - canvas.offsetLeft, y: y - canvas.offsetTop }
      ctx.strokeStyle = 'red'
      ctx.beginPath()
      ctx.moveTo(transformedCoords.x, transformedCoords.y)
    }
  }

  const handleMouseUp = (e: MouseEvent) => {
    setDrawing(false)
  }

  const handleMouseLeave = (e: MouseEvent) => {
    setDrawing(false)
  }

  const handleMouseMove= (e: MouseEvent) => {
    if (isDrawing()) {
      const { x, y } = e
      const ctx = canvas.getContext('2d')

      if (ctx) {
        const transformedCoords = { x: x - canvas.offsetLeft, y: y - canvas.offsetTop }
        ctx.lineTo(transformedCoords.x, transformedCoords.y)
        ctx.stroke()
      }
    }
  }

  const toggleBackground = () => {
    canvas.style.backgroundImage = !!canvas.style.backgroundImage ? '' : imgUrl()
  }

  const resetDrawing = () => {
    const ctx = canvas.getContext('2d')
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
  }

  const changeBackground = () => {
    resetDrawing()
    props.onResetGame()
    setImgUrl(getImgUrl())
  }

  return <div class="main-stage">
    <canvas
      ref={canvas}
      class="main-canvas"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      height={600}
      width={600}
    />
    <div class="stage-controls">
      <button onClick={toggleBackground}>Hide/Show picture</button>
      <button onClick={resetDrawing}>Reset drawing</button>
      <button onClick={changeBackground}>Change picture</button>
    </div>
  </div>
}