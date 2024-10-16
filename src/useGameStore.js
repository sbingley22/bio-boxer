import { create } from "zustand"

const gamepadState = {
  moveX: 0,
  moveY: 0,
  interact: false,
}

export const useGameStore = create((set, get) => ({
  getGamepad: () => gamepadState,

  mode: 0,
  setMode: (mode) => set({ mode }),

  gameMode: "round",
  setGameMode: (gameMode) => set({ gameMode }),
  round: 1,
  setRound: (round) => set({ round }),

  options: {
    volume: 0.5,
    mute: false,
    useController: true,
  },
  setOptions: (newOptions) => set((state) => ({
    options: { ...state.options, ...newOptions },
  })),
  getVolume: () => get().options.volume,
  getMute: () => get().options.mute,

  arenaSize: 6,
  setArenaSize: (arenaSize) => set({ arenaSize }),
  getArenaSize: () => get().arenaSize,

  player: null,
  setPlayer: (player) => set({ player }),
  setPlayerFlag: (flag, value) => {
    const state = get()
    if (state.player.current) state.player.current[flag] = value
  },
  enemy: null,
  setEnemy: (enemy) => set({ enemy }),
  setEnemyFlag: (flag, value) => {
    const state = get()
    if (state.enemy.current) state.enemy.current[flag] = value
  },

  score: 0,
  setScore: (score) => set({ score }),
  addScore: (amount) => {
    const state = get()
    const newScore = state.score + amount
    set({ score: newScore, xp: newXp })
  },
  getScore: () => get().score,
  
  hudInfo: {
    playerHealth: 100,
    enemyHealth: 100,
    msg: "",
  },
  setHudInfo: (hudInfo) => set({ hudInfo }),
  setHudInfoParameter: (newParameter) => set((state) => ({
    hudInfo: { ...state.hudInfo, ...newParameter },
  })),

  resetGame: () => {
    set({
      score: 0,
      player: null,
      enemy: null,
      hudInfo: {
        health: 100,
        armour: 0,
        msg: "",
        status: null,
      },
    });
  }
}))
