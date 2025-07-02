import React from 'react'
import { motion } from 'framer-motion'
import Avatar from '@/components/atoms/Avatar'
import ApperIcon from '@/components/ApperIcon'

const ProfileSelector = ({ profiles, selectedProfile, onSelect, onCreateNew, className = '' }) => {
  return (
    <div className={`space-y-4 ${className}`}>
      <h2 className="text-2xl font-display text-primary text-center mb-6">
        Choose Your Adventure Character
      </h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.Id}
            initial={{ scale: 0, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`storybook-card p-6 cursor-pointer text-center transition-all duration-300 ${
              selectedProfile?.Id === profile.Id 
                ? 'ring-4 ring-accent shadow-xl' 
                : 'hover:shadow-lg'
            }`}
            onClick={() => onSelect(profile)}
          >
            <Avatar 
              avatarId={profile.avatarId} 
              size="large" 
              name={profile.name}
              className="mx-auto mb-4"
            />
            
            <h3 className="font-display text-lg text-primary mb-2">
              {profile.name}
            </h3>
            
            <div className="flex items-center justify-center gap-4 text-sm text-gray-600 font-body mb-3">
              <div className="flex items-center gap-1">
                <ApperIcon name="Star" size={14} className="text-accent" />
                <span>{profile.totalStars}</span>
              </div>
              <div className="flex items-center gap-1">
                <ApperIcon name="Coins" size={14} className="text-warning" />
                <span>{profile.totalCoins}</span>
              </div>
            </div>
            
            <div className="text-xs text-gray-500 font-body">
              Age {profile.age} • Level {Math.max(profile.currentLevel.math, profile.currentLevel.reading)}
            </div>
          </motion.div>
        ))}
        
        {/* Create New Profile Card */}
        <motion.div
          initial={{ scale: 0, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ delay: profiles.length * 0.1, duration: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="storybook-card p-6 cursor-pointer text-center border-2 border-dashed border-primary/30 hover:border-primary/60 transition-all duration-300"
          onClick={onCreateNew}
        >
          <div className="w-24 h-24 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ApperIcon name="Plus" size={32} className="text-primary" />
          </div>
          
          <h3 className="font-display text-lg text-primary mb-2">
            Create New Character
          </h3>
          
          <p className="text-sm text-gray-600 font-body">
            Start a new learning adventure!
          </p>
        </motion.div>
      </div>
    </div>
  )
}

export default ProfileSelector