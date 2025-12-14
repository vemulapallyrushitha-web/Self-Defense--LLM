import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Zap, Rocket, Globe, Lock, ArrowRight } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const Landing: React.FC = () => {
  const { themeConfig } = useTheme()
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Zero-Shot Defense",
      description: "Works instantly",
      color: "text-yellow-500"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Fast & Lightweight",
      description: "Minimal delay",
      color: "text-blue-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Cross-Model Support",
      description: "LLaMA",
      color: "text-green-500"
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Safe by Design",
      description: "Near 100% safe",
      color: "text-red-500"
    }
  ]

  const flowSteps = [
    { text: "Prompt", icon: "💬" },
    { text: "AI", icon: "🤖" },
    { text: "AutoDefense", icon: "🛡️" },
    { text: "✅ Safe Output", icon: "✨" }
  ]

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <motion.section 
        className="relative flex-1 flex items-center justify-center px-4 py-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Full-bleed animated gradient background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-cyberpunk-gradient opacity-25 animate-gradient-shift" />

        <div className="relative z-10 max-w-6xl mx-auto text-center overflow-hidden">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-8 relative"
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-4 flex items-center justify-center gap-4">
              <Shield className="w-16 h-16 md:w-20 md:h-20 text-blue-600" />
              <span className="animated-text-gradient">
                AutoDefense
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4">
              Guarding AI Conversations, One Response at a Time
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 max-w-3xl mx-auto">
              AutoDefense protects users from harmful outputs by screening every response before it reaches you
            </p>
          </motion.div>
          
          {/* About/Storyline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-12"
          >
            <div className="max-w-2xl mx-auto p-0">
              <p className="text-lg leading-relaxed">
                In a world where AI responses can sometimes be unpredictable, AutoDefense stands as your digital guardian. 
                Our advanced screening technology ensures every AI interaction is safe, reliable, and trustworthy.
              </p>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={`relative group cursor-pointer`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.2 }}
              >
                <div className={`p-6 rounded-xl ${themeConfig.card} ${themeConfig.border} border h-40 flex flex-col items-center justify-center text-center group-hover:shadow-lg transition-all duration-300`}>
                  <div className={`${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          

          {/* Flow Diagram */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-12"
          >
            <h3 className="text-2xl font-bold mb-8">How It Works</h3>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
              {flowSteps.map((step, index) => (
                <React.Fragment key={index}>
                  <motion.div
                    className="flex flex-col items-center p-2 min-w-[100px]"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="text-3xl mb-2">{step.icon}</div>
                    <div className="text-sm font-medium text-center">{step.text}</div>
                  </motion.div>
                  {index < flowSteps.length - 1 && (
                    <motion.div
                      className="hidden md:block"
                      initial={{ opacity: 0.6 }}
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6 text-blue-500 drop-shadow" />
                    </motion.div>
                  )}
                </React.Fragment>
              ))}
            </div>
            {/* Defense pipeline note */}
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">AutoDefense intercepts model output, applies multi-stage policy checks, and only then releases the safe response.</p>
          </motion.div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              to="/login"
              className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl neon-glow"
            >
              <span className="relative z-10 flex items-center gap-2">
                Login
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link
              to="/signup"
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl neon-glow"
            >
              <span className="relative z-10 flex items-center gap-2">
                Sign Up
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </motion.div>

          {/* Demo Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold mb-8">Experience AutoDefense</h3>
            <div className="max-w-4xl mx-auto p-0 text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-semibold mb-3">Ready to Get Started?</h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
                Sign up now to experience the power of AutoDefense. Our AI screening technology will protect every conversation, ensuring safe and reliable interactions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Real-time AI screening
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Multiple theme options
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Secure data handling
                </div>
              </div>
            </div>
          </motion.div>
          {/* Particle overlay */}
          <div aria-hidden className="pointer-events-none absolute inset-0 particle-overlay" />
        </div>
      </motion.section>
    </div>
  )
}

export default Landing
