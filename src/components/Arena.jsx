import { useGameStore } from "../useGameStore.js"
import { Environment, Stars } from "@react-three/drei"
import Player from "./characters/Player"
import Enemy from "./characters/Enemy"
import Floor from "./Floor.jsx"

const Arena = () => {
  const { player } = useGameStore()

  return (
    <>
      <Stars />
      <Environment preset='dawn' />

      <Player />
      <Enemy />

      <Floor />
    </>
  )
}

export default Arena
