import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import ApperIcon from '@/components/ApperIcon'
import ProgressBar from '@/components/atoms/ProgressBar'

const WorldCard = ({ 
  worldId, 
  title, 
  description, 
  iconName, 
  backgroundColor, 
  progress = 0,
  totalGames = 0,
  completedGames = 0,
  isUnlocked = true,
  className = ''
}) => {
  const navigate = useNavigate()
  
  const handleEnterWorld = () => {
    if (isUnlocked) {
      navigate(`/world/${worldId}/games`)
    }
  }
  
  return (
    <motion.div
      whileHover={isUnlocked ? { scale: 1.05, y: -10 } : {}}
      whileTap={isUnlocked ? { scale: 0.98 } : {}}
      className={`relative overflow-hidden rounded-3xl cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-500 ${
        isUnlocked ? '' : 'opacity-60'
      } ${className}`}
      onClick={handleEnterWorld}
      style={{ 
        background: `linear-gradient(135deg, ${backgroundColor.from} 0%, ${backgroundColor.to} 100%)`,
        minHeight: '280px'
      }}
    >
      {/* Background Pattern */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-20 -mr-8 -mt-8">
        <ApperIcon name={iconName} size={128} className="text-white" />
      </div>
      
      {/* Lock Overlay */}
      {!isUnlocked && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white rounded-full p-4 shadow-lg">
            <ApperIcon name="Lock" size={32} className="text-gray-600" />
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-between text-white">
        <div>
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-lg">
            <ApperIcon name={iconName} size={32} className="text-white" />
          </div>
          
          <h2 className="font-display text-3xl mb-3">{title}</h2>
          <p className="font-body text-white/90 text-lg leading-relaxed mb-6">
            {description}
          </p>
        </div>
        
        {isUnlocked && (
          <div className="space-y-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-body text-sm">Progress</span>
                <span className="font-display text-sm">{completedGames}/{totalGames} games</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <motion.div
                  className="bg-white rounded-full h-3 shadow-sm"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-body text-white/80">Enter World</span>
              <ApperIcon name="ArrowRight" size={24} className="text-white" />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default WorldCard