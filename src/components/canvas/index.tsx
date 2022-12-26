import './styles.css'
import {createEffect, createSignal, onMount} from "solid-js";
import {GameState} from "~/components/game-stage";

let canvas: HTMLCanvasElement
let timerId: number
const getImgUrl = () => `url(images/obj_${Math.floor(Math.random() * 10) + 1 }.jpeg)`

type CanvasProps = {
  onStartGame: () => void
  onResetGame: () => void
  gameStatus: GameState['status']
  sendData : (data: any) => void
}

export const Canvas = (props: CanvasProps) => {
  const [isDrawing, setDrawing] = createSignal(false)
  const [imgUrl, setImgUrl] = createSignal(getImgUrl())

  createEffect(() => {
    if (props.gameStatus === 'WATCHING') {
      canvas.style.backgroundImage = ''
    } else if (props.gameStatus === 'ENDED') {
      toggleBackground()
    }
  })

  createEffect(() => {
    canvas.style.backgroundImage = imgUrl()
  })

  onMount(() => {
    canvas.style.backgroundImage = imgUrl()

    window.addEventListener('drawing', handleRemoteDraw as EventListener)

    // Set canvas event listeners that need to be passive
    canvas.addEventListener('touchmove', (e) => {
      e.preventDefault()
      const coords = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }

      handleDraw(coords)
    }, { passive: false })

    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault()
      handleStartDrawing({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      })
    }, { passive: false })
  })

  const handleRemoteDraw = (e: CustomEvent) => {
    if (!isDrawing()) {
      handleStartDrawing({ ...e.detail, remote: true })
    } else {
      handleDraw({ ...e.detail, remote: true })
    }

    // If 500ms passes, handle as new line
    clearTimeout(timerId)
    timerId = setTimeout(handleStopDrawing, 500)
  }

  const handleStartDrawing = ({ x, y, remote }: { x: number, y: number, remote?: boolean }) => {
    setDrawing(true)
    props.onStartGame()
    const ctx = canvas.getContext('2d')

    if (ctx) {
      const transformedCoords = remote ? { x, y } : { x: x - canvas.offsetLeft, y: y - canvas.offsetTop }
      ctx.strokeStyle = 'red'
      ctx.beginPath()
      ctx.moveTo(transformedCoords.x, transformedCoords.y)
    }
  }

  const handleDraw = ({ x, y, remote }: { x: number, y: number, remote?: boolean }) => {
    if (isDrawing()) {
      const ctx = canvas.getContext('2d')

      if (ctx) {
        const transformedCoords = remote ? { x, y } : { x: x - canvas.offsetLeft, y: y - canvas.offsetTop }
        ctx.lineTo(transformedCoords.x, transformedCoords.y)
        ctx.stroke()

        if (!remote) props.sendData(transformedCoords)
      }
    }
  }

  const handleStopDrawing = () => {
    setDrawing(false)
  }

  const handleLeaveCanvas = () => {
    setDrawing(false)
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