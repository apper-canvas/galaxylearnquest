import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const StarRating = ({ 
  rating = 0, 
  maxRating = 3, 
  size = 'medium',
  animated = true,
  onClick,
  readonly = false,
  className = ''
}) => {
  const sizes = {
    small: 16,
    medium: 24,
    large: 32
  }
  
  const handleStarClick = (starIndex) => {
    if (!readonly && onClick) {
      onClick(starIndex + 1)
    }
  }
  
  return (
    <div className={`flex gap-1 ${className}`}>
      {Array.from({ length: maxRating }, (_, index) => {
        const filled = index < rating
        
        return (
          <motion.div
            key={index}
            whileHover={!readonly ? { scale: 1.2 } : {}}
            whileTap={!readonly ? { scale: 0.9 } : {}}
            initial={animated ? { scale: 0, rotate: -180 } : {}}
            animate={animated ? { scale: 1, rotate: 0 } : {}}
            transition={animated ? { 
              delay: index * 0.1, 
              duration: 0.3,
              ease: "easeOut"
            } : {}}
            className={`cursor-${readonly ? 'default' : 'pointer'}`}
            onClick={() => handleStarClick(index)}
          >
            <ApperIcon 
              name={filled ? "Star" : "Star"} 
              size={sizes[size]} 
              className={filled 
                ? "text-accent fill-current drop-shadow-sm" 
                : "text-gray-300"
              }
            />
          </motion.div>
        )
      })}
    </div>
  )
}

export default StarRating