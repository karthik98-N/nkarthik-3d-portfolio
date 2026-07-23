import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, ChevronUp, ChevronDown, Settings, Check, MousePointer2, Video, VideoOff } from 'lucide-react'

const ControlButton = ({ icon, action, setEagleMovement }) => {
  const handleStart = (e) => {
    e.preventDefault()
    setEagleMovement({ [action]: true })
  }

  const handleEnd = (e) => {
    e.preventDefault()
    setEagleMovement({ [action]: false })
  }

  return (
    <button
      onMouseDown={handleStart}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchEnd={handleEnd}
      className="glass-panel"
      style={{
        border: '1px solid rgba(255,255,255,0.2)',
        padding: '12px',
        borderRadius: '50%',
        cursor: 'pointer',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(0,0,0,0.5)',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      {icon}
    </button>
  )
}

const EagleControlsUI = () => {
  const isDroneMode = useStore((s) => s.isDroneMode)
  const isPlacementMode = useStore((s) => s.isPlacementMode)
  const toggleDroneMode = useStore((s) => s.toggleDroneMode)
  const togglePlacementMode = useStore((s) => s.togglePlacementMode)
  const setEagleMovement = useStore((s) => s.setEagleMovement)
  const isFreeLook = useStore((s) => s.isFreeLook)
  const setIsFreeLook = useStore((s) => s.setIsFreeLook)

  // Handle Keyboard input for desktop
  useEffect(() => {
    if (!isDroneMode) return

    const handleKeyDown = (e) => {
      if (e.key.toLowerCase() === 'v') setIsFreeLook(!isFreeLook)
      switch (e.key.toLowerCase()) {
        case 'w': setEagleMovement({ forward: true }); break;
        case 's': setEagleMovement({ backward: true }); break;
        case 'a': setEagleMovement({ left: true }); break;
        case 'd': setEagleMovement({ right: true }); break;
        case 'arrowup': setEagleMovement({ up: true }); break;
        case 'arrowdown': setEagleMovement({ down: true }); break;
      }
    }

    const handleKeyUp = (e) => {
      switch (e.key.toLowerCase()) {
        case 'w': setEagleMovement({ forward: false }); break;
        case 's': setEagleMovement({ backward: false }); break;
        case 'a': setEagleMovement({ left: false }); break;
        case 'd': setEagleMovement({ right: false }); break;
        case 'arrowup': setEagleMovement({ up: false }); break;
        case 'arrowdown': setEagleMovement({ down: false }); break;
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      setEagleMovement({ forward: false, backward: false, left: false, right: false, up: false, down: false })
    }
  }, [isDroneMode, isFreeLook, setEagleMovement, setIsFreeLook])

  return (
    <AnimatePresence mode="wait">
      {isDroneMode && (
        <motion.div
          key="drone-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '24px',
            right: '24px',
            display: 'flex',
            justifyContent: 'flex-start', // Align all controls to the left
            alignItems: 'flex-end',
            gap: '32px', // Gap between D-pad and Altitude
            pointerEvents: 'none',
            zIndex: 20,
          }}
        >
          {/* Left Side: All Movement Controls Grouped */}
          <div style={{ pointerEvents: 'auto', display: 'flex', alignItems: 'flex-end', gap: '24px' }}>
            {/* D-Pad */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <ControlButton icon={<ArrowUp size={24} />} action="forward" setEagleMovement={setEagleMovement} />
              <div style={{ display: 'flex', gap: '8px' }}>
                <ControlButton icon={<ArrowLeft size={24} />} action="left" setEagleMovement={setEagleMovement} />
                <ControlButton icon={<ArrowDown size={24} />} action="backward" setEagleMovement={setEagleMovement} />
                <ControlButton icon={<ArrowRight size={24} />} action="right" setEagleMovement={setEagleMovement} />
              </div>
            </div>

            {/* Altitude Controls (Now on the left too) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <ControlButton icon={<ChevronUp size={24} />} action="up" setEagleMovement={setEagleMovement} />
              <ControlButton icon={<ChevronDown size={24} />} action="down" setEagleMovement={setEagleMovement} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default EagleControlsUI
