import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ProfileSelector from '@/components/molecules/ProfileSelector'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import { profileService } from '@/services/api/profileService'

const HomePage = () => {
  const navigate = useNavigate()
  const [profiles, setProfiles] = useState([])
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    loadProfiles()
  }, [])
  
  const loadProfiles = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await profileService.getAll()
      setProfiles(data)
    } catch (err) {
      setError('Failed to load profiles. Please try again.')
      console.error('Error loading profiles:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleProfileSelect = (profile) => {
    setSelectedProfile(profile)
    localStorage.setItem('currentProfile', JSON.stringify(profile))
    toast.success(`Welcome back, ${profile.name}! 🌟`)
    setTimeout(() => {
      navigate('/world-map')
    }, 1000)
  }
  
  const handleCreateNew = () => {
    navigate('/create-profile')
  }
  
  if (loading) {
    return <Loading message="Loading your adventure characters..." />
  }
  
  if (error) {
    return (
      <Error 
        title="Oops! Adventure Loading Failed"
        message={error}
        onRetry={loadProfiles}
      />
    )
  }
  
  return (
    <div className="min-h-screen flex flex-col justify-center py-8 px-4">
      <div className="max-w-6xl mx-auto w-full">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="w-24 h-24 bg-gradient-to-br from-accent to-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl"
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            >
              ✨
            </motion.div>
          </motion.div>
          
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-primary mb-4">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              LearnQuest
            </span>
          </h1>
          
          <p className="font-body text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Where learning becomes the greatest adventure! 
            Choose your character and begin your magical journey through worlds of knowledge.
          </p>
        </motion.div>
        
        {/* Profile Selection */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ProfileSelector
            profiles={profiles}
            selectedProfile={selectedProfile}
            onSelect={handleProfileSelect}
            onCreateNew={handleCreateNew}
          />
        </motion.div>
        
        {/* Parent Access */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <button
            onClick={() => navigate('/parent-dashboard')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-600 rounded-2xl font-body hover:bg-gray-200 transition-colors"
          >
            <span>🛡️</span>
            Parent Dashboard
          </button>
        </motion.div>
        
        {/* Floating Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 6 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              transition={{
                duration: 10 + Math.random() * 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              {['🌟', '📚', '🎨', '🔢', '🚀', '🏰'][i]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomePage