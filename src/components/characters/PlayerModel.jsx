import { useRef, useEffect } from "react"
import glb from "../../assets/SurvivorF.glb?url"
import { useSkinnedMeshClone } from "./SkinnedMeshClone.js"
import { useAnimations } from "@react-three/drei"
import { useFrame } from "@react-three/fiber"

const PlayerModel = ({ anim }) => {
  const { scene, nodes, animations } = useSkinnedMeshClone(glb)
  const { mixer, actions } = useAnimations(animations, scene)
  const lastAnim = useRef(anim.current)
  
  // Initial Setup
  useEffect(()=>{
    console.log(nodes, actions)

    Object.keys(nodes).forEach(nodeName => {
      const node = nodes[nodeName]
      if (node.type === "Mesh" || node.type === "SkinnedMesh") { 
        //node.visible = false
        node.castShadow = true
      }
    })

    if (actions[anim.current]){
      actions[anim.current].play()
    }

  },[nodes, actions])

  useFrame((state,delta) => {

  })

  return (
    <>
      <primitive object={scene} />
    </>
  )
}

export default PlayerModel
