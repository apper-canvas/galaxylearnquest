import React, { useState, useEffect } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Avatar from '@/components/atoms/Avatar'

const Layout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [currentProfile, setCurrentProfile] = useState(null)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  
  // Load current profile from localStorage
  useEffect(() => {
    const savedProfile = localStorage.getItem('currentProfile')
    if (savedProfile) {
      setCurrentProfile(JSON.parse(savedProfile))
    }
  }, [])
  
  const isChildInterface = !location.pathname.includes('parent-dashboard')
  const isHomePage = location.pathname === '/'
  
  const navigationItems = [
    { id: 'world-map', label: 'Adventure Map', icon: 'Map', path: '/world-map' },
    { id: 'profile', label: 'My Character', icon: 'User', path: '/profile' },
    { id: 'rewards', label: 'Rewards', icon: 'Gift', path: '/profile' },
  ]
  
  const parentNavigation = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', path: '/parent-dashboard' },
    { id: 'profiles', label: 'Children', icon: 'Users', path: '/' },
    { id: 'settings', label: 'Settings', icon: 'Settings', path: '/parent-dashboard' },
  ]
  
  const handleNavigation = (path) => {
    navigate(path)
    setShowMobileMenu(false)
  }
  
  // Don't show navigation on home page
  if (isHomePage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-surface/30 to-secondary/20">
        <Outlet />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface/30 to-secondary/20">
      {/* Child Interface Header */}
      {isChildInterface && (
        <header className="bg-white/80 backdrop-blur-sm border-b border-primary/10 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => navigate('/world-map')}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-accent to-primary rounded-xl flex items-center justify-center shadow-lg">
                  <ApperIcon name="Sparkles" size={24} className="text-white" />
                </div>
                <span className="font-display text-2xl text-primary">LearnQuest</span>
              </motion.div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-6">
                {navigationItems.map((item) => (
                  <motion.button
                    key={item.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl font-body transition-all duration-300 ${
                      location.pathname === item.path
                        ? 'bg-primary text-white shadow-lg'
                        : 'text-primary hover:bg-primary/10'
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <ApperIcon name={item.icon} size={18} />
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </nav>
              
              {/* Profile & Mobile Menu */}
              <div className="flex items-center gap-4">
                {currentProfile && (
                  <div className="hidden sm:flex items-center gap-3 bg-surface/50 rounded-full px-4 py-2">
                    <Avatar avatarId={currentProfile.avatarId} size="small" />
                    <div>
                      <div className="font-display text-sm text-primary">{currentProfile.name}</div>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <ApperIcon name="Star" size={12} className="text-accent" />
                        <span>{currentProfile.totalStars}</span>
                        <ApperIcon name="Coins" size={12} className="text-warning" />
                        <span>{currentProfile.totalCoins}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Mobile Menu Button */}
                <button
                  className="md:hidden p-2 rounded-xl bg-primary/10 text-primary"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  <ApperIcon name={showMobileMenu ? "X" : "Menu"} size={24} />
                </button>
                
                {/* Parent Corner */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-xl font-body text-sm hover:bg-gray-200 transition-colors"
                  onClick={() => navigate('/parent-dashboard')}
                >
                  <ApperIcon name="Shield" size={16} />
                  Parent Corner
                </motion.button>
              </div>
            </div>
          </div>
        </header>
      )}
      
      {/* Parent Interface Header */}
      {!isChildInterface && (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <ApperIcon name="BookOpen" size={18} className="text-white" />
                </div>
                <span className="font-display text-xl text-primary">LearnQuest Parent</span>
              </div>
              
              <nav className="hidden md:flex items-center gap-4">
                {parentNavigation.map((item) => (
                  <button
                    key={item.id}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg font-body text-sm transition-colors ${
                      location.pathname === item.path
                        ? 'bg-primary text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <ApperIcon name={item.icon} size={16} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
              
              <button
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent to-primary text-white rounded-lg font-body text-sm hover:opacity-90 transition-opacity"
                onClick={() => navigate('/')}
              >
                <ApperIcon name="ArrowLeft" size={16} />
                Back to Kids
              </button>
            </div>
          </div>
        </header>
      )}
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {showMobileMenu && isChildInterface && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <span className="font-display text-xl text-primary">Menu</span>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 rounded-xl bg-gray-100 text-gray-600"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                {currentProfile && (
                  <div className="flex items-center gap-3 bg-surface/50 rounded-2xl p-4 mb-6">
                    <Avatar avatarId={currentProfile.avatarId} size="medium" />
                    <div>
                      <div className="font-display text-lg text-primary">{currentProfile.name}</div>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Star" size={14} className="text-accent" />
                          <span>{currentProfile.totalStars}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ApperIcon name="Coins" size={14} className="text-warning" />
                          <span>{currentProfile.totalCoins}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.id}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body transition-all duration-300 ${
                        location.pathname === item.path
                          ? 'bg-primary text-white shadow-lg'
                          : 'text-primary hover:bg-primary/10'
                      }`}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <ApperIcon name={item.icon} size={20} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </nav>
                
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 bg-gray-100 text-gray-600 rounded-xl font-body hover:bg-gray-200 transition-colors"
                    onClick={() => {
                      navigate('/parent-dashboard')
                      setShowMobileMenu(false)
                    }}
                  >
                    <ApperIcon name="Shield" size={20} />
                    <span>Parent Corner</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Bottom Navigation for Mobile (Child Interface Only) */}
      {isChildInterface && (
        <div className="md:hidden bg-white border-t border-primary/10 sticky bottom-0 z-30">
          <div className="grid grid-cols-3 gap-1 p-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl font-body text-xs transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'bg-primary text-white shadow-lg'
                    : 'text-primary'
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <ApperIcon name={item.icon} size={20} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout