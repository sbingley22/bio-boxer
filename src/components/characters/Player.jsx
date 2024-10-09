import { useRef } from "react"
import PlayerModel from "./PlayerModel.jsx"

const Player = () => {
  const group = useRef()
  const anim = useRef("cqc stance")

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
