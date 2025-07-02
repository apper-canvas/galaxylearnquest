import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import StarRating from '@/components/atoms/StarRating'

const GameCanvas = ({ 
  game, 
  onComplete, 
  onExit,
  difficulty = 'easy'
}) => {
  const [gameState, setGameState] = useState('playing') // playing, completed, paused
  const [score, setScore] = useState(0)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState([])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  
  // Generate questions based on game type and difficulty
  useEffect(() => {
    const generateQuestions = () => {
      const questionCount = difficulty === 'easy' ? 5 : difficulty === 'medium' ? 8 : 12
      const newQuestions = []
      
      for (let i = 0; i < questionCount; i++) {
        if (game.category === 'counting') {
          const count = difficulty === 'easy' ? Math.floor(Math.random() * 5) + 1 : 
                       difficulty === 'medium' ? Math.floor(Math.random() * 10) + 1 :
                       Math.floor(Math.random() * 20) + 1
          
          newQuestions.push({
            id: i,
            type: 'counting',
            question: `How many stars do you see?`,
            count: count,
            options: generateCountingOptions(count),
            correct: count
          })
        } else if (game.category === 'addition') {
          const num1 = difficulty === 'easy' ? Math.floor(Math.random() * 5) + 1 :
                       difficulty === 'medium' ? Math.floor(Math.random() * 10) + 1 :
                       Math.floor(Math.random() * 20) + 1
          const num2 = difficulty === 'easy' ? Math.floor(Math.random() * 5) + 1 :
                       difficulty === 'medium' ? Math.floor(Math.random() * 10) + 1 :
                       Math.floor(Math.random() * 20) + 1
          const answer = num1 + num2
          
          newQuestions.push({
            id: i,
            type: 'addition',
            question: `What is ${num1} + ${num2}?`,
            options: generateMathOptions(answer),
            correct: answer
          })
        } else if (game.category === 'letters') {
          const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
          const targetLetter = letters[Math.floor(Math.random() * letters.length)]
          
          newQuestions.push({
            id: i,
            type: 'letters',
            question: `Find the letter "${targetLetter}"`,
            options: generateLetterOptions(targetLetter),
            correct: targetLetter
          })
        }
      }
      
      return newQuestions
    }
    
    setQuestions(generateQuestions())
  }, [game, difficulty])
  
  // Timer
  useEffect(() => {
    let interval
    if (gameState === 'playing') {
      interval = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [gameState])
  
  const generateCountingOptions = (correct) => {
    const options = [correct]
    while (options.length < 4) {
      const option = Math.max(1, correct + Math.floor(Math.random() * 6) - 3)
      if (!options.includes(option)) {
        options.push(option)
      }
    }
    return options.sort(() => Math.random() - 0.5)
  }
  
  const generateMathOptions = (correct) => {
    const options = [correct]
    while (options.length < 4) {
      const option = Math.max(0, correct + Math.floor(Math.random() * 10) - 5)
      if (!options.includes(option)) {
        options.push(option)
      }
    }
    return options.sort(() => Math.random() - 0.5)
  }
  
  const generateLetterOptions = (correct) => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    const options = [correct]
    while (options.length < 4) {
      const option = letters[Math.floor(Math.random() * letters.length)]
      if (!options.includes(option)) {
        options.push(option)
      }
    }
    return options.sort(() => Math.random() - 0.5)
  }
  
  const handleAnswerSelect = (answer) => {
    if (showFeedback) return
    
    setSelectedAnswer(answer)
    setShowFeedback(true)
    
    const isCorrect = answer === questions[currentQuestion]?.correct
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1)
      setScore(prev => prev + (difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20))
    }
    
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
      } else {
        // Game completed
        const finalScore = Math.round((correctAnswers / questions.length) * 100)
        const stars = finalScore >= 90 ? 3 : finalScore >= 70 ? 2 : finalScore >= 50 ? 1 : 0
        
        setGameState('completed')
        onComplete({
          score: finalScore,
          stars,
          timeElapsed,
          difficulty,
          correctAnswers,
          totalQuestions: questions.length
        })
      }
    }, 2000)
  }
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <ApperIcon name="Sparkles" size={32} className="text-white" />
          </motion.div>
          <p className="font-display text-xl text-primary">Preparing your adventure...</p>
        </div>
      </div>
    )
  }
  
  const question = questions[currentQuestion]
  
  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background to-surface/50">
      {/* Game Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-primary/10 p-4">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              icon="ArrowLeft"
              onClick={onExit}
              className="text-primary hover:bg-primary/10"
            >
              Exit
            </Button>
            <div className="hidden sm:block">
              <h1 className="font-display text-xl text-primary">{game.title}</h1>
              <p className="text-sm text-gray-600 font-body">Question {currentQuestion + 1} of {questions.length}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="font-display text-lg text-accent">{score}</div>
              <div className="text-xs text-gray-600 font-body">Score</div>
            </div>
            <div className="text-center">
              <div className="font-display text-lg text-primary">{formatTime(timeElapsed)}</div>
              <div className="text-xs text-gray-600 font-body">Time</div>
            </div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-accent to-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>
      
      {/* Game Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="text-center"
            >
              {/* Question */}
              <h2 className="font-display text-3xl text-primary mb-8">
                {question?.question}
              </h2>
              
              {/* Visual Elements for Counting */}
              {question?.type === 'counting' && (
                <div className="mb-8">
                  <div className="flex flex-wrap justify-center gap-2 max-w-md mx-auto">
                    {Array.from({ length: question.count }, (_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                      >
                        <ApperIcon name="Star" size={32} className="text-accent fill-current" />
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Answer Options */}
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                {question?.options.map((option, index) => (
                  <motion.button
                    key={index}
                    whileHover={{ scale: showFeedback ? 1 : 1.05 }}
                    whileTap={{ scale: showFeedback ? 1 : 0.95 }}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                    className={`storybook-card p-6 cursor-pointer text-center font-display text-2xl transition-all duration-300 ${
                      showFeedback
                        ? selectedAnswer === option
                          ? option === question.correct
                            ? 'bg-gradient-to-br from-success to-secondary text-white shadow-xl'
                            : 'bg-gradient-to-br from-error to-warning text-white shadow-xl'
                          : option === question.correct
                            ? 'bg-gradient-to-br from-success to-secondary text-white shadow-xl'
                            : 'opacity-50'
                        : 'hover:shadow-xl hover:bg-gradient-to-br hover:from-primary/10 hover:to-secondary/10'
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showFeedback}
                  >
                    {option}
                    
                    {showFeedback && option === question.correct && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2"
                      >
                        <ApperIcon name="CheckCircle" size={24} className="text-white mx-auto" />
                      </motion.div>
                    )}
                    
                    {showFeedback && selectedAnswer === option && option !== question.correct && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2"
                      >
                        <ApperIcon name="XCircle" size={24} className="text-white mx-auto" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Feedback Messages */}
      <AnimatePresence>
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 z-50"
          >
            <div className={`storybook-card p-4 text-center max-w-md mx-auto ${
              selectedAnswer === question?.correct
                ? 'bg-gradient-to-r from-success to-secondary text-white'
                : 'bg-gradient-to-r from-warning to-error text-white'
            }`}>
              <div className="flex items-center justify-center gap-2 font-display text-lg">
                <ApperIcon 
                  name={selectedAnswer === question?.correct ? "Trophy" : "Heart"} 
                  size={24} 
                />
                {selectedAnswer === question?.correct 
                  ? "Excellent work!" 
                  : "Good try! Keep going!"
                }
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default GameCanvas