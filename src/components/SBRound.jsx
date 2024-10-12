import { useGameStore } from "../useGameStore.js"

const SBRound = () => {
  const { hudInfo, round } = useGameStore()

  return (
    <div
      className="w-full h-full flex flex-col justify-between p-2 text-xl text-gray-200"
    >
      <div className="flex flex-col">
        <p>Round {round}</p>
        <p
          className={hudInfo.playerHealth > 70 ? "text-green-500" : hudInfo.playerHealth > 30 ? "text-yellow-500" : "text-red-500"}
        >
          Health : {hudInfo.playerHealth}
        </p>
      </div>
      <div className="flex flex-col">
        <p
          className={hudInfo.enemyHealth > 70 ? "text-green-500" : hudInfo.enemyHealth > 30 ? "text-yellow-500" : "text-red-500"}
        >
          Opponent Health : {hudInfo.enemyHealth}
        </p>
      </div>
    </div>
  )
}

export default SBRound
