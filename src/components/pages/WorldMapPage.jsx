import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import WorldCard from '@/components/molecules/WorldCard'
import DailyGoalCard from '@/components/molecules/DailyGoalCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { gameService } from '@/services/api/gameService'
import { dailyGoalService } from '@/services/api/dailyGoalService'

const WorldMapPage = () => {
  const [worlds, setWorlds] = useState([])
  const [dailyGoal, setDailyGoal] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentProfile, setCurrentProfile] = useState(null)
  
  useEffect(() => {
    const profile = localStorage.getItem('currentProfile')
    if (profile) {
      setCurrentProfile(JSON.parse(profile))
    }
    loadWorldData()
  }, [])
  
  const loadWorldData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const profile = JSON.parse(localStorage.getItem('currentProfile') || '{}')
      if (!profile.Id) {
        throw new Error('No profile selected')
      }
      
      // Load games and progress
      const [allGames, userProgress, todaysGoal] = await Promise.all([
        gameService.getAllGames(),
        gameService.getProgressByProfile(profile.Id),
        dailyGoalService.getTodaysGoal(profile.Id)
      ])
      
      // Calculate world progress
      const mathGames = allGames.filter(game => game.worldId === 'math')
      const readingGames = allGames.filter(game => game.worldId === 'reading')
      
      const mathProgress = userProgress.filter(p => 
        mathGames.some(g => g.Id === p.gameId)
      )
      const readingProgress = userProgress.filter(p => 
        readingGames.some(g => g.Id === p.gameId)
      )
      
      const mathCompletedGames = mathProgress.filter(p => p.starsEarned > 0).length
      const readingCompletedGames = readingProgress.filter(p => p.starsEarned > 0).length
      
      setWorlds([
        {
          worldId: 'math',
          title: 'Math Kingdom',
          description: 'Journey through enchanted lands where numbers come alive! Master counting, addition, shapes, and patterns.',
          iconName: 'Calculator',
          backgroundColor: { from: '#6B5B95', to: '#88D8B0' },
          progress: mathGames.length > 0 ? (mathCompletedGames / mathGames.length) * 100 : 0,
          totalGames: mathGames.length,
          completedGames: mathCompletedGames,
          isUnlocked: true
        },
        {
          worldId: 'reading',
          title: 'Reading Realm',
          description: 'Explore magical forests of words and letters! Discover phonics, build words, and unlock amazing stories.',
          iconName: 'BookOpen',
          backgroundColor: { from: '#FFCC5C', to: '#F39C12' },
          progress: readingGames.length > 0 ? (readingCompletedGames / readingGames.length) * 100 : 0,
          totalGames: readingGames.length,
          completedGames: readingCompletedGames,
          isUnlocked: true
        }
      ])
      
      setDailyGoal(todaysGoal)
      
    } catch (err) {
      setError('Failed to load your adventure map. Please try again.')
      console.error('Error loading world data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <Loading message="Loading your magical adventure map..." />
  }
  
  if (error) {
    return (
      <Error 
        title="Adventure Map Loading Failed"
        message={error}
        onRetry={loadWorldData}
      />
    )
  }
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl sm:text-5xl text-primary mb-4">
            🗺️ Adventure Map
          </h1>
          <p className="font-body text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your learning adventure! Each world is filled with exciting games and challenges.
          </p>
        </motion.div>
        
        {/* Daily Goal Card */}
        {currentProfile && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <DailyGoalCard 
              goalData={dailyGoal} 
              profileName={currentProfile.name}
              className="max-w-md mx-auto"
            />
          </motion.div>
        )}
        
        {/* World Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"
        >
          {worlds.map((world, index) => (
            <motion.div
              key={world.worldId}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <WorldCard {...world} />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Stats Overview */}
        {currentProfile && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            <div className="storybook-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-warning rounded-xl flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Star" size={24} className="text-white" />
              </div>
              <div className="font-display text-2xl text-primary mb-1">
                {currentProfile.totalStars}
              </div>
              <div className="text-sm text-gray-600 font-body">Stars Earned</div>
            </div>
            
            <div className="storybook-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-warning to-accent rounded-xl flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Coins" size={24} className="text-white" />
              </div>
              <div className="font-display text-2xl text-primary mb-1">
                {currentProfile.totalCoins}
              </div>
              <div className="text-sm text-gray-600 font-body">Coins Collected</div>
            </div>
            
            <div className="storybook-card p-6 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
                <ApperIcon name="Trophy" size={24} className="text-white" />
              </div>
              <div className="font-display text-2xl text-primary mb-1">
                {currentProfile.achievements?.length || 0}
              </div>
              <div className="text-sm text-gray-600 font-body">Achievements</div>
            </div>
          </motion.div>
        )}
        
        {/* Floating Elements */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 4 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute text-6xl opacity-10"
              initial={{ 
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                rotate: [0, 360],
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              {['🏰', '🌟', '📚', '🎭'][i]}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default WorldMapPage