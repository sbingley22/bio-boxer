import { useState } from 'react'
import GameScene from './GameScene.jsx'

function Game() {

  return (
    <div className="flex w-full h-screen justify-center items-center bg-black">
      <div className="w-[600px] h-full bg-green-700">
        sidebar
      </div>
      <div className="w-[1024px] h-full bg-black">
        <GameScene />
      </div>
    </div>
  )
}

export default Game
