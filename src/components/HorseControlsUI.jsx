import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { useStore } from '../store/useStore';

const HorseControlsUI = () => {
  const isHorseMode = useStore((s) => s.isHorseMode);
  const horseMovement = useStore((s) => s.horseMovement);
  const setHorseMovement = useStore((s) => s.setHorseMovement);

  if (!isHorseMode) return null;

  const handlePointerDown = (key) => setHorseMovement({ [key]: true });
  const handlePointerUp = (key) => setHorseMovement({ [key]: false });

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 50 }}
        style={{
          position: 'absolute',
          bottom: '40px',
          right: '40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'auto',
          zIndex: 100,
        }}
      >
        {/* Forward */}
        <ControlButton 
          icon={<ChevronUp size={32} />} 
          onDown={() => handlePointerDown('forward')} 
          onUp={() => handlePointerUp('forward')} 
          active={horseMovement.forward}
        />

        <div style={{ display: 'flex', gap: '12px' }}>
          {/* Left */}
          <ControlButton 
            icon={<ChevronLeft size={32} />} 
            onDown={() => handlePointerDown('left')} 
            onUp={() => handlePointerUp('left')} 
            active={horseMovement.left}
          />
          
          {/* Sprint */}
          <ControlButton 
            icon={<Zap size={32} />} 
            onDown={() => handlePointerDown('sprint')} 
            onUp={() => handlePointerUp('sprint')} 
            active={horseMovement.sprint}
            color="#fbbf24"
          />

          {/* Right */}
          <ControlButton 
            icon={<ChevronRight size={32} />} 
            onDown={() => handlePointerDown('right')} 
            onUp={() => handlePointerUp('right')} 
            active={horseMovement.right}
          />
        </div>

        {/* Backward */}
        <ControlButton 
          icon={<ChevronDown size={32} />} 
          onDown={() => handlePointerDown('backward')} 
          onUp={() => handlePointerUp('backward')} 
          active={horseMovement.backward}
        />
      </motion.div>
    </AnimatePresence>
  );
};

const ControlButton = ({ icon, onDown, onUp, active, color = '#38bdf8' }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onPointerDown={onDown}
    onPointerUp={onUp}
    onPointerLeave={onUp}
    style={{
      width: '64px',
      height: '64px',
      borderRadius: '16px',
      border: `2px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
      background: active ? `${color}33` : 'rgba(0,0,0,0.4)',
      color: active ? color : 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      backdropFilter: 'blur(10px)',
      boxShadow: active ? `0 0 20px ${color}66` : 'none',
      transition: 'all 0.2s ease',
      WebkitTapHighlightColor: 'transparent',
    }}
  >
    {icon}
  </motion.button>
);

export default HorseControlsUI;
