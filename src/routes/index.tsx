import { Title } from "solid-start";
import { GameStage } from "~/components/game-stage";

export default function Home() {
  return (
    <main>
      <Title>Play Scribble-Face!</Title>
      <h1>Scribble-Face</h1>
      <GameStage />
    </main>
  );
}
