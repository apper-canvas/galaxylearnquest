import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import GameCard from '@/components/molecules/GameCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { gameService } from '@/services/api/gameService'

const GameSelectionPage = () => {
  const { worldId } = useParams()
  const navigate = useNavigate()
  const [games, setGames] = useState([])
  const [userProgress, setUserProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentProfile, setCurrentProfile] = useState(null)
  
  useEffect(() => {
    const profile = localStorage.getItem('currentProfile')
    if (profile) {
      setCurrentProfile(JSON.parse(profile))
    }
    loadGames()
  }, [worldId])
  
  const loadGames = async () => {
    try {
      setLoading(true)
      setError('')
      
      const profile = JSON.parse(localStorage.getItem('currentProfile') || '{}')
      if (!profile.Id) {
        throw new Error('No profile selected')
      }
      
      const [worldGames, progress] = await Promise.all([
        gameService.getGamesByWorld(worldId),
        gameService.getProgressByProfile(profile.Id)
      ])
      
      setGames(worldGames)
      setUserProgress(progress)
      
    } catch (err) {
      setError('Failed to load games. Please try again.')
      console.error('Error loading games:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const getWorldInfo = () => {
    switch (worldId) {
      case 'math':
        return {
          title: 'Math Kingdom',
          description: 'Master numbers, shapes, and mathematical thinking!',
          icon: 'Calculator',
          gradient: 'from-primary to-secondary'
        }
      case 'reading':
        return {
          title: 'Reading Realm',
          description: 'Discover letters, words, and amazing stories!',
          icon: 'BookOpen',
          gradient: 'from-accent to-warning'
        }
      default:
        return {
          title: 'Learning World',
          description: 'Explore educational adventures!',
          icon: 'BookOpen',
          gradient: 'from-primary to-secondary'
        }
    }
  }
  
  if (loading) {
    return <Loading message="Loading your learning games..." />
  }
  
  if (error) {
    return (
      <Error 
        title="Games Loading Failed"
        message={error}
        onRetry={loadGames}
      />
    )
  }
  
  if (games.length === 0) {
    return (
      <Empty
        title="No Games Available"
        message="This world is still being built! Check back soon for new adventures."
        actionText="Back to Map"
        onAction={() => navigate('/world-map')}
        iconName="Construction"
      />
    )
  }
  
  const worldInfo = getWorldInfo()
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className={`w-20 h-20 bg-gradient-to-br ${worldInfo.gradient} rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl`}>
            <ApperIcon name={worldInfo.icon} size={36} className="text-white" />
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl text-primary mb-4">
            {worldInfo.title}
          </h1>
          <p className="font-body text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            {worldInfo.description}
          </p>
          
          <button
            onClick={() => navigate('/world-map')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm text-primary rounded-2xl font-body hover:bg-white transition-colors shadow-lg"
          >
            <ApperIcon name="ArrowLeft" size={18} />
            Back to Adventure Map
          </button>
        </motion.div>
        
        {/* Progress Summary */}
        {currentProfile && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="storybook-card p-6 mb-8 max-w-2xl mx-auto"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-lg text-primary mb-1">
                  {currentProfile.name}'s Progress
                </h3>
                <p className="text-sm text-gray-600 font-body">
                  Keep exploring to earn more stars and unlock new adventures!
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="font-display text-2xl text-accent">
                    {userProgress.filter(p => games.some(g => g.Id === p.gameId && p.starsEarned > 0)).length}
                  </div>
                  <div className="text-xs text-gray-600 font-body">Completed</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl text-primary">
                    {games.length}
                  </div>
                  <div className="text-xs text-gray-600 font-body">Total Games</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Games Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {games.map((game, index) => {
            const progress = userProgress.find(p => p.gameId === game.Id)
            const isLocked = !game.isUnlocked
            
            return (
              <motion.div
                key={game.Id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <GameCard 
                  game={game} 
                  progress={progress} 
                  isLocked={isLocked}
                />
              </motion.div>
            )
          })}
        </motion.div>
        
        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <div className="storybook-card p-8 bg-gradient-to-br from-secondary/10 to-accent/10">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-info to-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Lightbulb" size={28} className="text-white" />
              </div>
              
              <h3 className="font-display text-2xl text-primary mb-4">Learning Tips</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="font-display text-lg text-secondary mb-2">🌟 Earn Stars</div>
                  <p className="text-sm text-gray-600 font-body">
                    Get answers right to earn stars and unlock new games!
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="font-display text-lg text-accent mb-2">⏰ Take Your Time</div>
                  <p className="text-sm text-gray-600 font-body">
                    There's no rush! Think carefully before choosing your answer.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="font-display text-lg text-primary mb-2">🎯 Practice Daily</div>
                  <p className="text-sm text-gray-600 font-body">
                    Play a little bit each day to become a learning champion!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default GameSelectionPage