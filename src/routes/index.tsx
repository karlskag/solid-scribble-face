import { Title } from "solid-start";
import { Canvas } from "~/components/canvas";

export default function Home() {
  return (
    <main>
      <Title>Play Scribble-Face!</Title>
      <h1>Scribble-Face</h1>
      <Canvas />
    </main>
  );
}
