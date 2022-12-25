import { Canvas } from "~/components/canvas";
import {createSignal} from "solid-js";

export type GameState = {
  status: 'IDLE' | 'PLAYING' | 'ENDED'
}

let timerId
const GAME_TIMER = 1000 * 60

export const GameStage = () => {
  const [gameState, setGameState] = createSignal<GameState>({ status: 'IDLE' })

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

  return <Canvas onStartGame={handleStart} onResetGame={handleReset} gameStatus={gameState().status} />
}