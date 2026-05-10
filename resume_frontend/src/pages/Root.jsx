import React, { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
function Root() {
  const location = useLocation()
  const hideNavbar = location.pathname === '/login'
  const isTouchDevice =
    typeof window !== 'undefined' &&
    (window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window)
  const [cursor, setCursor] = useState({ x: 0, y: 0, visible: false })
  const [bubbles, setBubbles] = useState([])
  const lastSpawnRef = useRef(0)
  const timersRef = useRef([])

  useEffect(() => {
    if (isTouchDevice) {
      return undefined
    }

    const handleMove = (event) => {
      const now = Date.now()

      setCursor({
        x: event.clientX,
        y: event.clientY,
        visible: true,
      })

      if (now - lastSpawnRef.current < 28) {
        return
      }

      lastSpawnRef.current = now

      const id = now + Math.random()
      const size = 18 + Math.random() * 42
      const offsetX = (Math.random() - 0.5) * 28
      const offsetY = (Math.random() - 0.5) * 28

      setBubbles((current) => [
        ...current.slice(-12),
        {
          id,
          x: event.clientX + offsetX,
          y: event.clientY + offsetY,
          size,
        },
      ])

      const timer = window.setTimeout(() => {
        setBubbles((current) => current.filter((bubble) => bubble.id !== id))
      }, 900)

      timersRef.current.push(timer)
    }

    const handleLeave = () => {
      setCursor((current) => ({ ...current, visible: false }))
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseleave', handleLeave)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseleave', handleLeave)
      timersRef.current.forEach((timer) => window.clearTimeout(timer))
      timersRef.current = []
    }
  }, [isTouchDevice])

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className={`pointer-events-none fixed inset-0 z-20 mix-blend-screen ${isTouchDevice ? 'hidden' : ''}`}>
        {bubbles.map((bubble) => (
          <div
            key={bubble.id}
            className="absolute rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.95)_0%,rgba(125,211,252,0.42)_28%,rgba(125,211,252,0)_72%)] blur-2xl transition-all duration-700 ease-out"
            style={{
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              left: `${bubble.x - bubble.size / 2}px`,
              top: `${bubble.y - bubble.size / 2}px`,
              opacity: 0,
              transform: 'scale(1.8)',
            }}
          />
        ))}
        <div
          className="absolute h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(125,211,252,0.55)_0%,rgba(125,211,252,0.18)_35%,rgba(125,211,252,0)_72%)] blur-2xl transition-all duration-150 ease-out will-change-transform"
          style={{
            transform: `translate3d(${cursor.x - 112}px, ${cursor.y - 112}px, 0)`,
            opacity: cursor.visible ? 1 : 0,
          }}
        />
        <div className="absolute left-[8%] top-[18%] h-56 w-56 rounded-full bg-violet-400/12 blur-3xl" />
        <div className="absolute right-[10%] top-[32%] h-72 w-72 rounded-full bg-sky-300/12 blur-3xl" />
      </div>

      <div className="relative z-30">
        {!hideNavbar && <Navbar />}
        <Outlet />
      </div>
    </div>
  )
}

export default Root
