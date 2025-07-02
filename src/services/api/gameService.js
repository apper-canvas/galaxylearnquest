import { games } from '@/services/mockData/games.json'
import { gameProgress } from '@/services/mockData/gameProgress.json'

let gamesData = [...games]
let progressData = [...gameProgress]

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
    return gamesData.find(game => game.Id === parseInt(id))
  },

  async getProgressByProfile(profileId) {
    await delay()
    return progressData.filter(progress => progress.profileId === parseInt(profileId))
  },

  async updateProgress(progressUpdate) {
    await delay()
    const existingIndex = progressData.findIndex(
      p => p.profileId === progressUpdate.profileId && p.gameId === progressUpdate.gameId
    )
    
    if (existingIndex !== -1) {
      progressData[existingIndex] = { ...progressData[existingIndex], ...progressUpdate }
      return progressData[existingIndex]
    } else {
      const newProgress = {
        Id: Math.max(...progressData.map(p => p.Id), 0) + 1,
        ...progressUpdate,
        timesPlayed: 1,
        lastPlayed: new Date().toISOString()
      }
      progressData.push(newProgress)
      return newProgress
    }
  }
}