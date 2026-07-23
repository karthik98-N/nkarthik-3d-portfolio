import { useRef, useEffect, useCallback, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, OrbitControls, Sky, PerspectiveCamera, useGLTF, Stars, Sparkles, Center } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { useStore } from '../../store/useStore'
import DynamicCore from './DynamicCore'
import VillageLights from './VillageLights'
import FlyingLights from './FlyingLights'
import Hotspots from './Hotspots'
import FloatingClouds from './FloatingClouds'
import Rain from './Rain'
import DynamicSun from './DynamicSun'
import DynamicMoon from './DynamicMoon'
import Thunder from './Thunder'
import Eagle from './Eagle'
import Flock from './Flock'
import Horse from './Horse'


// Detect mobile/tablet for performance scaling
const IS_MOBILE = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768

// View positions defined outside component — stable reference, no re-creation on render
const VIEW_POSITIONS = {
  home:     { pos: [-100, 225, 100], lookAt: [0, 50, 0],  fov: 45 },
  about:    { pos: [35, 12, 115],   lookAt: [0, 8, 20],  fov: 45 },
  projects: { pos: [70, 52.5, 60],  lookAt: [8, 15, 4],  fov: 35 },
  contact:  { pos: [-35, 37.5, -60], lookAt: [0, 50, 0],  fov: 45 },
}

// Shared material instances to avoid GPU re-uploads
const DAY_GROUND_MATERIAL   = new THREE.MeshStandardMaterial({ color: '#2d4a1d', roughness: 1, metalness: 0 })
const NIGHT_GROUND_MATERIAL = new THREE.MeshStandardMaterial({ color: '#0a1a05', roughness: 1, metalness: 0 })

