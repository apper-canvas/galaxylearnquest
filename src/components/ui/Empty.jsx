import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "Ready for your next adventure?", 
  message = "Choose a game and start your magical learning journey!",
  actionText = "Start Playing",
  onAction,
  iconName = "Compass"
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <motion.div
        initial={{ scale: 0, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-6"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center shadow-xl">
          <ApperIcon name={iconName} size={40} className="text-white" />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="max-w-md"
      >
        <h3 className="text-2xl font-display text-primary mb-3">
          {title}
        </h3>
        <p className="text-gray-600 font-body mb-8 leading-relaxed">
          {message}
        </p>
        
        {onAction && (
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={onAction}
            className="bg-gradient-to-r from-accent to-primary text-white px-10 py-4 rounded-2xl font-display text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 mx-auto magical-glow"
          >
            <ApperIcon name="Play" size={24} />
            {actionText}
          </motion.button>
        )}
      </motion.div>
      
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mt-8 opacity-50"
      >
        <ApperIcon name="ChevronDown" size={24} className="text-primary" />
      </motion.div>
    </div>
  )
}

export default Empty