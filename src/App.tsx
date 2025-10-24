import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useTheme } from './contexts/ThemeContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Chat from './pages/Chat'

const App: React.FC = () => {
  const { isAuthenticated } = useAuth()
  const { theme, themeConfig } = useTheme()

  const getThemeClasses = () => {
    const baseClasses = `min-h-screen theme-transition ${themeConfig.background} ${themeConfig.text}`
    
    // Add custom theme-specific classes
    if (theme === 'ocean-blue' && themeConfig.customStyles) {
      return `${baseClasses} ${themeConfig.customStyles}`
    }
    if (theme === 'soft-pink' && themeConfig.animation) {
      return `${baseClasses} petals relative overflow-hidden`
    }
    if (theme === 'forest-green' && themeConfig.customStyles) {
      return `${baseClasses} ${themeConfig.customStyles}`
    }
    if (theme === 'galaxy' && themeConfig.animation) {
      return `${baseClasses} galaxy relative overflow-hidden`
    }
    if (theme === 'retro-console' && themeConfig.animation) {
      return `${baseClasses} retro-console`
    }
    if (theme === 'neon-purple' && themeConfig.animation) {
      return `${baseClasses} neon-glow`
    }
    if (theme === 'cyberpunk' && themeConfig.customStyles) {
      return `${baseClasses} ${themeConfig.customStyles}`
    }
    if (theme === 'hacker-matrix' && themeConfig.animation) {
      return `${baseClasses} matrix-rain relative overflow-hidden`
    }
    if (theme === 'gradient-rainbow' && themeConfig.customStyles) {
      return `${baseClasses} ${themeConfig.customStyles}`
    }
    
    return baseClasses
  }

  return (
    <div className={getThemeClasses()}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route 
          path="/login" 
          element={isAuthenticated ? <Navigate to="/chat" replace /> : <Login />} 
        />
        <Route 
          path="/signup" 
          element={isAuthenticated ? <Navigate to="/chat" replace /> : <Signup />} 
        />
        <Route 
          path="/chat" 
          element={isAuthenticated ? <Chat /> : <Navigate to="/login" replace />} 
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App











