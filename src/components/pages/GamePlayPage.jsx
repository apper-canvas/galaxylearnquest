import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import GameCanvas from '@/components/organisms/GameCanvas'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Button from '@/components/atoms/Button'
import StarRating from '@/components/atoms/StarRating'
import ApperIcon from '@/components/ApperIcon'
import { gameService } from '@/services/api/gameService'
import { profileService } from '@/services/api/profileService'
import { dailyGoalService } from '@/services/api/dailyGoalService'

const GamePlayPage = () => {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentProfile, setCurrentProfile] = useState(null)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameResults, setGameResults] = useState(null)
  const [difficulty, setDifficulty] = useState('easy')
  const [showConfetti, setShowConfetti] = useState(false)
  
  useEffect(() => {
    const profile = localStorage.getItem('currentProfile')
    if (profile) {
      setCurrentProfile(JSON.parse(profile))
    }
    loadGame()
  }, [gameId])
  
  const loadGame = async () => {
    try {
      setLoading(true)
      setError('')
      
      const gameData = await gameService.getGameById(parseInt(gameId))
      if (!gameData) {
        throw new Error('Game not found')
      }
      
      setGame(gameData)
      
      // Set initial difficulty based on profile level
      const profile = JSON.parse(localStorage.getItem('currentProfile') || '{}')
      if (profile.currentLevel) {
        const worldLevel = profile.currentLevel[gameData.worldId] || 1
        setDifficulty(worldLevel <= 1 ? 'easy' : worldLevel === 2 ? 'medium' : 'hard')
      }
      
    } catch (err) {
      setError('Failed to load game. Please try again.')
      console.error('Error loading game:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleGameComplete = async (results) => {
    try {
      setGameResults(results)
      setGameCompleted(true)
      
      if (results.stars > 0) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 3000)
      }
      
      const profile = JSON.parse(localStorage.getItem('currentProfile') || '{}')
      if (!profile.Id) return
      
      // Update game progress
      await gameService.updateProgress({
        profileId: profile.Id,
        gameId: parseInt(gameId),
        highScore: results.score,
        starsEarned: results.stars,
        difficultyLevel: results.difficulty
      })
      
      // Update daily goal
      const skillsPracticed = game.skills || []
      await dailyGoalService.updateGoalProgress(
        profile.Id,
        Math.ceil(results.timeElapsed / 60), // Convert to minutes
        parseInt(gameId),
        skillsPracticed
      )
      
      // Update profile stats
      const coinsEarned = results.stars * 10
      const updatedProfile = await profileService.update(profile.Id, {
        totalStars: profile.totalStars + results.stars,
        totalCoins: profile.totalCoins + coinsEarned
      })
      
      localStorage.setItem('currentProfile', JSON.stringify(updatedProfile))
      
      // Show success message
      if (results.stars === 3) {
        toast.success('Perfect! You earned 3 stars! ⭐⭐⭐')
      } else if (results.stars === 2) {
        toast.success('Great job! You earned 2 stars! ⭐⭐')
      } else if (results.stars === 1) {
        toast.success('Good work! You earned 1 star! ⭐')
      } else {
        toast.info('Keep practicing - you\'ll get better! 💪')
      }
      
    } catch (err) {
      console.error('Error updating game progress:', err)
      toast.error('Failed to save your progress')
    }
  }
  
  const handleExit = () => {
    if (game) {
      navigate(`/world/${game.worldId}/games`)
    } else {
      navigate('/world-map')
    }
  }
  
  const handlePlayAgain = () => {
    setGameCompleted(false)
    setGameResults(null)
    setShowConfetti(false)
  }
  
  const handleNextGame = async () => {
    try {
      const worldGames = await gameService.getGamesByWorld(game.worldId)
      const currentIndex = worldGames.findIndex(g => g.Id === parseInt(gameId))
      const nextGame = worldGames[currentIndex + 1]
      
      if (nextGame && nextGame.isUnlocked) {
        navigate(`/game/${nextGame.Id}`)
      } else {
        navigate(`/world/${game.worldId}/games`)
      }
    } catch (err) {
      navigate(`/world/${game.worldId}/games`)
    }
  }
  
  if (loading) {
    return <Loading message="Loading your game adventure..." />
  }
  
  if (error) {
    return (
      <Error 
        title="Game Loading Failed"
        message={error}
        onRetry={loadGame}
      />
    )
  }
  
  if (!game) {
    return (
      <Error 
        title="Game Not Found"
        message="This game adventure doesn't exist!"
        onRetry={() => navigate('/world-map')}
        showRetry={false}
      />
    )
  }
  
  return (
    <div className="h-screen flex flex-col">
      {/* Game Results Modal */}
      <AnimatePresence>
        {gameCompleted && gameResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="storybook-card p-8 max-w-md w-full text-center relative overflow-hidden"
            >
              {/* Confetti Animation */}
              {showConfetti && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 20 }, (_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 bg-accent rounded-full"
                      initial={{
                        x: '50%',
                        y: '50%',
                        scale: 0
                      }}
                      animate={{
                        x: Math.random() * 400 - 200,
                        y: Math.random() * 400 - 200,
                        scale: [0, 1, 0],
                        rotate: 360
                      }}
                      transition={{
                        duration: 2,
                        delay: i * 0.1,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>
              )}
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <ApperIcon name="Trophy" size={36} className="text-white" />
                </div>
                
                <h2 className="font-display text-3xl text-primary mb-4">
                  {gameResults.stars === 3 ? 'Perfect!' : 
                   gameResults.stars === 2 ? 'Great Job!' :
                   gameResults.stars === 1 ? 'Good Work!' : 'Keep Trying!'}
                </h2>
                
                <StarRating 
                  rating={gameResults.stars} 
                  size="large" 
                  readonly 
                  className="justify-center mb-6"
                />
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-secondary/20 rounded-xl p-4">
                    <div className="font-display text-2xl text-secondary mb-1">
                      {gameResults.score}%
                    </div>
                    <div className="text-sm text-gray-600 font-body">Score</div>
                  </div>
                  
                  <div className="bg-accent/20 rounded-xl p-4">
                    <div className="font-display text-2xl text-warning mb-1">
                      {gameResults.stars * 10}
                    </div>
                    <div className="text-sm text-gray-600 font-body">Coins Earned</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button
                    variant="magical"
                    onClick={handlePlayAgain}
                    icon="RotateCcw"
                    className="w-full"
                  >
                    Play Again
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={handleExit}
                      icon="ArrowLeft"
                      className="flex-1"
                    >
                      Back to Games
                    </Button>
                    
                    <Button
                      variant="primary"
                      onClick={handleNextGame}
                      icon="ArrowRight"
                      className="flex-1"
                    >
                      Next Game
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Game Canvas */}
      {!gameCompleted && (
        <GameCanvas
          game={game}
          difficulty={difficulty}
          onComplete={handleGameComplete}
          onExit={handleExit}
        />
      )}
    </div>
  )
}

export default GamePlayPage