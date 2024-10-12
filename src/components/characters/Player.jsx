import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import PlayerModel from "./PlayerModel.jsx"
import { useGameStore } from "../../useGameStore.js"
import { playerMovement, updateCamera, updateHeldInputs, playerAttack, playerFlags } from "../../gameHelper.js"
import { useKeyboardControls } from "@react-three/drei"

const Player = () => {
  const { setMode, options, getVolume, getMute, getGamepad, getArenaSize, player, setPlayer, enemy, setHudInfoParameter } = useGameStore()
  const group = useRef()
  const anim = useRef("cqc stance")
  const transition = useRef("cqc stance")
  const forceAnim = useRef(false)
  const speedMultiplier = useRef(1.0)
  const [, getKeys] = useKeyboardControls()
  const heldInputs = useRef({
    interact: false,
  })
  const { camera } = useThree()

  const baseSpeed = 4.0
  const hitTimer = useRef(999)

  useFrame((state, delta) => {
    if (!group.current) return
    if (!player) setPlayer(group)
    if (group.current.health <= 0) return
     
    const keyboard = getKeys()
    const gamepad = getGamepad()
    const inputs = {
      heldInputs: heldInputs.current,
      keyboard: keyboard,
      gamepad: gamepad,
    }

    const flagStatus = playerFlags(group, enemy, anim, forceAnim)
    if (flagStatus && flagStatus.length > 0) {
      flagStatus.forEach(status => {
        if (status === "health") setHudInfoParameter({playerHealth: group.current.health})
      })
    }

    hitTimer.current += delta
    playerAttack(group, enemy, anim, inputs, hitTimer)

    const arenaSize = getArenaSize()
    playerMovement(group, enemy, arenaSize, inputs, anim, transition, options, baseSpeed, speedMultiplier, delta )

    updateCamera(group, enemy, arenaSize, camera)
    updateHeldInputs(heldInputs, inputs)
  })

  return (
    <group
      ref={group}
      name="Player"
      position={[-5,0,0]}
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

export default Player
