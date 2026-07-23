import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { Home, User, Briefcase, Mail, Sun, Moon, ChevronLeft, ChevronRight, Cloud, CloudRain, CloudDrizzle, CloudLightning, Cpu, Bird, Settings2, Video, VideoOff, Ruler, MousePointer2 } from 'lucide-react'
import EagleControlsUI from './EagleControlsUI'
import HorseControlsUI from './HorseControlsUI'

import useBreakpoint from '../hooks/useBreakpoint'

const Overlay = () => {
  const currentView = useStore((s) => s.currentView)
  const setView = useStore((s) => s.setView)
  const isStarted = useStore((s) => s.isStarted)
  const isDayTime = useStore((s) => s.isDayTime)
  const toggleDayTime = useStore((s) => s.toggleDayTime)
  const rainLevel = useStore((s) => s.rainLevel)
  const nextRainLevel = useStore((s) => s.nextRainLevel)
  const dayPhase = useStore((s) => s.dayPhase)
  const nextDayPhase = useStore((s) => s.nextDayPhase)
  const nightPhase = useStore((s) => s.nightPhase)
  const nextNightPhase = useStore((s) => s.nextNightPhase)
  const isDroneMode = useStore((s) => s.isDroneMode)
  const toggleDroneMode = useStore((s) => s.toggleDroneMode)
  const isHorsePlacementMode = useStore((s) => s.isHorsePlacementMode)
  const toggleHorsePlacementMode = useStore((s) => s.toggleHorsePlacementMode)
  const isHorseMode = useStore((s) => s.isHorseMode)
  const toggleHorseMode = useStore((s) => s.toggleHorseMode)
  const isTouchToMoveEnabled = useStore((s) => s.isTouchToMoveEnabled)
  const toggleTouchToMove = useStore((s) => s.toggleTouchToMove)
  const eagleScale = useStore((s) => s.eagleScale)
  const setEagleScale = useStore((s) => s.setEagleScale)
  const eagleMovementParams = useStore((s) => s.eagleMovementParams)
  const setEagleMovementParams = useStore((s) => s.setEagleMovementParams)
  const isFreeLook = useStore((s) => s.isFreeLook)
  const setIsFreeLook = useStore((s) => s.setIsFreeLook)

  const [isEagleSettingsOpen, setIsEagleSettingsOpen] = React.useState(false)
  const { isMobile } = useBreakpoint()

  if (!isStarted) return null

  const mobile = isMobile

  const navItems = [
    { id: 'home',     icon: <Home     size={mobile ? 16 : 20} />, label: 'HOME'     },
    { id: 'about',    icon: <User     size={mobile ? 16 : 20} />, label: 'ABOUT'    },
    { id: 'projects', icon: <Briefcase size={mobile ? 16 : 20} />, label: 'PROJECTS' },
    { id: 'contact',  icon: <Mail     size={mobile ? 16 : 20} />, label: 'CONTACT'  },
  ]

  const views        = ['home', 'about', 'projects', 'contact']
  const currentIndex = views.indexOf(currentView)
  const handlePrev   = () => setView(views[(currentIndex - 1 + views.length) % views.length])
  const handleNext   = () => setView(views[(currentIndex + 1) % views.length])

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10 }}>

      {/* ── Top Navbar ─────────────────────────────────────────────────────── */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass-panel"
        style={{
          position:        'absolute',
          top:             mobile ? '12px' : '24px',
          left:            '50%',
          transform:       'translateX(-50%)',
          display:         'flex',
          gap:             mobile ? '4px' : '12px',
          padding:         mobile ? '8px 12px' : '12px 24px',
          pointerEvents:   'auto',
          maxWidth:        'calc(100vw - 24px)',
        }}
      >
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id)}
            style={{
              display:    'flex',
              alignItems: 'center',
              gap:        '6px',
              padding:    mobile ? '6px 10px' : '8px 16px',
              borderRadius: '8px',
              border:     'none',
              background: currentView === item.id ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
              color:      currentView === item.id ? '#38bdf8' : '#94a3b8',
              cursor:     'pointer',
              fontWeight: 600,
              fontFamily: 'JetBrains Mono',
              transition: 'all 0.3s ease',
              minWidth:   'unset',
              minHeight:  '36px',
            }}
          >
            {item.icon}
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </motion.nav>

      {/* ── Right Sidebar – Controls ────────────────────────────────────────── */}
      <motion.div
        initial={{ x: 100 }}
        animate={{ x: 0 }}
        style={{
          position:        'absolute',
          right:           mobile ? '8px' : '20px',
          top:             mobile ? '15%' : '12%',
          transform:       'none',
          display:         'flex',
          flexDirection:   'column',
          gap:             mobile ? '4px' : '6px',
          padding:         mobile ? '10px 8px' : '14px 10px',
          pointerEvents:   'auto',
          alignItems:      'center',
          background:      'rgba(2, 6, 23, 0.82)',
          backdropFilter:  'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border:          '1px solid rgba(56, 189, 248, 0.25)',
          borderRadius:    '18px',
          boxShadow:       '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {/* ── Sidebar button helper ── */}
        {[
          {
            label: 'TIME',
            onClick: toggleDayTime,
            icon: isDayTime
              ? <Sun  size={mobile ? 18 : 22} style={{ color: '#fbbf24' }} />
              : <Moon size={mobile ? 18 : 22} style={{ color: '#94a3b8' }} />,
            active: false,
          },
          {
            label: 'LOOK',
            onClick: () => setIsFreeLook(!isFreeLook),
            title: isFreeLook ? 'Exit Free Look' : 'Enter Free Look',
            icon: isFreeLook
              ? <Video    size={mobile ? 18 : 22} style={{ color: '#38bdf8' }} />
              : <VideoOff size={mobile ? 18 : 22} style={{ color: '#64748b' }} />,
            active: isFreeLook,
          },
          {
            label: 'PHASE',
            onClick: isDayTime ? nextDayPhase : nextNightPhase,
            icon: <Cpu size={mobile ? 16 : 20} style={{
              color: isDayTime
                ? (dayPhase === 'sunrise' ? '#f59e0b' : dayPhase === 'noon' ? '#ffffff' : '#f43f5e')
                : (nightPhase === 'early' ? '#94a3b8' : nightPhase === 'mid' ? '#ffffff' : '#38bdf8'),
            }} />,
            active: false,
          },
          {
            label: 'RAIN',
            onClick: nextRainLevel,
            icon: rainLevel === 'none'   ? <Cloud         size={mobile ? 18 : 22} style={{ color: '#64748b' }} />
                : rainLevel === 'low'    ? <CloudDrizzle  size={mobile ? 18 : 22} style={{ color: '#7dd3fc' }} />
                : rainLevel === 'medium' ? <CloudRain     size={mobile ? 18 : 22} style={{ color: '#38bdf8' }} />
                :                          <CloudLightning size={mobile ? 18 : 22} style={{ color: '#0ea5e9' }} />,
            active: rainLevel !== 'none',
          },
          {
            label: 'SET',
            onClick: () => setIsEagleSettingsOpen(!isEagleSettingsOpen),
            icon: <Settings2 size={mobile ? 18 : 22} style={{ color: isEagleSettingsOpen ? '#38bdf8' : '#94a3b8' }} />,
            active: isEagleSettingsOpen,
          },
          {
            label: 'PLACE',
            onClick: toggleHorsePlacementMode,
            icon: <Ruler size={mobile ? 18 : 22} style={{ color: isHorsePlacementMode ? '#38bdf8' : '#94a3b8' }} />,
            active: isHorsePlacementMode,
          },
          {
            label: 'RIDE',
            onClick: toggleHorseMode,
            icon: <span style={{ fontSize: mobile ? 18 : 22, lineHeight: 1 }}>🐎</span>,
            active: isHorseMode,
          },
          {
            label: 'TOUCH',
            onClick: toggleTouchToMove,
            icon: <MousePointer2 size={mobile ? 18 : 22} style={{ color: isTouchToMoveEnabled ? '#38bdf8' : '#94a3b8' }} />,
            active: isTouchToMoveEnabled,
            title: 'Tap & Hold to Move'
          },
          {
            label: 'FLY',
            onClick: toggleDroneMode,
            icon: <Bird size={mobile ? 18 : 22} style={{ color: isDroneMode ? '#38bdf8' : '#94a3b8' }} />,
            active: isDroneMode,
          },
        ].filter(btn => {
          if (['LOOK', 'PLACE', 'FLY', 'SET', 'TOUCH'].includes(btn.label)) return false
          return true
        }).map(({ label, onClick, icon, active, title }) => (
          <button
            key={label}
            onClick={onClick}
            title={title || label}
            style={{
              border:       active ? '1px solid rgba(56,189,248,0.5)' : '1px solid transparent',
              background:   active ? 'rgba(56,189,248,0.15)' : 'transparent',
              cursor:       'pointer',
              padding:      mobile ? '6px' : '8px 10px',
              borderRadius: '10px',
              display:      'flex',
              flexDirection:'column',
              alignItems:   'center',
              gap:          '4px',
              transition:   'all 0.2s ease',
              boxShadow:    active ? '0 0 10px rgba(56,189,248,0.3)' : 'none',
              minWidth:     mobile ? '32px' : '44px',
            }}
          >
            {icon}
            {!mobile && (
              <span style={{
                fontSize:      '8px',
                fontFamily:    'JetBrains Mono',
                letterSpacing: '1px',
                color:         active ? '#38bdf8' : '#475569',
                marginTop:     '1px',
              }}>{label}</span>
            )}
          </button>
        ))}

        {!mobile && (
          <>
            <div style={{ height: '60px', width: '1px', background: 'rgba(255,255,255,0.1)' }} />
            <div className="mono" style={{ fontSize: '10px', color: '#64748b', writingMode: 'vertical-rl' }}>CTRL_V1.0.4</div>
          </>
        )}
      </motion.div>

      {/* ── Eagle Settings Panel ────────────────────────────────────────────── */}
      <AnimatePresence>
        {isEagleSettingsOpen && (
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 200, opacity: 0 }}
            className="glass-panel"
            style={{
              position: 'absolute',
              right: mobile ? '60px' : '90px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '240px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              pointerEvents: 'auto',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              zIndex: 30,
            }}
          >
            <div className="mono" style={{ color: '#38bdf8', fontSize: '12px', letterSpacing: '2px', marginBottom: '4px' }}>EAGLE_CALIBRATION</div>
            
            {/* Scale Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="mono" style={{ color: '#94a3b8', fontSize: '10px' }}>UNIT_SCALE</span>
                <span className="mono" style={{ color: 'white', fontSize: '10px' }}>{eagleScale.toFixed(4)}</span>
              </div>
              <input 
                type="range" min="0.0001" max="1.0" step="0.0001" 
                value={eagleScale} 
                onChange={(e) => setEagleScale(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            {/* Speed Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="mono" style={{ color: '#94a3b8', fontSize: '10px' }}>THRUST_VELOCITY</span>
                <span className="mono" style={{ color: 'white', fontSize: '10px' }}>{eagleMovementParams?.speed || 0.5}</span>
              </div>
              <input 
                type="range" min="0.1" max="50.0" step="0.1" 
                value={eagleMovementParams?.speed || 0.5} 
                onChange={(e) => setEagleMovementParams({ speed: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            {/* Turning Slider */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="mono" style={{ color: '#94a3b8', fontSize: '10px' }}>GYRO_SENSITIVITY</span>
                <span className="mono" style={{ color: 'white', fontSize: '10px' }}>{eagleMovementParams?.rotSpeed || 0.01}</span>
              </div>
              <input 
                type="range" min="0.01" max="5.0" step="0.01" 
                value={eagleMovementParams?.rotSpeed || 0.01} 
                onChange={(e) => setEagleMovementParams({ rotSpeed: parseFloat(e.target.value) })}
                style={{ width: '100%', accentColor: '#38bdf8' }}
              />
            </div>

            <button 
              onClick={() => setIsEagleSettingsOpen(false)}
              className="mono"
              style={{ padding: '8px', background: 'rgba(56, 189, 248, 0.1)', border: '1px solid #38bdf8', color: '#38bdf8', borderRadius: '4px', cursor: 'pointer', fontSize: '10px', marginTop: '8px' }}
            >
              CLOSE_PANEL
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Arrow Navigation ────────────────────────────────────────────────── */}
      {!isDroneMode && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          style={{
            position:      'absolute',
            bottom:        mobile ? '24px' : '80px',
            left:          '24px',
            display:       'flex',
            gap:           mobile ? '12px' : '16px',
            alignItems:    'center',
            pointerEvents: 'auto',
            zIndex: 20,
          }}
        >
          <button
            onClick={handlePrev}
            className="glass-panel"
            style={{ border: 'none', padding: mobile ? '8px' : '12px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronLeft size={mobile ? 18 : 24} />
          </button>

          <div
            className="mono"
            style={{
              color:           'white',
              fontSize:        mobile ? '10px' : '12px',
              letterSpacing:   '4px',
              background:      'rgba(0,0,0,0.4)',
              padding:         mobile ? '6px 16px' : '8px 24px',
              borderRadius:    '20px',
              border:          '1px solid rgba(255,255,255,0.1)',
              backdropFilter:  'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
            }}
          >
            {currentView.toUpperCase()}
          </div>

          <button
            onClick={handleNext}
            className="glass-panel"
            style={{ border: 'none', padding: mobile ? '8px' : '12px', cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <ChevronRight size={mobile ? 18 : 24} />
          </button>
        </motion.div>
      )}

      {/* ── Bottom Label (desktop only) ─────────────────────────────────────── */}
      {!mobile && (
        <div className="mono" style={{ position: 'absolute', bottom: '24px', left: '24px', color: '#64748b', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em' }}>
          Sector: <span style={{ color: 'white' }}>{currentView.toUpperCase()}</span> / <span style={{ color: '#38bdf8' }}>NKS_CORE</span>
        </div>
      )}

      {/* ── Eagle Controls (Overlay) ────────────────────────────────────────── */}
      <EagleControlsUI />
      <HorseControlsUI />
    </div>
  )
}

export default Overlay
