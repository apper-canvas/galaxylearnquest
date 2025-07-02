import gameData from '@/services/mockData/games.json'
import progressData from '@/services/mockData/gameProgress.json'

let gamesData = [...gameData]
let gameProgressData = [...progressData]

// Mock storybook data
const storybooksData = [
  {
    Id: 101,
    title: "The Magic Forest",
    description: "Join Luna on her adventure through the enchanted forest!",
    category: "storybook",
    worldId: "reading",
    iconName: "TreePine",
    isUnlocked: true,
    minAge: 4,
    maxAge: 8,
    skills: ["reading-comprehension", "listening", "vocabulary"],
    storyContent: {
      pages: [
        {
          text: "Once upon a time, there was a little girl named Luna who loved to explore.",
          words: [
            { text: "Once", duration: 400 }, { text: "upon", duration: 300 }, { text: "a", duration: 200 },
            { text: "time,", duration: 400 }, { text: "there", duration: 300 }, { text: "was", duration: 300 },
            { text: "a", duration: 200 }, { text: "little", duration: 300 }, { text: "girl", duration: 300 },
            { text: "named", duration: 300 }, { text: "Luna", duration: 400 }, { text: "who", duration: 300 },
            { text: "loved", duration: 300 }, { text: "to", duration: 200 }, { text: "explore.", duration: 500 }
          ],
          illustration: "User"
        },
        {
          text: "One sunny morning, Luna discovered a magical path in the forest behind her house.",
          words: [
            { text: "One", duration: 300 }, { text: "sunny", duration: 400 }, { text: "morning,", duration: 500 },
            { text: "Luna", duration: 400 }, { text: "discovered", duration: 600 }, { text: "a", duration: 200 },
            { text: "magical", duration: 500 }, { text: "path", duration: 400 }, { text: "in", duration: 200 },
            { text: "the", duration: 200 }, { text: "forest", duration: 400 }, { text: "behind", duration: 400 },
            { text: "her", duration: 300 }, { text: "house.", duration: 500 }
          ],
          illustration: "TreePine"
        },
        {
          text: "The path sparkled with golden dust and seemed to whisper her name in the wind.",
          words: [
            { text: "The", duration: 300 }, { text: "path", duration: 400 }, { text: "sparkled", duration: 500 },
            { text: "with", duration: 300 }, { text: "golden", duration: 400 }, { text: "dust", duration: 400 },
            { text: "and", duration: 300 }, { text: "seemed", duration: 400 }, { text: "to", duration: 200 },
            { text: "whisper", duration: 500 }, { text: "her", duration: 300 }, { text: "name", duration: 400 },
            { text: "in", duration: 200 }, { text: "the", duration: 200 }, { text: "wind.", duration: 500 }
          ],
          illustration: "Sparkles"
        }
      ],
      questions: [
        {
          question: "What was the little girl's name?",
          options: ["Luna", "Stella", "Maya", "Rose"],
          correct: "Luna"
        },
        {
          question: "Where did Luna find the magical path?",
          options: ["In her backyard", "At school", "In the forest", "At the park"],
          correct: "In the forest"
        }
      ]
    }
  },
  {
    Id: 102,
    title: "The Brave Little Mouse",
    description: "Follow Max the mouse as he overcomes his fears!",
    category: "storybook",
    worldId: "reading",
    iconName: "Heart",
    isUnlocked: true,
    minAge: 3,
    maxAge: 7,
    skills: ["reading-comprehension", "listening", "emotions"],
    storyContent: {
      pages: [
        {
          text: "Max was a very small mouse who lived in a cozy hole in the wall.",
          words: [
            { text: "Max", duration: 400 }, { text: "was", duration: 300 }, { text: "a", duration: 200 },
            { text: "very", duration: 300 }, { text: "small", duration: 400 }, { text: "mouse", duration: 400 },
            { text: "who", duration: 300 }, { text: "lived", duration: 400 }, { text: "in", duration: 200 },
            { text: "a", duration: 200 }, { text: "cozy", duration: 400 }, { text: "hole", duration: 400 },
            { text: "in", duration: 200 }, { text: "the", duration: 200 }, { text: "wall.", duration: 500 }
          ],
          illustration: "Home"
        },
        {
          text: "Every day, Max watched the big mice play outside, but he was too scared to join them.",
          words: [
            { text: "Every", duration: 400 }, { text: "day,", duration: 400 }, { text: "Max", duration: 400 },
            { text: "watched", duration: 500 }, { text: "the", duration: 200 }, { text: "big", duration: 300 },
            { text: "mice", duration: 400 }, { text: "play", duration: 400 }, { text: "outside,", duration: 500 },
            { text: "but", duration: 300 }, { text: "he", duration: 200 }, { text: "was", duration: 300 },
            { text: "too", duration: 300 }, { text: "scared", duration: 400 }, { text: "to", duration: 200 },
            { text: "join", duration: 400 }, { text: "them.", duration: 500 }
          ],
          illustration: "Users"
        }
      ],
      questions: [
        {
          question: "What kind of animal was Max?",
          options: ["A cat", "A mouse", "A dog", "A bird"],
          correct: "A mouse"
        },
        {
          question: "How did Max feel about playing with the big mice?",
          options: ["Excited", "Angry", "Scared", "Happy"],
          correct: "Scared"
        }
      ]
    }
  }
]
const delay = () => new Promise(resolve => setTimeout(resolve, 200))

export const gameService = {
  async getAllGames() {
    await delay()
    return [...gamesData]
  },

  async getGamesByWorld(worldId) {
    await delay()
    return gamesData.filter(game => game.worldId === worldId)
  },

async getGameById(id) {
    await delay()
    const game = gamesData.find(game => game.Id === parseInt(id))
    if (game) return game
    return storybooksData.find(story => story.Id === parseInt(id))
  },

  async getProgressByProfile(profileId) {
    await delay()
    return gameProgressData.filter(progress => progress.profileId === parseInt(profileId))
  },

async getStoriesByWorld(worldId) {
    await delay()
    return storybooksData.filter(story => story.worldId === worldId)
  },

  async updateProgress(progressUpdate) {
    await delay()
    const existingIndex = gameProgressData.findIndex(
      p => p.profileId === progressUpdate.profileId && p.gameId === progressUpdate.gameId
    )
    
    if (existingIndex !== -1) {
      gameProgressData[existingIndex] = { ...gameProgressData[existingIndex], ...progressUpdate }
      return gameProgressData[existingIndex]
    } else {
      const newProgress = {
        Id: Math.max(...gameProgressData.map(p => p.Id), 0) + 1,
        ...progressUpdate,
        timesPlayed: 1,
        lastPlayed: new Date().toISOString()
      }
      gameProgressData.push(newProgress)
      return newProgress
    }
  }
}