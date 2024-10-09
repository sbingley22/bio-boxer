import { useRef } from "react"
import EnemyModel from "./EnemyModel.jsx"
import { useFrame } from "@react-three/fiber"

const Enemy = () => {
  const group = useRef()
  const anim = useRef("cqc stance")

  useFrame((state,delta) => {
    console.log("Enemy")
    if (!group.current) return

    group.current.position.x -= delta
  })

  return (
    <group
      ref={group}
      name="Enemy"
      position={[1,0,0]}
    >
      <EnemyModel
        anim={anim}
      />
    </group>
  )
}

export default Enemy
