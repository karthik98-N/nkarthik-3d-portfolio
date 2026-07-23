import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Scene Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: '#020617',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          color: '#cbd5e1',
          zIndex: 50,
          textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginBottom: '12px' }}>
            3D Graphics Mode Fallback
          </h2>
          <p style={{ maxWidth: '480px', fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '24px' }}>
            Your device or browser encountered an issue initializing full 3D graphics hardware (WebGL). The rest of the portfolio remains fully interactive!
          </p>
          <button
            onClick={() => window.location.reload()}
            className="glow-btn"
            style={{
              padding: '10px 24px',
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            RELOAD EXPERIENCE
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
