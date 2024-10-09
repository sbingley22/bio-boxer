import { useState } from 'react'
import { useGameStore } from '../useGameStore.js'

function MainMenu() {
  const { setMode } = useGameStore()

  return (
    <div>
      <button onClick={()=>setMode(0)}>Play</button>
    </div>
  )
}

export default MainMenu
