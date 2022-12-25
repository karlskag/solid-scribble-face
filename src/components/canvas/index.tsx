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

    // Set canvas event listeners that need to be passive
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault()
      handleDraw({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      })
    }, { passive: false })

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault()
      handleStartDrawing({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      })
    }, { passive: false })
  })

  createEffect(() => {
    canvas.style.backgroundImage = imgUrl()
  })

  const handleStartDrawing = ({ x, y }: { x: number, y: number }) => {
    setDrawing(true)
    props.onStartGame()
    const ctx = canvas.getContext('2d')

    if (ctx) {
      const transformedCoords = { x: x - canvas.offsetLeft, y: y - canvas.offsetTop }
      ctx.strokeStyle = 'red'
      ctx.beginPath()
      ctx.moveTo(transformedCoords.x, transformedCoords.y)
    }
  }

  const handleStopDrawing = () => {
    setDrawing(false)
  }

  const handleLeaveCanvas = () => {
    setDrawing(false)
  }

  const handleDraw = ({ x, y }: { x: number, y: number }) => {
    if (isDrawing()) {
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
      onMouseDown={handleStartDrawing}
      onMouseUp={handleStopDrawing}
      onTouchEnd={handleStopDrawing}
      onMouseMove={handleDraw}
      onMouseLeave={handleLeaveCanvas}
      height={500}
      width={350}
    />
    <div class="stage-controls">
      <button onClick={toggleBackground}>Hide/Show picture</button>
      <button onClick={resetDrawing}>Reset drawing</button>
      <button onClick={changeBackground}>Change picture</button>
    </div>
  </div>
}