import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store/useStore'
import { X } from 'lucide-react'
import useBreakpoint from '../hooks/useBreakpoint'

const Content = () => {
  const currentView = useStore((s) => s.currentView)
  const setView = useStore((s) => s.setView)
  const { isMobile, isTablet, isDesktop } = useBreakpoint()

  const contentData = {
    about: {
      title: "NEELI KARTHIK SHIVAMANI",
      subtitle: "",
      text: `I am Neeli Karthik Shivamani, a Computer Science Engineering student at Mohan Babu University.
I am passionate about web development and creating digital solutions. Proficient in Java, Python, SQL, HTML, CSS, I have built projects like KindConnect Donation App, RK Health Management System, and Gym Management System.
Apart from development, I am also a creative video editor skilled in Adobe Photoshop, Premiere Pro, CapCut, mobile editing, and system editing.
As ISTE Social Media Team Lead and Events Organizer, I enjoy combining technical skills with creativity to deliver engaging content and solutions.
I love learning new technologies and turning ideas into reality.`,
      skills: ["React", "Three.js", "Python", "Groq AI / LLaMA", "Twilio", "Flask", "SQL", "Java", "Adobe Photoshop", "Capcut"],
      education: "Bachelor of Technology in Computer Science"
    },
    projects: {
      title: "LATEST_WORKS",
      subtitle: "SELECTED EXPLORATIONS",
      projects: [
        {
          name: "KindConnect - Donation App",
          desc: `A clean and modern static donation portal for orphanages, developed using Lovable AI.
Users can browse donation categories (clothes, books, groceries, money) and view a simulated donation flow. Integrated Google Gemini Vision API demo to identify items from images. Built as a responsive front-end only using HTML, CSS, and JavaScript.`
        },
        {
          name: "RK Health – AI Smart Patient Appointment & Medication Reminder System",
          desc: `Built an AI-powered healthcare management dashboard that simplifies patient care and improves medication compliance.

🔹 AI Summarization: Uses Groq & LLaMA 3.3-70B to transform complex doctor notes into easy-to-understand patient guides.
🔹 Multi-Channel Reminders: Integrated Twilio SMS API and Google Calendar to automate appointment & medication alerts.
🔹 Serverless Stack: Engineered a serverless infrastructure combining HTML5/CSS/JS, Google Apps Script, and Google Sheets DB alongside a local Python Flask option.`,
          link: "https://rk-health-ai-smart-patient-appointment.onrender.com/"
        },
        {
          name: "Gym Management System",
          desc: "Complete web application for gym management including member registration, payment details, subscription handling, and member photo uploads."
        }
      ]
    },
    contact: {
      title: "CONTACT_CORE",
      subtitle: "ESTABLISH CONNECTION",
      text: "Ready to start a new mission? Feel free to reach out for collaborations or just a friendly chat about tech.",
      email: "neelikarthik888@gmail.com",
      linkedin: "www.linkedin.com/in/karthik-shivamani-neeli-",
    }
  }

  const data = contentData[currentView]
  if (currentView === 'home' || !data) return null

  // ── Responsive layout values ────────────────────────────────────────────────
  const panelWidth  = isMobile ? '100vw'  : isTablet ? 'min(520px, 90vw)' : 'min(580px, 45vw)'
  const panelLeft   = isMobile ? '0'      : '50%'
  const panelTop    = isMobile ? 'auto'   : isTablet ? '90px' : '100px'
  const panelBottom = isMobile ? '0'      : 'auto'
  const panelTransform = isMobile ? 'none' : 'translateX(-50%)'
  const panelPadding   = isMobile ? '24px 20px 32px' : isTablet ? '32px' : '40px'
  const borderRadius   = isMobile ? '20px 20px 0 0' : '16px'
  const maxHeight   = isMobile
    ? '85vh'
    : isTablet
    ? 'calc(100vh - 130px)'
    : 'calc(100vh - 140px)'
  const titleSize   = isMobile ? '1.4rem' : isTablet ? '1.7rem' : '2rem'

  return (
    <AnimatePresence>
      <motion.div
        key={currentView}
        initial={{ opacity: 0, y: isMobile ? 60 : -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: isMobile ? 60 : -20 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="glass-panel"
        style={{
          position:     'fixed',
          left:         panelLeft,
          top:          panelTop,
          bottom:       panelBottom,
          transform:    panelTransform,
          width:        panelWidth,
          maxHeight:    maxHeight,
          overflowY:    'auto',
          padding:      panelPadding,
          borderRadius: borderRadius,
          zIndex:       20,
          pointerEvents: 'auto',
          WebkitOverflowScrolling: 'touch', // Smooth scroll on iOS
        }}
      >
        {/* Close button */}
        <button
          onClick={() => setView('home')}
          style={{
            position:   'absolute',
            top:        '16px',
            right:      '16px',
            border:     'none',
            background: 'transparent',
            cursor:     'pointer',
            color:      '#64748b',
            minWidth:   '44px',
            minHeight:  '44px',
            display:    'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: isMobile ? '20px' : '28px', paddingRight: '40px' }}>
          {data.subtitle && (
            <span className="mono" style={{ color: '#38bdf8', fontSize: '0.65rem', letterSpacing: '0.2em', display: 'block', marginBottom: '4px' }}>
              {data.subtitle}
            </span>
          )}
          <h2 style={{ fontSize: titleSize, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {data.title}
          </h2>
        </div>

        {/* ── ABOUT ──────────────────────────────────────────────────────────── */}
        {currentView === 'about' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '28px', color: '#cbd5e1', lineHeight: 1.65 }}>
            <p style={{ fontSize: isMobile ? '0.85rem' : '0.92rem', whiteSpace: 'pre-line' }}>{data.text}</p>

            <div>
              <h4 className="mono" style={{ color: '#38bdf8', fontSize: '0.75rem', marginBottom: '12px', letterSpacing: '0.1em' }}>
                TECHNICAL_STACK
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {data.skills.map(skill => (
                  <span key={skill} className="mono" style={{
                    padding: '4px 10px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.2)',
                    borderRadius: '4px',
                    fontSize: '10px',
                    color: '#38bdf8',
                    whiteSpace: 'nowrap',
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="mono" style={{ color: '#38bdf8', fontSize: '0.75rem', marginBottom: '8px', letterSpacing: '0.1em' }}>
                ACADEMIC_BASE
              </h4>
              <p style={{ fontSize: isMobile ? '0.85rem' : '0.9rem' }}>{data.education}</p>
            </div>
          </div>
        )}

        {/* ── PROJECTS ───────────────────────────────────────────────────────── */}
        {currentView === 'projects' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '28px', color: '#cbd5e1' }}>
            {data.projects.map((p, i) => (
              <div key={i}>
                <h3 style={{ fontSize: isMobile ? '1rem' : '1.1rem', fontWeight: 700, marginBottom: '6px', color: '#f1f5f9' }}>
                  {p.name}
                </h3>
                <p style={{ fontSize: isMobile ? '0.82rem' : '0.9rem', color: '#94a3b8', lineHeight: 1.6, whiteSpace: 'pre-line' }}>
                  {p.desc}
                </p>
                {p.link && (
                  <div style={{ marginTop: '10px' }}>
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mono"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 12px',
                        background: 'rgba(56, 189, 248, 0.12)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        borderRadius: '6px',
                        color: '#38bdf8',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      🌐 Live Demo ↗
                    </a>
                  </div>
                )}
                <div style={{ height: '1px', width: '36px', background: '#38bdf8', marginTop: '12px' }} />
              </div>
            ))}
          </div>
        )}

        {/* ── CONTACT ────────────────────────────────────────────────────────── */}
        {currentView === 'contact' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '20px' : '28px', color: '#cbd5e1' }}>
            <p style={{ fontSize: isMobile ? '0.85rem' : '0.92rem', lineHeight: 1.65 }}>{data.text}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div className="selectable" style={{ padding: isMobile ? '16px' : '20px', background: 'rgba(15,23,42,0.5)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="mono" style={{ display: 'block', fontSize: '9px', color: '#64748b', marginBottom: '6px', letterSpacing: '0.15em' }}>EMAIL_ENCRYPTED</span>
                <a href={`mailto:${data.email}`} style={{ color: '#76bff3', fontWeight: 700, textDecoration: 'none', fontSize: isMobile ? '0.85rem' : '1rem', wordBreak: 'break-all' }}>
                  {data.email}
                </a>
              </div>
              <div className="selectable" style={{ padding: isMobile ? '16px' : '20px', background: 'rgba(15,23,42,0.5)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="mono" style={{ display: 'block', fontSize: '9px', color: '#64748b', marginBottom: '6px', letterSpacing: '0.15em' }}>LINKEDIN_PROFILE</span>
                <a href={`https://${data.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', fontWeight: 700, textDecoration: 'none', fontSize: isMobile ? '0.82rem' : '0.95rem', wordBreak: 'break-all' }}>
                  {data.linkedin}
                </a>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

export default Content
