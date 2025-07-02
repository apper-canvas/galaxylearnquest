import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import GameCard from '@/components/molecules/GameCard'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import ApperIcon from '@/components/ApperIcon'
import { gameService } from '@/services/api/gameService'

const StoryBooksPage = () => {
  const navigate = useNavigate()
  const [stories, setStories] = useState([])
  const [userProgress, setUserProgress] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentProfile, setCurrentProfile] = useState(null)
  
  useEffect(() => {
    const profile = localStorage.getItem('currentProfile')
    if (profile) {
      setCurrentProfile(JSON.parse(profile))
    }
    loadStories()
  }, [])
  
  const loadStories = async () => {
    try {
      setLoading(true)
      setError('')
      
      const profile = JSON.parse(localStorage.getItem('currentProfile') || '{}')
      if (!profile.Id) {
        throw new Error('No profile selected')
      }
      
      const [storyBooks, progress] = await Promise.all([
        gameService.getStoriesByWorld('reading'),
        gameService.getProgressByProfile(profile.Id)
      ])
      
      setStories(storyBooks)
      setUserProgress(progress)
      
    } catch (err) {
      setError('Failed to load stories. Please try again.')
      console.error('Error loading stories:', err)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <Loading message="Loading your magical stories..." />
  }
  
  if (error) {
    return (
      <Error 
        title="Stories Loading Failed"
        message={error}
        onRetry={loadStories}
      />
    )
  }
  
  if (stories.length === 0) {
    return (
      <Empty
        title="No Stories Available"
        message="Our storytellers are working on new tales! Check back soon for magical adventures."
        actionText="Back to Adventure Map"
        onAction={() => navigate('/world-map')}
        iconName="BookOpen"
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
          <div className="w-20 h-20 bg-gradient-to-br from-accent to-warning rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <ApperIcon name="BookOpen" size={36} className="text-white" />
          </div>
          
          <h1 className="font-display text-4xl sm:text-5xl text-primary mb-4">
            Story Time
          </h1>
          <p className="font-body text-xl text-gray-600 max-w-2xl mx-auto mb-6">
            Listen to amazing stories with word-by-word narration and test your reading skills!
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
                  {currentProfile.name}'s Reading Progress
                </h3>
                <p className="text-sm text-gray-600 font-body">
                  Listen carefully and answer questions to earn stars!
                </p>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="font-display text-2xl text-accent">
                    {userProgress.filter(p => stories.some(s => s.Id === p.gameId && p.starsEarned > 0)).length}
                  </div>
                  <div className="text-xs text-gray-600 font-body">Stories Read</div>
                </div>
                <div className="text-center">
                  <div className="font-display text-2xl text-primary">
                    {stories.length}
                  </div>
                  <div className="text-xs text-gray-600 font-body">Total Stories</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Stories Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {stories.map((story, index) => {
            const progress = userProgress.find(p => p.gameId === story.Id)
            const isLocked = !story.isUnlocked
            
            return (
              <motion.div
                key={story.Id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <GameCard 
                  game={story} 
                  progress={progress} 
                  isLocked={isLocked}
                />
              </motion.div>
            )
          })}
        </motion.div>
        
        {/* Reading Tips */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12"
        >
          <div className="storybook-card p-8 bg-gradient-to-br from-accent/10 to-warning/10">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-warning rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Volume2" size={28} className="text-white" />
              </div>
              
              <h3 className="font-display text-2xl text-primary mb-4">Reading Tips</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="font-display text-lg text-accent mb-2">👂 Listen Carefully</div>
                  <p className="text-sm text-gray-600 font-body">
                    Follow along as words light up during narration!
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="font-display text-lg text-primary mb-2">📖 Read Along</div>
                  <p className="text-sm text-gray-600 font-body">
                    Watch the highlighted words to improve your reading skills.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="font-display text-lg text-warning mb-2">🎯 Answer Questions</div>
                  <p className="text-sm text-gray-600 font-body">
                    Show what you learned by answering questions about the story!
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

export default StoryBooksPage