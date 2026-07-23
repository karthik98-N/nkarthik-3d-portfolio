import React, { Suspense, lazy, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import * as THREE from 'three'
import Overlay from './components/Overlay'
import Content from './components/Content'
import StartScreen from './components/StartScreen'
import ErrorBoundary from './components/ErrorBoundary'
import { useStore } from './store/useStore'

// Enable Three.js global caching to eliminate duplicate fetch requests
THREE.Cache.enabled = true

// Lazy-load the 3D scene for optimal initial paint & speed
const Experience = lazy(() => import('./components/three/Experience'))

const CustomLoader = () => {
  const { active, progress } = useProgress()
  const [showBypass, setShowBypass] = useState(false)
  const [forceDismiss, setForceDismiss] = useState(false)

  // Safety net: If loading takes >10s (e.g. slow network or asset stall), allow manual bypass
  useEffect(() => {
    let timer
    if (active && !forceDismiss) {
      timer = setTimeout(() => {
        setShowBypass(true)
      }, 10000)
    }
    return () => clearTimeout(timer)
  }, [active, forceDismiss])

  const isVisible = active && !forceDismiss

  return (
    <AnimatePresence style={{ pointerEvents: 'none' }}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 999,
            backgroundColor: '#020617',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
            pointerEvents: 'auto',
          }}
        >
          <div className="mono" style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '20px' }}>
            {progress.toFixed(0)}%
          </div>
          <div style={{ width: '200px', height: '2px', background: 'rgba(56, 189, 248, 0.2)', borderRadius: '2px', overflow: 'hidden', marginBottom: '24px' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: '#38bdf8', transition: 'width 0.3s ease-out' }} />
          </div>
          <p className="mono" style={{ color: '#94a3b8', fontSize: '0.75rem', textAlign: 'center', maxWidth: '320px', lineHeight: 1.6, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0 16px' }}>
            {progress >= 100 ? 'Finalizing 3D World...' : 'Preparing high-performance 3D scene...'}
          </p>

          {showBypass && progress < 100 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => setForceDismiss(true)}
              className="mono"
              style={{
                marginTop: '20px',
                padding: '8px 16px',
                background: 'rgba(56, 189, 248, 0.1)',
                border: '1px solid rgba(56, 189, 248, 0.4)',
                borderRadius: '6px',
                color: '#38bdf8',
                fontSize: '0.75rem',
                cursor: 'pointer',
                letterSpacing: '0.1em'
              }}
            >
              CONTINUE TO SITE ↗
            </motion.button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function App() {
  const isStarted = useStore((state) => state.isStarted)

  // Handle WebGL context loss gracefully without crashing
  const handleCreated = ({ gl }) => {
    const canvas = gl.domElement
    canvas.addEventListener('webglcontextlost', (event) => {
      event.preventDefault()
      console.warn('WebGL context lost. Attempting restoration...')
    }, false)

    canvas.addEventListener('webglcontextrestored', () => {
      console.info('WebGL context restored successfully.')
    }, false)
  }

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', backgroundColor: '#020617' }}>
      {!isStarted && <StartScreen />}
      
      <ErrorBoundary>
        <Canvas
          shadows={{ type: THREE.PCFShadowMap }}
          camera={{ position: [0, 2, 5], fov: 45 }}
          gl={{
            antialias: false,
            powerPreference: 'high-performance',
            outputColorSpace: THREE.SRGBColorSpace,
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
            failIfMajorPerformanceCaveat: false,
          }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
          onCreated={handleCreated}
          style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, touchAction: 'none' }}
        >
          <color attach="background" args={['#020617']} />
          <Suspense fallback={null}>
            <Experience />
          </Suspense>
        </Canvas>
      </ErrorBoundary>

      <Overlay />
      <Content />
      <CustomLoader />
    </div>
  )
}

export default App
