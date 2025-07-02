import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Avatar from '@/components/atoms/Avatar'
import StarRating from '@/components/atoms/StarRating'
import ProgressBar from '@/components/atoms/ProgressBar'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import { gameService } from '@/services/api/gameService'

const ProfilePage = () => {
  const [currentProfile, setCurrentProfile] = useState(null)
  const [gameProgress, setGameProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    const profile = localStorage.getItem('currentProfile')
    if (profile) {
      setCurrentProfile(JSON.parse(profile))
      loadProfileData(JSON.parse(profile))
    } else {
      setError('No profile selected')
      setLoading(false)
    }
  }, [])
  
  const loadProfileData = async (profile) => {
    try {
      setLoading(true)
      setError('')
      
      const progress = await gameService.getProgressByProfile(profile.Id)
      setGameProgress(progress)
      
    } catch (err) {
      setError('Failed to load profile data. Please try again.')
      console.error('Error loading profile data:', err)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <Loading message="Loading your character profile..." />
  }
  
  if (error) {
    return (
      <Error 
        title="Profile Loading Failed"
        message={error}
        onRetry={() => currentProfile && loadProfileData(currentProfile)}
      />
    )
  }
  
  if (!currentProfile) {
    return (
      <Error 
        title="No Character Selected"
        message="Please select a character to view their profile!"
        showRetry={false}
      />
    )
  }
  
  const totalGamesPlayed = gameProgress.length
  const totalStarsEarned = gameProgress.reduce((sum, p) => sum + p.starsEarned, 0)
  const perfectGames = gameProgress.filter(p => p.starsEarned === 3).length
  
  const achievements = [
    { 
      id: 'first_game', 
      name: 'First Steps', 
      description: 'Played your first game!',
      icon: 'Play',
      earned: totalGamesPlayed > 0
    },
    { 
      id: 'star_collector', 
      name: 'Star Collector', 
      description: 'Earned 10 stars!',
      icon: 'Star',
      earned: totalStarsEarned >= 10
    },
    { 
      id: 'perfect_player', 
      name: 'Perfect Player', 
      description: 'Got 3 stars in a game!',
      icon: 'Trophy',
      earned: perfectGames > 0
    },
    { 
      id: 'daily_player', 
      name: 'Daily Player', 
      description: 'Play every day this week!',
      icon: 'Calendar',
      earned: false // Would need more complex tracking
    },
    { 
      id: 'math_wizard', 
      name: 'Math Wizard', 
      description: 'Master of numbers!',
      icon: 'Calculator',
      earned: currentProfile.achievements?.includes('math_wizard') || false
    },
    { 
      id: 'reading_champion', 
      name: 'Reading Champion', 
      description: 'Word explorer extraordinaire!',
      icon: 'BookOpen',
      earned: currentProfile.achievements?.includes('reading_champion') || false
    }
  ]
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="storybook-card p-8 mb-8 text-center"
        >
          <Avatar 
            avatarId={currentProfile.avatarId} 
            size="xl" 
            name={currentProfile.name}
            className="mx-auto mb-6"
            animated
          />
          
          <h1 className="font-display text-4xl text-primary mb-2">
            {currentProfile.name}
          </h1>
          
          <p className="font-body text-lg text-gray-600 mb-6">
            Age {currentProfile.age} • Learning Champion
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-accent/20 to-warning/20 rounded-2xl p-4">
              <div className="font-display text-3xl text-accent mb-2">
                {currentProfile.totalStars}
              </div>
              <div className="text-sm text-gray-600 font-body flex items-center justify-center gap-1">
                <ApperIcon name="Star" size={14} className="text-accent" />
                Total Stars
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-warning/20 to-accent/20 rounded-2xl p-4">
              <div className="font-display text-3xl text-warning mb-2">
                {currentProfile.totalCoins}
              </div>
              <div className="text-sm text-gray-600 font-body flex items-center justify-center gap-1">
                <ApperIcon name="Coins" size={14} className="text-warning" />
                Coins Earned
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-4">
              <div className="font-display text-3xl text-primary mb-2">
                {Math.max(currentProfile.currentLevel?.math || 1, currentProfile.currentLevel?.reading || 1)}
              </div>
              <div className="text-sm text-gray-600 font-body flex items-center justify-center gap-1">
                <ApperIcon name="TrendingUp" size={14} className="text-primary" />
                Current Level
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Learning Progress */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
        >
          {/* Math Progress */}
          <div className="storybook-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <ApperIcon name="Calculator" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl text-primary mb-1">Math Kingdom</h3>
                <p className="text-sm text-gray-600 font-body">Level {currentProfile.currentLevel?.math || 1}</p>
              </div>
            </div>
            
            <ProgressBar
              progress={((currentProfile.currentLevel?.math || 1) - 1) * 33.33}
              max={100}
              color="primary"
              label="Level Progress"
              className="mb-4"
            />
            
            <div className="text-sm text-gray-600 font-body">
              Keep solving math puzzles to level up!
            </div>
          </div>
          
          {/* Reading Progress */}
          <div className="storybook-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-warning rounded-xl flex items-center justify-center">
                <ApperIcon name="BookOpen" size={24} className="text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl text-primary mb-1">Reading Realm</h3>
                <p className="text-sm text-gray-600 font-body">Level {currentProfile.currentLevel?.reading || 1}</p>
              </div>
            </div>
            
            <ProgressBar
              progress={((currentProfile.currentLevel?.reading || 1) - 1) * 33.33}
              max={100}
              color="magic"
              label="Level Progress"
              className="mb-4"
            />
            
            <div className="text-sm text-gray-600 font-body">
              Keep reading and exploring words to level up!
            </div>
          </div>
        </motion.div>
        
        {/* Recent Games */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="storybook-card p-6 mb-8"
        >
          <h3 className="font-display text-2xl text-primary mb-6">Recent Games</h3>
          
          {gameProgress.length === 0 ? (
            <div className="text-center py-8">
              <ApperIcon name="GamepadIcon" size={48} className="text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-body">No games played yet! Start your adventure!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {gameProgress.slice(0, 6).map((progress, index) => (
                <motion.div
                  key={progress.Id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="bg-gradient-to-br from-surface/50 to-white rounded-xl p-4 border border-primary/10"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="font-display text-sm text-primary">
                      Game #{progress.gameId}
                    </div>
                    <StarRating rating={progress.starsEarned} size="small" readonly />
                  </div>
                  
                  <div className="text-xs text-gray-600 font-body mb-2">
                    High Score: {progress.highScore}%
                  </div>
                  
                  <div className="text-xs text-gray-500 font-body">
                    Played {progress.timesPlayed} times
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Achievements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="storybook-card p-6"
        >
          <h3 className="font-display text-2xl text-primary mb-6">Achievements</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className={`rounded-xl p-4 border-2 transition-all duration-300 ${
                  achievement.earned
                    ? 'bg-gradient-to-br from-success/10 to-secondary/10 border-success/30'
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-3 ${
                  achievement.earned
                    ? 'bg-gradient-to-br from-success to-secondary'
                    : 'bg-gray-300'
                }`}>
                  <ApperIcon 
                    name={achievement.icon} 
                    size={24} 
                    className={achievement.earned ? 'text-white' : 'text-gray-500'} 
                  />
                </div>
                
                <h4 className={`font-display text-sm mb-1 ${
                  achievement.earned ? 'text-primary' : 'text-gray-500'
                }`}>
                  {achievement.name}
                </h4>
                
                <p className={`text-xs font-body ${
                  achievement.earned ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
                
                {achievement.earned && (
                  <div className="mt-2">
                    <span className="inline-flex items-center gap-1 bg-success text-white px-2 py-1 rounded-full text-xs font-body">
                      <ApperIcon name="Check" size={12} />
                      Earned!
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfilePage