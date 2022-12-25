import { Canvas } from "~/components/canvas";
import {createSignal} from "solid-js";

export type GameState = {
  status: 'IDLE' | 'PLAYING' | 'ENDED'
}

let timerId

export const GameStage = () => {
  const [gameState, setGameState] = createSignal<GameState>({ status: 'IDLE' })

  const handleGameOver = () => {
    setGameState({ status: 'ENDED' })
  }

  const handleStart = () => {
    if (gameState().status === 'IDLE') {
      setGameState({ status: 'PLAYING' })
      timerId = setTimeout(handleGameOver, 10000)
    }
  }

  const handleReset = () => {
    setGameState({ status: 'IDLE' })
  }

  return <Canvas onStartGame={handleStart} onResetGame={handleReset} gameStatus={gameState().status} />
}