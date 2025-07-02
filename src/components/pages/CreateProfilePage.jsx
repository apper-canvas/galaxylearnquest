import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Button from '@/components/atoms/Button'
import Avatar from '@/components/atoms/Avatar'
import ApperIcon from '@/components/ApperIcon'
import { profileService } from '@/services/api/profileService'

const CreateProfilePage = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    age: 5,
    avatarId: 'princess'
  })
  const [loading, setLoading] = useState(false)
  
  const avatars = [
    { id: 'princess', name: 'Princess', icon: 'Crown' },
    { id: 'astronaut', name: 'Astronaut', icon: 'Rocket' },
    { id: 'scientist', name: 'Scientist', icon: 'Beaker' },
    { id: 'artist', name: 'Artist', icon: 'Palette' },
    { id: 'explorer', name: 'Explorer', icon: 'Compass' },
    { id: 'wizard', name: 'Wizard', icon: 'Wand2' }
  ]
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast.error('Please enter a name for your character!')
      return
    }
    
    if (formData.name.trim().length < 2) {
      toast.error('Name must be at least 2 characters long!')
      return
    }
    
    try {
      setLoading(true)
      const newProfile = await profileService.create({
        name: formData.name.trim(),
        age: formData.age,
        avatarId: formData.avatarId,
        currentLevel: { math: 1, reading: 1 }
      })
      
      localStorage.setItem('currentProfile', JSON.stringify(newProfile))
      toast.success(`Welcome to LearnQuest, ${newProfile.name}! 🎉`)
      
      setTimeout(() => {
        navigate('/world-map')
      }, 1500)
      
    } catch (err) {
      toast.error('Failed to create profile. Please try again.')
      console.error('Error creating profile:', err)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <ApperIcon name="UserPlus" size={36} className="text-white" />
          </div>
          
          <h1 className="font-display text-4xl text-primary mb-3">
            Create Your Adventure Character
          </h1>
          <p className="font-body text-lg text-gray-600">
            Choose your name, age, and favorite character type to begin your learning journey!
          </p>
        </motion.div>
        
        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleSubmit}
          className="storybook-card p-8 space-y-8"
        >
          {/* Name Input */}
          <div>
            <label className="block font-display text-lg text-primary mb-3">
              What's your name?
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-primary/20 rounded-2xl font-body text-lg focus:border-primary focus:outline-none transition-colors"
              placeholder="Enter your name..."
              maxLength={20}
            />
          </div>
          
          {/* Age Selection */}
          <div>
            <label className="block font-display text-lg text-primary mb-3">
              How old are you?
            </label>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 7 }, (_, i) => i + 4).map(age => (
                <button
                  key={age}
                  type="button"
                  className={`aspect-square rounded-xl font-display text-lg transition-all duration-300 ${
                    formData.age === age
                      ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-lg scale-110'
                      : 'bg-surface text-primary hover:bg-primary/10'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, age }))}
                >
                  {age}
                </button>
              ))}
            </div>
          </div>
          
          {/* Avatar Selection */}
          <div>
            <label className="block font-display text-lg text-primary mb-3">
              Choose your character type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {avatars.map(avatar => (
                <motion.button
                  key={avatar.id}
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`storybook-card p-4 text-center transition-all duration-300 ${
                    formData.avatarId === avatar.id
                      ? 'ring-4 ring-accent shadow-xl'
                      : 'hover:shadow-lg'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, avatarId: avatar.id }))}
                >
                  <Avatar avatarId={avatar.id} size="large" className="mx-auto mb-3" />
                  <span className="font-display text-primary">{avatar.name}</span>
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Preview */}
          {formData.name && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl p-6 text-center"
            >
              <h3 className="font-display text-xl text-primary mb-4">Character Preview</h3>
              <Avatar avatarId={formData.avatarId} size="xl" className="mx-auto mb-4" />
              <div className="font-display text-2xl text-primary mb-2">{formData.name}</div>
              <div className="font-body text-gray-600">Age {formData.age} • {avatars.find(a => a.id === formData.avatarId)?.name}</div>
            </motion.div>
          )}
          
          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1"
              icon="ArrowLeft"
            >
              Back
            </Button>
            
            <Button
              type="submit"
              variant="magical"
              className="flex-1"
              loading={loading}
              icon="Sparkles"
            >
              Start Adventure!
            </Button>
          </div>
        </motion.form>
      </div>
    </div>
  )
}

export default CreateProfilePage