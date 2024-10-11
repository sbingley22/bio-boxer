import * as THREE from 'three'

const vec3a = new THREE.Vector3()
const vec3b = new THREE.Vector3()
const vec3c = new THREE.Vector3()
const quat = new THREE.Quaternion()

export const isUnskippableAnimation = (anim) => {
  if (!anim || !anim.current) return

  const a = anim.current
  if (a === "cqc dmg") return true
  if (a === "cqc block dmg") return true
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

export const updateHeldInputs = (heldInputs, inputs) => {
  Object.keys(heldInputs.current).forEach((inputName) => {
    if (inputs.keyboard[inputName] || inputs.gamepad[inputName]) heldInputs.current.interact = true
    else heldInputs.current.interact = false
  })
}

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
  const combatRange = 2.5
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

    transition.current = "cqc walk"
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
    if (enemyRange < combatRange) {
      // in combat range
      rotateToVec(group.current, rx, ry)
      transition.current = "cqc block"
      if (!isUnskippableAnimation(anim)) {
        anim.current = "cqc block"
      }
    }
    else if (!isUnskippableAnimation(anim)) {
      // out of combat range
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

export const playerAttack = (group, enemy, anim, inputs, hitTimer) => {
  if (!group) return
  if (!enemy) return
  if (!group.current) return
  if (!enemy.current) return
  if (!inputs.keyboard) return
  if (!hitTimer.current) return

  if (!inputs.keyboard.interact && !inputs.gamepad.interact) return
  if (inputs.heldInputs.interact) return

  if (!isUnskippableAnimation(anim)) {
    // start combo
    anim.current = "cqc jab"
    hitTimer.current = 0
    setTimeout(() => {
      enemy.current.flagDmg = {
        range: 1.5,
        damage: 2,
      }
    }, 150);
  }
  else if (anim.current === "cqc jab") {
    if (hitTimer.current > 0.12) {
      anim.current = "cqc straight"
      hitTimer.current = 0
      setTimeout(() => {
        enemy.current.flagDmg = {
          range: 2,
          damage: 4,
        }
      }, 250)
    }
  }
  else if (anim.current === "cqc straight") {
    if (hitTimer.current > 0.25) {
      anim.current = "cqc roundhouse"
      hitTimer.current = 0
      setTimeout(() => {
        enemy.current.flagDmg = {
          range: 2.4,
          damage: 10,
        }
      }, 500)
    }
  }
}

export const playerFlags = (group, opponent, anim, forceAnim) => {
  if (!group) return
  if (!opponent) return
  if (!group.current) return
  if (!opponent.current) return

  // Damage Flag
  if (group.current.flagDmg) {
    const flag = group.current.flagDmg
    const distance = group.current.position.distanceTo(opponent.current.position)
    //console.log(flag.range, distance)

    if (flag.range > distance) {
      let dmg = flag.damage
      if (["cqc block", "cqc block dmg"].includes(anim.current)) {
        // blocking
        group.current.health -= dmg * 0.1
        if (anim.current === "cqc block dmg") forceAnim.current = true
        anim.current = "cqc block dmg"
      }
      else {
        // clean hit
        group.current.health -= dmg
        if (anim.current === "cqc dmg") forceAnim.current = true
        anim.current = "cqc dmg"
      }
    }

    group.current.flagDmg = null
  }

}

//--------------------------------------------------------
// Enemy Functions

export const enemyFlags = (group, opponent, anim, forceAnim) => {
  if (!group) return
  if (!opponent) return
  if (!group.current) return
  if (!opponent.current) return

  // Damage Flag
  if (group.current.flagDmg) {
    const flag = group.current.flagDmg
    const distance = group.current.position.distanceTo(opponent.current.position)
    //console.log(flag.range, distance)

    if (flag.range > distance) {
      group.current.health -= flag.damage

      if (anim.current === "cqc dmg") forceAnim.current = true
      anim.current = "cqc dmg"
    }

    group.current.flagDmg = null
  }

}

