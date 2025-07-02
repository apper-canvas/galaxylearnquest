import React from 'react'
import { motion } from 'framer-motion'

const ProgressBar = ({ 
  progress = 0, 
  max = 100, 
  size = 'medium',
  color = 'primary',
  showLabel = true,
  label = 'Progress',
  animated = true,
  className = ''
}) => {
  const percentage = Math.min((progress / max) * 100, 100)
  
  const sizes = {
    small: 'h-2',
    medium: 'h-4',
    large: 'h-6'
  }
  
  const colors = {
    primary: 'from-primary to-secondary',
    success: 'from-success to-secondary',
    warning: 'from-warning to-accent',
    magic: 'from-accent to-primary'
  }
  
  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-body text-gray-700">{label}</span>
          <span className="text-sm font-display text-primary">{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${sizes[size]} overflow-hidden`}>
        <motion.div
          className={`${sizes[size]} bg-gradient-to-r ${colors[color]} rounded-full progress-fill`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 0.8 : 0,
            ease: "easeOut"
          }}
        />
      </div>
    </div>
  )
}

export default ProgressBar