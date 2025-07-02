import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import StarRating from '@/components/atoms/StarRating'

const GameCard = ({ game, progress, isLocked = false, className = '' }) => {
  const navigate = useNavigate()
  
const handlePlay = () => {
    if (!isLocked) {
      if (game.category === 'storybook') {
        navigate(`/story/${game.Id}`)
      } else {
        navigate(`/game/${game.Id}`)
      }
    }
  }
  
  return (
    <motion.div
      whileHover={!isLocked ? { scale: 1.05, y: -5 } : {}}
      whileTap={!isLocked ? { scale: 0.98 } : {}}
      className={`storybook-card p-6 cursor-pointer relative overflow-hidden ${
        isLocked ? 'opacity-60' : ''
      } ${className}`}
      onClick={handlePlay}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10">
        <ApperIcon name={game.iconName} size={80} className="text-primary" />
      </div>
      
      {/* Lock Overlay */}
      {isLocked && (
        <div className="absolute inset-0 bg-black/20 rounded-2xl flex items-center justify-center">
          <div className="bg-white rounded-full p-3 shadow-lg">
            <ApperIcon name="Lock" size={24} className="text-gray-600" />
          </div>
        </div>
      )}
      
      <div className="relative z-10">
{/* Game Icon */}
        <div className={`w-12 h-12 bg-gradient-to-br ${
          game.category === 'storybook' 
            ? 'from-accent to-warning' 
            : 'from-primary to-secondary'
        } rounded-xl flex items-center justify-center mb-4 shadow-md`}>
          <ApperIcon name={game.iconName} size={24} className="text-white" />
        </div>
        
        {/* Game Info */}
        <h3 className="font-display text-lg text-primary mb-2">{game.title}</h3>
        <p className="text-sm text-gray-600 font-body mb-4 line-clamp-2">
          {game.description}
        </p>
        
        {/* Progress and Stars */}
        <div className="flex items-center justify-between">
          <StarRating 
            rating={progress?.starsEarned || 0} 
            size="small" 
            readonly 
            animated={false}
          />
          
{!isLocked && (
            <div className="flex items-center gap-2">
              {progress?.timesPlayed > 0 && (
                <span className="text-xs text-gray-500 font-body">
                  {game.category === 'storybook' ? 'Read' : 'Played'} {progress.timesPlayed}x
                </span>
              )}
              <ApperIcon name={game.category === 'storybook' ? "BookOpen" : "Play"} size={16} className="text-primary" />
            </div>
          )}
        </div>
        
        {/* Age Range */}
        <div className="mt-3 inline-flex items-center gap-1 bg-secondary/20 px-2 py-1 rounded-lg">
          <ApperIcon name="Users" size={12} className="text-secondary" />
          <span className="text-xs font-body text-secondary">
            Ages {game.minAge}-{game.maxAge}
          </span>
        </div>
      </div>
    </motion.div>
  )
}

export default GameCard