import { Circle } from "@react-three/drei"
import { useGameStore } from "../useGameStore.js"
import { MeshBasicMaterial } from "three"

const Floor = () => {
  const { arenaSize } = useGameStore()

  return (
    <Circle
      rotation-x={-Math.PI/2}
      scale={arenaSize}
    >
      <meshBasicMaterial color="#303" />
    </Circle>
  )
}

export default Floor
