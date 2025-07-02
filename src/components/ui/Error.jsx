import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ 
  title = "Oops! Something went wrong", 
  message = "Don't worry, even the best adventurers face challenges!",
  onRetry,
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] p-8 text-center">
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mb-6"
      >
        <div className="w-20 h-20 bg-gradient-to-br from-error to-warning rounded-full flex items-center justify-center shadow-lg">
          <ApperIcon name="AlertTriangle" size={36} className="text-white" />
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="max-w-md"
      >
        <h3 className="text-2xl font-display text-primary mb-3">
          {title}
        </h3>
        <p className="text-gray-600 font-body mb-6 leading-relaxed">
          {message}
        </p>
        
        {showRetry && onRetry && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRetry}
            className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-3 rounded-2xl font-display text-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto"
          >
            <ApperIcon name="RotateCcw" size={20} />
            Try Again
          </motion.button>
        )}
      </motion.div>
    </div>
  )
}

export default Error