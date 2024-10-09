import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import PlayerModel from "./PlayerModel.jsx"

const Player = () => {
  const group = useRef()
  const anim = useRef("cqc stance")

  useFrame((state, delta) => {
    if (!group.current) {
      console.log("Group ref is null", group)
      return
    }

    console.log("Player position:", group.current.position)
    group.current.position.x += delta
  })

  return (
    <group
      ref={group}
      name="Player"
    >
      <PlayerModel
        anim={anim}
      />
    </group>
  )
}

export default Player
