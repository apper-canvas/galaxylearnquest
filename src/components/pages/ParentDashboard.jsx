import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import ApperIcon from '@/components/ApperIcon'
import Avatar from '@/components/atoms/Avatar'
import { profileService } from '@/services/api/profileService'
import { gameService } from '@/services/api/gameService'
import { dailyGoalService } from '@/services/api/dailyGoalService'

const ParentDashboard = () => {
  const navigate = useNavigate()
  const [profiles, setProfiles] = useState([])
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [activityData, setActivityData] = useState([])
  const [dailyGoals, setDailyGoals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    loadDashboardData()
  }, [])
  
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError('')
      
      const allProfiles = await profileService.getAll()
      setProfiles(allProfiles)
      
      if (allProfiles.length > 0) {
        setSelectedProfile(allProfiles[0])
        
        // Load activity data for all profiles
        const activityPromises = allProfiles.map(async (profile) => {
          const [progress, todaysGoal] = await Promise.all([
            gameService.getProgressByProfile(profile.Id),
            dailyGoalService.getTodaysGoal(profile.Id)
          ])
          
          return {
            profile,
            progress,
            todaysGoal
          }
        })
        
        const activities = await Promise.all(activityPromises)
        setActivityData(activities)
      }
      
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.')
      console.error('Error loading dashboard:', err)
    } finally {
      setLoading(false)
    }
  }
  
  if (loading) {
    return <Loading message="Loading parent dashboard..." />
  }
  
  if (error) {
    return (
      <Error 
        title="Dashboard Loading Failed"
        message={error}
        onRetry={loadDashboardData}
      />
    )
  }
  
  const selectedActivityData = activityData.find(data => data.profile.Id === selectedProfile?.Id)
  
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Parent Dashboard</h1>
              <p className="text-gray-600">Monitor your children's learning progress and achievements</p>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <ApperIcon name="ArrowLeft" size={16} />
              Back to Kids Area
            </button>
          </div>
        </motion.div>
        
        {profiles.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <ApperIcon name="Users" size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Children Profiles</h3>
            <p className="text-gray-500 mb-6">Create a child profile to start tracking learning progress</p>
            <button
              onClick={() => navigate('/create-profile')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              <ApperIcon name="Plus" size={16} />
              Add Child Profile
            </button>
          </div>
        ) : (
          <>
            {/* Profile Selector */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Child</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {profiles.map((profile) => (
                  <button
                    key={profile.Id}
                    onClick={() => setSelectedProfile(profile)}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      selectedProfile?.Id === profile.Id
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar avatarId={profile.avatarId} size="medium" />
                      <div>
                        <div className="font-semibold text-gray-800">{profile.name}</div>
                        <div className="text-sm text-gray-600">Age {profile.age}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Star" size={14} className="text-yellow-500" />
                        <span>{profile.totalStars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ApperIcon name="Coins" size={14} className="text-orange-500" />
                        <span>{profile.totalCoins}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
            
            {selectedProfile && selectedActivityData && (
              <>
                {/* Stats Overview */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Clock" size={20} className="text-blue-600" />
                      </div>
                      <div className="text-sm text-gray-600">Today's Progress</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedActivityData.todaysGoal?.completedMinutes || 0} min
                    </div>
                    <div className="text-sm text-gray-500">
                      Goal: {selectedActivityData.todaysGoal?.targetMinutes || 20} min
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="GamepadIcon" size={20} className="text-green-600" />
                      </div>
                      <div className="text-sm text-gray-600">Games Played</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedActivityData.progress.length}
                    </div>
                    <div className="text-sm text-gray-500">Total games</div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Star" size={20} className="text-yellow-600" />
                      </div>
                      <div className="text-sm text-gray-600">Stars Earned</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedProfile.totalStars}
                    </div>
                    <div className="text-sm text-gray-500">Total collection</div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ApperIcon name="TrendingUp" size={20} className="text-purple-600" />
                      </div>
                      <div className="text-sm text-gray-600">Average Score</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {selectedActivityData.progress.length > 0
                        ? Math.round(selectedActivityData.progress.reduce((sum, p) => sum + p.highScore, 0) / selectedActivityData.progress.length)
                        : 0}%
                    </div>
                    <div className="text-sm text-gray-500">Across all games</div>
                  </div>
                </motion.div>
                
                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-xl shadow-lg p-6 mb-8"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h3>
                  
                  {selectedActivityData.progress.length === 0 ? (
                    <div className="text-center py-8">
                      <ApperIcon name="Activity" size={48} className="text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No activity yet. Encourage your child to start playing!</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {selectedActivityData.progress.slice(0, 5).map((progress, index) => (
                        <div key={progress.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                              <ApperIcon name="Play" size={16} className="text-primary" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">Game #{progress.gameId}</div>
                              <div className="text-sm text-gray-600">
                                {new Date(progress.lastPlayed).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <div className="font-medium text-gray-800">{progress.highScore}%</div>
                              <div className="flex gap-1">
                                {Array.from({ length: 3 }, (_, i) => (
                                  <ApperIcon
                                    key={i}
                                    name="Star"
                                    size={12}
                                    className={i < progress.starsEarned ? "text-yellow-400 fill-current" : "text-gray-300"}
                                  />
                                ))}
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              {progress.timesPlayed}x played
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
                
                {/* Learning Progress */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                >
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Math Progress</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current Level</span>
                        <span className="font-semibold text-primary">{selectedProfile.currentLevel?.math || 1}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                          style={{ width: `${((selectedProfile.currentLevel?.math || 1) - 1) * 33.33}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-500">Progress to next level</div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Reading Progress</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Current Level</span>
                        <span className="font-semibold text-primary">{selectedProfile.currentLevel?.reading || 1}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-accent to-warning h-3 rounded-full transition-all duration-500"
                          style={{ width: `${((selectedProfile.currentLevel?.reading || 1) - 1) * 33.33}%` }}
                        />
                      </div>
                      <div className="text-sm text-gray-500">Progress to next level</div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ParentDashboard