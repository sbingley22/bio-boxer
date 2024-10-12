import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
//import EnemyModel from "./EnemyModel.jsx"
import PlayerModel from "./PlayerModel.jsx"
import { useGameStore } from "../../useGameStore.js"
import { playerMovement, enemyFlags } from "../../gameHelper.js"

const Enemy = () => {
  const { setMode, options, getVolume, getMute, getGamepad, player, enemy, setEnemy, setHudInfoParameter } = useGameStore()
  const group = useRef()
  const anim = useRef("cqc stance")
  const transition = useRef("cqc stance")
  const speedMultiplier = useRef(1.0)
  const forceAnim = useRef(false)

  useFrame((state, delta) => {
    if (!group.current) return
    if (!enemy) setEnemy(group)
    if (group.current.health <= 0) return
     
    const flagStatus = enemyFlags(group, player, anim, forceAnim)
    if (flagStatus && flagStatus.length > 0) {
      flagStatus.forEach(status => {
        if (status === "health") setHudInfoParameter({enemyHealth: group.current.health})
      })
    }
  })

  return (
    <group
      ref={group}
      name="Enemy"
      position={[3,0,0]}
      health={100}
      flagDmg={null}
    >
      <PlayerModel
        anim={anim}
        transition={transition}
        speedMultiplier={speedMultiplier}
        forceAnim={forceAnim}
      />
    </group>
  )
}

export default Enemy
