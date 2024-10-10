import * as THREE from 'three'

const vec3a = new THREE.Vector3()
const vec3b = new THREE.Vector3()
const vec3c = new THREE.Vector3()
const quat = new THREE.Quaternion()

export const isUnskippableAnimation = (anim) => {
  if (!anim || !anim.current) return

  const a = anim.current
  if (a === "cqc dmg") return true
  if (a === "cqc block") return true
  if (a === "cqc jab") return true
  if (a === "cqc straight") return true
  if (a === "cqc roundhouse") return true

  return false
}

export const playAudio = (src, volume=1, mute=false) => {
  if (mute) return
  const audio = new Audio(src)
  audio.volume = volume
  audio.play()
}

export const rotateToVec = (group, dx, dy, rotSpeed=0.1) => {
  if (!group) return

  // Calculate target rotation
  const direction = vec3b.set(dx, 0, dy).normalize()
  const angle = Math.atan2(direction.x, direction.z)

  // Create quaternions for current and target rotations
  const currentQuaternion = group.quaternion.clone()
  const targetQuaternion = quat.setFromAxisAngle(vec3c.set(0, 1, 0), angle)

  // Interpolate rotation using slerp
  currentQuaternion.slerp(targetQuaternion, rotSpeed)
  group.quaternion.copy(currentQuaternion)
}


// ---------------------------------------------------------------------
// Player Functions

export const playerMovement = (group, enemy, arenaSize, inputs, anim, transition, options, baseSpeed, speedMultiplier, delta ) => {
  if (!group.current) return
  transition.current = "cqc stance"

  let dx = 0
  let dy = 0

  // keyboard
  if (inputs.keyboard.forward) dy = -1
  else if (inputs.keyboard.backward) dy = 1
  if (inputs.keyboard.left) dx = -1
  else if (inputs.keyboard.right) dx = 1

  // Normalise horizontal movement
  if (dx && dy) {
    dx *= 0.7
    dy *= 0.7
  }

  // gamepad
  const gpmx = inputs.gamepad.moveX
  const gpmy = inputs.gamepad.moveY
  const moveDeadZone = 0.3
  if (options.useController) {
    if (Math.abs(gpmx) > moveDeadZone) dx = gpmx
    if (Math.abs(gpmy) > moveDeadZone) dy = gpmy * -1
  }

  let speed = baseSpeed * speedMultiplier.current * delta

  // enemy position
  let enemyRange = 999
  const combatRange = 2
  let rx = dx
  let ry = dy
  if (enemy && enemy.current) {
    enemyRange = enemy.current.position.distanceTo(group.current.position)
    rx = enemy.current.position.x - group.current.position.x
    ry = enemy.current.position.z - group.current.position.z
  }

  // move
  const targetPosition = vec3a.set(group.current.position.x + dx * speed, group.current.position.y, group.current.position.z + dy * speed)

  if (dx || dy) {
    // moving
    rotateToVec(group.current, rx, ry)

    transition.current = "cqc move"
    if (!isUnskippableAnimation(anim)) {
      anim.current = "cqc walk"
    }

    // make sure to not move out of arena
    const targetRadius = targetPosition.length()
    if (targetRadius > arenaSize) {
      targetPosition.normalize().multiplyScalar(arenaSize);
    }
  }
  else {
    // stationary
    if (enemyRange < combatRange) rotateToVec(group.current, rx, ry)

    if (!isUnskippableAnimation(anim)) {
      anim.current = "cqc stance"
    }
  }

  group.current.position.x = targetPosition.x
  group.current.position.y = targetPosition.y
  group.current.position.z = targetPosition.z
}

const camYOffset = 4
const camZOffset = 3
export const updateCamera = (group, enemy, arenaSize, camera) => {
  if (!group || !enemy) return
  const midpoint = vec3a.addVectors(group.current.position, enemy.current.position).multiplyScalar(0.5)
  const distance = midpoint.distanceTo(group.current.position)
  const zoom = distance * 1

  camera.position.x = midpoint.x
  camera.position.y = midpoint.y + camYOffset + zoom
  camera.position.z = midpoint.z + camZOffset + zoom
}

