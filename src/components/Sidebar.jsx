import { useGameStore } from "../useGameStore.js"
import SBRound from "./SBRound.jsx"
import SBRest from "./SBRest.jsx"

const Sidebar = () => {
  const { gameMode } = useGameStore()
  
  return (
    <div
      className="w-full h-full flex"
    >
      {gameMode === "round" && 
        <SBRound />
      }

      {gameMode === "rest" && 
        <SBRest />
      }
    </div>
  )
}

export default Sidebar
