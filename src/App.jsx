import { useState } from 'react'
import { useGameStore } from './useGameStore.js'
import MainMenu from './components/MainMenu.jsx'
import Game from './components/Game.jsx'

function App() {
  const { mode } = useGameStore()

  return (
    <>
      {mode === 0 && <Game />}
      {mode === 5 && <MainMenu />}
    </> 
  )
}

export default App
