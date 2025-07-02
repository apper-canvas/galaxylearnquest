import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import ProgressBar from '@/components/atoms/ProgressBar'

const DailyGoalCard = ({ 
  goalData,
  profileName,
  className = ''
}) => {
  if (!goalData) {
    return (
      <div className={`storybook-card p-6 ${className}`}>
        <div className="text-center">
          <ApperIcon name="Target" size={48} className="text-gray-300 mx-auto mb-4" />
          <h3 className="font-display text-lg text-gray-500 mb-2">No Goal Set</h3>
          <p className="text-sm text-gray-400 font-body">Start playing to set your daily goal!</p>
        </div>
      </div>
    )
  }
  
  const progress = (goalData.completedMinutes / goalData.targetMinutes) * 100
  const isCompleted = progress >= 100
  
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`storybook-card p-6 relative overflow-hidden ${
        isCompleted ? 'bg-gradient-to-br from-success/10 to-secondary/10' : ''
      } ${className}`}
    >
      {/* Celebration confetti for completed goals */}
      {isCompleted && (
        <div className="absolute top-2 right-2">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <ApperIcon name="Sparkles" size={24} className="text-accent" />
          </motion.div>
        </div>
      )}
      
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          isCompleted 
            ? 'bg-gradient-to-br from-success to-secondary' 
            : 'bg-gradient-to-br from-primary to-secondary'
        }`}>
          <ApperIcon 
            name={isCompleted ? "CheckCircle" : "Target"} 
            size={24} 
            className="text-white" 
          />
        </div>
        <div>
          <h3 className="font-display text-lg text-primary">
            {isCompleted ? "Goal Completed!" : "Today's Goal"}
          </h3>
          <p className="text-sm text-gray-600 font-body">
            {profileName}'s learning time
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <ProgressBar
          progress={goalData.completedMinutes}
          max={goalData.targetMinutes}
          color={isCompleted ? "success" : "magic"}
          label={`${goalData.completedMinutes} / ${goalData.targetMinutes} minutes`}
          showLabel={true}
        />
        
        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="bg-secondary/20 rounded-xl p-3">
            <div className="font-display text-2xl text-secondary mb-1">
              {goalData.gamesPlayed?.length || 0}
            </div>
            <div className="text-xs text-gray-600 font-body">Games Played</div>
          </div>
          
          <div className="bg-accent/20 rounded-xl p-3">
            <div className="font-display text-2xl text-warning mb-1">
              {goalData.skillsPracticed?.length || 0}
            </div>
            <div className="text-xs text-gray-600 font-body">Skills Practiced</div>
          </div>
        </div>
        
        {isCompleted && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center py-2"
          >
            <span className="inline-flex items-center gap-2 bg-success text-white px-4 py-2 rounded-full text-sm font-display">
              <ApperIcon name="Trophy" size={16} />
              Amazing work today!
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default DailyGoalCard