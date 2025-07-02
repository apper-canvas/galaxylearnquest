import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Avatar = ({ 
  avatarId = 'default', 
  size = 'medium', 
  name = '',
  className = '',
  onClick,
  animated = false
}) => {
  const avatars = {
    princess: { icon: 'Crown', color: 'from-pink-400 to-purple-500' },
    astronaut: { icon: 'Rocket', color: 'from-blue-400 to-indigo-500' },
    scientist: { icon: 'Beaker', color: 'from-green-400 to-teal-500' },
    artist: { icon: 'Palette', color: 'from-orange-400 to-red-500' },
    explorer: { icon: 'Compass', color: 'from-yellow-400 to-orange-500' },
    wizard: { icon: 'Wand2', color: 'from-purple-400 to-indigo-500' },
    default: { icon: 'User', color: 'from-gray-400 to-gray-500' }
  }
  
  const sizes = {
    small: 'w-10 h-10',
    medium: 'w-16 h-16',
    large: 'w-24 h-24',
    xl: 'w-32 h-32'
  }
  
  const iconSizes = {
    small: 20,
    medium: 28,
    large: 40,
    xl: 56
  }
  
  const avatar = avatars[avatarId] || avatars.default
  
  const AvatarComponent = (
    <div 
      className={`${sizes[size]} bg-gradient-to-br ${avatar.color} rounded-full flex items-center justify-center shadow-lg cursor-pointer ${className}`}
      onClick={onClick}
      title={name}
    >
      <ApperIcon name={avatar.icon} size={iconSizes[size]} className="text-white" />
    </div>
  )
  
  if (animated) {
    return (
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        {AvatarComponent}
      </motion.div>
    )
  }
  
  return AvatarComponent
}

export default Avatar