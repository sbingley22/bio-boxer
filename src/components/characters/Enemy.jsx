import { useRef } from "react"
import EnemyModel from "./EnemyModel.jsx"

const Enemy = () => {
  const group = useRef()
  const anim = useRef("cqc stance")

  return (
    <group
      ref={group}
      name="Enemy"
    >
      <EnemyModel
        anim={anim}
      />
    </group>
  )
}

export default Enemy
