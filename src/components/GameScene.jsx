import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import Arena from "./Arena"

const GameScene = () => {

  return (
    <Canvas
      camera={{
        position: [0,5,5],
        fov: 60,
      }}
      shadows
    >
      <Suspense>
        <Arena />
      </Suspense>
    </Canvas>
  )
}

export default GameScene
