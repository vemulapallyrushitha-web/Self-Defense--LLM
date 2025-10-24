import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  Send, 
  Mic, 
  Image, 
  Video, 
  File, 
  Settings, 
  HelpCircle, 
  LogOut, 
  User, 
  ChevronDown,
  X,
  Palette,
  Download,
  Trash2,
  History,
  MessageSquare
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

interface Message {
  id: string
  text: string
  isUser: boolean
  timestamp: Date
  avatar?: string
}

const Chat: React.FC = () => {
  const { user, logout } = useAuth()
  const { theme, setTheme, themeConfig } = useTheme()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showThemeMenu, setShowThemeMenu] = useState(false)
  const [showUploadMenu, setShowUploadMenu] = useState(false)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const uploadMenuRef = useRef<HTMLDivElement>(null)
  const accountMenuRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Close menus on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (showUploadMenu && uploadMenuRef.current && !uploadMenuRef.current.contains(target)) {
        setShowUploadMenu(false)
      }
      if (showAccountMenu && accountMenuRef.current && !accountMenuRef.current.contains(target)) {
        setShowAccountMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showUploadMenu, showAccountMenu])

  const handleSendMessage = () => {
    if (!inputText.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputText('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: `I understand you said: "${inputText}". This is a simulated response from AutoDefense. In a real implementation, this would be the AI's response after being screened for safety.`,
        isUser: false,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    // Voice recording functionality would be implemented here
  }

  const handleUpload = (type: 'file' | 'image' | 'video') => {
    setShowUploadMenu(false)
    if (type === 'file') fileInputRef.current?.click()
    if (type === 'image') imageInputRef.current?.click()
    if (type === 'video') videoInputRef.current?.click()
  }

  const onSelectFile = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'file' | 'image' | 'video'
  ) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      const notice: Message = {
        id: `${Date.now()}-${type}`,
        text: `Uploaded ${type}: ${selectedFile.name}`,
        isUser: true,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, notice])
    }
    // reset input so the same file can be selected again later
    e.target.value = ''
  }

  const clearChat = () => {
    setMessages([])
  }

  const exportData = () => {
    const data = {
      messages,
      user: user?.name,
      exportDate: new Date().toISOString()
    }
    const blob = new JSONBlob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `autodefense-chat-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const themes = [
    { id: 'light', name: 'Light', emoji: '🌞' },
    { id: 'dark', name: 'Dark', emoji: '🌙' },
    { id: 'ocean-blue', name: 'Ocean Blue', emoji: '🌊' },
    { id: 'soft-pink', name: 'Soft Pink', emoji: '🌸' },
    { id: 'forest-green', name: 'Forest Green', emoji: '🌲' },
    { id: 'high-contrast', name: 'High Contrast', emoji: '⚡' },
    { id: 'galaxy', name: 'Galaxy', emoji: '🌌' },
    { id: 'retro-console', name: 'Retro Console', emoji: '🕹' },
    { id: 'neon-purple', name: 'Neon Purple', emoji: '🟣' },
    { id: 'cyberpunk', name: 'Cyberpunk', emoji: '🏙' },
    { id: 'hacker-matrix', name: 'Hacker Matrix', emoji: '👾' },
    { id: 'adventure-nature', name: 'Adventure Nature', emoji: '🏞' },
    { id: 'gradient-rainbow', name: 'Gradient Rainbow', emoji: '🎨' }
  ] as const

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {showSidebar && (
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            transition={{ duration: 0.3 }}
            className={`w-80 ${themeConfig.card} ${themeConfig.border} border-r flex flex-col`}
          >
            {/* Sidebar Header */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">AutoDefense</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Chat History */}
            <div className="flex-1 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Chats</h3>
                <button
                  onClick={clearChat}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  title="Clear conversations"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    No conversations yet.<br />
                    Start a new chat below!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-800 dark:text-blue-200">
                      Current conversation with {messages.length} messages
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Account Section */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <div className="relative">
                <button
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                  className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium">{user?.name || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showAccountMenu ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {showAccountMenu && (
                    <motion.div
                      ref={accountMenuRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute bottom-full left-0 right-0 mb-2 rounded-lg shadow-lg overflow-hidden bg-gray-900 text-white border border-gray-800"
                    >
                      <button
                        onClick={() => { setShowSettings(true); setShowAccountMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors"
                      >
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button
                        onClick={() => { setShowThemeMenu(true); setShowAccountMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors"
                      >
                        <Palette className="w-4 h-4" />
                        Themes
                      </button>
                      <button
                        onClick={exportData}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Export Data
                      </button>
                      <button
                        onClick={clearChat}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors"
                      >
                        <History className="w-4 h-4" />
                        Clear History
                      </button>
                      <button
                        onClick={() => { setShowAccountMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors"
                      >
                        <HelpCircle className="w-4 h-4" />
                        Help & Support
                      </button>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-red-900/30 text-red-400 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className={`p-4 border-b ${themeConfig.border} border flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            {!showSidebar && (
              <button
                onClick={() => setShowSidebar(true)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
              >
                <User className="w-5 h-5" />
              </button>
            )}
            <div>
              <h1 className="text-lg font-semibold">AutoDefense Chat</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Protected by AI screening technology
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">Welcome to AutoDefense</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md">
                  Start a conversation below. Every message is automatically screened for safety before you see the response.
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    message.isUser 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                  }`}>
                    {message.isUser ? (user?.name?.charAt(0).toUpperCase() || 'U') : 'AI'}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.isUser 
                      ? 'bg-blue-600 text-white' 
                      : `${themeConfig.card} ${themeConfig.border} border`
                  }`}>
                    <p className="text-sm">{message.text}</p>
                    <p className={`text-xs mt-1 ${
                      message.isUser ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={`p-4 border-t ${themeConfig.border} border`}>
          <div className="flex items-end gap-3">
            {/* Upload Button */}
            <div className="relative">
              <button
                onClick={() => setShowUploadMenu(!showUploadMenu)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {showUploadMenu && (
                  <motion.div
                    ref={uploadMenuRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-0 mb-2 rounded-lg shadow-lg overflow-hidden bg-gray-900 text-white border border-gray-800 min-w-[240px]"
                  >
                    <button
                      onClick={() => handleUpload('file')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors"
                    >
                      <File className="w-4 h-4" />
                      Upload File & Document
                    </button>
                    <button
                      onClick={() => handleUpload('image')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors"
                    >
                      <Image className="w-4 h-4" />
                      Upload Photo
                    </button>
                    <button
                      onClick={() => handleUpload('video')}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-800 transition-colors"
                    >
                      <Video className="w-4 h-4" />
                      Upload Video
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Text Input */}
            <div className="flex-1">
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask AutoDefense anything..."
                className={`w-full px-4 py-3 rounded-lg border ${themeConfig.border} ${themeConfig.background} ${themeConfig.text} focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all`}
              />
            </div>

            {/* Voice Button */}
            <button
              onClick={handleVoiceRecord}
              className={`p-2 rounded-lg transition-colors ${
                isRecording 
                  ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' 
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim()}
              className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file inputs for uploads */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={(e) => onSelectFile(e, 'file')}
        // common document types
        accept=".pdf,.doc,.docx,.txt,.rtf,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/rtf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/zip,application/x-zip-compressed"
      />
      <input
        ref={imageInputRef}
        type="file"
        className="hidden"
        onChange={(e) => onSelectFile(e, 'image')}
        accept="image/*"
      />
      <input
        ref={videoInputRef}
        type="file"
        className="hidden"
        onChange={(e) => onSelectFile(e, 'video')}
        accept="video/*"
      />

      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            transition={{ duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-80 bg-gray-900 text-white border-l border-gray-800 shadow-lg z-50"
          >
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Settings</h2>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-1 rounded hover:bg-gray-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-4 space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">General</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Language</label>
                    <select className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Spoken Language</label>
                    <select className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                      <option>German</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-300 mb-1">Voice</label>
                    <select className="w-full px-3 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white">
                      <option>Default</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Data Controls</h3>
                <div className="space-y-3">
                  <button
                    onClick={exportData}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Export data
                  </button>
                  <button
                    onClick={clearChat}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete account
                  </button>
                  <button
                    onClick={clearChat}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <History className="w-4 h-4" />
                    Manage history
                  </button>
                  <button
                    onClick={clearChat}
                    className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear conversations
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Theme Menu */}
      <AnimatePresence>
        {showThemeMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowThemeMenu(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Choose Theme</h2>
                <button
                  onClick={() => setShowThemeMenu(false)}
                  className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      setTheme(themeOption.id as any)
                      setShowThemeMenu(false)
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      theme === themeOption.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">{themeOption.emoji}</div>
                    <div className="text-sm font-medium">{themeOption.name}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Helper class for creating JSON blob
class JSONBlob extends Blob {
  constructor(parts: any[], options: any) {
    super(parts, options)
  }
}

export default Chat
