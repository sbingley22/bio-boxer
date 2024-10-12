import GameScene from './GameScene.jsx'
import Sidebar from './Sidebar.jsx'

function Game() {

  return (
    <div className="flex w-full h-screen justify-center items-center bg-black">
      <div className="w-[400px] h-full bg-black border-4 border-purple-800 text-purple-400">
        <Sidebar />
      </div>
      <div className="w-[1024px] h-full bg-black">
        <GameScene />
      </div>
    </div>
  )
}

export default Game
