import { useRef } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import PlayerModel from "./PlayerModel.jsx"
import { useGameStore } from "../../useGameStore.js"
import { playerMovement, updateCamera } from "../../gameHelper.js"
import { useKeyboardControls } from "@react-three/drei"

const Player = () => {
  const { setMode, options, getVolume, getMute, getGamepad, getArenaSize, player, setPlayer, enemy, setHudInfoParameter } = useGameStore()
  const group = useRef()
  const anim = useRef("cqc stance")
  const transition = useRef("cqc stance")
  const speedMultiplier = useRef(1.0)
  const [, getKeys] = useKeyboardControls()
  const { camera } = useThree()

  const baseSpeed = 4.0

  useFrame((state, delta) => {
    if (!group.current) return
    if (!player) setPlayer(group)
    if (group.current.health <= 0) return
     
    const keyboard = getKeys()
    const gamepad = getGamepad()
    const inputs = {
      keyboard: keyboard,
      gamepad: gamepad,
    }

    const arenaSize = getArenaSize()
    playerMovement(group, enemy, arenaSize, inputs, anim, transition, options, baseSpeed, speedMultiplier, delta )

    updateCamera(group, enemy, arenaSize, camera)

  })

  return (
    <group
      ref={group}
      name="Player"
      position={[-5,0,0]}
      health={100}
    >
      <PlayerModel
        anim={anim}
        transition={transition}
        speedMultiplier={speedMultiplier}
      />
    </group>
  )
}

export default Player
