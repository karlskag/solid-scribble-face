import { Canvas } from "~/components/canvas";
import {createSignal, onMount} from "solid-js";
import throttle from 'lodash.throttle'

export type GameState = {
  status: 'IDLE' | 'PLAYING' | 'ENDED' | 'WATCHING'
}

let timerId
let ws: WebSocket
const GAME_TIMER = 1000 * 60

export const GameStage = () => {
  const [gameState, setGameState] = createSignal<GameState>({ status: 'IDLE' })
  const [connectionId, setConnectionId] = createSignal()

  const handleMessage = ({ type, data }: { type: string, data: any }) => {
    switch(type) {
      case 'CONNECTED':
        setConnectionId(data)
        break
      case 'DRAW_UPDATE':
        const drawEvent = new CustomEvent('drawing', { detail: data.data})
        window.dispatchEvent(drawEvent)
        break
    }
  }

  onMount(() => {
    ws = new WebSocket('ws://192.168.0.12:8080');
    ws.addEventListener('message', (data) => {
      handleMessage(JSON.parse(data.data))
    });
  })

  const sendData = throttle((data: any) => {
    ws.send(JSON.stringify({ ID: connectionId(), data }))
  }, 10)

  const handleGameOver = () => {
    setGameState({ status: 'ENDED' })
  }

  const handleStart = () => {
    if (gameState().status === 'IDLE') {
      setGameState({ status: 'PLAYING' })
      timerId = setTimeout(handleGameOver, GAME_TIMER)
    }
  }

  const handleReset = () => {
    setGameState({ status: 'IDLE' })
  }

  return <Canvas
    onStartGame={handleStart}
    onResetGame={handleReset}
    gameStatus={gameState().status}
    sendData={sendData}
  />
}