const Experience = () => {
  const isStarted = useStore((s) => s.isStarted)
  const currentView = useStore((s) => s.currentView)
  const setView = useStore((s) => s.setView)
  const isDayTime = useStore((s) => s.isDayTime)
  const rainLevel = useStore((s) => s.rainLevel)
  const dayPhase = useStore((s) => s.dayPhase)
  const nightPhase = useStore((s) => s.nightPhase)
  const isDroneMode = useStore((s) => s.isDroneMode)
  const isPlacementMode = useStore((s) => s.isPlacementMode)
  const isHorseMode = useStore((s) => s.isHorseMode)
  const isTouchToMoveEnabled = useStore((s) => s.isTouchToMoveEnabled)
  const setHorseMovement = useStore((s) => s.setHorseMovement)
  const setEagleMovement = useStore((s) => s.setEagleMovement)
  const cameraRef    = useRef()
  const controlsRef  = useRef()
  const groupRef     = useRef()

  const lidarMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      wireframe: true,
      uniforms: {
        uTime: { value: 0 },
        uScanPosition: { value: 0 },
        uColor: { value: new THREE.Color('#00f2ff') },
        uOpacity: { value: IS_MOBILE ? 0.3 : 0.8 }
      },
      vertexShader: `
        varying vec3 vWorldPosition;
        void main() {
          vec4 worldPosition = modelMatrix * vec4(position, 1.0);
          vWorldPosition = worldPosition.xyz;
          gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uScanPosition;
        uniform vec3 uColor;
        uniform float uOpacity;
        varying vec3 vWorldPosition;

        void main() {
          float dist = abs(vWorldPosition.y - uScanPosition);
          
          // Scanning pulse (sharper)
          float pulse = smoothstep(5.0, 0.0, dist);
          
          // Secondary pulse for 'scan line' highlight
          float line = smoothstep(1.5, 0.0, dist);
          
          // Fading trail behind the scan
          float trail = smoothstep(60.0, 0.0, uScanPosition - vWorldPosition.y);
          trail = clamp(trail, 0.0, 1.0) * 0.4;
          
          // World-space grid effect
          float gridSize = 20.0;
          vec2 gridCoords = fract(vWorldPosition.xz / gridSize);
          float grid = step(0.98, gridCoords.x) + step(0.98, gridCoords.y);
          grid = clamp(grid, 0.0, 1.0) * 0.5;

          // Edge highlighting / digital twin feel
          vec3 finalColor = uColor;
          finalColor += line * vec3(0.8, 1.0, 1.0) * 2.0; // Very bright scan line
          finalColor += pulse * vec3(0.2, 0.5, 0.8);      // Blue-ish pulse
          finalColor += grid * uColor * 0.3;              // Subtle grid

          float alpha = uOpacity * (0.15 + pulse + trail + grid * 0.5);
          
          gl_FragColor = vec4(finalColor, alpha);
        }
      `
    })
  }, [])

  // ── Model Loading ────────────────────────────────────────────────────────────
  const { scene }  = useGLTF('/jadeite_village_environment.glb')
  const { scene: forestScene } = useGLTF('/low_poly_forest.glb')

  const forestScenes = useMemo(() => {
    if (!forestScene) return []
    return [forestScene.clone(), forestScene.clone(), forestScene.clone()]
  }, [forestScene])

  // ── Shadow traversal ────────────────────────────────────────────────────────
  useEffect(() => {
    const targets = [scene, forestScene, ...forestScenes]
    targets.forEach((s) => {
      if (!s) return
      s.traverse((child) => {
        if (child.isMesh) {
          child.castShadow    = true
          child.receiveShadow = true
        }
      })
    })
  }, [scene, forestScene, forestScenes])

  // ── Target Lidar Scan to Models Only ───────────────────────────────────────
  // We apply the material once when state changes to avoid per-frame traversal.
  useEffect(() => {
    if (!groupRef.current) return
    const group = groupRef.current

    const applyMaterial = (mode) => {
      group.traverse((child) => {
        if (child.isMesh) {
          if (mode === 'lidar') {
            if (!child.userData.originalMaterial) child.userData.originalMaterial = child.material
            child.material = lidarMaterial
          } else {
            if (child.userData.originalMaterial) child.material = child.userData.originalMaterial
          }
        }
      })
    }

    applyMaterial(isStarted ? 'normal' : 'lidar')
  }, [isStarted, lidarMaterial, scene, forestScene]) // Re-run if models load or mode changes

  useFrame((state) => {
    if (!isStarted) {
      const t = state.clock.getElapsedTime()
      lidarMaterial.uniforms.uTime.value = t
      const scanRange = 170
      const scanPos = -20 + (Math.sin(t * 0.5) * 0.5 + 0.5) * scanRange
      lidarMaterial.uniforms.uScanPosition.value = scanPos
    }
  })

  // ── Camera animation ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (!cameraRef.current || isDroneMode || isPlacementMode || isHorseMode) return
    
    // Don't force-tween the camera for the 'home' view to allow for totally free movement
    if (currentView === 'home') return

    const target = VIEW_POSITIONS[currentView]
    if (!target) return

    gsap.killTweensOf(cameraRef.current.position)
    gsap.killTweensOf(cameraRef.current)

    gsap.to(cameraRef.current.position, {
      x: target.pos[0], y: target.pos[1], z: target.pos[2],
      duration: 2.5, ease: 'power3.inOut',
    })
    gsap.to(cameraRef.current, {
      fov: target.fov, duration: 2.5, ease: 'power3.inOut',
      onUpdate: () => cameraRef.current?.updateProjectionMatrix(),
    })
    if (controlsRef.current) {
      gsap.killTweensOf(controlsRef.current.target)
      gsap.to(controlsRef.current.target, {
        x: target.lookAt[0], y: target.lookAt[1], z: target.lookAt[2],
        duration: 2.5, ease: 'power3.inOut',
      })
    }
  }, [currentView, isDroneMode, isHorseMode, isPlacementMode])

  // ── Hotspot camera jump ───────────────────────────────────────────────────────
  const handleHotspotSelect = useCallback((position) => {
    if (!cameraRef.current || !controlsRef.current) return
    gsap.to(cameraRef.current.position, { x: position[0], y: position[1], z: position[2], duration: 2, ease: 'power2.inOut' })
    gsap.to(controlsRef.current.target, { x: 0, y: 0, z: 0, duration: 2, ease: 'power2.inOut' })
  }, [])

  const keys = useRef({})
  useEffect(() => {
    const down = (e) => { keys.current[e.key.toLowerCase()] = true }
    const up   = (e) => { keys.current[e.key.toLowerCase()] = false }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up) }
  }, [])

  // ── Tap & Hold to Move Logic ────────────────────────────────────────────────
  const isHoldingRef = useRef(false)
  useEffect(() => {
    if (!isTouchToMoveEnabled || !isStarted) return

    const handleDown = (e) => {
      if (e.target.closest('button') || e.target.closest('a') || e.target.closest('input')) return
      isHoldingRef.current = true
      if (isDroneMode) setEagleMovement({ forward: true })
      if (isHorseMode) setHorseMovement({ forward: true })
    }
    const handleUp = () => {
      if (isHoldingRef.current) {
        isHoldingRef.current = false
        if (isDroneMode) setEagleMovement({ forward: false })
        if (isHorseMode) setHorseMovement({ forward: false })
      }
    }

    window.addEventListener('pointerdown', handleDown)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointerleave', handleUp)

    return () => {
      window.removeEventListener('pointerdown', handleDown)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointerleave', handleUp)
      // Ensure movement stops if mode is toggled or disabled
      setEagleMovement({ forward: false })
      setHorseMovement({ forward: false })
    }
  }, [isTouchToMoveEnabled, isStarted, isDroneMode, isHorseMode, setEagleMovement, setHorseMovement])

  const isInteractingRef = useRef(false)
  const lastInteractionTime = useRef(0)

  // ── Per-frame update ──────────────────────────────────────────────────────────
  useFrame((state) => {
    const controls = controlsRef.current
    if (!controls) return

    // ── Keyboard Roam for Normal Mode (All views) ───────────────────────────
    if (!isDroneMode && !isHorseMode && isStarted) {
      const isSprinting = keys.current['shift']
      const moveSpeed = isSprinting ? 1.5 : 0.5
      const cam = cameraRef.current
      if (cam) {
        const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(cam.quaternion).setY(0).normalize()
        const right   = new THREE.Vector3(1, 0, 0).applyQuaternion(cam.quaternion).setY(0).normalize()
        
        let moved = false
        if (keys.current['w'] || keys.current['arrowup'])    { cam.position.addScaledVector(forward, moveSpeed); controls.target.addScaledVector(forward, moveSpeed); moved = true }
        if (keys.current['s'] || keys.current['arrowdown'])  { cam.position.addScaledVector(forward, -moveSpeed); controls.target.addScaledVector(forward, -moveSpeed); moved = true }
        if (keys.current['a'] || keys.current['arrowleft'])  { cam.position.addScaledVector(right, -moveSpeed); controls.target.addScaledVector(right, -moveSpeed); moved = true }
        if (keys.current['d'] || keys.current['arrowright']) { cam.position.addScaledVector(right, moveSpeed); controls.target.addScaledVector(right, moveSpeed); moved = true }
        if (keys.current['q']) { cam.position.y += moveSpeed; moved = true }
        if (keys.current['e']) { cam.position.y -= moveSpeed; moved = true }

        if (moved) {
          lastInteractionTime.current = state.clock.getElapsedTime()
        }
      }
    }

    // Detect interaction (dragging or zooming)
    if (isInteractingRef.current) {
      lastInteractionTime.current = state.clock.getElapsedTime()
      controls.update()
      return
    }

    controls.update()

    // ── Drone-style drift for Home View (only if idle for 8s and no keys pressed) ──
    const isKeyPressed = Object.values(keys.current).some(v => v)
    const idleTime = state.clock.getElapsedTime() - lastInteractionTime.current
    if (currentView === 'home' && !isDroneMode && !isHorseMode && cameraRef.current && idleTime > 8 && !isKeyPressed) {
      const t = state.clock.getElapsedTime()
      cameraRef.current.position.y = THREE.MathUtils.lerp(cameraRef.current.position.y, VIEW_POSITIONS.home.pos[1] + Math.sin(t * 0.2) * 5, 0.05)
      cameraRef.current.fov = THREE.MathUtils.lerp(cameraRef.current.fov, VIEW_POSITIONS.home.fov + Math.sin(t * 0.1) * 2, 0.05)
      cameraRef.current.updateProjectionMatrix()
    }
  })

  // ── Derived sky / light values ─────────────────────────────────────────────
  const sunPos = dayPhase === 'sunrise' ? [-150, 40, -100] : dayPhase === 'noon' ? [0, 150, -80] : [150, 45, -100]
  const ambientIntensity = isDayTime ? (dayPhase === 'noon' ? 0.8 : 0.6) : (nightPhase === 'mid' ? 0.3 : 0.15)
  const groundMat = isDayTime ? DAY_GROUND_MATERIAL : NIGHT_GROUND_MATERIAL

  return (
    <>
      <PerspectiveCamera makeDefault ref={cameraRef} position={[35, 18, 45]} fov={50} far={3000} near={0.1} />
      <OrbitControls
        ref={controlsRef}
        makeDefault
        enabled={!isHorseMode}
        onStart={() => { isInteractingRef.current = true }}
        onEnd={() => { isInteractingRef.current = false }}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        zoomSpeed={1.5}
        minDistance={5}
        maxDistance={1000}
        autoRotate={currentView === 'home' && !isDroneMode && !isHorseMode}
        autoRotateSpeed={0.3}
        maxPolarAngle={Math.PI}
        minPolarAngle={0}
        enableDamping
        dampingFactor={0.05}
      />

      {/* ── Lighting ─────────────────────────────────────────────────────────── */}
      {isDayTime ? (
        <>
          <Sky sunPosition={sunPos} turbidity={0.1} rayleigh={0.5} />
          <ambientLight
            intensity={ambientIntensity}
            color={dayPhase === 'sunrise' ? '#ff9d00' : dayPhase === 'evening' ? '#ff5e00' : '#ffffff'}
          />
          <directionalLight
            position={sunPos}
            intensity={dayPhase === 'noon' ? 1.5 : 1.2}
            color={dayPhase === 'sunrise' ? '#ffcc00' : dayPhase === 'evening' ? '#ff4400' : '#ffffff'}
            castShadow
            shadow-mapSize={[1024, 1024]}
            shadow-camera-far={600}
            shadow-camera-near={1}
            shadow-camera-left={-300}
            shadow-camera-right={300}
            shadow-camera-top={300}
            shadow-camera-bottom={-300}
          />
          <DynamicSun />
        </>
      ) : (
        <>
          <Stars radius={300} depth={60} count={3000} factor={7} saturation={0} fade speed={1} />
          <Sparkles count={60} scale={50} size={2} speed={0.5} color="#ffffff" />
          <ambientLight intensity={ambientIntensity} color={nightPhase === 'early' ? '#94a3b8' : nightPhase === 'post' ? '#38bdf8' : '#ffffff'} />
          <directionalLight
            position={nightPhase === 'early' ? [-10, 5, -5] : nightPhase === 'mid' ? [0, 20, 0] : [10, 5, -5]}
            intensity={nightPhase === 'mid' ? 2 : 1}
            color={nightPhase === 'early' ? '#cbd5e1' : nightPhase === 'post' ? '#7dd3fc' : '#ffffff'}
            castShadow
            shadow-mapSize={[512, 512]}
            shadow-camera-far={200}
            shadow-camera-left={-100}
            shadow-camera-right={100}
            shadow-camera-top={100}
            shadow-camera-bottom={-100}
          />
          <spotLight position={[0, 15, 0]} intensity={5} distance={30} angle={Math.PI / 4} color="#ffffff" penumbra={1} />
          <DynamicMoon />
        </>
      )}

      {/* ── Environment Models ────────────────────────────────────────────────── */}
      <group ref={groupRef}>
        <Center top position={[0, -2, 0]}>
          <primitive object={scene} scale={1.3} />
        </Center>

        <DynamicCore />
        <VillageLights />

        {/* Fireflies — fewer on mobile, golden glow at night */}
        <FlyingLights count={IS_MOBILE ? 20 : 50}   range={100} intensity={isDayTime ? 0.3 : 2} color="#ffcc00" />
        <FlyingLights count={IS_MOBILE ? 100 : 300} range={500} intensity={isDayTime ? 0.1 : 4} color="#ffaa00" />

        <Hotspots onSelect={handleHotspotSelect} />
        <FloatingClouds count={8} />
        {rainLevel !== 'none' && (
          <>
            <Rain level={rainLevel} />
            <Thunder rainLevel={rainLevel} />
          </>
        )}
        
        {/* Atmospheric Life */}
        <Flock count={25} />
        <Eagle />
        <Horse />

        {/* Forest — 4 cardinal positions (Reduced on mobile wireframe) */}
        {(!IS_MOBILE || isStarted) && (
          <Center top position={[0,   -30,  80]}><primitive object={forestScene} scale={[50,50,50]} /></Center>
        )}
        {forestScenes[0] && (!IS_MOBILE || isStarted) && (
          <Center top position={[0,   -30, -80]}><primitive object={forestScenes[0]} scale={[50,50,50]} rotation={[0, Math.PI, 0]} /></Center>
        )}
        {forestScenes[1] && (!IS_MOBILE || isStarted) && (
          <Center top position={[80,  -30,  0]} ><primitive object={forestScenes[1]} scale={[50,50,50]} rotation={[0, Math.PI / 2, 0]} /></Center>
        )}
        {forestScenes[2] && (!IS_MOBILE || isStarted) && (
          <Center top position={[-80, -30,  0]} ><primitive object={forestScenes[2]} scale={[50,50,50]} rotation={[0, -Math.PI / 2, 0]} /></Center>
        )}

        {/* Ground plane */}
        <mesh rotation-x={-Math.PI / 2} position={[0, -2.1, 0]} receiveShadow material={groundMat}>
          <circleGeometry args={[500, 48]} />
        </mesh>
      </group>

      <Environment preset={isDayTime ? 'sunset' : 'night'} resolution={512} />
      <color attach="background" args={[isDayTime ? '#87ceeb' : '#010101']} />
      {rainLevel === 'low' && <fog attach="fog" args={['#334155', 40, 250]} />}
      {rainLevel === 'medium' && <fog attach="fog" args={['#1e293b', 20, 150]} />}
      {rainLevel === 'high' && <fog attach="fog" args={['#0f172a', 10, 80]} />}
    </>
  )
}

useGLTF.preload('/jadeite_village_environment.glb')
useGLTF.preload('/low_poly_forest.glb')

export default Experience
